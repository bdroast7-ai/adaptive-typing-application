import React, { useEffect, useRef, useState } from 'react';
import { splitGraphemes } from '../utils/graphemes';

interface TypingCanvasProps {
  targetGraphemes: string[];
  cursorIndex: number;
  errors: Map<number, string>;
  status: 'idle' | 'typing' | 'finished';
  language: string;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  strictMode: boolean;
}

export const TypingCanvas: React.FC<TypingCanvasProps> = ({
  targetGraphemes,
  cursorIndex,
  errors,
  status,
  language,
  onKeyPress,
  onBackspace,
  strictMode
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (status === 'idle') setInputValue('');
    inputRef.current?.focus();
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    const val = e.target.value;

    if (val.length < inputValue.length) {
      if (!strictMode) onBackspace();
    } else if (val.length > inputValue.length) {
      const newChars = val.slice(inputValue.length);
      const graphemes = splitGraphemes(newChars);
      graphemes.forEach(g => onKeyPress(g));
    }

    setInputValue(val);
  };

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
      <input
        ref={inputRef}
        type="text"
        className="absolute inset-0 opacity-0"
        value={inputValue}
        onChange={handleChange}
        autoComplete="off"
        spellCheck="false"
      />

      <div className="text-3xl leading-relaxed select-none">
        {targetGraphemes.map((char, i) => {
          let className = 'transition-colors duration-100 inline-block ';

          if (i < cursorIndex) {
            if (errors.has(i)) {
              className += 'text-white bg-red-500 rounded px-0.5';
            } else {
              className += 'text-[#1A1A1A]';
            }
          } else if (i === cursorIndex) {
            className += 'bg-[#F5F5F5] border-l-2 border-[#2563EB]';
          } else {
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
          Start typing to begin... {strictMode && '(Strict Mode: No backspace)'}
        </div>
      )}
    </div>
  );
};
