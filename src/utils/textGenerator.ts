import { CharacterStats } from '../db';
import { ENGLISH_BIGRAMS, ENGLISH_TRIGRAMS } from '../config/dictionaries';
import { INITIAL_UNLOCKED_CHARS } from '../config/layouts';
import { splitGraphemes } from './graphemes';

type Language = 'english' | 'bangla';

// Define all Bangla vowel marks and modifiers that cannot stand alone at the beginning of a word
const BANGLA_MODIFIERS = new Set([
  'া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ', '্', 'ং', 'ঃ', 'ঁ'
]);

// Generate grapheme-safe Bangla pseudo-words
export function generateBanglaPseudoWord(unlockedChars: string[], wordLength: number): string {
  // 1. Separate the unlocked characters into standalone bases and dependent modifiers
  const bases = unlockedChars.filter(char => !BANGLA_MODIFIERS.has(char));
  const modifiers = unlockedChars.filter(char => BANGLA_MODIFIERS.has(char));

  // Fallback in case only modifiers are passed (prevent infinite loops)
  if (bases.length === 0) return unlockedChars.join('');

  let word = '';
  let lastWasModifier = false;

  for (let i = 0; i < wordLength; i++) {
    // 2. Rules: First character MUST be a base. 
    // We also prevent back-to-back modifiers (like িকি) for basic typing practice.
    if (i === 0 || lastWasModifier || modifiers.length === 0) {
      const randomBase = bases[Math.floor(Math.random() * bases.length)];
      word += randomBase;
      lastWasModifier = false;
    } else {
      // 3. If the last character was a base, we can attach a modifier.
      // Adjust the 0.5 value (50%) to control how frequently vowel marks appear.
      const shouldAttachModifier = Math.random() > 0.5; 
      
      if (shouldAttachModifier) {
        const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        word += randomModifier;
        lastWasModifier = true;
      } else {
        const randomBase = bases[Math.floor(Math.random() * bases.length)];
        word += randomBase;
        lastWasModifier = false;
      }
    }
  }

  return word;
}

// Generate pseudo-words using unlocked characters and n-grams
export const generatePseudoWord = (
  unlockedChars: string[],
  language: Language,
  length: number = 4
): string => {
  if (unlockedChars.length === 0) return '';
  
  // Use grapheme-safe generator for Bangla
  if (language === 'bangla') {
    return generateBanglaPseudoWord(unlockedChars, length);
  }
  
  // English n-gram based generation
  const bigrams = ENGLISH_BIGRAMS;
  const trigrams = ENGLISH_TRIGRAMS;
  
  // Filter n-grams that only use unlocked characters
  const validBigrams = bigrams.filter(bg => 
    bg.split('').every(c => unlockedChars.includes(c))
  );
  
  const validTrigrams = trigrams.filter(tg =>
    tg.split('').every(c => unlockedChars.includes(c))
  );
  
  let word = '';
  
  // Start with a trigram or bigram if available
  if (validTrigrams.length > 0 && Math.random() > 0.5) {
    word = validTrigrams[Math.floor(Math.random() * validTrigrams.length)];
  } else if (validBigrams.length > 0) {
    word = validBigrams[Math.floor(Math.random() * validBigrams.length)];
  } else {
    // Fallback: random character
    word = unlockedChars[Math.floor(Math.random() * unlockedChars.length)];
  }
  
  // Extend to desired length using bigrams or random chars
  while (word.length < length) {
    const lastChar = word[word.length - 1];
    const possibleBigrams = validBigrams.filter(bg => bg[0] === lastChar);
    
    if (possibleBigrams.length > 0 && Math.random() > 0.3) {
      const bigram = possibleBigrams[Math.floor(Math.random() * possibleBigrams.length)];
      word += bigram[1];
    } else {
      word += unlockedChars[Math.floor(Math.random() * unlockedChars.length)];
    }
  }
  
  return word.slice(0, length);
};

// Generate practice text based on character statistics
export const generateAdaptiveText = (
  characterStats: CharacterStats[],
  language: Language,
  wordCount: number = 20
): string => {
  let unlockedChars = characterStats
    .filter(stat => stat.isUnlocked)
    .map(stat => stat.character);
  
  if (unlockedChars.length === 0) {
    unlockedChars = INITIAL_UNLOCKED_CHARS[language] || [];
  }

  if (unlockedChars.length === 0) {
    return '';
  }
  
  // Find slowest characters (highest latency, lowest accuracy)
  const slowestChars = characterStats
    .filter(stat => stat.isUnlocked && stat.totalAttempts >= 5)
    .sort((a, b) => {
      const scoreA = (a.averageLatency / 100) + (1 - a.correctAttempts / a.totalAttempts);
      const scoreB = (b.averageLatency / 100) + (1 - b.correctAttempts / b.totalAttempts);
      return scoreB - scoreA;
    })
    .slice(0, 3)
    .map(stat => stat.character);
  
  const words: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    const wordLength = 3 + Math.floor(Math.random() * 4); // 3-6 characters
    
    // 60% of words should contain slow characters
    if (slowestChars.length > 0 && Math.random() < 0.6) {
      const slowChar = slowestChars[Math.floor(Math.random() * slowestChars.length)];
      let word = generatePseudoWord(unlockedChars, language, wordLength);
      
      // Ensure the word contains the slow character
      if (!word.includes(slowChar)) {
        const graphemes = splitGraphemes(word);
        const insertIndex = Math.floor(Math.random() * graphemes.length);

        if (language === 'bangla' && BANGLA_MODIFIERS.has(slowChar)) {
          const baseGrapheme = graphemes[insertIndex] ?? '';
          graphemes[insertIndex] = baseGrapheme.charAt(0) + slowChar;
        } else {
          graphemes[insertIndex] = slowChar;
        }

        word = graphemes.join('');
      }
      
      words.push(word);
    } else {
      words.push(generatePseudoWord(unlockedChars, language, wordLength));
    }
  }
  
  return words.join(' ');
};

// Check if ready to unlock new character
export const shouldUnlockNewChar = (
  currentUnlocked: CharacterStats[],
  minAccuracy: number = 0.95,
  maxLatency: number = 250,
  minAttempts: number = 20
): boolean => {
  if (currentUnlocked.length === 0) return true;
  
  // All current unlocked chars must meet threshold
  return currentUnlocked.every(stat => {
    if (stat.totalAttempts < minAttempts) return false;
    
    const accuracy = stat.correctAttempts / stat.totalAttempts;
    return accuracy >= minAccuracy && stat.averageLatency <= maxLatency;
  });
};

// Get next character to unlock
export const getNextCharToUnlock = (
  _allStats: CharacterStats[],
  currentUnlocked: string[],
  language: Language
): string | null => {
  // Priority order for English
  const englishPriority = [
    'e', 't', 'a', 'o', 'i', 'n', // Initial
    's', 'r', 'h', 'l', 'd', 'c', // Common
    'u', 'm', 'f', 'p', 'g', 'w', 'y', 'b', // Medium
    'v', 'k', 'x', 'j', 'q', 'z' // Less common
  ];
  
  // Priority order for Bangla (most common characters first)
  const banglaPriority = [
    'া', 'ি', 'ু', 'ক', 'ত', 'র', // Initial
    'ন', 'ব', 'ম', 'স', 'দ', 'প',
    'ল', 'হ', 'য', 'গ', 'ে', 'চ'
  ];
  
  const priority = language === 'english' ? englishPriority : banglaPriority;
  
  for (const char of priority) {
    if (!currentUnlocked.includes(char)) {
      return char;
    }
  }
  
  return null;
};
