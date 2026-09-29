# Quick Reference - Professional Typing Engine

## 🎯 What's New at a Glance

### 5 Major Upgrades
1. **IndexedDB** - Unlimited storage, keystroke tracking
2. **Progressive Unlock** - Start with 6 chars, unlock gradually
3. **State Machine** - Precise typing control, strict mode
4. **Audio Feedback** - Mechanical keyboard sounds
5. **Modular Code** - Clean architecture

---

## 🚀 Quick Start

### First Time Using the App

1. **Open the app** - 6 characters already unlocked
2. **Click typing area** - Green box in center
3. **Start typing** - Hear clicks, see your WPM
4. **Complete test** - Stats auto-saved to database
5. **Click "Next Test"** - New pseudo-words generated

### Key UI Elements

```
┌─────────────────────────────────────────────┐
│ [🎹] Professional Typing Engine    [🔊][⚙️][🇺🇸] │ ← Header
│      Progressive unlock • 6 chars unlocked       │
├─────────────────────────────────────────────┤
│ [⚙️ Settings Panel]                         │ ← Click gear icon
│ ☑ Strict Mode                               │
│ [Export] [Import] [Clear]                   │
├─────────────────────────────────────────────┤
│ 🎯 Focusing on slower characters: t, n, e   │ ← AI Mentor
├─────────────────────────────────────────────┤
│  📊 WPM     🎯 Accuracy    🏆 Time          │ ← Metrics
│    42          95%          15s             │
├─────────────────────────────────────────────┤
│ [Typing Area - Click here to type]          │ ← Main interface
│ eaten teen note...                          │
├─────────────────────────────────────────────┤
│ 📊 Recent Tests                              │ ← History
│ [Test 1] [Test 2] [Test 3]                  │
└─────────────────────────────────────────────┘
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Any letter** | Type character (if unlocked) |
| **Backspace** | Delete last char (if not in strict mode) |
| **Click** | Focus typing area |
| **Ctrl+S** | (Not implemented - future feature) |

---

## 🎮 Features Guide

### Progressive Unlocking

**How it works:**
1. Start: 6 characters (e, t, a, o, i, n)
2. Practice: Type pseudo-words using only those
3. Threshold: Accuracy ≥95%, Latency ≤250ms, 20+ attempts
4. Unlock: Next character added (usually 's')
5. Repeat: Until full keyboard unlocked

**Check your progress:**
- Look at header: "6 characters unlocked"
- After good practice: Number increases!

### Strict Mode

**Toggle location:** Settings panel (⚙️)

**When ON:**
- ❌ Cannot backspace
- ❌ Must type correct character to progress
- ✅ Forces accuracy
- ✅ Builds muscle memory

**When OFF:**
- ✅ Backspace allowed
- ✅ Errors marked but typing continues
- Good for: Beginners, relaxed practice

### Audio Feedback

**Toggle location:** Volume button in header (🔊/🔇)

**Sounds:**
- 🔊 **Click** (high pitch) = Correct keystroke
- 🔊 **Thud** (low pitch) = Error

**Why use it:**
- Don't need to look at screen for errors
- Mechanical keyboard feel
- Instant feedback
- Professional typing experience

### Data Export/Import

**Export (Backup):**
1. Settings → Export Data
2. Save JSON file
3. Store in cloud/USB

**Import (Restore):**
1. Settings → Import Data
2. Select JSON file
3. All progress restored!

**Use cases:**
- Backup before browser clear
- Transfer between devices
- Share with others (for analysis)

---

## 📊 Understanding Metrics

### WPM (Words Per Minute)
```
Calculation: (Correct Characters ÷ 5) ÷ Time in Minutes
Example: 210 correct chars in 1 minute = 42 WPM
```

**Levels:**
- 0-20 WPM: Beginner
- 20-40 WPM: Learning
- 40-60 WPM: Good
- 60-80 WPM: Advanced
- 80+ WPM: Professional

### Accuracy
```
Calculation: (Correct ÷ Total) × 100
Example: 95 correct out of 100 typed = 95%
```

**Targets:**
- < 90%: Slow down, focus on accuracy
- 90-95%: Good progress
- 95-98%: Excellent
- 98%+: Ready for speed increase

### Time
Simple elapsed time since test started.

---

## 🎯 Progressive Unlock Timeline

### Typical User Journey

**Day 1-3** (Learning basics)
- Unlocked: 6 chars
- WPM: 10-20
- Focus: Accuracy
- Keystrokes: ~500

**Week 1** (Building foundation)
- Unlocked: 8-10 chars
- WPM: 20-30
- Focus: Consistency
- Keystrokes: ~2,000

**Week 2-3** (Rapid progress)
- Unlocked: 15-20 chars
- WPM: 30-45
- Focus: Speed
- Keystrokes: ~5,000

**Month 2+** (Full keyboard)
- Unlocked: All chars
- WPM: 50-70
- Focus: Mastery
- Keystrokes: ~20,000+

---

## 🔧 Settings Explained

### Strict Mode
- **Purpose**: Force accuracy, no backspace
- **Best for**: Building proper habits
- **Not for**: Casual practice

### Audio Toggle
- **Purpose**: Enable/disable keyboard sounds
- **Best for**: Quiet environments when off
- **Benefit**: Tactile feedback when on

### Export Data
- **Format**: JSON file
- **Contains**: All sessions, keystrokes, stats
- **Size**: Typically < 1 MB

### Import Data
- **Purpose**: Restore from backup
- **Effect**: Merges with existing data
- **Warning**: Can't undo

### Clear All Data
- **Purpose**: Fresh start
- **Effect**: Deletes everything
- **Warning**: Cannot be undone!

---

## 🐛 Troubleshooting

### Audio Not Playing
1. Check volume button (🔊 should be visible)
2. Unmute browser tab
3. Check system volume
4. Try clicking typing area to activate AudioContext

### Characters Not Unlocking
1. Check accuracy (needs ≥95%)
2. Check latency (practice more to reduce)
3. Need 20+ attempts per character
4. Be patient - unlocking is gradual

### Data Not Saving
1. Don't use private/incognito mode
2. Allow browser to store data
3. Check browser storage settings
4. Try exporting as backup

### Typing Not Registering
1. Click typing area to focus
2. Make sure you're typing unlocked characters
3. In strict mode, must type correctly
4. Refresh page if stuck

---

## 📈 Tips for Fast Improvement

### For Accuracy
✅ Slow down initially
✅ Focus on correct finger placement
✅ Use strict mode to build habits
✅ Don't look at keyboard

### For Speed
✅ Maintain 95%+ accuracy first
✅ Practice daily (15-20 min)
✅ Let progressive unlock guide you
✅ Use audio feedback

### For Efficiency
✅ Export data regularly
✅ Practice at same time daily
✅ Focus on slow characters (see AI mentor)
✅ Track progress over weeks

---

## 📊 Data Format Reference

### Export File Structure
```json
{
  "version": 1,
  "exportDate": 1234567890,
  "sessions": [...],      // Your test results
  "keystrokes": [...],    // Every keystroke logged
  "characterStats": [...] // Per-character metrics
}
```

### What Each Table Contains

**sessions:**
- Test date, WPM, accuracy
- Language, duration
- Total keystrokes

**keystrokes:**
- Expected vs typed character
- Latency in milliseconds
- Error flag
- Timestamp

**characterStats:**
- Character, language
- Total/correct attempts
- Average latency
- Unlock status

---

## 🎯 Best Practices

### Daily Routine
```
1. Warm up (5 min)
   - Practice with current unlocked chars
   - Focus on accuracy

