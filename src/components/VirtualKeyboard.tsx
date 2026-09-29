// Import your existing layout arrays from a constants file
import { ENGLISH_KEYBOARD_LAYOUT, BANGLA_KEYBOARD_LAYOUT, BIJOY_TO_KEY } from '../config/layouts';

interface VirtualKeyboardProps {
  language: 'english' | 'bangla';
  expectedChar: string;
  activeKeys: Set<string>;
  unlockedChars?: string[]; // Used to dim locked keys in progressive mode
}

export default function VirtualKeyboard({ language, expectedChar, activeKeys, unlockedChars = [] }: VirtualKeyboardProps) {
  const keyboardLayout = language === 'english' ? ENGLISH_KEYBOARD_LAYOUT : BANGLA_KEYBOARD_LAYOUT;

  // Determine which physical key needs to be pressed next
  const getExpectedPhysicalKey = () => {
    if (!expectedChar) return '';
    if (language === 'bangla') {
      return BIJOY_TO_KEY[expectedChar] || expectedChar.toLowerCase();
    }
    return expectedChar.toLowerCase();
  };

  const expectedPhysicalKey = getExpectedPhysicalKey();

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 select-none">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-sm font-medium text-[#1A1A1A]">
          {language === 'english' ? 'QWERTY Layout' : 'বিজয় (Bijoy) Layout'}
        </span>
        <span className="text-xs text-[#737373]">
          {language === 'bangla' ? 'Top: Shift | Bottom: Normal' : 'Shift + Normal'}
        </span>
      </div>

      <div className="space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {rowIndex === 1 && <div className="w-10 md:w-14" />}
            {rowIndex === 2 && <div className="w-14 md:w-20" />}
            {rowIndex === 3 && <div className="w-20 md:w-24" />}
            
            {row.map((keyInfo, keyIndex) => {
              const isPressed = activeKeys.has(keyInfo.physicalKey.toLowerCase());
              const isExpected = keyInfo.physicalKey.toLowerCase() === expectedPhysicalKey;
              
              // In progressive mode, check if the character is unlocked
              const isUnlocked = unlockedChars.length === 0 || 
                                 unlockedChars.includes(keyInfo.normal) || 
                                 unlockedChars.includes(keyInfo.shift);

              let keyClass = 'relative px-2 py-3 md:px-3 md:py-4 rounded-md transition-all duration-75 min-w-[40px] md:min-w-[48px] text-center border ';
              
              if (isPressed) {
                keyClass += 'bg-[#E5E5E5] border-[#E5E5E5] shadow-inner scale-95';
              } else if (isExpected) {
                keyClass += 'bg-[#2563EB]/10 border-2 border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/20 z-10';
              } else if (!isUnlocked) {
                keyClass += 'bg-[#FAFAFA] border-[#E5E5E5] opacity-40';
              } else {
                keyClass += 'bg-white border-[#E5E5E5] shadow-sm';
              }

              return (
                <div key={`${rowIndex}-${keyIndex}`} className={keyClass}>
                  <div 
                    className="text-[10px] md:text-xs text-[#737373] mb-0.5 font-medium"
                    style={{ fontFamily: language === 'bangla' ? 'Kalpurush, SolaimanLipi, Noto Sans Bengali, sans-serif' : 'monospace' }}
                  >
                    {keyInfo.shift}
                  </div>
                  <div 
                    className="text-sm md:text-base font-semibold text-[#1A1A1A]"
                    style={{ fontFamily: language === 'bangla' ? 'Kalpurush, SolaimanLipi, Noto Sans Bengali, sans-serif' : 'monospace' }}
                  >
                    {keyInfo.normal}
                  </div>
                  {language === 'bangla' && (
                    <div className="text-[9px] text-[#A3A3A3] mt-0.5 font-mono">
                      {keyInfo.physicalKey}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Spacebar */}
        <div className="flex justify-center mt-2">
          <div className={`px-32 py-3 md:py-4 rounded-md border text-sm font-medium transition-all duration-75 ${
            activeKeys.has(' ') ? 'bg-[#E5E5E5] border-[#E5E5E5] scale-95' :
            expectedPhysicalKey === ' ' ? 'bg-[#2563EB]/10 border-2 border-[#2563EB] ring-2 ring-[#2563EB]/20' : 
            'bg-white border-[#E5E5E5]'
          }`}>
            <span className="text-[#737373]">Space</span>
          </div>
        </div>
      </div>
    </div>
  );
}
