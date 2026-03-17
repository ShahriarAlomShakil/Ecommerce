"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { useEffect, useRef } from "react"

type SearchOverlayProps = {
	isOpen: boolean
	onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"

		const timer = window.setTimeout(() => {
			inputRef.current?.focus()
		}, 120)

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose()
			}
		}

		window.addEventListener("keydown", onKeyDown)

		return () => {
			window.clearTimeout(timer)
			window.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = previousOverflow
		}
	}, [isOpen, onClose])

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-[120]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<button
						type="button"
						aria-label="Close search"
						onClick={onClose}
						className="absolute inset-0 h-full w-full bg-black/35"
					/>

					<motion.div
						initial={{ y: -18, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -18, opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeOut" }}
						className="relative w-full border-b border-border bg-[var(--color-nav-bg)] px-4 pb-8 pt-5 backdrop-blur-lg sm:px-6"
					>
						<div className="mx-auto w-full max-w-5xl">
							<div className="mb-4 flex items-center justify-between">
								<p className="font-ui text-xs uppercase tracking-[0.14em] text-muted">
									Search GlowHaus
								</p>
								<button
									type="button"
									onClick={onClose}
									className="rounded-full p-2 text-[var(--color-text)] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
									aria-label="Close search overlay"
								>
									<X className="h-4 w-4" />
								</button>
							</div>

							<div className="relative">
								<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
								<input
									ref={inputRef}
									type="search"
									placeholder="Search for products, brands, concerns..."
									className="w-full rounded-btn border border-border bg-transparent py-3.5 pl-12 pr-4 text-sm text-[var(--color-text)] outline-none transition focus:border-primary"
								/>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
