import Dexie, { Table } from 'dexie';

export interface Session {
  id?: number;
  date: number;
  wpm: number;
  accuracy: number;
  language: string;
  duration: number;
  totalKeystrokes: number;
}

export interface Keystroke {
  id?: number;
  sessionId?: number;
  expectedChar: string;
  typedChar: string;
  latencyMs: number;
  isError: boolean;
  timestamp: number;
}

export interface CharacterStats {
  id?: number;
  character: string;
  language: string;
  totalAttempts: number;
  correctAttempts: number;
  averageLatency: number;
  lastPracticed: number;
  isUnlocked: boolean;
}

export class TypingDB extends Dexie {
  sessions!: Table<Session>;
  keystrokes!: Table<Keystroke>;
  characterStats!: Table<CharacterStats>;

  constructor() {
    super('TypingAppDB');
    this.version(1).stores({
      sessions: '++id, date, language',
      keystrokes: '++id, sessionId, expectedChar, timestamp',
      characterStats: '++id, character, language, isUnlocked'
    });
  }
}

export const db = new TypingDB();

// Helper functions for data operations
export const saveSession = async (session: Omit<Session, 'id'>) => {
  return await db.sessions.add(session);
};

export const saveKeystroke = async (keystroke: Omit<Keystroke, 'id'>) => {
  return await db.keystrokes.add(keystroke);
};

export const updateCharacterStats = async (
  character: string,
  language: string,
  latency: number,
  isCorrect: boolean
) => {
  const existing = await db.characterStats
    .where({ character, language })
    .first();

  if (existing) {
    const newTotal = existing.totalAttempts + 1;
    const newCorrect = existing.correctAttempts + (isCorrect ? 1 : 0);
    const newAvgLatency = 
      (existing.averageLatency * existing.totalAttempts + latency) / newTotal;

    await db.characterStats.update(existing.id!, {
      totalAttempts: newTotal,
      correctAttempts: newCorrect,
      averageLatency: newAvgLatency,
      lastPracticed: Date.now()
    });
  } else {
    await db.characterStats.add({
      character,
      language,
      totalAttempts: 1,
      correctAttempts: isCorrect ? 1 : 0,
      averageLatency: latency,
      lastPracticed: Date.now(),
      isUnlocked: false
    });
  }
};

export const getUnlockedCharacters = async (language: string) => {
  return await db.characterStats
    .where({ language, isUnlocked: 1 })
    .toArray();
};

export const unlockCharacter = async (character: string, language: string) => {
  const stat = await db.characterStats
    .where({ character, language })
    .first();
  
  if (stat) {
    await db.characterStats.update(stat.id!, { isUnlocked: true });
  } else {
    await db.characterStats.add({
      character,
      language,
      totalAttempts: 0,
      correctAttempts: 0,
      averageLatency: 0,
      lastPracticed: Date.now(),
      isUnlocked: true
    });
  }
};

export const exportData = async () => {
  const sessions = await db.sessions.toArray();
  const keystrokes = await db.keystrokes.toArray();
  const characterStats = await db.characterStats.toArray();
  
  return {
    version: 1,
    exportDate: Date.now(),
    sessions,
    keystrokes,
    characterStats
  };
};

export const importData = async (data: any) => {
  await db.transaction('rw', db.sessions, db.keystrokes, db.characterStats, async () => {
    if (data.sessions) {
      await db.sessions.bulkAdd(data.sessions);
    }
    if (data.keystrokes) {
      await db.keystrokes.bulkAdd(data.keystrokes);
    }
    if (data.characterStats) {
      await db.characterStats.bulkAdd(data.characterStats);
    }
  });
};

export const clearAllData = async () => {
  await db.transaction('rw', db.sessions, db.keystrokes, db.characterStats, async () => {
    await db.sessions.clear();
    await db.keystrokes.clear();
    await db.characterStats.clear();
  });
};
