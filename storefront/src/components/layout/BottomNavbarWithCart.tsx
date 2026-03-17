"use client"

import { motion } from "framer-motion"
import { Grid2X2, Heart, Home, ShoppingBag, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { useCart } from "@hooks/useCart"
import { useWishlist } from "@hooks/useWishlist"
import { cn } from "@lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BottomNavbarWithCartProps = {
	onCartOpen?: () => void
}

type NavItem = {
	label: string
	href?: string
	icon: typeof Home
	active: boolean
	badgeCount?: number
}

function CountBadge({ count }: { count: number }) {
	if (count <= 0) {
		return null
	}

	return (
		<span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
			{count > 99 ? "99+" : count}
		</span>
	)
}

function normalizePath(pathname?: string | null) {
	if (!pathname) {
		return "/"
	}

	return pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/"
}

export default function BottomNavbarWithCart({ onCartOpen }: BottomNavbarWithCartProps) {
	const pathname = usePathname()
	const { count: cartCount } = useCart()
	const { count: wishlistCount } = useWishlist()
	const [isCartTouching, setIsCartTouching] = useState(false)
	const normalizedPath = normalizePath(pathname)

	const items: NavItem[] = [
		{
			label: "Home",
			href: "/",
			icon: Home,
			active: normalizedPath === "/",
		},
		{
			label: "Shop",
			href: "/store",
			icon: Grid2X2,
			active:
				normalizedPath.startsWith("/shop") ||
				normalizedPath.startsWith("/store") ||
				normalizedPath.startsWith("/categories"),
		},
		{
			label: "Wishlist",
			href: "/wishlist",
			icon: Heart,
			active: normalizedPath.startsWith("/wishlist"),
			badgeCount: wishlistCount,
		},
		{
			label: "Account",
			href: "/account",
			icon: User,
			active: normalizedPath.startsWith("/account"),
		},
	]

	const handleCartClick = () => {
		if (onCartOpen) {
			onCartOpen()
		}
	}

	return (
		<nav
			aria-label="Bottom navigation with floating cart"
			className="fixed inset-x-0 bottom-0 z-50 overflow-visible lg:hidden"
			style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
		>
			{/* Background with notch */}
			<div className="relative">
				{/* SVG Notch Background - creates the curved cutout for FAB */}
				<svg
					className="absolute inset-x-0 -top-6 h-8 w-full"
					viewBox="0 0 390 32"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{
						pointerEvents: "none",
					}}
				>
					{/* Left curved section */}
					<path
						d="M 0,0 Q 0,16 0,32 L 160,32 Q 160,20 162,8"
						fill="none"
						stroke="var(--color-bg-card)"
						strokeWidth="32"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Center notch curve */}
					<path
						d="M 164,2 Q 175,0 190,3 Q 205,0 226,2 Q 225,16 226,30"
						fill="none"
						stroke="var(--color-bg-card)"
						strokeWidth="32"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Right curved section */}
					<path
						d="M 228,8 Q 230,20 230,32 L 390,32 Q 390,16 390,0"
						fill="none"
						stroke="var(--color-bg-card)"
						strokeWidth="32"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>

				{/* Main navbar bar with background */}
				<div className="border-t border-[var(--color-border)] bg-[color:var(--color-bg-card)]/95 backdrop-blur-xl">
					{/* Tab grid + FAB container */}
					<div className="relative flex h-20 items-end justify-between px-2">
						{/* Left tabs (Home, Shop) - 2 items, 25% width each */}
						<div className="flex w-1/4 flex-col gap-0.5">
							{items.slice(0, 2).map(({ label, href, icon: Icon, active, badgeCount }) => (
								<NavTab
									key={label}
									label={label}
									href={href}
									icon={Icon}
									active={active}
									badgeCount={badgeCount}
									layoutId="bottom-nav-left"
								/>
							))}
						</div>

						{/* Center space for FAB (aligned to bottom) */}
						<div className="flex w-1/4 items-end justify-center">
							<motion.button
								type="button"
								onClick={handleCartClick}
								onMouseDown={() => setIsCartTouching(true)}
								onMouseUp={() => setIsCartTouching(false)}
								onMouseLeave={() => setIsCartTouching(false)}
								onTouchStart={() => setIsCartTouching(true)}
								onTouchEnd={() => setIsCartTouching(false)}
								whileTap={{ scale: 0.92 }}
								className="relative -mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_4px_16px_rgba(242,167,179,0.5)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(242,167,179,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
								aria-label="Shopping cart"
								title="Open cart"
							>
								<motion.div
									animate={{ scale: isCartTouching ? 1 : 1 }}
									transition={{ duration: 0.15 }}
									className="relative flex items-center justify-center"
								>
									<ShoppingBag className="h-6 w-6" strokeWidth={1.9} />
									<CountBadge count={cartCount} />
								</motion.div>
							</motion.button>
						</div>

						{/* Right tabs (Wishlist, Account) - 2 items, 25% width each */}
						<div className="flex w-1/4 flex-col gap-0.5">
							{items.slice(2, 4).map(({ label, href, icon: Icon, active, badgeCount }) => (
								<NavTab
									key={label}
									label={label}
									href={href}
									icon={Icon}
									active={active}
									badgeCount={badgeCount}
									layoutId="bottom-nav-right"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}

/**
 * Individual navigation tab component
 */
function NavTab({
	label,
	href,
	icon: Icon,
	active,
	badgeCount,
	layoutId,
}: {
	label: string
	href?: string
	icon: typeof Home
	active: boolean
	badgeCount?: number
	layoutId: string
}) {
	const sharedClassName = cn(
		"relative inline-flex w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 font-ui text-[10px] font-medium leading-none transition-colors duration-200",
		active
			? "text-[var(--color-primary)]"
			: "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
	)

	const content = (
		<>
			<div className="relative flex h-6 items-center justify-center">
				{active && (
					<motion.span
						layoutId={layoutId}
						className="absolute -top-2.5 h-1.5 w-8 rounded-full bg-[var(--color-primary)]"
						transition={{ type: "spring", stiffness: 420, damping: 34 }}
					/>
				)}
				<Icon className="h-6 w-6" strokeWidth={1.9} />
				<CountBadge count={badgeCount ?? 0} />
			</div>
			<span>{label}</span>
		</>
	)

	if (!href) {
		return <div className={sharedClassName}>{content}</div>
	}

	return (
		<LocalizedClientLink href={href} className={sharedClassName}>
			{content}
		</LocalizedClientLink>
	)
}
