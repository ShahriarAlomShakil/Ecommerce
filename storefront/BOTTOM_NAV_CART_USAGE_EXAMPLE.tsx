/**
 * Example: How to integrate BottomNavbarWithCart into your layout
 * 
 * This example shows how to replace the standard BottomNavbar with
 * the new BottomNavbarWithCart variant that features a floating
 * shopping cart button.
 */

import { useState } from "react"
import BottomNavbarWithCart from "@components/layout/BottomNavbarWithCart"
import MiniCartDrawer from "@components/layout/MiniCartDrawer"

/**
 * Option 1: Conditional Variant Selection
 * Use a component prop or environment variable to switch between variants
 */
export function RootLayoutShellWithVariant() {
	const [isCartOpen, setIsCartOpen] = useState(false)
	const useCartFab = process.env.NEXT_PUBLIC_NAV_VARIANT === "cart-fab"

	return (
		<>
			{/* Page content goes here */}

			{/* Desktop Navigation */}
			{/* <Navbar onCartOpen={() => setIsCartOpen(true)} /> */}

			{/* Mobile Navigation - Choose variant */}
			{useCartFab ? (
				// Option A: Floating Cart Button variant
				<>
					<BottomNavbarWithCart onCartOpen={() => setIsCartOpen(true)} />
					<MiniCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
				</>
			) : (
				// Option B: Standard flat navigation
				// <BottomNavbar onSearchOpen={handleSearchOpen} />
				null
			)}
		</>
	)
}

/**
 * Option 2: Direct Integration
 * Simply use BottomNavbarWithCart directly in your layout
 */
export function RootLayoutShellDirect() {
	const [isCartOpen, setIsCartOpen] = useState(false)

	return (
		<>
			{/* Page content */}
			<div className="flex-1 overflow-auto">
				{/* Your routes and content render here */}
			</div>

			{/* Floating Cart Navigation */}
			<BottomNavbarWithCart onCartOpen={() => setIsCartOpen(true)} />

			{/* Cart Drawer Modal */}
			<MiniCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
		</>
	)
}

/**
 * Option 3: Layout Wrapper Component
 * Create a reusable layout component that handles mobile nav state
 */
export function BottomNavBarLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isCartOpen, setIsCartOpen] = useState(false)

	return (
		<div className="flex min-h-screen flex-col">
			{/* Main content area - has padding-bottom to avoid FAB overlap */}
			<div className="flex-1 pb-20 sm:pb-0">
				{children}
			</div>

			{/* Mobile Navigation with FAB Cart */}
			<BottomNavbarWithCart onCartOpen={() => setIsCartOpen(true)} />

			{/* Mini Cart Drawer */}
			<MiniCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
		</div>
	)
}

/**
 * Option 4: Feature Flag Integration
 * Use a context or configuration hook to dynamically select layout
 */
import { useFeatureFlags } from "@lib/hooks/useFeatureFlags" // example hook

export function DynamicBottomNav() {
	const { isCartFabEnabled } = useFeatureFlags()
	const [isCartOpen, setIsCartOpen] = useState(false)

	if (isCartFabEnabled) {
		return (
			<>
				<BottomNavbarWithCart onCartOpen={() => setIsCartOpen(true)} />
				<MiniCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
			</>
		)
	}

	return (
		<>
			{/* Fallback to standard navigation */}
			{/* <BottomNavbar onSearchOpen={handleSearch} /> */}
		</>
	)
}

/**
 * Integration Checklist
 *
 * ✅ Import BottomNavbarWithCart component
 * ✅ Import MiniCartDrawer component
 * ✅ Create state for cart drawer (isCartOpen, setIsCartOpen)
 * ✅ Pass onCartOpen callback to BottomNavbarWithCart
 * ✅ Add MiniCartDrawer with isOpen and onClose props
 * ✅ Ensure useCart() hook is configured
 * ✅ Ensure useWishlist() hook is configured
 * ✅ Add pb-20 padding to main content area (mobile)
 * ✅ Test on real device with notch display
 * ✅ Verify safe area insets (iOS)
 */

/**
 * Mobile Content Spacing
 *
 * Since the BottomNavbarWithCart is position: fixed, add padding
 * to your main content to prevent overlap:
 */
export const LayoutExample = () => {
	const [isCartOpen, setIsCartOpen] = useState(false)

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header (desktop only) */}
			{/* <Navbar onCartOpen={() => setIsCartOpen(true)} /> */}

			{/* Main content - add padding-bottom to prevent FAB overlap on mobile */}
			<main className="flex-1 pb-20 sm:pb-0">
				{/* Your page content here */}
			</main>

			{/* Mobile bottom navigation with floating cart */}
			<BottomNavbarWithCart onCartOpen={() => setIsCartOpen(true)} />

			{/* Cart overlay drawer */}
			<MiniCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
		</div>
	)
}

/**
 * Styling Customization Example
 *
 * To customize colors and appearance, override CSS variables:
 */
const CustomStylesExample = `
:root {
  /* Primary color for FAB and active states */
  --color-primary: #f2a7b3;
  
  /* Navbar background color for notch */
  --color-bg-card: #ffffff;
  
  /* Text colors */
  --color-text: #1a1a1a;
  --color-text-muted: #666666;
  
  /* Border color */
  --color-border: #e5e5e5;
}

/* Dark mode example */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #ff6b7a;
    --color-bg-card: #1a1a1a;
    --color-text: #ffffff;
    --color-text-muted: #999999;
    --color-border: #333333;
  }
}
`

/**
 * Accessibility Testing Checklist
 * 
 * ✅ Keyboard navigation (Tab through all tabs and FAB)
 * ✅ Screen reader support (aria-label on FAB and buttons)
 * ✅ Focus indicators visible on FAB (ring-2 focus-visible)
 * ✅ Touch target size adequate (56px FAB, 64px+ tab height)
 * ✅ Color contrast meets WCAG AA standards
 * ✅ No keyboard traps
 * ✅ Proper heading hierarchy
 * ✅ Alt text for icons (lucide-react provides semantic labels)
 */