2. Main practice (10-15 min)
   - Complete 3-5 tests
   - Maintain 95%+ accuracy
   - Let AI adapt to your needs

3. Cool down (5 min)
   - Practice slow characters
   - Review session stats
```

### Weekly Goals
- [ ] Complete 20+ tests
- [ ] Unlock 2-3 new characters
- [ ] Maintain 95%+ average accuracy
- [ ] Export data backup

### Monthly Milestones
- [ ] 100+ tests completed
- [ ] 15+ characters unlocked
- [ ] 40+ WPM average
- [ ] Analyze export data

---

## 🔍 Understanding the Algorithm

### Text Generation
```
1. Get unlocked characters: [e, t, a, o, i, n]
2. Find bigrams: "et", "te", "an", "on"...
3. Generate pseudo-word: "eaten"
4. Repeat for 20 words
5. Emphasize slow characters (60%)
```

### Unlock Decision
```
For each unlocked character:
  IF attempts >= 20 AND
     accuracy >= 95% AND
     latency <= 250ms
  THEN all_chars_good = true

IF all_chars_good:
  Unlock next character in priority order
```

### Priority Order (English)
```
Initial: e, t, a, o, i, n
Next:    s, r, h, l, d, c
Then:    u, m, f, p, g, w, y, b
Finally: v, k, x, j, q, z
```

---

## 💡 Pro Tips

1. **Audio is your friend** - Don't disable it until you're advanced
2. **Export weekly** - Database can corrupt (rare but possible)
3. **Strict mode builds habits** - Use it once comfortable
4. **Progressive unlock is scientific** - Trust the algorithm
5. **Latency matters** - Slow, accurate typing unlocks faster than fast, sloppy
6. **20 attempts minimum** - Don't expect instant unlocks
7. **Practice daily** - 15 min/day beats 2 hours on weekend
8. **Check AI mentor** - It tells you what to focus on

---

## 📞 Quick Help

**Can't type?**
→ Click typing area to focus

**No sound?**
→ Check 🔊 button, unmute tab

**No new unlocks?**
→ Need 95% accuracy + 250ms latency + 20 attempts

**Want to reset?**
→ Settings → Clear All Data

**Need backup?**
→ Settings → Export Data

**Lost data?**
→ Settings → Import Data (if you have backup)

---

*Quick Reference Version: 1.0*
*For: Professional Typing Engine v2.0*
*Last Updated: December 2024*
