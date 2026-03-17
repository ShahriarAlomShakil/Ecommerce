# BottomNavbarWithCart - Visual Design Specification

## Component Dimensions

### Overall Container
- **Height**: 80px (H-20 class = 5rem)
- **Safe Area Padding**: `env(safe-area-inset-bottom)` (0-54px depending on device)
- **Position**: Fixed to bottom of viewport
- **Z-Index**: 50 (above most content)

### Floating Cart Button (FAB)
```
┌─────────────────────┐
│    56px diameter    │
│   circular button   │ ← 16px elevation (-mb-6)
├─────────────────────┤
│  Navbar Background  │
└─────────────────────┘
```

- **Diameter**: 56px (h-14, w-14)
- **Elevation**: 16px above navbar
- **Border Radius**: 100% (perfect circle)
- **Icon Size**: 24px (h-6, w-6)

### Icon Details
```
   ┌──────┐
   │ [24] │  Size: 24px
   │  px  │  Stroke Width: 1.9
   └──────┘
```

### Badge Position
```
    📍 Count badge
    ↗️ Top-right
     ┌──────┐
    │ Icon │
  └──────┘
```

- **Diameter**: 20px (h-5, min-w-5)
- **Position**: `-right-1.5 -top-1.5` (offset from icon edge)
- **Font Size**: 10px
- **Max Height**: Badge shows 0-99+

### Tab Layout Grid
```
┌────────┬────────┬────────┬────────┐
│Home    │        │        │Wishlist│
│Shop    │  FAB   │        │Account │
├────────┼────────┼────────┼────────┤
│  25%   │  25%   │  25%   │  25%   │
└────────┴────────┴────────┴────────┘
```

- **Left Section**: Home, Shop (25% width each)
- **Center Section**: FAB (25% width)
- **Right Section**: Wishlist, Account (25% width each)
- **Tab Height**: Full 80px per tab
- **Vertical Spacing**: `gap-0.5` between icon and label

### Tab Components
```
┌─────────────┐
│    [📦]     │ ← Icon: 24px (h-6, w-6)
│     Name    │ ← Label: 10px text
└─────────────┘
```

- **Icon Height**: 24px
- **Icon Container Height**: 24px (h-6)
- **Label Font Size**: 10px
- **Label Padding**: `py-2` (total 16px vertical)
- **Horizontal Padding**: `px-1` per tab (4px)

### SVG Notch Dimensions
```
                CENTER (190px)
                    │
    ┌───────────────┼───────────────┐
    │               │               │
164px            190px            226px
    ↓               ↓               ↓
    ┌───────────────┴───────────────┐
    │     CURVED NOTCH SECTION      │
    └───────────────────────────────┘
    
Notch depth: 8px (extends above navbar)
Notch width: 62px (164px to 226px)
Total SVG height: 32px with 24px of negative offset (-top-6)
```

### Notch SVG Paths
1. **Left Curve**
   - Start: (0, 0)
   - Control: (0, 16)
   - End: (162, 8)

2. **Center Notch**
   - Start: (164, 2)
   - Peak Center: (190, 3)
   - End: (226, 2)
   - Control Points: Quadratic curves for smooth edges

3. **Right Curve**
   - Start: (228, 8)
   - Control: (230, 20)
   - End: (390, 0)

### Shadow Specifications
```
Default Shadow:
  0px horizontal
  4px vertical
  16px blur
  rgba(242, 167, 179, 0.5) color

Hover Shadow:
  0px horizontal
  6px vertical (↑ 2px)
  20px blur   (↑ 4px)
  rgba(242, 167, 179, 0.6) opacity (↑ 10%)
```

## Color Specifications

### Active States
```
Tab Label Color (Active):
  Color: var(--color-primary)
  
Underline Pill (Active):
  Background: var(--color-primary)
  Height: 1.5px (h-1.5)
  Width: 32px (w-8)
  Border Radius: 100% (rounded-full)
  Margin Top: -10px (-top-2.5)

FAB:
  Background: var(--color-primary)
  Shadow: rgba from primary color
```

### Inactive States
```
Tab Label Color:
  Color: var(--color-text-muted)
  
Hover State:
  Color: var(--color-text)
```

### Background Colors
```
Navbar Background:
  Background: var(--color-bg-card)
  Opacity: 95% (bg-opacity-95)
  Backdrop: 12px blur (backdrop-blur-xl)
  Border: var(--color-border)

SVG Notch:
  Stroke: var(--color-bg-card)
  Stroke Width: 32px
```

## Font Specifications

