# Adaptive Typing Practice Application

A responsive, AI-powered typing tutor inspired by keybr.com that helps users improve their typing speed and accuracy with full support for both English and Bangla (বাংলা) languages.

## Features

### 🎯 Adaptive Learning (AI Mentor)
- Tracks character-level accuracy across all typing sessions
- Identifies weak keys based on historical performance
- Dynamically generates practice text targeting your weakest characters
- Shows personalized feedback messages to guide your practice

### 📊 Real-time Metrics
- **WPM (Words Per Minute)**: Live calculation based on correctly typed characters
- **Accuracy**: Percentage of correct keystrokes
- **Time Tracking**: Elapsed time display with precision timing

### ⌨️ Interactive Virtual Keyboard
- **English**: QWERTY keyboard layout
- **Bangla**: Full Bijoy keyboard layout (বিজয় কীবোর্ড)
- Shows physical key mappings below Bangla characters
- Highlights the next expected key to press with pulsing animation
- Shows currently pressed keys in real-time
- Marks weak keys with special highlighting

### 🌍 Multi-language Support
- **English**: Standard English word dictionary with 80+ words
- **Bangla**: Native Bangla word dictionary with 100+ words (বাংলা শব্দ)
- Proper grapheme handling using Intl.Segmenter for complex Bangla conjuncts
- Bijoy keyboard layout for authentic Bangla typing experience
- Easy language toggle with flag indicators (🇺🇸/🇧🇩)

### 💾 Progress Tracking
- Saves your typing history to browser localStorage
- Stores character-level statistics for adaptive learning
- Displays recent test results with date, WPM, and accuracy
- Maintains up to 20 recent tests

### 🎨 Modern UI/UX (Like keybr.com)
- Dark-themed glassmorphism design with gradient backgrounds
- Fully responsive for desktop and mobile
- Smooth animations and transitions
- **Proper text wrapping** - Characters wrap naturally within the typing box
- Color-coded character feedback (green for correct, red for errors)
- Pulsing cursor indicator showing current position
- Professional typography with proper Bangla font rendering (Kalpurush, SolaimanLipi, Noto Sans Bengali)

## Technology Stack

- **React** - Functional components with Hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

## Key Implementation Details

### Grapheme Handling
Uses `Intl.Segmenter` API to properly split complex scripts like Bangla into visible grapheme clusters, ensuring accurate character counting and display for conjuncts and vowel modifiers.

### Mobile Support
Implements a hidden input field approach to trigger native mobile keyboards and IME (Input Method Editor) support, making the app fully functional on touch devices.

### Adaptive Algorithm
1. Analyzes your character statistics (minimum 5 attempts per character)
2. Identifies the 4 characters with the lowest accuracy
3. Filters the word dictionary for words containing these weak characters
4. Generates practice text mixing targeted words (every 3rd word) with random words

### WPM Calculation
Follows the standard typing convention: `(Correct Characters / 5) / Time in Minutes`
- 5 characters = 1 word
- Only counts correctly typed characters
- Updates in real-time during typing

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Choose Language**: Click the language toggle button to switch between English and Bangla
2. **Start Typing**: Click on the typing area and begin typing the displayed text
3. **Watch Metrics**: Monitor your WPM and accuracy in real-time
4. **Complete Test**: Finish typing all words to see your final results
5. **Next Test**: Click "Next Test" to generate new adaptive text based on your performance

## Adaptive Learning Flow

1. **Initial Tests**: Practice with random words to establish baseline statistics
2. **Analysis**: After 5+ attempts per character, the system identifies weak keys
3. **Targeted Practice**: New tests focus on words containing your weak characters
4. **Continuous Improvement**: Statistics update after every character typed
5. **Progress Tracking**: View your improvement over time in the history section

## Browser Compatibility

- Modern browsers with ES6+ support
- Intl.Segmenter API for optimal Bangla support (falls back to basic split for older browsers)
- localStorage for data persistence

## License

MIT License - Feel free to use and modify for your own projects!
