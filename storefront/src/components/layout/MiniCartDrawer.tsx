"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBag, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { useCart } from "@hooks/useCart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type MiniCartDrawerProps = {
	isOpen: boolean
	onClose: () => void
}

export default function MiniCartDrawer({ isOpen, onClose }: MiniCartDrawerProps) {
	const { items, count } = useCart()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose()
			}
		}

		window.addEventListener("keydown", onKeyDown)

		return () => {
			window.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = previousOverflow
		}
	}, [isOpen, onClose])

	if (!mounted) {
		return null
	}

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.button
						type="button"
						aria-label="Close mini cart"
						onClick={onClose}
						className="fixed inset-0 z-[124] bg-black/35"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>

					<motion.aside
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", stiffness: 280, damping: 28 }}
						className="fixed inset-x-0 bottom-0 z-[125] mx-auto w-full max-w-2xl rounded-t-[32px] border border-border bg-[var(--color-bg-card)] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-[0_-24px_64px_rgba(15,23,42,0.2)]"
					>
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<p className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted">
									Your bag
								</p>
								<h2 className="mt-1 text-lg font-medium text-[var(--color-text)]">
									{count > 0 ? `${count} item${count === 1 ? "" : "s"} added` : "Your cart is empty"}
								</h2>
							</div>

							<button
								type="button"
								onClick={onClose}
								className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-[var(--color-text)] transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								aria-label="Close cart drawer"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<div className="rounded-[28px] border border-border bg-[var(--color-bg)]/70 p-4">
							{items.length > 0 ? (
								<ul className="space-y-3">
									{items.slice(0, 4).map((item) => (
										<li
											key={item.id}
											className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-[var(--color-bg-card)] px-4 py-3"
										>
											<div className="min-w-0">
												<p className="truncate font-ui text-sm font-medium text-[var(--color-text)]">
													{item.id}
												</p>
												<p className="mt-1 text-xs text-muted">Qty {item.quantity}</p>
											</div>
											<ShoppingBag className="h-4 w-4 shrink-0 text-primary" />
										</li>
									))}
								</ul>
							) : (
								<div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center">
									<p className="text-sm text-muted">
										Add products to your bag to see them here.
									</p>
								</div>
							)}
						</div>

						<div className="mt-5 grid grid-cols-2 gap-3">
							<LocalizedClientLink
								href="/store"
								onClick={onClose}
								className="inline-flex items-center justify-center rounded-full border border-border px-4 py-3 font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text)] transition hover:border-primary"
							>
								Keep shopping
							</LocalizedClientLink>
							<LocalizedClientLink
								href="/cart"
								onClick={onClose}
								className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 font-ui text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
							>
								View cart
							</LocalizedClientLink>
						</div>
					</motion.aside>
				</>
			)}
		</AnimatePresence>,
		document.body
	)
}
