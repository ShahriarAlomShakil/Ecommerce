"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import ProductCard, { FeaturedProductCardItem } from "@components/ui/ProductCard"
import SkeletonCard from "@components/ui/SkeletonCard"
import { formatPrice, cn } from "@lib/utils"
import { getProductPrice } from "@lib/util/get-product-price"

type TrendingNowProps = {
  className?: string
}

type ProductsResponse = {
  products?: HttpTypes.StoreProduct[]
}

type TabKey = "all" | "korean" | "japanese" | "european" | "under500"

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "korean", label: "Korean" },
  { key: "japanese", label: "Japanese" },
  { key: "european", label: "European" },
  { key: "under500", label: "Under ৳500" },
]

const DEFAULT_VISIBLE = 8

const koreanHints = ["korea", "korean", "seoul", "kr"]
const japaneseHints = ["japan", "japanese", "tokyo", "jp"]
const europeanHints = [
  "europe",
  "european",
  "france",
  "french",
  "germany",
  "german",
  "italy",
  "italian",
  "spain",
  "spainish",
  "uk",
  "united kingdom",
  "england",
  "sweden",
  "swiss",
  "switzerland",
]

const fallbackProducts: FeaturedProductCardItem[] = [
  {
    id: "trend-fallback-cosrx-cleanser",
    addToCartId: "trend-fallback-cosrx-cleanser",
    handle: "cosrx-low-ph-good-morning-cleanser",
    title: "Low pH Good Morning Gel Cleanser",
    brand: "COSRX",
    thumbnail:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80",
    price: "৳450",
    rawPrice: 45000,
    rating: 4.7,
    reviewCount: 186,
    badge: "Trending",
  },
  {
    id: "trend-fallback-laneige",
    addToCartId: "trend-fallback-laneige",
    handle: "laneige-water-sleeping-mask",
    title: "Water Sleeping Mask Mini",
    brand: "Laneige",
    thumbnail:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
    price: "৳880",
    rawPrice: 88000,
    rating: 4.8,
    reviewCount: 241,
    badge: "New",
  },
  {
    id: "trend-fallback-hada-labo",
    addToCartId: "trend-fallback-hada-labo",
    handle: "hada-labo-gokujyun-lotion",
    title: "Gokujyun Hydrating Lotion",
    brand: "Hada Labo",
    thumbnail:
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=900&q=80",
    price: "৳1,120",
    rawPrice: 112000,
    rating: 4.7,
    reviewCount: 134,
    badge: "Trending",
  },
  {
    id: "trend-fallback-la-roche-posay",
    addToCartId: "trend-fallback-la-roche-posay",
    handle: "la-roche-posay-cicaplast-baume-b5",
    title: "Cicaplast Baume B5+",
    brand: "La Roche-Posay",
    thumbnail:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=80",
    price: "৳1,350",
    rawPrice: 135000,
    rating: 4.8,
    reviewCount: 199,
    badge: "Trending",
  },
  {
    id: "trend-fallback-some-by-mi",
    addToCartId: "trend-fallback-some-by-mi",
    handle: "some-by-mi-miracle-toner",
    title: "AHA BHA PHA 30 Days Miracle Toner",
    brand: "Some By Mi",
    thumbnail:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=900&q=80",
    price: "৳990",
    rawPrice: 99000,
    rating: 4.6,
    reviewCount: 157,
    badge: "Trending",
  },
  {
    id: "trend-fallback-biore",
    addToCartId: "trend-fallback-biore",
    handle: "biore-uv-aqua-rich",
    title: "UV Aqua Rich Watery Essence SPF 50+",
    brand: "Biore",
    thumbnail:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80",
    price: "৳780",
    rawPrice: 78000,
    rating: 4.8,
    reviewCount: 278,
    badge: "New",
  },
  {
    id: "trend-fallback-klairs",
    addToCartId: "trend-fallback-klairs",
    handle: "klairs-rich-moist-soothing-cream",
    title: "Rich Moist Soothing Cream",
    brand: "Klairs",
    thumbnail:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80",
    price: "৳1,250",
    rawPrice: 125000,
    rating: 4.7,
    reviewCount: 112,
    badge: "Trending",
  },
  {
    id: "trend-fallback-ordinary",
    addToCartId: "trend-fallback-ordinary",
    handle: "the-ordinary-niacinamide-10-zinc-1",
    title: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    thumbnail:
      "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&w=900&q=80",
    price: "৳1,050",
    rawPrice: 105000,
    rating: 4.6,
    reviewCount: 224,
    badge: "Trending",
  },
]

function getPublishableHeaders() {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  return publishableKey
    ? {
        "x-publishable-api-key": publishableKey,
      }
    : {}
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : null
}

function getCollectionAndTagText(product: HttpTypes.StoreProduct) {
  const tags = (product.tags || [])
    .map((tag: any) => {
      if (typeof tag === "string") {
        return tag
      }
      if (typeof tag?.value === "string") {
        return tag.value
      }
      if (typeof tag?.name === "string") {
        return tag.name
      }
      return ""
    })
    .join(" ")

  const metadata = product.metadata as Record<string, unknown> | null | undefined
  const metaValues = [
    typeof metadata?.country === "string" ? metadata.country : "",
    typeof metadata?.country_of_origin === "string" ? metadata.country_of_origin : "",
    typeof metadata?.origin === "string" ? metadata.origin : "",
    typeof metadata?.region === "string" ? metadata.region : "",
  ].join(" ")

  return `${product.collection?.title || ""} ${product.collection?.handle || ""} ${product.subtitle || ""} ${tags} ${metaValues}`.toLowerCase()
}

function hasAnyHint(value: string, hints: string[]) {
  return hints.some((hint) => value.includes(hint))
}

