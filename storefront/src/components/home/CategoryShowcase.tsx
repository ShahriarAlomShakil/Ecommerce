"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@lib/utils"
import { medusa } from "@lib/medusa"

interface Category {
  id: string
  name: string
  handle?: string
}

interface CategoryWithGradient extends Category {
  gradient: string
  icon: string
}

// Define unique gradient and icon for each category
const categoryConfig: Record<string, { gradient: string; icon: string }> = {
  cleanser: {
    gradient: "from-[#FFE5EC] to-[#FFD4E5] dark:from-[#3A1F2A] dark:to-[#2A1020]",
    icon: "💧",
  },
  toner: {
    gradient: "from-[#B8E0D2] to-[#D8F0E8] dark:from-[#1A3A30] dark:to-[#1A4A3A]",
    icon: "✨",
  },
  serum: {
    gradient: "from-[#FFE8D6] to-[#FFF0E8] dark:from-[#3A2418] dark:to-[#3A3018]",
    icon: "🌟",
  },
  moisturizer: {
    gradient: "from-[#F5DCD0] to-[#FCE8D6] dark:from-[#2A1614] dark:to-[#3A2018]",
    icon: "🌸",
  },
  "spf/sunscreen": {
    gradient: "from-[#FFF4D6] to-[#FFFBE6] dark:from-[#3A3014] dark:to-[#4A4014]",
    icon: "☀️",
  },
  "eye care": {
    gradient: "from-[#E8D5F2] to-[#F5E8FF] dark:from-[#2A1A3A] dark:to-[#2A1A3A]",
    icon: "👁️",
  },
  "sheet masks": {
    gradient: "from-[#D4E4F7] to-[#E8F4FF] dark:from-[#1A2A3A] dark:to-[#162A3A]",
    icon: "🧴",
  },
  "lip care": {
    gradient: "from-[#FFD4E5] to-[#FFE5F0] dark:from-[#3A1A2A] dark:to-[#3A1020]",
    icon: "💋",
  },
  "body care": {
    gradient: "from-[#E8F5E9] to-[#F1F8F5] dark:from-[#1A3020] dark:to-[#182A18]",
    icon: "🌿",
  },
  "men's skincare": {
    gradient: "from-[#D7E8F7] to-[#E8F4FF] dark:from-[#1A2A3A] dark:to-[#1A2A3A]",
    icon: "👨",
  },
}

// Skeleton loader component
function CategorySkeleton() {
  return (
    <div className="flex shrink-0 flex-col items-center gap-3 md:gap-4">
      <div
        className={cn(
          "aspect-square w-32 sm:w-36 md:w-40 rounded-[var(--radius-card)]",
          "animate-pulse bg-[rgba(194,116,138,0.1)] dark:bg-[rgba(255,143,163,0.08)]"
        )}
      />
      <div className="w-full space-y-1">
        <div className="mx-auto h-3 w-24 animate-pulse rounded-full bg-[rgba(194,116,138,0.1)] dark:bg-[rgba(255,143,163,0.08)]" />
      </div>
    </div>
  )
}

// Category tile component
interface CategoryTileProps {
  category: CategoryWithGradient
}

function CategoryTile({ category }: CategoryTileProps) {
  return (
    <motion.a
      href={`/shop?category=${category.handle || category.id}`}
      className="group flex shrink-0 flex-col items-center gap-3 md:gap-4"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Card */}
      <motion.div
        className={cn(
          "flex aspect-square w-32 items-center justify-center sm:w-36 md:w-40",
          "rounded-[var(--radius-card)] transition-all duration-300",
          "shadow-[var(--shadow-card)] group-hover:shadow-[var(--shadow-hover)]",
          `bg-gradient-to-br ${category.gradient}`
        )}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.2 }}
      >
        {/* Icon */}
        <span className="text-5xl sm:text-6xl md:text-7xl drop-shadow-sm">
          {category.icon}
        </span>
      </motion.div>

      {/* Category name */}
      <p className="font-ui text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-text)] sm:text-sm md:text-base">
        {category.name}
      </p>
    </motion.a>
  )
}

interface CategoryShowcaseProps {
  className?: string
}

export default function CategoryShowcase({ className }: CategoryShowcaseProps) {
  const [categories, setCategories] = useState<CategoryWithGradient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        
        // Try to fetch from Medusa API
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories?limit=100`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Merge fetched categories with config
          const enrichedCategories = (data.product_categories || [])
            .map((cat: Category) => ({
              ...cat,
              ...categoryConfig[cat.handle?.toLowerCase() || cat.name.toLowerCase()] || {
                gradient:
                  "from-[#E8D5F2] to-[#F5E8FF] dark:from-[#2A1A3A] dark:to-[#3A2A4A]",
                icon: "🎯",
              },
            }))
            .slice(0, 10) // Limit to 10 categories

          setCategories(enrichedCategories as CategoryWithGradient[])
          return
        }
      } catch (err) {
        // Silently catch fetch errors
      } finally {
        setLoading(false)
      }
      
      // Fallback to static categories
      setCategories(
        Object.entries(categoryConfig).map(([key, config]) => ({
          id: key,
          name: key
            .split(/[\/-]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          handle: key.replace(/\s+/g, "-").toLowerCase(),
          ...config,
        }))
      )
    }

    fetchCategories()
  }, [])

  const topCategories = categories.slice(0, 6)
  const hasMoreCategories = categories.length > 6

  return (
    <section className={cn("glowhaus-section", className)}>
      <div className="glowhaus-container">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between sm:mb-12 md:mb-14">
          <div className="text-left">
            <h2 className="font-heading text-3xl font-medium sm:text-4xl md:text-5xl text-[var(--color-text)]">
              Shop by Category
            </h2>
            <p className="mt-3 font-body text-sm text-[var(--color-text-muted)] sm:text-base">
              Find exactly what your skin needs
            </p>
          </div>
          {hasMoreCategories && (
            <a
              href="/categories"
              className="whitespace-nowrap font-ui text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-deep)]"
            >
              View All →
            </a>
          )}
        </div>

        {/* Categories Grid */}
        {/* Mobile: 2×N Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:hidden">
            {topCategories.map((cat) => (
              <CategoryTile key={cat.id} category={cat} />
            ))}
          </div>
        )}

        {/* Desktop: 6-Column Grid */}
        {loading ? (
          <div className="hidden md:grid gap-6 grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="hidden md:grid gap-6 grid-cols-3 lg:grid-cols-6">
            {topCategories.map((cat) => (
              <CategoryTile key={cat.id} category={cat} />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-6 text-center text-sm text-red-500">
            Failed to load categories. Using default categories.
          </p>
        )}
      </div>
    </section>
  )
}
