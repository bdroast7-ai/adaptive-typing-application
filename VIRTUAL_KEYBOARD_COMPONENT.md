# Virtual Keyboard Component - Implementation Guide

## 🎯 Overview

The `VirtualKeyboard` component is a standalone, reusable component that provides visual keyboard feedback with support for progressive character unlocking and multi-language layouts.

---

## 📁 File Structure

**Created**: `src/components/VirtualKeyboard.tsx`

**Dependencies**:
- `src/config/layouts.ts` - Keyboard layout data
- React (no external libraries needed)

---

## 🎨 Component Interface

### Props

```typescript
interface VirtualKeyboardProps {
  language: 'english' | 'bangla';
  expectedChar: string;              // Next character to type
  activeKeys: Set<string>;           // Currently pressed keys
  unlockedChars?: string[];          // For progressive mode dimming
}
```

### Prop Details

#### `language`
- **Type**: `'english' | 'bangla'`
- **Purpose**: Determines which keyboard layout to display
- **Effect**: Switches between QWERTY and Bijoy layouts

#### `expectedChar`
- **Type**: `string`
- **Purpose**: The next character the user should type
- **Effect**: Highlights the corresponding physical key with blue border and ring
- **Example**: If `expectedChar = 'ক'`, highlights the `j` key (Bijoy layout)

#### `activeKeys`
- **Type**: `Set<string>`
- **Purpose**: Tracks currently pressed physical keys
- **Effect**: Shows pressed keys with gray background and scale-down animation
- **Updates**: Real-time via keyboard event listeners

#### `unlockedChars` (Optional)
- **Type**: `string[]`
- **Default**: `[]` (empty array = all keys visible)
- **Purpose**: Implements progressive unlock visual feedback
- **Effect**: Dims locked keys with reduced opacity (40%)
- **Progressive Mode**: Only shows full brightness for unlocked characters

---

## 🎮 Features

### 1. Physical Key Highlighting

**Expected Key (Next to type)**:
```css
bg-[#2563EB]/10        /* Light blue background */
border-2 border-[#2563EB]  /* Blue border */
ring-2 ring-[#2563EB]/20   /* Blue ring glow */
z-10                   /* Above other keys */
```

**Active Key (Currently pressed)**:
```css
bg-[#E5E5E5]          /* Gray background */
border-[#E5E5E5]      /* Gray border */
shadow-inner          /* Inset shadow */
scale-95              /* Slightly smaller */
```

### 2. Progressive Unlocking Visualization

**Unlocked Keys**:
```css
bg-white              /* White background */
border-[#E5E5E5]      /* Light gray border */
shadow-sm             /* Subtle shadow */
opacity-100           /* Full visibility */
```

**Locked Keys**:
```css
bg-[#FAFAFA]          /* Off-white background */
border-[#E5E5E5]      /* Light gray border */
opacity-40            /* Dimmed (40%) */
```

### 3. Dual Character Display

**For Each Key**:
```
┌──────────┐
│   ফ      │ ← Shift character (top, small, gray)
│   প      │ ← Normal character (middle, large, black)
│   r      │ ← Physical key (bottom, tiny, light gray) - Bangla only
└──────────┘
```

### 4. Language-Specific Layout

**English (QWERTY)**:
- Standard QWERTY layout
- Shows shift/normal characters
- No physical key labels (not needed)

**Bangla (Bijoy)**:
- Bijoy keyboard layout
- Shows Bangla characters
- Physical QWERTY key labels below
- Proper Bengali font rendering

---

## 🔧 Integration Example

### In App.tsx

```typescript
import VirtualKeyboard from './components/VirtualKeyboard';

export default function App() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  
  // Track keyboard events
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
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <VirtualKeyboard
      language={language}
      expectedChar={targetGraphemes[cursorIndex] || ''}
      activeKeys={activeKeys}
      unlockedChars={characterStats
        ?.filter(s => s.isUnlocked)
        .map(s => s.character) || []}
    />
  );
}
```

