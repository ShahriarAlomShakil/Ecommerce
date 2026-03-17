"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
	Heart,
	Menu,
	Search,
	ShoppingBag,
	User,
	X,
	Instagram,
	Facebook,
	Youtube,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import ThemeToggle from "@components/layout/ThemeToggle"
import SearchOverlay from "@components/ui/SearchOverlay"
import { useCart } from "@hooks/useCart"
import { useWishlist } from "@hooks/useWishlist"
import { cn } from "@lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type NavItem = {
	label: string
	href: string
}

const NAV_ITEMS: NavItem[] = [
	{ label: "Home", href: "/" },
	{ label: "Shop", href: "/store" },
	{ label: "Brands", href: "/brands" },
	{ label: "Skin Concerns", href: "/skin-concerns" },
	{ label: "Sale", href: "/sale" },
	{ label: "Blog", href: "/blog" },
]

const SOCIAL_LINKS = [
	{ label: "Instagram", href: "https://instagram.com", Icon: Instagram },
	{ label: "Facebook", href: "https://facebook.com", Icon: Facebook },
	{ label: "YouTube", href: "https://youtube.com", Icon: Youtube },
]

function GlowHausLogo() {
	return (
		<svg
			width="170"
			height="34"
			viewBox="0 0 170 34"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label="GlowHaus"
			role="img"
		>
			<g transform="translate(2,4)">
				<circle cx="8" cy="8" r="3.4" fill="var(--color-primary)" />
				<ellipse cx="8" cy="2.3" rx="2.2" ry="3.1" fill="var(--color-primary)" />
				<ellipse cx="8" cy="13.7" rx="2.2" ry="3.1" fill="var(--color-primary)" />
				<ellipse
					cx="2.4"
					cy="8"
					rx="2.2"
					ry="3.1"
					transform="rotate(-90 2.4 8)"
					fill="var(--color-primary)"
				/>
				<ellipse
					cx="13.6"
					cy="8"
					rx="2.2"
					ry="3.1"
					transform="rotate(-90 13.6 8)"
					fill="var(--color-primary)"
				/>
				<circle cx="8" cy="8" r="1" fill="var(--color-primary-deep)" />
			</g>
			<text
				x="26"
				y="22"
				fill="currentColor"
				style={{
					fontFamily: "Cormorant Garamond, serif",
					fontWeight: 600,
					fontSize: 24,
					letterSpacing: "0.02em",
				}}
			>
				GlowHaus
			</text>
		</svg>
	)
}

function CountBadge({ count }: { count: number }) {
	if (count <= 0) {
		return null
	}

	return (
		<span className="absolute -right-1.5 -top-1.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
			{count > 99 ? "99+" : count}
		</span>
	)
}

