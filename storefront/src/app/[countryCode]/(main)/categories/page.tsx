import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InteractiveLink from "@modules/common/components/interactive-link"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Categories | Medusa Store",
  description: "Browse our product categories",
}

export default async function CategoriesPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const categories = await listCategories()

  if (!categories) {
    return (
      <div className="flex flex-col items-center justify-center py-12 content-container">
        <p className="text-ui-fg-subtle">No categories found</p>
      </div>
    )
  }

  // Filter for root categories (no parent)
  const rootCategories = categories.filter(
    (cat: HttpTypes.StoreProductCategory) => !cat.parent_category_id
  )

  return (
    <div className="py-6 content-container">
      <div className="mb-8">
        <h1 className="text-3xl-semi mb-4">Categories</h1>
        <p className="text-base-regular text-ui-fg-subtle">
          Explore our product categories
        </p>
      </div>

      {rootCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-ui-fg-subtle">No categories available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rootCategories.map((category: HttpTypes.StoreProductCategory) => (
            <div
              key={category.id}
              className="border border-ui-border-base rounded-lg p-6 hover:border-ui-border-interactive transition-colors"
            >
              <div className="mb-4">
                <h2 className="text-xl-semi mb-2">{category.name}</h2>
                {category.description && (
                  <p className="text-base-regular text-ui-fg-subtle truncate">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <InteractiveLink href={`/categories/${category.handle}`}>
                  View Category
                </InteractiveLink>
                {category.category_children && category.category_children.length > 0 && (
                  <span className="text-sm text-ui-fg-subtle">
                    {category.category_children.length} subcategories
                  </span>
                )}
              </div>

              {category.category_children && category.category_children.length > 0 && (
                <div className="mt-4 pt-4 border-t border-ui-border-base">
                  <p className="text-sm text-ui-fg-subtle mb-2">Subcategories:</p>
                  <ul className="space-y-1">
                    {category.category_children.slice(0, 3).map((child) => (
                      <li key={child.id}>
                        <InteractiveLink
                          href={`/categories/${child.handle}`}
                          className="text-sm"
                        >
                          {child.name}
                        </InteractiveLink>
                      </li>
                    ))}
                    {category.category_children.length > 3 && (
                      <li className="text-sm text-ui-fg-subtle">
                        +{category.category_children.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