---

## 📊 State Flow

### How Expected Key Highlighting Works

```
User needs to type: 'ক'
    ↓
Component receives: expectedChar = 'ক'
    ↓
getExpectedPhysicalKey() called
    ↓
If Bangla: BIJOY_TO_KEY['ক'] → 'j'
If English: 'ক'.toLowerCase() → 'ক'
    ↓
expectedPhysicalKey = 'j'
    ↓
During render, each key checks:
  keyInfo.physicalKey.toLowerCase() === expectedPhysicalKey
    ↓
'j' key gets isExpected = true
    ↓
Applies blue highlight styling
```

### How Progressive Dimming Works

```
unlockedChars = ['ক', 'ত', 'র', 'া', 'ি']
    ↓
For each key on keyboard:
  Check if keyInfo.normal in unlockedChars
  OR keyInfo.shift in unlockedChars
    ↓
If YES: isUnlocked = true → Full brightness
If NO:  isUnlocked = false → 40% opacity
    ↓
Locked keys appear dimmed
Unlocked keys appear normal
```

---

## 🎨 Styling Details

### Key States (Priority Order)

1. **Pressed** (highest priority)
   - Gray background
   - Scale down animation
   - Immediate visual feedback

2. **Expected** (second priority)
   - Blue highlight
   - Ring glow effect
   - Guides user to next key

3. **Locked** (third priority)
   - Dimmed appearance
   - Shows unavailable keys

4. **Normal** (default)
   - White background
   - Subtle shadow

### Responsive Design

**Mobile (<768px)**:
```css
min-w-[40px]      /* Smaller keys */
px-2 py-3         /* Less padding */
text-[10px]       /* Smaller shift char */
text-sm           /* Smaller normal char */
```

**Desktop (≥768px)**:
```css
min-w-[48px]      /* Larger keys */
px-3 py-4         /* More padding */
text-xs           /* Larger shift char */
text-base         /* Larger normal char */
```

### Keyboard Layout Offsets

```typescript
rowIndex === 1 ? <div className="w-10 md:w-14" />  // Tab offset
rowIndex === 2 ? <div className="w-14 md:w-20" />  // Caps Lock offset
rowIndex === 3 ? <div className="w-20 md:w-24" />  // Shift offset
```

This creates the natural staggered keyboard appearance.

---

## 🔍 Key Detection Logic

### For English

```typescript
// Simple: character itself is the physical key
expectedPhysicalKey = expectedChar.toLowerCase();
```

### For Bangla

```typescript
// Complex: need to map Bangla char to physical key
if (language === 'bangla') {
  // expectedChar = 'ক'
  // BIJOY_TO_KEY['ক'] = 'j'
  expectedPhysicalKey = BIJOY_TO_KEY[expectedChar] || expectedChar.toLowerCase();
}
```

### Spacebar Handling

```typescript
<div className={`... ${
  activeKeys.has(' ') ? 'bg-[#E5E5E5] scale-95' :
  expectedPhysicalKey === ' ' ? 'bg-[#2563EB]/10 border-2 border-[#2563EB]' : 
  'bg-white'
}`}>
  Space
</div>
```

---

## 🎯 Progressive Mode Example

### Scenario: 6 Characters Unlocked

```typescript
unlockedChars = ['e', 't', 'a', 'o', 'i', 'n']
```

**Visual Result**:
- Keys for `e`, `t`, `a`, `o`, `i`, `n` → Full brightness ✓
- All other keys (q, w, r, y, u, p...) → Dimmed (40% opacity)

**User Experience**:
- Clear visual focus on available characters
- Prevents overwhelming the learner
- Guides attention to current lesson

### Scenario: All Unlocked (Traditional Mode)

```typescript
unlockedChars = []  // Empty array
```

**Visual Result**:
- All keys → Full brightness
- No dimming effect
- Traditional typing practice mode

---

## 🔧 Customization Options

### Adjust Locked Key Opacity

