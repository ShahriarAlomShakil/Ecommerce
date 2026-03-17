"use client"

import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoriesDropdown() {
  const [categories, setCategories] = useState<HttpTypes.StoreProductCategory[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        // Filter root categories only
        const rootCategories = data.filter(
          (cat: HttpTypes.StoreProductCategory) => !cat.parent_category_id
        )
        setCategories(rootCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Categories Button */}
      <LocalizedClientLink
        href="/categories"
        className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#2E1F14]/70 hover:opacity-100 transition flex items-center gap-1"
      >
        Categories
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-3 h-3 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </LocalizedClientLink>

      {/* Dropdown Menu */}
      <div
        className={`absolute left-0 top-full mt-0 w-56 bg-white border border-[#D4B89A]/20 rounded-lg shadow-lg transition-all duration-200 origin-top ${
          isOpen
            ? "opacity-100 visible scale-y-100"
            : "opacity-0 invisible scale-y-95"
        }`}
        style={{
          transformOrigin: "top",
        }}
      >
        {isLoading ? (
          <div className="p-4 text-center text-[#2E1F14]/50 text-sm">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-4 text-center text-[#2E1F14]/50 text-sm">
            No categories available
          </div>
        ) : (
          <div className="py-2 max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id}>
                {/* Main Category */}
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className="block px-4 py-2 text-sm text-[#2E1F14] hover:bg-[#FAF6F0] transition"
                >
                  <span className="font-medium">{category.name}</span>
                </LocalizedClientLink>

                {/* Subcategories */}
                {category.category_children &&
                  category.category_children.length > 0 && (
                    <div className="bg-[#FAF6F0]/50 pl-8">
                      {category.category_children.map((subcat) => (
                        <LocalizedClientLink
                          key={subcat.id}
                          href={`/categories/${subcat.handle}`}
                          className="block px-4 py-1.5 text-xs text-[#2E1F14]/70 hover:text-[#C9877A] hover:bg-white/50 transition"
                        >
                          {subcat.name}
                        </LocalizedClientLink>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Link */}
        {categories.length > 0 && (
          <div className="border-t border-[#D4B89A]/20 py-2">
            <LocalizedClientLink
              href="/categories"
              className="block px-4 py-2 text-xs text-[#C9877A] hover:text-[#2E1F14] transition font-medium"
            >
              View All Categories →
            </LocalizedClientLink>
          </div>
        )}
      </div>
    </div>
  )
}
