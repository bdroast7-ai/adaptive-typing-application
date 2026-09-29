# Design System - Minimalist Typing Practice

## 🎨 Color Palette

### Primary Colors
```css
App Background:     #FAFAFA  /* Warm, neutral off-white */
Surface/Cards:      #FFFFFF  /* Pure white */
Primary Text:       #1A1A1A  /* Near black - maximum legibility */
Secondary Text:     #737373  /* Neutral gray - labels, subtitles */
Accent Color:       #2563EB  /* Calm, muted blue - active states */
Borders/Dividers:   #E5E5E5  /* Very light gray */
```

### Semantic Colors
```css
Correct Text:       #1A1A1A  /* Primary text color */
Error Background:   #EF4444  /* Red for errors */
Untyped Text:       #A3A3A3  /* Lighter gray */
Active Background:  #F5F5F5  /* Soft gray for highlights */
Weak Key Alert:     #FEF2F2  /* Very light red background */
Weak Key Border:    #FECACA  /* Light red border */
```

## 📐 Spacing & Layout

### Container Widths
- Max Width: 7xl (1280px)
- Padding: 1rem (mobile), 2rem (desktop)

### Component Spacing
```css
Between sections:   2rem (32px)
Card padding:       1.5rem (24px)
Button padding:     0.75rem 1.25rem (12px 20px)
Input padding:      2.5rem (40px)
```

### Border Radius
```css
Cards:              8px (rounded-lg)
Buttons:            6px (rounded-md)
Keyboard Keys:      6px (rounded-md)
Alert Banners:      6px (rounded-md)
```

## 🔤 Typography

### Font Families
```css
English:    'monospace'
Bangla:     'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', system-ui, sans-serif
UI Text:    System default (Inter, -apple-system, etc.)
```

### Font Sizes
```css
App Title:          1.5rem (24px) - text-2xl
Subtitle:           0.875rem (14px) - text-sm
Stat Numbers:       2.25rem (36px) - text-4xl
Stat Labels:        0.875rem (14px) - text-sm
Typing Text:        1.875rem (30px) - text-3xl
Keyboard Normal:    1rem (16px) - text-base
Keyboard Shift:     0.75rem (12px) - text-xs
Keyboard Physical:  0.5625rem (9px) - text-[9px]
```

### Font Weights
```css
Headers:            600 (semibold)
Stats Numbers:      600 (semibold)
Labels:             500 (medium)
Body Text:          400 (normal)
```

## 🎯 Component Specifications

### Header
```css
Background:         Transparent (sits on #FAFAFA)
Title Color:        #1A1A1A
Title Weight:       600 (semibold)
Subtitle Color:     #737373
Subtitle Weight:    500 (medium)
Icon Background:    #FFFFFF
Icon Border:        1px solid #E5E5E5
Border Radius:      8px
Shadow:             0 1px 2px 0 rgba(0, 0, 0, 0.05)
```

### Language Toggle Button
```css
Background:         #FFFFFF
Border:             1px solid #E5E5E5
Hover Background:   #F5F5F5
Text Color:         #1A1A1A
Font Size:          0.875rem (14px)
Font Weight:        500 (medium)
Padding:            0.625rem 1.25rem (10px 20px)
Border Radius:      6px
Transition:         200ms
```

### Alert Banner (AI Mentor)
```css
Background:         #F5F5F5
Border:             1px solid #E5E5E5
Border Radius:      6px
Padding:            1rem (16px)
Icon Color:         #2563EB
Text Color:         #1A1A1A
Font Size:          0.875rem (14px)
Font Weight:        500 (medium)
```

### Stat Cards (WPM, Accuracy, Time)
```css
Background:         #FFFFFF
Border:             1px solid #E5E5E5
Border Radius:      8px
Padding:            1.5rem (24px)
Shadow:             0 1px 2px 0 rgba(0, 0, 0, 0.05)

Label Icon Size:    1rem (16px)
Label Icon Color:   #737373
Label Text Color:   #737373
Label Font Size:    0.875rem (14px)
Label Font Weight:  500 (medium)

Number Color:       #1A1A1A
Number Font Size:   2.25rem (36px)
Number Font Weight: 600 (semibold)
```

### Typing Area
```css
Background:         #FFFFFF
Border:             1px solid #E5E5E5
Border Radius:      8px
Padding:            2.5rem (40px)
Min Height:         280px
Shadow:             0 1px 2px 0 rgba(0, 0, 0, 0.05)

Text Font Size:     1.875rem (30px)
Text Line Height:   relaxed (1.625)

Untyped Text:       #A3A3A3
Correct Text:       #1A1A1A
Error Text:         #FFFFFF
Error Background:   #EF4444
Cursor Background:  #F5F5F5
Cursor Border:      2px solid #2563EB (left border)
```

### Completion Modal
```css
Background:         rgba(255, 255, 255, 0.95)
Border Radius:      8px
Padding:            2rem (32px)

Trophy Icon Size:   4rem (64px)
Trophy Color:       #2563EB

Title Font Size:    1.875rem (30px)
Title Font Weight:  600 (semibold)
Title Color:        #1A1A1A

Stat Font Size:     3rem (48px)
Stat Font Weight:   600 (semibold)
Stat Color:         #1A1A1A

Button Background:  #2563EB
Button Hover:       #1d4ed8
Button Text:        #FFFFFF
Button Padding:     0.75rem 2rem (12px 32px)
Button Radius:      6px
```

### Virtual Keyboard

#### Container
```css
Background:         Transparent
Max Width:          1536px (6xl)
Gap Between Rows:   0.5rem (8px)
Gap Between Keys:   0.375rem (6px)
```

