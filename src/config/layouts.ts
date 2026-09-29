export interface KeyMapping {
  normal: string;
  shift: string;
  physicalKey: string;
}

// English keyboard layout
export const ENGLISH_KEYBOARD_LAYOUT: KeyMapping[][] = [
  [
    { normal: '`', shift: '~', physicalKey: '`' },
    { normal: '1', shift: '!', physicalKey: '1' },
    { normal: '2', shift: '@', physicalKey: '2' },
    { normal: '3', shift: '#', physicalKey: '3' },
    { normal: '4', shift: '$', physicalKey: '4' },
    { normal: '5', shift: '%', physicalKey: '5' },
    { normal: '6', shift: '^', physicalKey: '6' },
    { normal: '7', shift: '&', physicalKey: '7' },
    { normal: '8', shift: '*', physicalKey: '8' },
    { normal: '9', shift: '(', physicalKey: '9' },
    { normal: '0', shift: ')', physicalKey: '0' },
    { normal: '-', shift: '_', physicalKey: '-' },
    { normal: '=', shift: '+', physicalKey: '=' },
  ],
  [
    { normal: 'q', shift: 'Q', physicalKey: 'q' },
    { normal: 'w', shift: 'W', physicalKey: 'w' },
    { normal: 'e', shift: 'E', physicalKey: 'e' },
    { normal: 'r', shift: 'R', physicalKey: 'r' },
    { normal: 't', shift: 'T', physicalKey: 't' },
    { normal: 'y', shift: 'Y', physicalKey: 'y' },
    { normal: 'u', shift: 'U', physicalKey: 'u' },
    { normal: 'i', shift: 'I', physicalKey: 'i' },
    { normal: 'o', shift: 'O', physicalKey: 'o' },
    { normal: 'p', shift: 'P', physicalKey: 'p' },
    { normal: '[', shift: '{', physicalKey: '[' },
    { normal: ']', shift: '}', physicalKey: ']' },
    { normal: '\\', shift: '|', physicalKey: '\\' },
  ],
  [
    { normal: 'a', shift: 'A', physicalKey: 'a' },
    { normal: 's', shift: 'S', physicalKey: 's' },
    { normal: 'd', shift: 'D', physicalKey: 'd' },
    { normal: 'f', shift: 'F', physicalKey: 'f' },
    { normal: 'g', shift: 'G', physicalKey: 'g' },
    { normal: 'h', shift: 'H', physicalKey: 'h' },
    { normal: 'j', shift: 'J', physicalKey: 'j' },
    { normal: 'k', shift: 'K', physicalKey: 'k' },
    { normal: 'l', shift: 'L', physicalKey: 'l' },
    { normal: ';', shift: ':', physicalKey: ';' },
    { normal: "'", shift: '"', physicalKey: "'" },
  ],
  [
    { normal: 'z', shift: 'Z', physicalKey: 'z' },
    { normal: 'x', shift: 'X', physicalKey: 'x' },
    { normal: 'c', shift: 'C', physicalKey: 'c' },
    { normal: 'v', shift: 'V', physicalKey: 'v' },
    { normal: 'b', shift: 'B', physicalKey: 'b' },
    { normal: 'n', shift: 'N', physicalKey: 'n' },
    { normal: 'm', shift: 'M', physicalKey: 'm' },
    { normal: ',', shift: '<', physicalKey: ',' },
    { normal: '.', shift: '>', physicalKey: '.' },
    { normal: '/', shift: '?', physicalKey: '/' },
  ]
];

