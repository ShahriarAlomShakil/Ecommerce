"use client"

import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@lib/utils"
import { useCart } from "@hooks/useCart"
import { useWishlist } from "@hooks/useWishlist"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Badge from "./Badge"
import StarRating from "./StarRating"

export type FeaturedProductCardItem = {
	id: string
	handle: string
	title: string
	brand: string
	thumbnail: string
	price: string
	originalPrice?: string | null
	rawPrice?: number | null
	rawOriginalPrice?: number | null
	rating?: number
	reviewCount?: number
	badge?: string | null
	addToCartId?: string
}

type ProductCardProps = {
	product: FeaturedProductCardItem
	className?: string
}

const isKoreanBrand = (brand: string) => /[가-힣]/.test(brand)

export default function ProductCard({ product, className }: ProductCardProps) {
	const { addItem } = useCart()
	const { hasItem, toggleItem } = useWishlist()

	const wishlistActive = hasItem(product.id)
	const isOnSale =
		typeof product.rawOriginalPrice === "number" &&
		typeof product.rawPrice === "number" &&
		product.rawOriginalPrice > product.rawPrice

	const cartId = product.addToCartId || product.id

	const handleAddToCart = () => {
		addItem(cartId, 1)
	}

	return (
		<article
			className={cn(
				"group overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]",
				className
			)}
		>
			<div className="relative overflow-hidden rounded-[calc(var(--radius-card)-4px)]">
				<LocalizedClientLink href={`/products/${product.handle}`} className="block">
					<div className="relative aspect-[3/4] overflow-hidden rounded-[calc(var(--radius-card)-4px)] bg-[var(--color-surface)]">
						<Image
							src={product.thumbnail}
							alt={product.title}
							fill
							sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
							className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,44,44,0.14)] via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
					</div>
				</LocalizedClientLink>

				<div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
					<div className="pointer-events-auto">
						{product.badge ? (
							<Badge variant={isOnSale ? "accent" : "new"}>{product.badge}</Badge>
						) : null}
					</div>

					<button
						type="button"
						onClick={() => toggleItem(product.id)}
						className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.88)] text-[var(--color-text)] shadow-[0_10px_30px_rgba(44,44,44,0.08)] backdrop-blur-sm transition hover:scale-105 hover:text-[var(--color-primary-deep)] dark:bg-[rgba(30,30,30,0.88)]"
						aria-label={wishlistActive ? "Remove from wishlist" : "Add to wishlist"}
					>
						<Heart
							className={cn("h-4.5 w-4.5 transition", wishlistActive && "fill-current text-[var(--color-primary)]")}
						/>
					</button>
				</div>

				<motion.button
					type="button"
					onClick={handleAddToCart}
					initial={false}
					className="absolute inset-x-3 bottom-3 inline-flex translate-y-4 items-center justify-center gap-2 rounded-full bg-[var(--color-text)] px-4 py-3 font-ui text-xs font-semibold uppercase tracking-[0.16em] text-white opacity-0 shadow-[0_18px_30px_rgba(44,44,44,0.22)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
					aria-label={`Quick add ${product.title} to cart`}
				>
					<ShoppingBag className="h-4 w-4" />
					Quick Add
				</motion.button>
			</div>

			<div className="mt-4 space-y-3">
				<p
					className={cn(
						"text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]",
						isKoreanBrand(product.brand) ? "font-korean" : "font-ui"
					)}
				>
					{product.brand}
				</p>

				<LocalizedClientLink href={`/products/${product.handle}`} className="block">
					<h3 className="line-clamp-2 min-h-[3.25rem] font-body text-base font-medium leading-6 text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary-deep)]">
						{product.title}
					</h3>
				</LocalizedClientLink>

				<StarRating rating={product.rating} reviewCount={product.reviewCount} />

				<div className="flex items-end justify-between gap-3 pt-1">
					<div className="space-y-1">
						{product.originalPrice && isOnSale ? (
							<p className="font-ui text-xs text-[var(--color-text-muted)] line-through">
								{product.originalPrice}
							</p>
						) : null}
						<p className="font-ui text-lg font-semibold text-[var(--color-text)]">
							{product.price}
						</p>
					</div>

					<button
						type="button"
						onClick={handleAddToCart}
						className="rounded-full border border-[var(--color-border)] px-4 py-2.5 font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</article>
	)
}