export default function Navbar() {
	const pathname = usePathname()
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const { count: cartCount } = useCart()
	const { count: wishlistCount } = useWishlist()

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 12)

		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })

		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	useEffect(() => {
		document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
		return () => {
			document.body.style.overflow = ""
		}
	}, [isMobileMenuOpen])

	useEffect(() => {
		setIsMobileMenuOpen(false)
	}, [pathname])

	const activeHref = useMemo(() => {
		if (!pathname) {
			return "/"
		}

		const normalizedPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/"
		const found = NAV_ITEMS.find((item) =>
			item.href === "/"
				? normalizedPath === "/"
				: normalizedPath.startsWith(item.href)
		)

		return found?.href ?? ""
	}, [pathname])

	return (
		<>
			<header
				className={cn(
					"sticky top-0 z-[110] w-full transition-all duration-300",
					isScrolled
						? "border-b border-border bg-[var(--color-nav-bg)] shadow-nav backdrop-blur-lg"
						: "border-b border-transparent bg-transparent"
				)}
			>
				<div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="flex items-center lg:hidden">
						<button
							type="button"
							aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
							onClick={() => setIsMobileMenuOpen((previous) => !previous)}
							className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<motion.span
								initial={false}
								animate={{ rotate: isMobileMenuOpen ? 90 : 0, opacity: isMobileMenuOpen ? 0 : 1 }}
								transition={{ duration: 0.2 }}
								className="absolute"
							>
								<Menu className="h-5 w-5" />
							</motion.span>
							<motion.span
								initial={false}
								animate={{ rotate: isMobileMenuOpen ? 0 : -90, opacity: isMobileMenuOpen ? 1 : 0 }}
								transition={{ duration: 0.2 }}
								className="absolute"
							>
								<X className="h-5 w-5" />
							</motion.span>
						</button>
					</div>

					<div className="hidden flex-1 items-center lg:flex">
						<LocalizedClientLink href="/" aria-label="Go to homepage" className="text-[var(--color-text)]">
							<GlowHausLogo />
						</LocalizedClientLink>
					</div>

					<nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
						{NAV_ITEMS.map((item) => {
							const isActive = activeHref === item.href

							return (
								<LocalizedClientLink
									key={item.label}
									href={item.href}
									className="relative px-3 py-2 font-ui text-sm text-[var(--color-text)]/85 transition hover:text-[var(--color-text)]"
								>
									{item.label}
									{isActive && (
										<motion.span
											layoutId="glowhaus-active-nav"
											className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-primary"
											transition={{ type: "spring", stiffness: 500, damping: 35 }}
										/>
									)}
								</LocalizedClientLink>
							)
						})}
					</nav>

					<div className="hidden flex-1 items-center justify-end gap-1.5 lg:flex">
						<button
							type="button"
							onClick={() => setIsSearchOpen(true)}
							aria-label="Open search"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<Search className="h-5 w-5" />
						</button>

						<LocalizedClientLink
							href="/wishlist"
							aria-label="Wishlist"
							className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<Heart className="h-5 w-5" />
							<CountBadge count={wishlistCount} />
						</LocalizedClientLink>

						<LocalizedClientLink
							href="/cart"
							aria-label="Cart"
							className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<ShoppingBag className="h-5 w-5" />
							<CountBadge count={cartCount} />
						</LocalizedClientLink>

						<LocalizedClientLink
							href="/account"
							aria-label="Account"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<User className="h-5 w-5" />
						</LocalizedClientLink>

						<ThemeToggle />
					</div>

					<div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
						<LocalizedClientLink href="/" aria-label="Go to homepage" className="text-[var(--color-text)]">
							<GlowHausLogo />
						</LocalizedClientLink>
					</div>

					<div className="flex items-center gap-1 lg:hidden">
						<button
							type="button"
							onClick={() => setIsSearchOpen(true)}
							aria-label="Open search"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<Search className="h-5 w-5" />
						</button>

						<LocalizedClientLink
							href="/cart"
							aria-label="Cart"
							className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<ShoppingBag className="h-5 w-5" />
							<CountBadge count={cartCount} />
						</LocalizedClientLink>
					</div>
				</div>

				<AnimatePresence>
					{isMobileMenuOpen && (
						<>
							<motion.button
								type="button"
								aria-label="Close menu"
								className="fixed inset-0 z-[109] bg-black/35 lg:hidden"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setIsMobileMenuOpen(false)}
							/>

							<motion.aside
								className="fixed inset-y-0 left-0 z-[111] flex w-full max-w-sm flex-col bg-[var(--color-nav-bg)] px-6 pb-8 pt-24 shadow-xl lg:hidden"
								initial={{ x: "-100%" }}
								animate={{ x: 0 }}
								exit={{ x: "-100%" }}
								transition={{ type: "spring", stiffness: 320, damping: 32 }}
							>
								<nav className="space-y-1">
									{NAV_ITEMS.map((item) => {
										const isActive = activeHref === item.href

										return (
											<LocalizedClientLink
												key={item.label}
												href={item.href}
												className={cn(
													"block rounded-lg px-3 py-3 font-ui text-base transition",
													isActive
														? "bg-primary/15 text-[var(--color-text)]"
														: "text-[var(--color-text)]/90 hover:bg-black/5"
												)}
											>
												{item.label}
											</LocalizedClientLink>
										)
									})}
								</nav>

								<div className="mt-8 border-t border-border pt-6">
									<p className="font-ui text-xs uppercase tracking-[0.14em] text-muted">
										Follow us
									</p>
									<div className="mt-3 flex items-center gap-2">
										{SOCIAL_LINKS.map(({ label, href, Icon }) => (
											<a
												key={label}
												href={href}
												target="_blank"
												rel="noreferrer"
												aria-label={label}
												className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-[var(--color-text)] transition hover:border-primary hover:text-primary"
											>
												<Icon className="h-4 w-4" />
											</a>
										))}
									</div>
								</div>
							</motion.aside>
						</>
					)}
				</AnimatePresence>
			</header>

			<SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
		</>
	)
}
