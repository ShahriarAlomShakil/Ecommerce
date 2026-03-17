"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { cn, formatPrice } from "@lib/utils"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard, { FeaturedProductCardItem } from "@components/ui/ProductCard"
import SkeletonCard from "@components/ui/SkeletonCard"

type FeaturedProductsProps = {
  className?: string
}

type ProductsResponse = {
  products?: HttpTypes.StoreProduct[]
}

const fallbackProducts: FeaturedProductCardItem[] = [
  {
    id: "fallback-cosrx-snail-essence",
    handle: "cosrx-advanced-snail-96-mucin-power-essence",
    title: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    thumbnail:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
    price: "৳1,450",
    originalPrice: "৳1,790",
    rawPrice: 145000,
    rawOriginalPrice: 179000,
    rating: 4.8,
    reviewCount: 214,
    badge: "Sale -19%",
  },
  {
    id: "fallback-laneige-cream-skin",
    handle: "laneige-cream-skin-cerapeptide-refiner",
    title: "Cream Skin Cerapeptide Refiner",
    brand: "Laneige",
    thumbnail:
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80",
    price: "৳2,100",
    rawPrice: 210000,
    rating: 4.7,
    reviewCount: 168,
    badge: "New",
  },
  {
    id: "fallback-boj-sunscreen",
    handle: "beauty-of-joseon-relief-sun",
    title: "Relief Sun Rice + Probiotics SPF50+",
    brand: "Beauty of Joseon",
    thumbnail:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
    price: "৳1,350",
    rawPrice: 135000,
    rating: 4.9,
    reviewCount: 302,
    badge: "New",
  },
  {
    id: "fallback-somebymi-serum",
    handle: "some-by-mi-galactomyces-pure-vitamin-c-glow-serum",
    title: "Galactomyces Pure Vitamin C Glow Serum",
    brand: "Some By Mi",
    thumbnail:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=80",
    price: "৳1,680",
    originalPrice: "৳2,050",
    rawPrice: 168000,
    rawOriginalPrice: 205000,
    rating: 4.6,
    reviewCount: 124,
    badge: "Sale -18%",
  },
  {
    id: "fallback-torriden-serum",
    handle: "torriden-dive-in-serum",
    title: "Dive-In Low Molecule Hyaluronic Acid Serum",
    brand: "Torriden",
    thumbnail:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80",
    price: "৳1,590",
    rawPrice: 159000,
    rating: 4.8,
    reviewCount: 187,
    badge: "New",
  },
  {
    id: "fallback-klairs-toner",
    handle: "klairs-supple-preparation-unscented-toner",
    title: "Supple Preparation Unscented Toner",
    brand: "Klairs",
    thumbnail:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
    price: "৳1,320",
    rawPrice: 132000,
    rating: 4.7,
    reviewCount: 96,
    badge: "New",
  },
  {
    id: "fallback-innisfree-cleanser",
    handle: "innisfree-green-tea-amino-cleanser",
    title: "Green Tea Amino Hydrating Cleansing Foam",
    brand: "Innisfree",
    thumbnail:
      "https://images.unsplash.com/photo-1526758097130-bab247274f58?auto=format&fit=crop&w=900&q=80",
    price: "৳980",
    originalPrice: "৳1,150",
    rawPrice: 98000,
    rawOriginalPrice: 115000,
    rating: 4.5,
    reviewCount: 71,
    badge: "Sale -15%",
  },
  {
    id: "fallback-missha-ampoule",
    handle: "missha-time-revolution-night-repair-ampoule",
    title: "Time Revolution Night Repair Ampoule 5X",
    brand: "Missha",
    thumbnail:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80",
    price: "৳2,350",
    rawPrice: 235000,
    rating: 4.8,
    reviewCount: 143,
    badge: "New",
  },
]

const brandFallbacks = [
  "COSRX",
  "Laneige",
  "Beauty of Joseon",
  "Some By Mi",
  "Torriden",
  "Klairs",
  "Innisfree",
  "Missha",
]

const reviewFallbacks = [214, 168, 302, 124, 187, 96, 71, 143]
const ratingFallbacks = [4.8, 4.7, 4.9, 4.6, 4.8, 4.7, 4.5, 4.8]

function getPublishableHeaders() {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  return publishableKey
    ? {
        "x-publishable-api-key": publishableKey,
      }
    : {}
}

