"use client"

import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type MobileCategoriesMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileCategoriesMenu({
  isOpen,
  onClose,
}: MobileCategoriesMenuProps) {
  const [categories, setCategories] = useState<HttpTypes.StoreProductCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  )

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

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#FAF6F0] z-40 transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6 overflow-y-auto">
          {/* Categories Section */}
          <div className="mb-8">
            <h3 className="font-serif text-[#2E1F14] text-lg mb-4">Categories</h3>

            {isLoading ? (
              <div className="text-[#2E1F14]/50 text-sm">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-[#2E1F14]/50 text-sm">
                No categories available
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center justify-between">
                      <LocalizedClientLink
                        href={`/categories/${category.handle}`}
                        onClick={onClose}
                        className="font-sans text-[14px] text-[#3A2820] hover:text-[#C9877A] transition py-2"
                      >
                        {category.name}
                      </LocalizedClientLink>

                      {category.category_children &&
                        category.category_children.length > 0 && (
                          <button
                            onClick={() => toggleExpand(category.id)}
                            className="text-[#2E1F14]/70 hover:text-[#2E1F14] transition p-1"
                            aria-label="Toggle subcategories"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className={`w-4 h-4 transition-transform duration-200 ${
                                expandedCategories.has(category.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </button>
                        )}
                    </div>

                    {/* Subcategories */}
                    {category.category_children &&
                      category.category_children.length > 0 &&
                      expandedCategories.has(category.id) && (
                        <div className="pl-4 space-y-1 mt-1">
                          {category.category_children.map((subcat) => (
                            <LocalizedClientLink
                              key={subcat.id}
                              href={`/categories/${subcat.handle}`}
                              onClick={onClose}
                              className="block font-sans text-[13px] text-[#2E1F14]/70 hover:text-[#C9877A] transition py-1.5"
                            >
                              {subcat.name}
                            </LocalizedClientLink>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                <LocalizedClientLink
                  href="/categories"
                  onClick={onClose}
                  className="block font-sans text-[13px] text-[#C9877A] hover:text-[#2E1F14] transition py-2 border-t border-[#D4B89A]/20 mt-4 pt-4 font-medium"
                >
                  View All Categories
                </LocalizedClientLink>
              </div>
            )}
          </div>

          {/* Other Navigation Links */}
          <div className="space-y-4">
            <LocalizedClientLink
              href="/store"
              onClick={onClose}
              className="block font-serif text-2xl text-[#3A2820] hover:text-[#C9877A] transition"
            >
              Skincare
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              onClick={onClose}
              className="block font-serif text-2xl text-[#3A2820] hover:text-[#C9877A] transition"
            >
              Ingredients
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              onClick={onClose}
              className="block font-serif text-2xl text-[#3A2820] hover:text-[#C9877A] transition"
            >
              Rituals
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              onClick={onClose}
              className="block font-serif text-2xl text-[#3A2820] hover:text-[#C9877A] transition"
            >
              About
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </>
  )
}
