"use client"

import { AnimatePresence, motion } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { ArrowLeft, Clock3, LoaderCircle, Search, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { formatPrice } from "@lib/utils"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SearchOverlayProps = {
	isOpen: boolean
	onClose: () => void
}

type ProductsResponse = {
	products?: HttpTypes.StoreProduct[]
}

const POPULAR_SEARCHES = [
	"COSRX Snail Essence",
	"SPF 50",
	"Niacinamide Serum",
	"Vitamin C",
	"Sheet Masks",
	"Retinol",
	"Hyaluronic Acid",
]

const RECENT_SEARCHES_KEY = "glowhaus-recent-searches"

function getPublishableHeaders() {
	const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

	return publishableKey
		? {
				"x-publishable-api-key": publishableKey,
			}
		: {}
}

function readRecentSearches() {
	if (typeof window === "undefined") {
		return [] as string[]
	}

	try {
		const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY)

		if (!raw) {
			return []
		}

		const parsed = JSON.parse(raw) as unknown

		if (!Array.isArray(parsed)) {
			return []
		}

		return parsed.filter((term): term is string => typeof term === "string").slice(0, 5)
	} catch {
		return []
	}
}

function writeRecentSearches(searches: string[]) {
	if (typeof window === "undefined") {
		return
	}

	window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, 5)))
}

function getProductBrand(product: HttpTypes.StoreProduct) {
	const metadata = product.metadata as Record<string, unknown> | null | undefined

	return (
		(typeof metadata?.brand === "string" && metadata.brand) ||
		(typeof metadata?.vendor === "string" && metadata.vendor) ||
		product.collection?.title ||
		product.subtitle ||
		"GlowHaus"
	)
}

