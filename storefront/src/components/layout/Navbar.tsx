"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
	ChevronDown,
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

type NavbarProps = {
	onSearchOpen?: () => void
	onCartOpen?: () => void
}

type NavItem = {
	label: string
	href: string
	hasDropdown?: boolean
}

type CategoryItem = {
	id: string
	name: string
	handle: string
	parent_category_id?: string | null
	category_children?: CategoryItem[]
}

const NAV_ITEMS: NavItem[] = [
	{ label: "Home", href: "/" },
	{ label: "Shop", href: "/store" },
	{ label: "Brands", href: "/brands" },
	{ label: "Categories", href: "/categories", hasDropdown: true },
	{ label: "Sale", href: "/sale" },
	{ label: "Blog", href: "/blog" },
]

const FALLBACK_CATEGORIES: CategoryItem[] = [
	{ id: "cleanser", name: "Cleanser", handle: "cleanser" },
	{ id: "toner", name: "Toner", handle: "toner" },
	{ id: "serum", name: "Serum", handle: "serum" },
	{ id: "moisturizer", name: "Moisturizer", handle: "moisturizer" },
	{ id: "sunscreen", name: "Sunscreen", handle: "sunscreen" },
	{ id: "sheet-masks", name: "Sheet Masks", handle: "sheet-masks" },
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

function normalizePath(pathname?: string | null) {
	if (!pathname) {
		return "/"
	}

	return pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/"
}

export default function Navbar({ onSearchOpen, onCartOpen }: NavbarProps) {
	const pathname = usePathname()
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
	const [expandedMobileCategories, setExpandedMobileCategories] = useState<Set<string>>(
		new Set()
	)
	const [isDesktopCategoriesOpen, setIsDesktopCategoriesOpen] = useState(false)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [categories, setCategories] = useState<CategoryItem[]>(FALLBACK_CATEGORIES)
	const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
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
		let isMounted = true

		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/categories")
				if (!response.ok) {
					throw new Error("Failed to fetch categories")
				}

				const data = (await response.json()) as CategoryItem[]
				const rootCategories = data.filter((category) => !category.parent_category_id)

				if (isMounted && rootCategories.length > 0) {
					setCategories(rootCategories)
				}
			} catch {
				if (isMounted) {
					setCategories(FALLBACK_CATEGORIES)
				}
			} finally {
				if (isMounted) {
					setIsCategoriesLoading(false)
				}
			}
		}

		fetchCategories()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		setIsMobileMenuOpen(false)
		setIsMobileCategoriesOpen(false)
		setExpandedMobileCategories(new Set())
		setIsDesktopCategoriesOpen(false)
	}, [pathname])

	const toggleMobileCategory = (categoryId: string) => {
		setExpandedMobileCategories((previous) => {
			const next = new Set(previous)

			if (next.has(categoryId)) {
				next.delete(categoryId)
			} else {
				next.add(categoryId)
			}

			return next
		})
	}

	const activeHref = useMemo(() => {
		const normalizedPath = normalizePath(pathname)
		const found = NAV_ITEMS.find((item) =>
			item.href === "/"
				? normalizedPath === "/"
				: normalizedPath.startsWith(item.href)
		)

		return found?.href ?? ""
	}, [pathname])

	const normalizedPath = normalizePath(pathname)
	const isCategoriesActive = normalizedPath.startsWith("/categories")
	const handleSearchOpen = () => {
		if (onSearchOpen) {
			onSearchOpen()
			return
		}

		setIsSearchOpen(true)
	}

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

							if (item.hasDropdown) {
								return (
									<div
										key={item.label}
										className="relative"
										onMouseEnter={() => setIsDesktopCategoriesOpen(true)}
										onMouseLeave={() => setIsDesktopCategoriesOpen(false)}
										onFocus={() => setIsDesktopCategoriesOpen(true)}
										onBlur={(event) => {
											if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
												setIsDesktopCategoriesOpen(false)
											}
										}}
									>
										<LocalizedClientLink
											href={item.href}
											className="relative inline-flex items-center gap-1.5 px-3 py-2 font-ui text-sm text-[var(--color-text)]/85 transition hover:text-[var(--color-text)]"
										>
											{item.label}
											<ChevronDown
												className={cn(
													"h-4 w-4 transition-transform duration-200",
													isDesktopCategoriesOpen && "rotate-180"
												)}
											/>
											{isCategoriesActive && (
												<motion.span
													layoutId="glowhaus-active-nav"
													className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-primary"
													transition={{ type: "spring", stiffness: 500, damping: 35 }}
												/>
											)}
										</LocalizedClientLink>

										<AnimatePresence>
											{isDesktopCategoriesOpen && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 10 }}
													transition={{ duration: 0.18, ease: "easeOut" }}
												className="absolute left-1/2 top-full z-20 mt-3 w-[22rem] -translate-x-1/2 rounded-[24px] border border-border bg-[var(--color-bg-card)] p-4 shadow-[0_24px_64px_rgba(15,23,42,0.12)] backdrop-blur-xl"
												>
													<div className="mb-3 flex items-center justify-between">
														<div>
															<p className="font-ui text-[11px] uppercase tracking-[0.22em] text-muted">
																Shop by category
															</p>
															<h3 className="mt-1 font-ui text-sm font-medium text-[var(--color-text)]">
																Find your routine faster
															</h3>
														</div>
														<LocalizedClientLink
															href="/categories"
															className="font-ui text-xs font-medium text-primary transition hover:opacity-80"
														>
															View all
														</LocalizedClientLink>
													</div>

													<div className="grid gap-2">
														{isCategoriesLoading && categories.length === 0 ? (
															<p className="rounded-2xl border border-border/70 px-4 py-3 text-sm text-muted">
																Loading categories...
															</p>
														) : (
															categories.slice(0, 8).map((category) => (
																<div
																	key={category.id}
																	className="rounded-2xl border border-border/70 bg-[var(--color-bg)]/70 px-4 py-3 transition hover:border-primary/40 hover:bg-primary/5"
																>
																	<LocalizedClientLink
																		href={`/categories/${category.handle}`}
																		className="font-ui text-sm font-medium text-[var(--color-text)]"
																	>
																		{category.name}
																	</LocalizedClientLink>

																	{category.category_children && category.category_children.length > 0 && (
																		<div className="mt-2 flex flex-wrap gap-2">
																			{category.category_children.slice(0, 4).map((subCategory) => (
																				<LocalizedClientLink
																					key={subCategory.id}
																					href={`/categories/${subCategory.handle}`}
																					className="rounded-full border border-border bg-[var(--color-bg-card)] px-2.5 py-1 font-ui text-[11px] text-muted transition hover:border-primary/40 hover:text-[var(--color-text)]"
																				>
																					{subCategory.name}
																				</LocalizedClientLink>
																			))}
																		</div>
																	)}
																</div>
															))
														)}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)
							}

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
							onClick={handleSearchOpen}
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

						{onCartOpen ? (
							<button
								type="button"
								onClick={onCartOpen}
								aria-label="Cart"
								className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							>
								<ShoppingBag className="h-5 w-5" />
								<CountBadge count={cartCount} />
							</button>
						) : (
							<LocalizedClientLink
								href="/cart"
								aria-label="Cart"
								className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							>
								<ShoppingBag className="h-5 w-5" />
								<CountBadge count={cartCount} />
							</LocalizedClientLink>
						)}

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
								<div className="origin-center scale-[0.8] sm:scale-[0.9]">
									<GlowHausLogo />
								</div>
						</LocalizedClientLink>
					</div>

					<div className="flex items-center gap-1 lg:hidden">
						<button
							type="button"
							onClick={handleSearchOpen}
							aria-label="Open search"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<Search className="h-5 w-5" />
						</button>

						{onCartOpen ? (
							<button
								type="button"
								onClick={onCartOpen}
								aria-label="Cart"
								className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							>
								<ShoppingBag className="h-5 w-5" />
								<CountBadge count={cartCount} />
							</button>
						) : (
							<LocalizedClientLink
								href="/cart"
								aria-label="Cart"
								className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							>
								<ShoppingBag className="h-5 w-5" />
								<CountBadge count={cartCount} />
							</LocalizedClientLink>
						)}
					</div>
				</div>

				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.aside
							className="fixed inset-0 z-[111] flex h-dvh flex-col overflow-hidden bg-[var(--color-surface)] lg:hidden"
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", stiffness: 320, damping: 32 }}
						>
							<div className="border-b border-border bg-[var(--color-bg-card)] px-5 pb-5 pt-5">
								<div className="flex items-center justify-between gap-3">
									<LocalizedClientLink
										href="/"
										aria-label="Go to homepage"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-[var(--color-text)]"
									>
										<div className="origin-left scale-[0.72]">
											<GlowHausLogo />
										</div>
									</LocalizedClientLink>

									<div className="flex items-center gap-2">
										<ThemeToggle className="border-border bg-[var(--color-bg-card)] shadow-none backdrop-blur-none" />

										<button
											type="button"
											onClick={() => setIsMobileMenuOpen(false)}
											aria-label="Close navigation menu"
											className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
										>
											<X className="h-5 w-5" />
										</button>
									</div>
								</div>

							</div>

							<div className="flex-1 overflow-y-auto px-5 pb-8 pt-5 no-scrollbar">
								<nav className="space-y-3">
									{NAV_ITEMS.map((item) => {
										if (item.hasDropdown) {
											return (
												<div
													key={item.label}
													className="rounded-[28px] border border-border bg-[var(--color-bg-card)] p-4 shadow-[0_12px_32px_rgba(44,44,44,0.06)]"
												>
													<button
														type="button"
														onClick={() => setIsMobileCategoriesOpen((previous) => !previous)}
														className="flex w-full items-start justify-between gap-4 text-left"
													>
														<div>
															<h3 className="font-ui text-lg font-medium text-[var(--color-text)]">
																Categories
															</h3>
														</div>
														<span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[var(--color-bg)] text-[var(--color-text)]">
															<ChevronDown
																className={cn(
																	"h-4 w-4 transition-transform duration-200",
																	isMobileCategoriesOpen && "rotate-180"
																)}
															/>
														</span>
													</button>

													<AnimatePresence initial={false}>
														{isMobileCategoriesOpen && (
															<motion.div
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: "auto", opacity: 1 }}
																exit={{ height: 0, opacity: 0 }}
																transition={{ duration: 0.2, ease: "easeOut" }}
																className="overflow-hidden"
															>
																<div className="mt-4 space-y-3 border-t border-border pt-4">
																	{isCategoriesLoading && categories.length === 0 ? (
																		<p className="rounded-2xl border border-border bg-[var(--color-bg)] px-4 py-3 text-sm text-muted">
																		Loading categories...
																		</p>
																	) : (
																		categories.map((category) => (
																			<div
																				key={category.id}
																				className="rounded-2xl border border-border bg-[var(--color-bg)] p-4"
																			>
																				<div className="flex items-start justify-between gap-3">
																					<div>
																						<LocalizedClientLink
																							href={`/categories/${category.handle}`}
																							onClick={() => setIsMobileMenuOpen(false)}
																							className="font-ui text-base font-medium text-[var(--color-text)]"
																						>
																							{category.name}
																						</LocalizedClientLink>
																					</div>

																					{category.category_children && category.category_children.length > 0 && (
																						<button
																							type="button"
																							onClick={() => toggleMobileCategory(category.id)}
																							aria-label={`Toggle ${category.name} subcategories`}
																							className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[var(--color-bg-card)] text-[var(--color-text)] transition hover:border-primary"
																						>
																							<ChevronDown
																								className={cn(
																									"h-4 w-4 transition-transform duration-200",
																									expandedMobileCategories.has(category.id) && "rotate-180"
																								)}
																							/>
																						</button>
																					)}
																				</div>

																				{category.category_children &&
																					category.category_children.length > 0 &&
																					expandedMobileCategories.has(category.id) && (
																						<div className="mt-3 flex flex-wrap gap-2">
																							{category.category_children.map((subCategory) => (
																								<LocalizedClientLink
																									key={subCategory.id}
																									href={`/categories/${subCategory.handle}`}
																									onClick={() => setIsMobileMenuOpen(false)}
																									className="rounded-full border border-border bg-[var(--color-bg-card)] px-3 py-1.5 font-ui text-xs text-muted transition hover:border-primary hover:text-[var(--color-text)]"
																								>
																									{subCategory.name}
																								</LocalizedClientLink>
																							))}
																						</div>
																					)}
																			</div>
																		))
																	)}

																	<LocalizedClientLink
																		href="/categories"
																		onClick={() => setIsMobileMenuOpen(false)}
																		className="block rounded-2xl border border-border bg-[var(--color-surface)] px-4 py-3 font-ui text-sm font-medium text-primary"
																	>
																		View all categories
																	</LocalizedClientLink>
																</div>
															</motion.div>
														)}
													</AnimatePresence>
												</div>
											)
										}

										const isActive = activeHref === item.href

										return (
											<LocalizedClientLink
												key={item.label}
												href={item.href}
												onClick={() => setIsMobileMenuOpen(false)}
												className={cn(
													"flex items-center justify-between rounded-[24px] border p-4 transition",
													isActive
														? "border-primary bg-[var(--color-bg-card)] text-[var(--color-text)]"
														: "border-border bg-[var(--color-bg-card)] text-[var(--color-text)] hover:border-primary"
												)}
											>
												<div>
													<p className="font-ui text-lg font-medium">{item.label}</p>
												</div>
												{isActive && (
													<span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
												)}
											</LocalizedClientLink>
										)
									})}
								</nav>

								<div className="mt-6 rounded-[28px] border border-border bg-[var(--color-bg-card)] p-4 shadow-[0_12px_32px_rgba(44,44,44,0.06)]">
									<div className="flex items-center gap-3">
										{SOCIAL_LINKS.map(({ label, href, Icon }) => (
											<a
												key={label}
												href={href}
												target="_blank"
												rel="noreferrer"
												aria-label={label}
												className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-[var(--color-bg)] text-[var(--color-text)] transition hover:border-primary hover:text-primary"
											>
												<Icon className="h-4 w-4" />
											</a>
										))}
									</div>
								</div>
							</div>
						</motion.aside>
					)}
				</AnimatePresence>
			</header>

			{!onSearchOpen && (
				<SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
			)}
		</>
	)
}