```typescript
// Current: 40% opacity
className={!isUnlocked ? 'opacity-40' : ''}

// More visible (60%):
className={!isUnlocked ? 'opacity-60' : ''}

// More dimmed (20%):
className={!isUnlocked ? 'opacity-20' : ''}
```

### Change Expected Key Highlight Color

```typescript
// Current: Blue (#2563EB)
'bg-[#2563EB]/10 border-2 border-[#2563EB] ring-2 ring-[#2563EB]/20'

// Green:
'bg-green-500/10 border-2 border-green-500 ring-2 ring-green-500/20'

// Purple:
'bg-purple-500/10 border-2 border-purple-500 ring-2 ring-purple-500/20'
```

### Adjust Animation Speed

```typescript
// Current: 75ms
transition-all duration-75

// Faster (50ms):
transition-all duration-50

// Slower (150ms):
transition-all duration-150

// No animation:
transition-none
```

---

## 📈 Performance Considerations

### Rendering Optimization

**Efficient Key Checks**:
```typescript
const isPressed = activeKeys.has(keyInfo.physicalKey.toLowerCase());
const isExpected = keyInfo.physicalKey.toLowerCase() === expectedPhysicalKey;
const isUnlocked = unlockedChars.includes(keyInfo.normal) || 
                   unlockedChars.includes(keyInfo.shift);
```

All checks are O(1) operations (Set.has, string comparison, array includes for small arrays).

### Re-render Triggers

Component re-renders only when:
1. `language` changes (rare)
2. `expectedChar` changes (every correct keystroke)
3. `activeKeys` changes (every key press/release)
4. `unlockedChars` changes (when new character unlocks)

**Optimization**: Component is lightweight enough not to need React.memo.

---

## 🐛 Troubleshooting

### Key Not Highlighting

**Issue**: Expected key doesn't light up

**Check**:
1. Is `expectedChar` being passed correctly?
2. For Bangla, is the character in `BIJOY_TO_KEY` mapping?
3. Console log `expectedPhysicalKey` to verify

**Fix**:
```typescript
console.log('Expected char:', expectedChar);
console.log('Expected key:', getExpectedPhysicalKey());
```

### Locked Keys Still Bright

**Issue**: Dimming not working

**Check**:
1. Is `unlockedChars` array being passed?
2. Is it empty (empty = all unlocked)?

**Fix**:
```typescript
console.log('Unlocked chars:', unlockedChars);
console.log('Is unlocked:', isUnlocked);
```

### Active Keys Not Showing

**Issue**: Pressed keys don't change appearance

**Check**:
1. Are keyboard event listeners attached?
2. Is `activeKeys` Set being updated?

**Fix**:
```typescript
console.log('Active keys:', Array.from(activeKeys));
```

### Spacebar Not Working

**Issue**: Space key behavior wrong

**Check**:
1. Space is handled separately (outside main loop)
2. Check `activeKeys.has(' ')` (with actual space character)

---

## ✅ Summary

### Component Benefits

✅ **Modular** - Self-contained, reusable component
✅ **Progressive** - Built-in support for character unlocking
✅ **Multi-language** - English and Bangla layouts
✅ **Visual Feedback** - Three distinct key states
✅ **Responsive** - Mobile and desktop optimized
✅ **Performant** - Efficient rendering logic
✅ **Accessible** - Clear visual hierarchy

### Integration Points

1. **State Injection**: Pass current typing state via props
2. **Physical Key Mapping**: Automatic resolution for Bangla
3. **Visual Dimming**: Progressive mode via `unlockedChars`
4. **Real-time Feedback**: Active key tracking

### Use Cases

- **Progressive Learning**: Show only unlocked keys
- **Traditional Practice**: All keys visible (empty array)
- **Multi-language Support**: English and Bangla
- **Visual Guidance**: Highlight next expected key
- **Physical Feedback**: Show pressed keys in real-time

---

*Component Version: 1.0*
*Created: December 2024*
*Status: Production Ready ✅*
