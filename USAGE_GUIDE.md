# Usage Guide - Adaptive Typing Practice

## Quick Start

### Starting the Application
1. Open the application in your browser
2. You'll see the main typing interface with the English language selected by default

### Switching Languages
- Click the language toggle button in the top-right corner
- 🇺🇸 **English** - Standard QWERTY keyboard
- 🇧🇩 **বাংলা** - Bijoy keyboard layout (বিজয় কীবোর্ড)

## How to Practice

### 1. **Start Typing**
- Click on the typing area (the box with gray text)
- Start typing the words shown
- The timer starts automatically with your first keystroke

### 2. **Follow Visual Cues**
- **Gray text** = Not yet typed
- **Green text** = Correctly typed ✓
- **Red background** = Incorrect character ✗
- **Purple highlight** = Current cursor position (blinking)

### 3. **Use the Virtual Keyboard**
- **Yellow pulsing key** = Next key you need to press
- **Purple key** = Currently pressed key on your physical keyboard
- **Red highlighted keys** = Your weak keys that need practice

### 4. **Complete the Test**
- Type all words correctly to finish
- View your final WPM (Words Per Minute) and Accuracy
- Click "Next Test" to continue practicing

## Understanding the Metrics

### WPM (Words Per Minute)
- Industry standard calculation: (Correct Characters ÷ 5) ÷ Time in Minutes
- Only counts correctly typed characters
- Higher is better! Professional typists achieve 60-80 WPM

### Accuracy
- Percentage of correct keystrokes
- (Correct Characters ÷ Total Characters) × 100
- Aim for 95%+ accuracy for best results

### Time
- Elapsed time since you started typing
- Pauses automatically when test is finished

## AI Adaptive Learning

### How It Works
1. **Initial Practice**: Start with random words from the dictionary
2. **Data Collection**: The AI tracks every character you type
3. **Analysis**: After 5+ attempts per character, AI identifies weak characters
4. **Targeted Practice**: New tests focus on words containing your weak keys
5. **Continuous Improvement**: Statistics update in real-time

### AI Mentor Messages
- 💪 **"Practice to identify your weak keys!"** - Keep practicing to build statistics
- 🎯 **"Focusing on your weak keys: a, e, r, t"** - Test contains words with these characters

### Example Flow
```
Test 1: Random words → Build statistics
Test 2-3: More practice → AI analyzing
Test 4: "Focusing on: ক, র, ব" → Targeted practice
Test 5+: Continuous adaptation based on performance
```

## Language-Specific Tips

### English Typing (QWERTY)
- Standard keyboard layout
- Focus on home row: A S D F J K L ;
- Practice common words and letter combinations
- Build muscle memory for frequent keys

### Bangla Typing (Bijoy Layout - বিজয়)
- **Physical Key → Bangla Character mapping** shown on virtual keyboard
- Common mappings:
  - `k` → ক
  - `a` → া  
  - `s` → স
  - `j` → জ
  - `b` → ব
  - `r` → র
- Conjuncts (যুক্তাক্ষর) are properly handled
- Practice common Bangla words first

### Bijoy Keyboard Quick Reference
```
Row 1 (Numbers): 1→১, 2→২, 3→৩, 4→৪, 5→৫, etc.
Row 2 (Top):     q→ং, w→ও, e→ৃ, r→র, t→ট, y→এ, u→উ, i→ই, o→ও, p→প
Row 3 (Home):    a→া, s→স, d→দ, f→ফ, g→গ, h→হ, j→জ, k→ক, l→ল
Row 4 (Bottom):  z→য, x→শ, c→চ, v→ভ, b→ব, n→ন, m→ম
```

## Progress Tracking

### Recent Tests Section
- Shows your last 6 tests
- Each card displays:
  - Date of the test
  - Language used (🇺🇸 or 🇧🇩)
  - WPM achieved
  - Accuracy percentage

### Character Statistics (Hidden but Active)
- Stored in browser localStorage
- Tracks total attempts and correct attempts per character
- Used by AI to identify weak keys
- Persists across browser sessions
- Clear browser data to reset statistics

## Tips for Improvement

### Beginner Level (0-30 WPM)
✓ Focus on accuracy over speed
✓ Look at the keyboard to learn key positions
✓ Practice each key individually
✓ Use the virtual keyboard for guidance

### Intermediate Level (30-50 WPM)
✓ Reduce looking at keyboard
✓ Focus on home row positioning
✓ Practice common word combinations
✓ Maintain 95%+ accuracy

### Advanced Level (50+ WPM)
✓ Touch typing without looking
✓ Focus on speed while maintaining accuracy
✓ Practice weak keys identified by AI
✓ Challenge yourself with longer tests

## Troubleshooting

### Mobile Devices
- Tap the typing area to bring up keyboard
- Hidden input captures your typing
- Virtual keyboard shows which key to press
- Works with both English and Bangla mobile keyboards

### Bangla Text Not Displaying
- Ensure browser supports Unicode
- Fonts load automatically from CDN
- Try refreshing the page if fonts don't load

### Statistics Not Saving
- Enable cookies and localStorage in browser
- Don't use incognito/private mode for persistent tracking
- Check browser storage settings

### Next Key Not Highlighting
- Make sure you're using the correct keyboard layout
- For Bangla, use Bijoy keyboard input method
- Physical key (not the character) is highlighted

## Keyboard Shortcuts

- **Click typing area**: Focus and start typing
- **Any key**: Start the test (on first keystroke)
- **Escape**: Click outside to blur (stops test)
- **Click "Next Test"**: Generate new adaptive text

## Best Practices

1. **Practice Regularly**: 15-20 minutes daily is better than 2 hours once a week
2. **Warm Up**: Start with easier, familiar words
3. **Focus on Accuracy First**: Speed will come naturally
4. **Use Proper Posture**: Sit straight, feet flat, wrists elevated
5. **Take Breaks**: Rest your hands every 20-30 minutes
6. **Track Progress**: Check your history to see improvement over time
7. **Trust the AI**: Follow targeted practice suggestions

## Data Privacy

- All data stored locally in your browser (localStorage)
- No data sent to external servers
- No user accounts or sign-ups required
- Clear browser data to reset all statistics

## Advanced Features

### Custom Practice Focus
The AI automatically adjusts difficulty based on:
- Your accuracy per character
- Total attempts per character
- Recent performance trends
- Language-specific common characters

### Grapheme-Level Tracking (Bangla)
- Properly handles complex Bangla conjuncts (যুক্তাক্ষর)
- Tracks individual graphemes, not bytes
- Accurate for vowel modifiers (কার)
- Uses Intl.Segmenter API for precision

## Support

For best experience:
- Use modern browsers (Chrome, Firefox, Edge, Safari)
- Enable JavaScript
- Allow localStorage
- Use a physical keyboard for accurate tracking

---

**Happy Typing! 🎉**

Start practicing now and watch your speed improve with AI-powered adaptive learning!