function getProductPriceLabel(product: HttpTypes.StoreProduct) {
	const metadata = product.metadata as Record<string, unknown> | null | undefined
	const { cheapestPrice } = getProductPrice({ product })

	if (cheapestPrice?.calculated_price_number) {
		return formatPrice(
			cheapestPrice.calculated_price_number,
			cheapestPrice.currency_code || "BDT"
		)
	}

	if (typeof metadata?.price === "number") {
		return formatPrice(metadata.price, "BDT")
	}

	return null
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [mounted, setMounted] = useState(false)
	const [query, setQuery] = useState("")
	const [debouncedQuery, setDebouncedQuery] = useState("")
	const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [recentSearches, setRecentSearches] = useState<string[]>([])

	const trimmedQuery = useMemo(() => query.trim(), [query])

	const syncRecentSearches = useCallback(() => {
		setRecentSearches(readRecentSearches())
	}, [])

	const saveRecentSearch = useCallback(
		(term: string) => {
			const normalizedTerm = term.trim()

			if (!normalizedTerm) {
				return
			}

			const nextSearches = [
				normalizedTerm,
				...readRecentSearches().filter(
					(existingTerm) => existingTerm.toLowerCase() !== normalizedTerm.toLowerCase()
				),
			].slice(0, 5)

			writeRecentSearches(nextSearches)
			setRecentSearches(nextSearches)
		},
		[]
	)

	const removeRecentSearch = useCallback((term: string) => {
		const nextSearches = readRecentSearches().filter(
			(existingTerm) => existingTerm.toLowerCase() !== term.toLowerCase()
		)

		writeRecentSearches(nextSearches)
		setRecentSearches(nextSearches)
	}, [])

	const clearRecentSearches = useCallback(() => {
		writeRecentSearches([])
		setRecentSearches([])
	}, [])

	const runSearch = useCallback(
		(term: string) => {
			const normalizedTerm = term.trim()

			setQuery(normalizedTerm)
			setDebouncedQuery(normalizedTerm)
			saveRecentSearch(normalizedTerm)

			window.requestAnimationFrame(() => {
				inputRef.current?.focus()
				inputRef.current?.setSelectionRange(normalizedTerm.length, normalizedTerm.length)
			})
		},
		[saveRecentSearch]
	)

	useEffect(() => {
		setMounted(true)
		syncRecentSearches()
	}, [])

	useEffect(() => {
		if (!isOpen) {
			setQuery("")
			setDebouncedQuery("")
			setProducts([])
			setIsLoading(false)
			return
		}

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		syncRecentSearches()

		const timer = window.setTimeout(() => {
			inputRef.current?.focus()
		}, 80)

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose()
			}

			if (event.key === "Enter" && query.trim()) {
				saveRecentSearch(query)
			}
		}

		window.addEventListener("keydown", onKeyDown)

		return () => {
			window.clearTimeout(timer)
			window.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = previousOverflow
		}
	}, [isOpen, onClose, query, saveRecentSearch, syncRecentSearches])

	useEffect(() => {
		if (!isOpen) {
			return
		}

		if (!trimmedQuery) {
			setDebouncedQuery("")
			setProducts([])
			setIsLoading(false)
			return
		}

		const timer = window.setTimeout(() => {
			setDebouncedQuery(trimmedQuery)
		}, 300)

		return () => window.clearTimeout(timer)
	}, [isOpen, trimmedQuery])

	useEffect(() => {
		if (!isOpen || !debouncedQuery) {
			return
		}

		const controller = new AbortController()

		const fetchProducts = async () => {
			try {
				setIsLoading(true)

				const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

				if (!baseUrl) {
					throw new Error("Missing Medusa backend URL")
				}

				const params = new URLSearchParams({
					q: debouncedQuery,
					limit: "6",
					fields:
						"*variants.calculated_price,+thumbnail,+subtitle,+metadata,+collection,+handle",
				})

				const response = await fetch(`${baseUrl}/store/products?${params.toString()}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						...getPublishableHeaders(),
					},
					signal: controller.signal,
				})

				if (!response.ok) {
					throw new Error(`Failed to fetch products: ${response.status}`)
				}

				const data = (await response.json()) as ProductsResponse
				setProducts(data.products || [])
				saveRecentSearch(debouncedQuery)
			} catch (error) {
				if (controller.signal.aborted) {
					return
				}

				setProducts([])
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false)
				}
			}
		}

		fetchProducts()

		return () => controller.abort()
	}, [debouncedQuery, isOpen, saveRecentSearch])

	if (!mounted) {
		return null
	}

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-[120] overflow-y-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<div className="absolute inset-0 bg-[color:var(--color-bg)]/95 backdrop-blur-md" />

					<motion.div
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -20, opacity: 0 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="relative min-h-screen w-full px-4 pb-10 pt-5 sm:px-6"
					>
						<div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
							<div className="border-b border-[var(--color-border)] bg-[var(--color-bg)] pb-3 sm:pb-4">
								<div className="flex items-center gap-3">
									<button
										type="button"
										onClick={onClose}
										className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] sm:h-10 sm:w-10"
										aria-label="Close search overlay"
									>
										<ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
									</button>

									<div className="relative min-w-0 flex-1 border-b border-[var(--color-border)] pb-1">
										<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] sm:h-5 sm:w-5" />
										<input
											ref={inputRef}
											type="search"
											value={query}
											onChange={(event) => setQuery(event.target.value)}
											placeholder="Search for COSRX, Laneige, serums..."
											className="w-full bg-transparent py-1.5 pl-6 pr-14 font-body text-[17px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] sm:py-2 sm:pl-8 sm:pr-16 sm:text-[20px]"
											autoComplete="off"
											autoCapitalize="none"
											spellCheck={false}
											aria-label="Search products"
										/>

										{query && (
											<button
												type="button"
												onClick={() => {
													setQuery("")
													setDebouncedQuery("")
													setProducts([])
													inputRef.current?.focus()
												}}
												className="absolute right-0 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full px-2 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] sm:px-2.5 sm:text-xs"
											>
												<X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
												<span>Clear</span>
											</button>
										)}
									</div>
								</div>
							</div>

							{trimmedQuery ? (
								<section className="bg-[var(--color-bg)]">
									<div className="mb-3 flex items-center justify-between border-b border-[var(--color-border)] pb-3">
										<p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
											Search results
										</p>
										{isLoading && (
											<div className="inline-flex items-center gap-2 font-ui text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
												<LoaderCircle className="h-3.5 w-3.5 animate-spin" />
												<span>Searching</span>
											</div>
										)}
									</div>

									<div className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
										{!isLoading && products.length === 0 ? (
											<p className="py-5 font-body text-sm text-[var(--color-text-muted)]">
												No products found for &quot;{trimmedQuery}&quot; — try another term
											</p>
										) : (
											products.map((product) => {
												const brand = getProductBrand(product)
												const price = getProductPriceLabel(product)

												return (
													<LocalizedClientLink
														key={product.id}
														href={`/products/${product.handle}`}
														onClick={() => {
															saveRecentSearch(product.title || trimmedQuery)
															onClose()
														}}
														className="flex items-center gap-3 py-3 transition hover:bg-black/5"
													>
														<div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--color-bg-card)] ring-1 ring-[var(--color-border)]">
															{product.thumbnail ? (
																<img
																	src={product.thumbnail}
																	alt={product.title || "Product image"}
																	className="h-full w-full object-cover"
																/>
															) : (
																<Search className="h-4 w-4 text-[var(--color-text-muted)]" />
															)}
														</div>

														<div className="min-w-0 flex-1">
															<p className="truncate font-body text-sm font-medium text-[var(--color-text)]">
																{product.title}
															</p>
															<p className="truncate font-ui text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
																{brand}
															</p>
														</div>

														{price && (
															<span className="shrink-0 font-ui text-sm font-semibold text-[var(--color-text)]">
																{price}
															</span>
														)}
													</LocalizedClientLink>
												)
											})
										)}
									</div>
								</section>
							) : (
								<>
									<section className="border-b border-[var(--color-border)] pb-5">
										<p className="mb-4 font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
											Popular Searches 🔥
										</p>

										<div className="flex flex-wrap gap-2.5">
											{POPULAR_SEARCHES.map((term) => (
												<button
													key={term}
													type="button"
													onClick={() => runSearch(term)}
													className="rounded-full border border-[var(--color-border)] px-4 py-2 font-body text-sm text-[var(--color-text)] transition hover:border-[var(--color-text)] hover:bg-[var(--color-bg-card)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
												>
													{term}
												</button>
											))}
										</div>
									</section>

									<section>
										<div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-3">
											<p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
												Recent
											</p>
											{recentSearches.length > 0 && (
												<button
													type="button"
													onClick={clearRecentSearches}
													className="font-ui text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] transition hover:text-[var(--color-primary-deep)] focus:outline-none"
												>
													Clear all
												</button>
											)}
										</div>

										{recentSearches.length === 0 ? (
											<p className="font-body text-sm text-[var(--color-text-muted)]">
												Your recent searches will appear here.
											</p>
										) : (
											<div className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
												{recentSearches.map((term) => (
													<div key={term} className="flex items-center gap-2 py-2.5">
														<button
															type="button"
															onClick={() => runSearch(term)}
															className="flex min-w-0 flex-1 items-center gap-3 text-left transition hover:text-[var(--color-text)]"
														>
															<Clock3 className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
															<span className="truncate font-body text-sm text-[var(--color-text)]">{term}</span>
														</button>

														<button
															type="button"
															onClick={() => removeRecentSearch(term)}
															className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:bg-black/5 hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
															aria-label={`Remove ${term} from recent searches`}
														>
															<X className="h-4 w-4" />
														</button>
													</div>
												))}
											</div>
										)}
									</section>
								</>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	)
}
