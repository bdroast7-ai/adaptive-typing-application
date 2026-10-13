import React, { useEffect, useRef } from 'react';

interface TypingCanvasProps {
  targetGraphemes: string[];
  cursorIndex: number;
  errors: Map<number, string>;
  status: 'idle' | 'typing' | 'finished';
  language: string;
  typedValue: string;
  onInput: (value: string) => void;
  strictMode: boolean;
}

export const TypingCanvas: React.FC<TypingCanvasProps> = ({
  targetGraphemes,
  cursorIndex,
  errors,
  status,
  language,
  typedValue,
  onInput,
  strictMode
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusInput = () => {
      if (status !== 'finished') {
        inputRef.current?.focus();
      }
    };

    focusInput();
    window.addEventListener('focus', focusInput);
    return () => window.removeEventListener('focus', focusInput);
  }, [status]);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="p-10 bg-white border border-[#E5E5E5] rounded-lg shadow-sm min-h-[280px] relative focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-text"
      style={{ 
        fontFamily: language === 'bangla' 
          ? 'Kalpurush, SolaimanLipi, Noto Sans Bengali, system-ui, sans-serif' 
          : 'monospace'
      }}
    >
      {/* Input allows native IME composition (crucial for Bangla) */}
      <input 
        ref={inputRef}
        type="text"
        className="absolute inset-0 opacity-0 cursor-default"
        value={typedValue}
        onChange={(e) => onInput(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        data-gramm="false"
      />

      <div className="text-3xl leading-relaxed select-none">
        {targetGraphemes.map((char, i) => {
          let className = 'transition-colors duration-100 inline-block ';
          
          if (i < cursorIndex) {
            if (errors.has(i)) {
              // Wrong key pressed -> looks a little off (red text + underline)
              className += 'text-red-500 bg-red-50 rounded border-b-2 border-red-200';
            } else {
              // Correct -> Black
              className += 'text-[#1A1A1A]';
            }
          } else if (i === cursorIndex) {
            // Active Cursor
            className += 'bg-[#F5F5F5] border-l-2 border-[#2563EB]';
          } else {
            // Future Text
            className += 'text-[#A3A3A3]';
          }
          
          return (
            <span key={i} className={className}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>

      {status === 'idle' && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-[#737373] text-sm">
          Start typing to begin... {strictMode && '(Strict Mode ON)'}
        </div>
      )}
    </div>
  );
};