function normalizeProduct(product: HttpTypes.StoreProduct, index: number): FeaturedProductCardItem {
  const metadata = product.metadata as Record<string, unknown> | null | undefined
  const { cheapestPrice } = getProductPrice({ product })
  const fallback = fallbackProducts[index % fallbackProducts.length]

  const rawPrice =
    cheapestPrice?.calculated_price_number ??
    toNumber(metadata?.price) ??
    fallback.rawPrice ??
    0

  const rawOriginalPrice =
    cheapestPrice?.original_price_number ??
    toNumber(metadata?.original_price) ??
    null

  const hasDiscount =
    typeof rawOriginalPrice === "number" &&
    typeof rawPrice === "number" &&
    rawOriginalPrice > rawPrice

  return {
    id: product.id,
    addToCartId: product.variants?.[0]?.id || product.id,
    handle: product.handle || fallback.handle,
    title: product.title || fallback.title,
    brand:
      (typeof metadata?.brand === "string" && metadata.brand) ||
      (typeof metadata?.vendor === "string" && metadata.vendor) ||
      product.collection?.title ||
      fallback.brand,
    thumbnail: product.thumbnail || fallback.thumbnail,
    price: rawPrice ? formatPrice(rawPrice, cheapestPrice?.currency_code || "BDT") : fallback.price,
    originalPrice:
      typeof rawOriginalPrice === "number" && rawOriginalPrice > rawPrice
        ? formatPrice(rawOriginalPrice, cheapestPrice?.currency_code || "BDT")
        : null,
    rawPrice,
    rawOriginalPrice,
    rating: toNumber(metadata?.rating) ?? fallback.rating,
    reviewCount: toNumber(metadata?.review_count) ?? fallback.reviewCount,
    badge: hasDiscount
      ? `Sale -${Math.round(((rawOriginalPrice! - rawPrice) / rawOriginalPrice!) * 100)}%`
      : "Trending",
  }
}

function filterByTab(products: FeaturedProductCardItem[], rawProducts: HttpTypes.StoreProduct[], tab: TabKey) {
  if (tab === "all") {
    return products
  }

  return products.filter((item, index) => {
    if (tab === "under500") {
      return typeof item.rawPrice === "number" && item.rawPrice <= 50000
    }

    const raw = rawProducts[index]
    if (!raw) {
      return false
    }

    const combinedText = getCollectionAndTagText(raw)

    if (tab === "korean") {
      return hasAnyHint(combinedText, koreanHints)
    }
    if (tab === "japanese") {
      return hasAnyHint(combinedText, japaneseHints)
    }

    return hasAnyHint(combinedText, europeanHints)
  })
}

export default function TrendingNow({ className }: TrendingNowProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [products, setProducts] = useState<FeaturedProductCardItem[]>([])
  const [rawProducts, setRawProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [visibleByTab, setVisibleByTab] = useState<Record<TabKey, number>>({
    all: DEFAULT_VISIBLE,
    korean: DEFAULT_VISIBLE,
    japanese: DEFAULT_VISIBLE,
    european: DEFAULT_VISIBLE,
    under500: DEFAULT_VISIBLE,
  })

  useEffect(() => {
    const controller = new AbortController()

    const fetchTrendingProducts = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

        if (!baseUrl) {
          throw new Error("Missing Medusa backend URL")
        }

        const response = await fetch(
          `${baseUrl}/store/products?limit=100&tags[]=trending&fields=*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+collection,+thumbnail,+subtitle`,
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
        const fetchedRawProducts = data.products || []

        if (!fetchedRawProducts.length) {
          throw new Error("No trending products returned")
        }

        setRawProducts(fetchedRawProducts)
        setProducts(fetchedRawProducts.map(normalizeProduct))
        setUsingFallback(false)
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setRawProducts([])
        setProducts(fallbackProducts)
        setUsingFallback(true)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchTrendingProducts()

    return () => controller.abort()
  }, [])

  const filteredProducts = useMemo(() => {
    if (usingFallback || !rawProducts.length) {
      if (activeTab === "under500") {
        return products.filter(
          (product) => typeof product.rawPrice === "number" && product.rawPrice <= 50000
        )
      }

      return activeTab === "all" ? products : []
    }

    return filterByTab(products, rawProducts, activeTab)
  }, [activeTab, products, rawProducts, usingFallback])

  const visibleCount = visibleByTab[activeTab]
  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleProducts.length < filteredProducts.length

  const handleLoadMore = () => {
    setVisibleByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + DEFAULT_VISIBLE,
    }))
  }

  return (
    <section className={cn("glowhaus-section", className)}>
      <div className="glowhaus-container">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-heading text-3xl text-[var(--color-text)] sm:text-4xl md:text-5xl">
            Trending Now
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-body text-sm text-[var(--color-text-muted)] sm:text-base">
            What Bangladesh is adding to their routines
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2.5 sm:mb-10">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-full px-4 py-2 font-ui text-xs font-medium uppercase tracking-[0.12em] transition-all sm:px-5 sm:py-2.5",
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-[0_12px_24px_rgba(194,116,138,0.24)]"
                    : "border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)]"
                )}
                aria-pressed={isActive}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {loading
                ? Array.from({ length: DEFAULT_VISIBLE }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                : visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            {!loading && !visibleProducts.length ? (
              <p className="py-8 text-center font-body text-sm text-[var(--color-text-muted)]">
                No products found for this tab yet.
              </p>
            ) : null}

            {!loading && hasMore ? (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="rounded-full border border-[var(--color-border)] px-6 py-3 font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                >
                  Load More
                </button>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {usingFallback && !loading ? (
          <p className="mt-5 text-center font-ui text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Showing curated trending picks while products sync from Medusa.
          </p>
        ) : null}
      </div>
    </section>
  )
}
