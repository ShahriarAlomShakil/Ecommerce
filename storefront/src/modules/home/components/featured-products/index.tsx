import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import Link from "next/link"
import SkincareProductCard from "@modules/home/components/product-card-skin"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  // Let's fetch all products without locking to a single collection
  // so that any 4 products in the store will show up on the homepage.
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      fields: "*variants.calculated_price",
      limit: 4,
    },
  })

  // We can still use the first collection link for the "View all" button, 
  // or default to "/store" if no collections exist.
  const collection = collections && collections[0]
  const viewAllLink = collection ? `/collections/${collection.handle}` : "/store"

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  const displayProducts = pricedProducts.slice(0, 4)

  return (
    <section className="py-12 md:py-[100px] px-6 md:px-12 lg:px-20">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0 mb-10 md:mb-14">
        <div>
          <span className="text-[#C9877A] text-[11px] uppercase tracking-[3px] border-l border-[#C9877A] pl-3 mb-4 block">
            Curated for you
          </span>
          <h2 className="font-serif text-[clamp(36px,4vw,52px)] font-light text-[#3A2820]">
            Bestselling Formulas
          </h2>
        </div>
        <Link 
          href={viewAllLink} 
          className="text-[12px] uppercase tracking-[2px] text-[#2E1F14]/50 hover:text-[#C9877A] mb-3 transition"
        >
          View all products &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <SkincareProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
