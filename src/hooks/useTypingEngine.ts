import { useState, useCallback, useRef, useEffect } from 'react';
import { splitGraphemes } from '../utils/graphemes';
import { updateCharacterStats } from '../db';
import { audioFeedback } from '../utils/audioFeedback';

type TypingStatus = 'idle' | 'typing' | 'finished';

interface TypingState {
  status: TypingStatus;
  cursorIndex: number;
  errors: Map<number, string>;
  startTime: number | null;
  elapsedTime: number;
  lastKeypressTime: number;
}

export interface RecordedKeystroke {
  expectedChar: string;
  typedChar: string;
  latencyMs: number;
  isError: boolean;
  timestamp: number;
}

export interface CompletionStats {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  totalKeystrokes: number;
  keystrokes: RecordedKeystroke[];
}

interface UseTypingEngineProps {
  targetText: string;
  language: string;
  strictMode: boolean;
  onComplete: (stats: CompletionStats) => void;
}

export const useTypingEngine = ({
  targetText,
  language,
  strictMode,
  onComplete
}: UseTypingEngineProps) => {
  const targetGraphemes = splitGraphemes(targetText);
  
  const [state, setState] = useState<TypingState>({
    status: 'idle',
    cursorIndex: 0,
    errors: new Map(),
    startTime: null,
    elapsedTime: 0,
    lastKeypressTime: 0
  });

  const keystrokesRef = useRef<RecordedKeystroke[]>([]);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Timer effect
  useEffect(() => {
    if (state.status === 'typing' && state.startTime) {
      timerRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsedTime: Date.now() - (prev.startTime || Date.now())
        }));
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.status, state.startTime]);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const handleKeyPress = useCallback(async (key: string) => {
    const currentState = stateRef.current;
    if (currentState.status === 'finished') return;

    const now = Date.now();
    let currentCursor = currentState.cursorIndex;
    let startTime = currentState.startTime;
    let lastKeypressTime = currentState.lastKeypressTime;

    if (currentState.status === 'idle') {
      keystrokesRef.current = [];
      currentCursor = 0;
      startTime = now;
      lastKeypressTime = now;
    }

    const expectedChar = targetGraphemes[currentCursor];
    if (!expectedChar) return;

    const isCorrect = key === expectedChar;
    const latency = lastKeypressTime && currentState.status !== 'idle'
      ? Math.max(0, now - lastKeypressTime)
      : 0;

    const recordedKeystroke: RecordedKeystroke = {
      expectedChar,
      typedChar: key,
      latencyMs: latency,
      isError: !isCorrect,
      timestamp: now
    };
    keystrokesRef.current.push(recordedKeystroke);

    // Update character statistics
    updateCharacterStats(expectedChar, language, latency, isCorrect).catch(console.error);

    // Play audio feedback
    if (isCorrect) {
      audioFeedback.playClick();
    } else {
      audioFeedback.playError();
    }

    const activeStartTime = startTime || now;
    const elapsedTimeMs = Math.max(1, now - activeStartTime);
    const newErrors = new Map(currentState.errors);

    if (!isCorrect) {
      newErrors.set(currentCursor, key);
    }

    let newCursorIndex = currentCursor;
    if (isCorrect || !strictMode) {
      newCursorIndex = currentCursor + 1;
    }

    const isFinished = newCursorIndex >= targetGraphemes.length;

    if (isFinished) {
      const correctChars = targetGraphemes.length - newErrors.size;
      const totalChars = targetGraphemes.length;
      const minutes = elapsedTimeMs / 60000;
      const finalWpm = Math.max(0, Math.round((correctChars / 5) / minutes));
      const finalAcc = Math.max(0, Math.round((correctChars / totalChars) * 100));

      setState({
        status: 'finished',
        cursorIndex: newCursorIndex,
        errors: newErrors,
        startTime: activeStartTime,
        elapsedTime: elapsedTimeMs,
        lastKeypressTime: now
      });

      onComplete({
        wpm: finalWpm,
        accuracy: finalAcc,
        elapsedTime: elapsedTimeMs,
        totalKeystrokes: totalChars,
        keystrokes: keystrokesRef.current
      });
    } else {
      setState({
        status: 'typing',
        cursorIndex: newCursorIndex,
        errors: newErrors,
        startTime: activeStartTime,
        elapsedTime: elapsedTimeMs,
        lastKeypressTime: now
      });
    }
  }, [targetGraphemes, strictMode, language, onComplete]);

  const handleBackspace = useCallback(() => {
    if (strictMode) return; // No backspace in strict mode

    setState(prev => {
      if (prev.cursorIndex > 0) {
        const newErrors = new Map(prev.errors);
        newErrors.delete(prev.cursorIndex - 1);
        
        return {
          ...prev,
          cursorIndex: prev.cursorIndex - 1,
          errors: newErrors
        };
      }
      return prev;
    });
  }, [strictMode]);

  const reset = useCallback(() => {
    keystrokesRef.current = [];
    setState({
      status: 'idle',
      cursorIndex: 0,
      errors: new Map(),
      startTime: null,
      elapsedTime: 0,
      lastKeypressTime: 0
    });
  }, []);

  // Calculate stats
  const correctChars = Math.max(0, state.cursorIndex - state.errors.size);
  const totalChars = state.cursorIndex;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  const wpm = state.startTime && state.elapsedTime > 0
    ? Math.max(0, Math.round((correctChars / 5) / (state.elapsedTime / 60000)))
    : 0;

  return {
    status: state.status,
    cursorIndex: state.cursorIndex,
    errors: state.errors,
    elapsedTime: state.elapsedTime,
    targetGraphemes,
    handleKeyPress,
    handleBackspace,
    reset,
    stats: {
      wpm,
      accuracy: Math.round(accuracy),
      correctChars,
      totalChars
    }
  };
};
