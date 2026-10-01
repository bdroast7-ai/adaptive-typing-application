import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Keyboard, Trophy, Activity, Target, Settings, Download, Upload, Volume2, VolumeX } from 'lucide-react';
import { db, saveSession, saveKeystroke, unlockCharacter, exportData, importData, clearAllData } from './db';
import { useTypingEngine, CompletionStats } from './hooks/useTypingEngine';
import { TypingCanvas } from './components/TypingCanvas';
import VirtualKeyboard from './components/VirtualKeyboard';
import { generateAdaptiveText, shouldUnlockNewChar, getNextCharToUnlock } from './utils/textGenerator';
import { audioFeedback } from './utils/audioFeedback';
import { INITIAL_UNLOCKED_CHARS, UNLOCK_THRESHOLD } from './config/layouts';

type Language = 'english' | 'bangla';

export default function App() {
  const [language, setLanguage] = useState<Language>('english');
  const [strictMode, setStrictMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [targetText, setTargetText] = useState('');
  const [showComplete, setShowComplete] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  // Query character stats from IndexedDB
  const characterStats = useLiveQuery(
    () => db.characterStats.where('language').equals(language).toArray(),
    [language]
  );

  const recentSessions = useLiveQuery(
    () => db.sessions.where('language').equals(language).reverse().limit(6).toArray(),
    [language]
  );

  // Initialize audio on mount
  useEffect(() => {
    audioFeedback.initialize().catch(console.error);
  }, []);

  // Initialize unlocked characters on language change
  useEffect(() => {
    const initUnlockedChars = async () => {
      const stats = await db.characterStats.where('language').equals(language).toArray();
      const unlockedChars = stats.filter(s => s.isUnlocked);
      
      if (unlockedChars.length === 0) {
        // Initialize with default unlocked characters
        for (const char of INITIAL_UNLOCKED_CHARS[language]) {
          await unlockCharacter(char, language);
        }
      }
    };

    initUnlockedChars();
  }, [language]);

  // Check for character unlock opportunities
  useEffect(() => {
    const checkUnlock = async () => {
      if (!characterStats) return;

      const unlocked = characterStats.filter(s => s.isUnlocked);
      
      if (shouldUnlockNewChar(
        unlocked,
        UNLOCK_THRESHOLD.minAccuracy,
        UNLOCK_THRESHOLD.maxLatency,
        UNLOCK_THRESHOLD.minAttempts
      )) {
        const nextChar = getNextCharToUnlock(
          characterStats,
          unlocked.map(s => s.character),
          language
        );
        
        if (nextChar) {
          await unlockCharacter(nextChar, language);
        }
      }
    };

    checkUnlock();
  }, [characterStats, language]);

  const generateNewTest = useCallback(async () => {
    const text = generateAdaptiveText(characterStats || [], language, 20);
    setTargetText(text);
    setShowComplete(false);
  }, [characterStats, language]);

  useEffect(() => {
    generateNewTest();
  }, [generateNewTest]);

  const handleComplete = useCallback(async (finalStats: CompletionStats) => {
    setShowComplete(true);
    const newSessionId = await saveSession({
      date: Date.now(),
      wpm: finalStats.wpm,
      accuracy: finalStats.accuracy,
      language,
      duration: finalStats.elapsedTime,
      totalKeystrokes: finalStats.totalKeystrokes
    });

    if (newSessionId && finalStats.keystrokes) {
      for (const ks of finalStats.keystrokes) {
        await saveKeystroke({
          sessionId: newSessionId,
          expectedChar: ks.expectedChar,
          typedChar: ks.typedChar,
          latencyMs: ks.latencyMs,
          isError: ks.isError,
          timestamp: ks.timestamp
        });
      }
    }
  }, [language]);

  const typingEngine = useTypingEngine({
    targetText,
    language,
    strictMode,
    onComplete: handleComplete
  });

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typing-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const data = JSON.parse(text);
        await importData(data);
        window.location.reload();
      }
    };
    input.click();
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      await clearAllData();
      window.location.reload();
    }
  };

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    audioFeedback.setEnabled(newState);
  };

  // Keyboard event listeners for active keys tracking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    };
    const handleBlur = () => {
      setActiveKeys(new Set());
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const unlockedCount = characterStats?.filter(s => s.isUnlocked).length || 0;
  const slowestChars = characterStats
    ?.filter(s => s.isUnlocked && s.totalAttempts >= 5)
    .sort((a, b) => b.averageLatency - a.averageLatency)
    .slice(0, 3)
    .map(s => s.character) || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-[#E5E5E5] rounded-lg shadow-sm">
              <Keyboard className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#1A1A1A]">
                Professional Typing Engine
              </h1>
              <p className="text-sm text-[#737373] font-medium">
                Progressive unlock • {unlockedCount} characters unlocked
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleAudio}
              className="p-2.5 bg-white border border-[#E5E5E5] rounded-md hover:bg-[#F5F5F5] transition-colors"
              title={audioEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 bg-white border border-[#E5E5E5] rounded-md hover:bg-[#F5F5F5] transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLanguage(prev => prev === 'english' ? 'bangla' : 'english')}
              className="px-5 py-2.5 bg-white border border-[#E5E5E5] rounded-md text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
            >
              {language === 'english' ? '🇺🇸 English' : '🇧🇩 বাংলা'}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8 p-6 bg-white border border-[#E5E5E5] rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={strictMode}
                  onChange={(e) => setStrictMode(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  Strict Mode (No backspace allowed)
                </span>
              </label>

              <div className="flex gap-2 pt-4 border-t border-[#E5E5E5]">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm hover:bg-[#F5F5F5]"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
                <button
                  onClick={handleImport}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm hover:bg-[#F5F5F5]"
                >
                  <Upload className="w-4 h-4" />
                  Import Data
                </button>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 hover:bg-red-100"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Mentor */}
        {slowestChars.length > 0 && (
          <div className="mb-6 p-4 bg-[#F5F5F5] rounded-md border border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm font-medium">
                Focusing on slower characters: {slowestChars.join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white border border-[#E5E5E5] rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-[#737373]" />
              <span className="text-sm font-medium text-[#737373]">WPM</span>
            </div>
            <div className="text-4xl font-semibold">{typingEngine.stats.wpm}</div>
          </div>
          <div className="p-6 bg-white border border-[#E5E5E5] rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#737373]" />
              <span className="text-sm font-medium text-[#737373]">Accuracy</span>
            </div>
            <div className="text-4xl font-semibold">{typingEngine.stats.accuracy}%</div>
          </div>
          <div className="p-6 bg-white border border-[#E5E5E5] rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-[#737373]" />
              <span className="text-sm font-medium text-[#737373]">Time</span>
            </div>
            <div className="text-4xl font-semibold">{Math.floor(typingEngine.elapsedTime / 1000)}s</div>
          </div>
        </div>

        {/* Typing Canvas */}
        <div className="mb-8 relative">
          <TypingCanvas
            targetGraphemes={typingEngine.targetGraphemes}
            cursorIndex={typingEngine.cursorIndex}
            errors={typingEngine.errors}
            status={typingEngine.status}
            language={language}
            onKeyPress={typingEngine.handleKeyPress}
            onBackspace={typingEngine.handleBackspace}
            strictMode={strictMode}
          />

          {showComplete && (
            <div className="absolute inset-0 bg-white/95 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-[#2563EB]" />
                <h2 className="text-3xl font-semibold mb-6">Test Complete!</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-5xl font-semibold">{typingEngine.stats.wpm}</div>
                    <div className="text-sm text-[#737373] mt-1">WPM</div>
                  </div>
                  <div>
                    <div className="text-5xl font-semibold">{typingEngine.stats.accuracy}%</div>
                    <div className="text-sm text-[#737373] mt-1">Accuracy</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    typingEngine.reset();
                    generateNewTest();
                  }}
                  className="px-8 py-3 bg-[#2563EB] text-white rounded-md font-medium hover:bg-[#1d4ed8]"
                >
                  Next Test
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Virtual Keyboard */}
        <VirtualKeyboard
          language={language}
          expectedChar={typingEngine.targetGraphemes[typingEngine.cursorIndex] || ''}
          activeKeys={activeKeys}
          unlockedChars={characterStats?.filter(s => s.isUnlocked).map(s => s.character) || []}
        />

        {/* Recent Sessions */}
        {recentSessions && recentSessions.length > 0 && (
          <div className="p-6 bg-white border border-[#E5E5E5] rounded-lg shadow-sm">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#737373]" />
              Recent Tests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="p-4 bg-[#FAFAFA] rounded-md border border-[#E5E5E5]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-[#737373] font-medium">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-[#737373]">
                      {session.language === 'english' ? '🇺🇸' : '🇧🇩'}
                    </span>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-2xl font-semibold">{session.wpm}</div>
                      <div className="text-xs text-[#737373]">WPM</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">{session.accuracy}%</div>
                      <div className="text-xs text-[#737373]">Acc</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
