# BottomNavbarWithCart Component

A mobile-optimized bottom navigation bar with a **floating action button (FAB)** for the shopping cart.

## Features

### Layout
- **4 Flat Tabs** evenly distributed around the center FAB
  - Home | Shop | [CART FAB] | Wishlist | Account
- **Responsive Grid**: Left tabs (25%), Center FAB space (25%), Right tabs (25%), with padding

### Floating Cart Button (FAB)
- **Dimensions**: 56px circular button
- **Elevation**: Rises 16px above the navbar (`-mb-6`)
- **Background**: `var(--color-primary)` (primary color)
- **Icon**: ShoppingBag from lucide-react (white, 24px)
- **Shadow**: 
  - Default: `0 4px 16px rgba(242, 167, 179, 0.5)`
  - Hover: `0 6px 20px rgba(242, 167, 179, 0.6)`
- **Animation**: 
  - Tap: Scale down to 0.92 using Framer Motion `whileTap`
  - Smooth spring transitions
- **Cart Badge**: Top-right positioned item count badge

### Notch Background
- **SVG Curved Cutout**: Creates a smooth semicircular notch in the navbar background
- **Color**: `var(--color-bg-card)` (matches card background)
- **Integration**: The FAB sits perfectly in the curved cutout, creating a premium visual effect

### Active State Indicators
- **Pill Indicator**: Animated underline for active tabs
- **Color**: Primary color on active state
- **Animation**: Spring-based smooth transitions using `layoutId`

### Badge System
- **Display**: Positioned at top-right of icons
- **Format**: Shows count up to 99, then "99+"
- **Active on**: Cart and Wishlist tabs

## Usage

### Basic Integration

In your layout file (e.g., `RootLayoutShell.tsx`):

```tsx
import BottomNavbarWithCart from "@components/layout/BottomNavbarWithCart"
import MiniCartDrawer from "@components/layout/MiniCartDrawer"

export default function RootLayoutShell() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      {/* Your page content */}
      
      {/* Bottom navbar with floating cart */}
      <BottomNavbarWithCart onCartOpen={() => setIsCartOpen(true)} />
      
      {/* Mini cart drawer - slides up when FAB is clicked */}
      <MiniCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
```

### Props

```typescript
type BottomNavbarWithCartProps = {
  onCartOpen?: () => void  // Callback when FAB is clicked
}
```

## Technical Details

### SVG Notch Implementation

The SVG notch creates a smooth curved cutout using quadratic Bezier curves:

```tsx
<path
  d="M 164,2 Q 175,0 190,3 Q 205,0 226,2 Q 225,16 226,30"
  fill="none"
  stroke="var(--color-bg-card)"
  strokeWidth="32"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
```

The notch:
- Starts at 164px (left edge)
- Curves smoothly to center (190px)
- Ends at 226px (right edge)
- Maintains same color as navbar background

### Tab Component Structure

Each tab uses a dedicated `NavTab` component for consistency:

```tsx
<NavTab
  label="Home"
  href="/"
  icon={Home}
  active={normalizedPath === "/"}
  badgeCount={badgeCount}
  layoutId="bottom-nav-left"
/>
```

### Animation Details

- **TAP Animation**: `whileTap={{ scale: 0.92 }}` from Framer Motion
- **Active Indicator**: Spring animation with `stiffness: 420` and `damping: 34`
- **Layout Animation**: `layoutId` enables smooth content transitions

## Styling

### CSS Variables Used
- `--color-primary`: FAB background & active tab indicator
- `--color-bg-card`: Navbar background & notch color
- `--color-text`: Tab text color
- `--color-text-muted`: Inactive tab text color
- `--color-border`: Top border of navbar

### Responsive Behavior
- Mobile-only: `lg:hidden` class
- Safe area support: `paddingBottom: "env(safe-area-inset-bottom)"`
- Works with notch displays and home indicators

## Accessibility

- ✅ Semantic HTML: `<nav>` with `aria-label`
- ✅ Button roles: `<button type="button">` with proper `aria-label`
- ✅ Keyboard support: Tab navigation through links and buttons
- ✅ Focus indicators: `focus-visible:ring-2` on FAB

## Hook Requirements

The component uses these custom hooks:
- `useCart()` - Returns cart state with `count` property
- `useWishlist()` - Returns wishlist state with `count` property

Ensure these hooks are available in `@hooks/useCart` and `@hooks/useWishlist`.

## Customization

### Change FAB Shadow
Modify the shadow values in the button element:

```tsx
// Default shadow
shadow-[0_4px_16px_rgba(242,167,179,0.5)]

// Hover shadow
hover:shadow-[0_6px_20px_rgba(242,167,179,0.6)]
```

### Adjust FAB Size
Change the height and width classes:

```tsx
// Current: h-14 w-14 (56px)
// For larger: h-16 w-16 (64px)
// For smaller: h-12 w-12 (48px)
```

### Modify Notch Depth
Adjust the SVG path curvature values in the `viewBox` and `d` attributes to make the notch shallower or deeper.

## Browser Support

- ✅ iOS Safari (iOS 13+)
- ✅ Android Chrome
- ✅ All modern browsers
- ✅ Safe area inset support for notched devices

## Performance Notes

- Lightweight component with minimal re-renders
- SVG notch uses `pointerEvents: "none"` for performance
- Framer Motion animations are GPU-accelerated
- Safe area inset is CSS-based (no JS calculation)

## Related Components

- [BottomNavbar](./BottomNavbar.tsx) - Standard bottom navigation (5 flat tabs)
- [MiniCartDrawer](./MiniCartDrawer.tsx) - Cart slide-up drawer
- [Navbar](./Navbar.tsx) - Desktop header navigation

