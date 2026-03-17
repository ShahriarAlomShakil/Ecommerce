"use client"

import { motion } from "framer-motion"
import { Grid2X2, Heart, Home, Search, User } from "lucide-react"
import { usePathname } from "next/navigation"

import { useWishlist } from "@hooks/useWishlist"
import { cn } from "@lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BottomNavbarProps = {
	onSearchOpen: () => void
}

type NavItem = {
	label: string
	href?: string
	icon: typeof Home
	onClick?: () => void
	active: boolean
	badgeCount?: number
}

function CountBadge({ count }: { count: number }) {
	if (count <= 0) {
		return null
	}

	return (
		<span className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
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

export default function BottomNavbar({ onSearchOpen }: BottomNavbarProps) {
	const pathname = usePathname()
	const { count: wishlistCount } = useWishlist()
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
			href: "/shop",
			icon: Grid2X2,
			active:
				normalizedPath.startsWith("/shop") ||
				normalizedPath.startsWith("/store") ||
				normalizedPath.startsWith("/categories"),
		},
		{
			label: "Search",
			icon: Search,
			onClick: onSearchOpen,
			active: false,
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

	return (
		<nav
			aria-label="Bottom navigation"
			className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[color:var(--color-bg-card)]/95 backdrop-blur-xl lg:hidden"
			style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
		>
			<div className="grid h-16 grid-cols-5 px-1.5">
				{items.map(({ label, href, icon: Icon, onClick, active, badgeCount }) => {
					const sharedClassName = cn(
						"relative inline-flex h-full flex-col items-center justify-center gap-1 rounded-2xl font-ui text-[10px] font-medium leading-none transition-colors duration-200",
						active
							? "text-[var(--color-primary)]"
							: "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
					)

					const content = (
						<>
							<div className="relative flex h-7 items-center justify-center">
								{active && (
									<motion.span
										layoutId="bottom-nav-pill"
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

					if (href) {
						return (
							<LocalizedClientLink key={label} href={href} className={sharedClassName}>
								{content}
							</LocalizedClientLink>
						)
					}

					return (
						<button
							key={label}
							type="button"
							onClick={onClick}
							className={sharedClassName}
							aria-label={label}
						>
							{content}
						</button>
					)
				})}
			</div>
		</nav>
	)
}
