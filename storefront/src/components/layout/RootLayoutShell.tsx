"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Toaster } from "react-hot-toast"

import AnnouncementBar from "@components/layout/AnnouncementBar"
import BottomNavbar from "@components/layout/BottomNavbar"
import MiniCartDrawer from "@components/layout/MiniCartDrawer"
import Navbar from "@components/layout/Navbar"
import SearchOverlay from "@components/ui/SearchOverlay"
import { CartProvider } from "@hooks/useCart"
import { ThemeProvider } from "@providers/ThemeProvider"

export const HIDE_BOTTOM_NAV_ROUTES = ["/checkout", "/checkout/success"]

function normalizePath(pathname?: string | null) {
	if (!pathname) {
		return "/"
	}

	return pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/"
}

export default function RootLayoutShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const normalizedPath = useMemo(() => normalizePath(pathname), [pathname])
	const [queryClient] = useState(() => new QueryClient())
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)

	const shouldHideBottomNav = HIDE_BOTTOM_NAV_ROUTES.some(
		(route) => normalizedPath === route || normalizedPath.startsWith(`${route}/`)
	)

	useEffect(() => {
		setIsSearchOpen(false)
		setIsMiniCartOpen(false)
	}, [pathname])

	const openSearch = () => {
		setIsMiniCartOpen(false)
		setIsSearchOpen(true)
	}

	const openMiniCart = () => {
		setIsSearchOpen(false)
		setIsMiniCartOpen(true)
	}

	return (
		<ThemeProvider>
			<CartProvider>
				<QueryClientProvider client={queryClient}>
					<div className="grain-overlay" aria-hidden="true" />
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-btn focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:outline-none"
					>
						Skip to content
					</a>

					<AnnouncementBar />
					<Navbar onSearchOpen={openSearch} onCartOpen={openMiniCart} />

					<div
						className={
							shouldHideBottomNav
								? "lg:pb-0"
								: "pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0"
						}
					>
						<main id="main-content" className="relative">
							{children}
						</main>
					</div>

					{!shouldHideBottomNav && (
						<BottomNavbar onSearchOpen={openSearch} />
					)}

					<MiniCartDrawer isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
					<SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
					<Toaster
						position="bottom-center"
						containerStyle={{ bottom: "calc(80px + env(safe-area-inset-bottom))" }}
						toastOptions={{
							duration: 2500,
							style: {
								borderRadius: "9999px",
								background: "var(--color-bg-card)",
								color: "var(--color-text)",
								border: "1px solid var(--color-border)",
								padding: "12px 16px",
								boxShadow: "0 18px 42px rgba(15, 23, 42, 0.12)",
							},
						}}
					/>
				</QueryClientProvider>
			</CartProvider>
		</ThemeProvider>
	)
}
