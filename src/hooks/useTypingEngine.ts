import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { splitGraphemes } from '../utils/graphemes';
import { saveKeystroke, updateCharacterStats } from '../db';
import { audioFeedback } from '../utils/audioFeedback';

interface TypingStats {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  totalKeystrokes: number;
}

interface UseTypingEngineProps {
  targetText: string;
  language: string;
  strictMode: boolean;
  sessionId?: number;
  onComplete: (stats: TypingStats) => void;
}

export const useTypingEngine = ({
  targetText,
  language,
  strictMode,
  sessionId,
  onComplete
}: UseTypingEngineProps) => {
  const targetGraphemes = useMemo(() => splitGraphemes(targetText), [targetText]);
  
  const [state, setState] = useState({
    status: 'idle' as 'idle' | 'typing' | 'finished',
    typedValue: '',
    typedGraphemes: [] as string[],
    cursorIndex: 0,
    errors: new Map<number, string>(),
    startTime: null as number | null,
    endTime: null as number | null,
    elapsedTime: 0,
    lastKeypressTime: 0,
    totalKeystrokes: 0
  });

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  // Use a ref for onComplete to avoid handleInput dependency cycles
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (state.status === 'typing' && state.startTime) {
      timerRef.current = setInterval(() => {
        setState(prev => ({ 
          ...prev, 
          elapsedTime: Date.now() - (prev.startTime || Date.now()) 
        }));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.startTime]);

  // Handle completion side effect
  useEffect(() => {
    if (state.status === 'finished' && state.startTime && state.endTime) {
      const durationMin = (state.endTime - state.startTime) / 60000;
      const correctChars = state.typedGraphemes.length - state.errors.size;
      const finalWpm = Math.round((correctChars / 5) / Math.max(durationMin, 0.01));
      const finalAcc = state.totalKeystrokes > 0 
        ? Math.round((correctChars / state.totalKeystrokes) * 100) 
        : 100;

      onCompleteRef.current({
        wpm: finalWpm,
        accuracy: Math.max(0, Math.min(100, finalAcc)),
        elapsedTime: state.endTime - state.startTime,
        totalKeystrokes: state.totalKeystrokes
      });
    }
  }, [state.status, state.startTime, state.endTime, state.errors.size, state.totalKeystrokes, state.typedGraphemes.length]);

  const handleInput = useCallback((newValue: string) => {
    const now = Date.now();

    setState(prev => {
      if (prev.status === 'finished') return prev;

      const isBackspace = newValue.length < prev.typedValue.length;
      const newStatus = prev.status === 'idle' ? 'typing' : prev.status;
      const startTime = prev.startTime || now;
      const newTypedGraphemes = splitGraphemes(newValue);
      
      let newErrors = new Map<number, string>();
      let newCursorIndex = newTypedGraphemes.length;
      let hasStrictError = false;

      // Calculate errors and handle incomplete Bangla characters
      for (let i = 0; i < newTypedGraphemes.length; i++) {
        const typed = newTypedGraphemes[i];
        const target = targetGraphemes[i];

        if (!target) {
          newErrors.set(i, typed);
          hasStrictError = true;
        } else if (typed !== target) {
          // Check if this is a partial character (Bangla IME)
          if (i === newTypedGraphemes.length - 1 && target.startsWith(typed) && !isBackspace) {
            newCursorIndex = i; // Cursor rests here to allow completion
            break;
          } else {
            newErrors.set(i, typed);
            hasStrictError = true;
          }
        }
      }

      // Strict mode: Reject the input if there's an error and it's not a backspace
      if (strictMode && hasStrictError && !isBackspace) {
        audioFeedback.playError();
        return prev;
      }

      // Play audio & save to DB only when advancing/typing (not backspacing)
      if (!isBackspace && newValue.length > prev.typedValue.length) {
        const currentIndex = newCursorIndex > 0 ? newCursorIndex - 1 : 0;
        const isErrorAtCurrent = newErrors.has(currentIndex);
        const latency = prev.lastKeypressTime ? now - prev.lastKeypressTime : 0;
        
        isErrorAtCurrent ? audioFeedback.playError() : audioFeedback.playClick();

        if (sessionId !== undefined && targetGraphemes[currentIndex]) {
          saveKeystroke({
            sessionId,
            expectedChar: targetGraphemes[currentIndex],
            typedChar: newTypedGraphemes[currentIndex] || '',
            latencyMs: latency,
            isError: isErrorAtCurrent,
            timestamp: now
          }).catch(console.error);

          updateCharacterStats(targetGraphemes[currentIndex], language, latency, !isErrorAtCurrent).catch(console.error);
        }
      }

      const totalKeystrokes = !isBackspace ? prev.totalKeystrokes + 1 : prev.totalKeystrokes;

      // Check Completion
      if (newCursorIndex >= targetGraphemes.length) {
        return { 
          ...prev, 
          status: 'finished',
          typedValue: newValue, 
          typedGraphemes: newTypedGraphemes, 
          cursorIndex: newCursorIndex, 
          errors: newErrors,
          endTime: now,
          totalKeystrokes
        };
      }

      return {
        ...prev,
        status: newStatus,
        startTime,
        typedValue: newValue,
        typedGraphemes: newTypedGraphemes,
        cursorIndex: newCursorIndex,
        errors: newErrors,
        lastKeypressTime: now,
        totalKeystrokes
      };
    });
  }, [targetGraphemes, strictMode, sessionId, language]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      typedValue: '',
      typedGraphemes: [],
      cursorIndex: 0,
      errors: new Map(),
      startTime: null,
      endTime: null,
      elapsedTime: 0,
      lastKeypressTime: 0,
      totalKeystrokes: 0
    });
  }, []);

  // Force a complete reset whenever the target words change
  useEffect(() => {
    reset();
  }, [targetText, reset]);

  const correctChars = state.typedGraphemes.length - state.errors.size;
  const wpm = state.startTime 
    ? Math.round((correctChars / 5) / (Math.max(state.elapsedTime, 1) / 60000)) 
    : 0;
  const accuracy = state.totalKeystrokes > 0 
    ? Math.round((correctChars / state.totalKeystrokes) * 100) 
    : 100;

  return {
    status: state.status,
    cursorIndex: state.cursorIndex,
    errors: state.errors,
    elapsedTime: state.elapsedTime,
    targetGraphemes,
    typedValue: state.typedValue,
    handleInput,
    reset,
    stats: { 
      wpm, 
      accuracy: Math.max(0, Math.min(100, accuracy)), 
      correctChars, 
      totalChars: state.totalKeystrokes 
    }
  };
};
