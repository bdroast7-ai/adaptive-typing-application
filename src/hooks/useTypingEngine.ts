import { useState, useCallback, useRef, useEffect } from 'react';
import { splitGraphemes } from '../utils/graphemes';
import { saveKeystroke, updateCharacterStats } from '../db';
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

interface CompletionStats {
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
  onComplete: (stats: CompletionStats) => void;
}

export const useTypingEngine = ({
  targetText,
  language,
  strictMode,
  sessionId,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.startTime]);

  const handleKeyPress = useCallback(async (key: string) => {
    const now = Date.now();
    
    setState(prev => {
      // Start test on first keypress
      if (prev.status === 'idle') {
        return {
          ...prev,
          status: 'typing',
          startTime: now,
          lastKeypressTime: now
        };
      }

      if (prev.status === 'finished') return prev;

      const expectedChar = targetGraphemes[prev.cursorIndex];
      const isCorrect = key === expectedChar;
      const latency = prev.lastKeypressTime ? now - prev.lastKeypressTime : 0;

      // Save keystroke to database (async, fire and forget)
      if (sessionId !== undefined) {
        saveKeystroke({
          sessionId,
          expectedChar,
          typedChar: key,
          latencyMs: latency,
          isError: !isCorrect,
          timestamp: now
        }).catch(console.error);
      }

      // Update character statistics (async, fire and forget)
      updateCharacterStats(expectedChar, language, latency, isCorrect).catch(console.error);

      // Play audio feedback
      if (isCorrect) {
        audioFeedback.playClick();
      } else {
        audioFeedback.playError();
      }

      if (isCorrect) {
        const newCursorIndex = prev.cursorIndex + 1;
        const correctChars = newCursorIndex - (prev.errors.size || 0);
        const totalChars = newCursorIndex;
        const finalWpm = Math.round((correctChars / 5) / (prev.elapsedTime / 60000));
        const finalAcc = Math.round((correctChars / totalChars) * 100);

        // Check if test is complete
        if (newCursorIndex >= targetGraphemes.length) {
          onComplete({
            wpm: finalWpm,
            accuracy: finalAcc,
            elapsedTime: prev.elapsedTime,
            totalKeystrokes: totalChars
          });
          return {
            ...prev,
            cursorIndex: newCursorIndex,
            status: 'finished',
            lastKeypressTime: now
          };
        }

        return {
          ...prev,
          cursorIndex: newCursorIndex,
          lastKeypressTime: now
        };
      } else {
        // In strict mode, don't allow progression
        if (strictMode) {
          const newErrors = new Map(prev.errors);
          newErrors.set(prev.cursorIndex, key);
          return {
            ...prev,
            errors: newErrors,
            lastKeypressTime: now
          };
        } else {
          // In normal mode, allow progression but mark error
          const newErrors = new Map(prev.errors);
          newErrors.set(prev.cursorIndex, key);
          const newCursorIndex = prev.cursorIndex + 1;
          
          const correctChars = newCursorIndex - newErrors.size;
          const totalChars = newCursorIndex;
          const finalWpm = Math.round((correctChars / 5) / (prev.elapsedTime / 60000));
          const finalAcc = Math.round((correctChars / totalChars) * 100);

          if (newCursorIndex >= targetGraphemes.length) {
            onComplete({
              wpm: finalWpm,
              accuracy: finalAcc,
              elapsedTime: prev.elapsedTime,
              totalKeystrokes: totalChars
            });
            return {
              ...prev,
              cursorIndex: newCursorIndex,
              errors: newErrors,
              status: 'finished',
              lastKeypressTime: now
            };
          }

          return {
            ...prev,
            cursorIndex: newCursorIndex,
            errors: newErrors,
            lastKeypressTime: now
          };
        }
      }
    });
  }, [targetGraphemes, strictMode, sessionId, language, onComplete]);

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
  const correctChars = state.cursorIndex - state.errors.size;
  const totalChars = state.cursorIndex;
  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;
  const wpm = state.startTime
    ? Math.round((correctChars / 5) / (state.elapsedTime / 60000))
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