function isRecentlyAdded(date?: string | null) {
  if (!date) {
    return false
  }

  const createdAt = new Date(date).getTime()

  if (Number.isNaN(createdAt)) {
    return false
  }

  const daysSinceCreated = (Date.now() - createdAt) / (1000 * 60 * 60 * 24)
  return daysSinceCreated <= 35
}

function pickBrand(product: HttpTypes.StoreProduct, index: number) {
  const metadata = product.metadata as Record<string, unknown> | null | undefined

  const brand =
    (typeof metadata?.brand === "string" && metadata.brand) ||
    (typeof metadata?.vendor === "string" && metadata.vendor) ||
    (product.collection?.title as string | undefined) ||
    product.subtitle ||
    brandFallbacks[index % brandFallbacks.length]

  return brand.toUpperCase() === brand ? brand : brand
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : null
}

function normalizeProduct(product: HttpTypes.StoreProduct, index: number): FeaturedProductCardItem {
  const metadata = product.metadata as Record<string, unknown> | null | undefined
  const { cheapestPrice } = getProductPrice({ product })

  const rawPrice =
    cheapestPrice?.calculated_price_number ??
    toNumber(metadata?.price) ??
    fallbackProducts[index % fallbackProducts.length].rawPrice ??
    0

  const rawOriginalPrice =
    cheapestPrice?.original_price_number ??
    toNumber(metadata?.original_price) ??
    null

  const onSale =
    typeof rawOriginalPrice === "number" && typeof rawPrice === "number" && rawOriginalPrice > rawPrice

  const reviewCount =
    toNumber(metadata?.review_count) ?? reviewFallbacks[index % reviewFallbacks.length]

  const rating =
    toNumber(metadata?.rating) ?? ratingFallbacks[index % ratingFallbacks.length]

  const fallback = fallbackProducts[index % fallbackProducts.length]
  const badge = onSale
    ? `Sale -${Math.round(((rawOriginalPrice! - rawPrice) / rawOriginalPrice!) * 100)}%`
    : isRecentlyAdded(product.created_at)
      ? "New"
      : index < 3
        ? "New"
        : null

  return {
    id: product.id,
    addToCartId: product.variants?.[0]?.id || product.id,
    handle: product.handle || fallback.handle,
    title: product.title || fallback.title,
    brand: pickBrand(product, index),
    thumbnail: product.thumbnail || fallback.thumbnail,
    price: rawPrice ? formatPrice(rawPrice, cheapestPrice?.currency_code || "BDT") : fallback.price,
    originalPrice:
      typeof rawOriginalPrice === "number" && rawOriginalPrice > rawPrice
        ? formatPrice(rawOriginalPrice, cheapestPrice?.currency_code || "BDT")
        : null,
    rawPrice,
    rawOriginalPrice,
    rating,
    reviewCount,
    badge,
  }
}

export default function FeaturedProducts({ className }: FeaturedProductsProps) {
  const [products, setProducts] = useState<FeaturedProductCardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      try {
        setLoading(true)

        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

        if (!baseUrl) {
          throw new Error("Missing Medusa backend URL")
        }

        const response = await fetch(
          `${baseUrl}/store/products?limit=8&order=created_at&fields=*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+collection,+thumbnail,+subtitle`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...getPublishableHeaders(),
            },
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }

        const data = (await response.json()) as ProductsResponse
        const fetchedProducts = (data.products || []).slice(0, 8)

        if (!fetchedProducts.length) {
          throw new Error("No products returned")
        }

        setProducts(fetchedProducts.map(normalizeProduct))
        setUsingFallback(false)
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setProducts(fallbackProducts)
        setUsingFallback(true)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [])

  const content = useMemo(() => {
    if (loading) {
      return Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
    }

    return products.map((product, index) => (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
      >
        <ProductCard product={product} />
      </motion.div>
    ))
  }, [loading, products])

  return (
    <section className={cn("glowhaus-section", className)}>
      <div className="glowhaus-container">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl text-[var(--color-text)] sm:text-4xl md:text-5xl">
              Best Sellers
            </h2>
            <p className="mt-3 max-w-xl font-body text-sm text-[var(--color-text-muted)] sm:text-base">
              What everyone&apos;s loving right now
            </p>
          </div>

          <LocalizedClientLink
            href="/store"
            className="font-ui text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-deep)]"
          >
            View All →
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {content}
        </div>

        {usingFallback && !loading ? (
          <p className="mt-5 text-center font-ui text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Showing curated best sellers while products sync from Medusa.
          </p>
        ) : null}
      </div>
    </section>
  )
}