#### Individual Keys
```css
Normal State:
  Background:       #FFFFFF
  Border:           1px solid #E5E5E5
  Shadow:           0 1px 2px 0 rgba(0, 0, 0, 0.05)
  Border Radius:    6px
  Padding:          0.625rem 0.75rem (10px 12px)
  Min Width:        44px (mobile), 52px (desktop)

Active/Pressed:
  Background:       #E5E5E5
  Border:           1px solid #E5E5E5

Expected Next Key:
  Background:       rgba(37, 99, 235, 0.1)
  Border:           2px solid #2563EB
  Shadow:           0 4px 6px -1px rgba(0, 0, 0, 0.1)

Weak Key:
  Background:       #FEF2F2
  Border:           1px solid #FECACA

Text Layout:
  Shift Character:  Top, 10px-12px, #737373, medium
  Normal Character: Middle, 16px-18px, #1A1A1A, semibold
  Physical Key:     Bottom, 9px, #A3A3A3, monospace
```

#### Space Bar
```css
Background:         #FFFFFF
Border:             1px solid #E5E5E5
Shadow:             0 1px 2px 0 rgba(0, 0, 0, 0.05)
Padding:            0.875rem 10rem (14px 160px)
Border Radius:      6px
Text Color:         #737373
Font Size:          0.875rem (14px)
Font Weight:        500 (medium)
```

### History Cards
```css
Container:
  Background:       #FFFFFF
  Border:           1px solid #E5E5E5
  Border Radius:    8px
  Padding:          1.5rem (24px)
  Shadow:           0 1px 2px 0 rgba(0, 0, 0, 0.05)

Individual Cards:
  Background:       #FAFAFA
  Border:           1px solid #E5E5E5
  Border Radius:    6px
  Padding:          1rem (16px)
  
Date Text:          #737373, 0.75rem (12px), 500 weight
Language Flag:      #737373, 0.75rem (12px)
Stat Numbers:       #1A1A1A, 1.5rem (24px), 600 weight
Stat Labels:        #737373, 0.75rem (12px)
```

## 🎭 States & Interactions

### Button Hover States
```css
Language Toggle:
  Default:          #FFFFFF background
  Hover:            #F5F5F5 background
  Transition:       200ms colors

Next Test Button:
  Default:          #2563EB background
  Hover:            #1d4ed8 background
  Transition:       200ms colors
```

### Keyboard Key States
```css
Default → Hover:    No change (keys don't hover)
Default → Active:   #E5E5E5 background (instant)
Default → Expected: #2563EB/10 background + 2px border
Default → Weak:     #FEF2F2 background + #FECACA border

Transition Duration: 100ms
```

### Text Feedback
```css
Typing Correct:     Instant color change to #1A1A1A
Typing Error:       Instant background to #EF4444
Cursor Movement:    No animation (instant)
```

## 📏 Responsive Breakpoints

### Mobile (< 768px)
```css
Container Padding:  1rem (16px)
Card Padding:       1rem (16px)
Typing Text:        1.5rem (24px)
Stat Numbers:       2rem (32px)
Key Min Width:      44px
Key Padding:        0.5rem 0.625rem (8px 10px)
```

### Desktop (≥ 768px)
```css
Container Padding:  2rem (32px)
Card Padding:       1.5rem (24px)
Typing Text:        1.875rem (30px)
Stat Numbers:       2.25rem (36px)
Key Min Width:      52px
Key Padding:        0.875rem 0.75rem (14px 12px)
```

## 🎨 Design Principles

### 1. Minimalism
- Clean, uncluttered interface
- Generous whitespace between elements
- Subtle shadows instead of heavy effects
- No gradients or glassmorphism

### 2. Hierarchy
- Large, bold numbers for stats
- Clear differentiation between primary and secondary text
- Visual weight through size and color, not decoration

### 3. Consistency
- 6px-8px border radius throughout
- #E5E5E5 for all borders
- Consistent padding ratios
- Uniform shadow specifications

### 4. Accessibility
- High contrast ratios (WCAG AAA)
- Clear focus states
- Readable font sizes
- Tactile keyboard feedback

### 5. Performance
- Minimal animations (100-200ms max)
- Instant feedback for critical interactions
- No heavy transitions or effects

## 🔍 Visual Examples

### Color Usage Example
```
Header Area:
├── Background: #FAFAFA
├── Icon Container: #FFFFFF with #E5E5E5 border
├── Title: #1A1A1A, 600 weight
└── Subtitle: #737373, 500 weight

Stat Card:
├── Background: #FFFFFF
├── Border: #E5E5E5
├── Label Icon: #737373
├── Label Text: #737373, 500 weight
└── Number: #1A1A1A, 600 weight, 2.25rem

Typing Area:
├── Background: #FFFFFF
├── Border: #E5E5E5
├── Untyped: #A3A3A3
├── Correct: #1A1A1A
├── Error: #FFFFFF on #EF4444
└── Cursor: #F5F5F5 with #2563EB left border
```

## 🎯 Key Takeaways

1. **Neutral Foundation**: #FAFAFA background provides warmth without distraction
2. **Pure Whites**: #FFFFFF surfaces for clear content separation
3. **Minimal Borders**: 1px #E5E5E5 creates subtle divisions
4. **Subtle Shadows**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` for depth
5. **Accent Sparingly**: #2563EB only for active/important elements
6. **Typography Hierarchy**: Size + weight + color = clear structure
7. **Consistent Radius**: 6px-8px for modern, clean appearance
8. **Generous Spacing**: 2rem+ between major sections
9. **Instant Feedback**: No delays on critical interactions
10. **Monochrome First**: Let content, not colors, drive the experience

---

*Design System Version: 2.0 - Minimalist*
*Last Updated: December 2024*
*Status: Production Ready ✅*