### Tab Labels
- **Font Family**: `font-ui` (custom font stack, likely sans-serif)
- **Font Size**: 10px (text-[10px])
- **Font Weight**: 500 (font-medium)
- **Line Height**: No line (leading-none)

### Badge Count
- **Font Family**: Inherited
- **Font Size**: 10px (text-[10px])
- **Font Weight**: 600 (font-semibold)
- **Line Height**: No line (leading-none)

## Spacing Specifications

### Component Gaps
```
Tab Container:
  Vertical gap: 2px (gap-0.5)
  Horizontal gap between tabs: 0 (absolute positioning)

Tab Icon to Label:
  Vertical gap: 2px (gap-0.5)

FAB relative to navbar:
  Vertical offset: -24px (-mb-6 = -1.5rem)

Navbar padding:
  Horizontal: 8px each side (px-2)
  Vertical: None (items-end)
```

### Touch Target Sizes
```
FAB:
  Size: 56px × 56px ✓ (Exceeds 48px minimum)
  
Tab Touch Area:
  Width: ~78px (25% of 390px viewport)
  Height: 80px ✓ (Exceeds 48px minimum)
  
Tab per section:
  Home/Shop: 39px width each
  Wishlist/Account: 39px width each
```

## Animation Specifications

### FAB Press Animation
```
Initial Scale: 1
Pressed Scale: 0.92
Duration: Spring (not easing)
Type: "tween" (instant application)
```

### Active Indicator Animation
```
Type: spring
Stiffness: 420
Damping: 34
Duration: Auto-calculated
```

### Shadow Transition
```
Duration: 200ms
Timing: ease-in-out (default)
Property: box-shadow
```

### Icon Touch Animation
```
Animate: scale
From: 1
To: 1 (no change, but prepared for future)
Duration: 150ms
```

## Breakpoint Behavior

### Mobile (< 1024px / < lg)
- BottomNavbarWithCart: **Visible**
- Display: Full width, fixed bottom
- Safe area applied

### Desktop (≥ 1024px / ≥ lg)
- BottomNavbarWithCart: **Hidden** (`lg:hidden`)
- Alternative: Desktop navbar used instead

## Responsive Layout

### Viewport Widths

**280px (iPhone SE)**
```
├──┐  ├──┐  ├──┐  ├──┐
│H │  │S │  │F │  │W │
│  │  │  │  │AB│  │L │
├──┘  ├──┘  ├──┘  ├──┘
Home      Shop      FAB       Wishlist
(25%)    (25%)     (25%)      (25%)
```

**390px (iPhone 12)**
Standard layout, SVG viewBox matches

**430px (iPhone 14 Pro Max)**
SVG scales proportionally to 430px
Tabs remain 25% each of available width

**768px (iPad mini)**
Component: Hidden (lg:hidden)
Desktop nav used instead

## Safe Area Integration

### iOS Devices
```
┌─────────────────────┐
│  Device Display     │
│   (notch if any)    │
├─────────────────────┤
│                     │
│   Safe Content      │
│     Area (80px)     │
├─────────────────────┤
│ Safe Area Inset: 0  │ (Regular)
│ Safe Area Inset:34  │ (iPhone 14+)
│ Safe Area Inset:54  │ (iPhone XS Max)
└─────────────────────┘
```

### Android Devices
```
┌─────────────────────┐
│  Device Display     │
├─────────────────────┤
│                     │
│   Safe Content      │
│     Area (80px)     │
├─────────────────────┤
│ Safe Area Inset: 0  │
│ Gesture Nav:24-33px │
└─────────────────────┘
```

## Accessibility Spacing

### Minimum Touch Targets
- FAB: 56px × 56px ✓
- Individual Tab: ~39px × 80px ✓
- Hover State: Full tab width ✓

### Focus Indicators
```
FAB Focus Ring:
  Ring Width: 2px (ring-2)
  Ring Color: var(--color-primary) / 50% opacity
  Outline: None (focus:outline-none)
```

## Implementation Notes

1. **SVG Notch**: Uses fixed 390px viewBox; scales with `preserveAspectRatio="none"`
2. **Pointer Events**: SVG has `pointerEvents: "none"` to avoid interfering with taps
3. **Z-stacking**: FAB has no explicit z-index (inherits parent z-50)
4. **Clip Behavior**: No overflow: hidden on navbar (allows FAB elevation)
5. **Backdrop Filter**: Applied to navbar, notch appears through it

## Dark Mode Support

All colors use CSS custom properties allowing automatic dark mode support:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: /* lighter shade */
    --color-bg-card: /* darker shade */
    --color-text-muted: /* lighter gray */
  }
}
```