// Bangla Bijoy keyboard layout
export const BANGLA_KEYBOARD_LAYOUT: KeyMapping[][] = [
  [
    { normal: '`', shift: '~', physicalKey: '`' },
    { normal: '১', shift: '!', physicalKey: '1' },
    { normal: '২', shift: '@', physicalKey: '2' },
    { normal: '৩', shift: '#', physicalKey: '3' },
    { normal: '৪', shift: '$', physicalKey: '4' },
    { normal: '৫', shift: '%', physicalKey: '5' },
    { normal: '৬', shift: '^', physicalKey: '6' },
    { normal: '৭', shift: '&', physicalKey: '7' },
    { normal: '৮', shift: '*', physicalKey: '8' },
    { normal: '৯', shift: '(', physicalKey: '9' },
    { normal: '০', shift: ')', physicalKey: '0' },
    { normal: '-', shift: '_', physicalKey: '-' },
    { normal: '=', shift: '+', physicalKey: '=' },
  ],
  [
    { normal: 'ঙ', shift: 'ং', physicalKey: 'q' },
    { normal: 'য', shift: 'য়', physicalKey: 'w' },
    { normal: 'ড', shift: 'ঢ', physicalKey: 'e' },
    { normal: 'প', shift: 'ফ', physicalKey: 'r' },
    { normal: 'ট', shift: 'ঠ', physicalKey: 't' },
    { normal: 'চ', shift: 'ছ', physicalKey: 'y' },
    { normal: 'জ', shift: 'ঝ', physicalKey: 'u' },
    { normal: 'হ', shift: 'ঞ', physicalKey: 'i' },
    { normal: 'গ', shift: 'ঘ', physicalKey: 'o' },
    { normal: 'ড়', shift: 'ঢ়', physicalKey: 'p' },
    { normal: '[', shift: '{', physicalKey: '[' },
    { normal: ']', shift: '}', physicalKey: ']' },
    { normal: '\\', shift: '|', physicalKey: '\\' },
  ],
  [
    { normal: 'ৃ', shift: 'র্', physicalKey: 'a' },
    { normal: 'ু', shift: 'ূ', physicalKey: 's' },
    { normal: 'ি', shift: 'ী', physicalKey: 'd' },
    { normal: 'া', shift: 'অ', physicalKey: 'f' },
    { normal: '্', shift: '।', physicalKey: 'g' },
    { normal: 'ব', shift: 'ভ', physicalKey: 'h' },
    { normal: 'ক', shift: 'খ', physicalKey: 'j' },
    { normal: 'ত', shift: 'থ', physicalKey: 'k' },
    { normal: 'দ', shift: 'ধ', physicalKey: 'l' },
    { normal: ';', shift: ':', physicalKey: ';' },
    { normal: "'", shift: '"', physicalKey: "'" },
  ],
  [
    { normal: '্র', shift: '্য', physicalKey: 'z' },
    { normal: 'ও', shift: 'ৌ', physicalKey: 'x' },
    { normal: 'ে', shift: 'ৈ', physicalKey: 'c' },
    { normal: 'র', shift: 'ল', physicalKey: 'v' },
    { normal: 'ন', shift: 'ণ', physicalKey: 'b' },
    { normal: 'স', shift: 'ষ', physicalKey: 'n' },
    { normal: 'ম', shift: 'শ', physicalKey: 'm' },
    { normal: ',', shift: '<', physicalKey: ',' },
    { normal: '.', shift: '>', physicalKey: '.' },
    { normal: '/', shift: '?', physicalKey: '/' },
  ]
];

// Create mapping for Bangla characters to physical keys
export const BIJOY_TO_KEY: { [key: string]: string } = {};
BANGLA_KEYBOARD_LAYOUT.forEach(row => {
  row.forEach(key => {
    BIJOY_TO_KEY[key.normal] = key.physicalKey;
    BIJOY_TO_KEY[key.shift] = key.physicalKey;
  });
});

// Initial unlocked characters for progressive learning
export const INITIAL_UNLOCKED_CHARS = {
  english: ['e', 't', 'a', 'o', 'i', 'n'],
  bangla: ['া', 'ি', 'ু', 'ক', 'ত', 'র']
};

// Unlock thresholds
export const UNLOCK_THRESHOLD = {
  minAccuracy: 0.95, // 95% accuracy required
  maxLatency: 250,   // Max 250ms average latency
  minAttempts: 20    // Minimum 20 attempts before considering unlock
};
