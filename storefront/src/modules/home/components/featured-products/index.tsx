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
  const collection = collections[0]
  if (!collection) {
    return null
  }

  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  const displayProducts = pricedProducts.slice(0, 4)

  return (
    <section className="py-[100px] px-20">
      <div className="flex justify-between items-end mb-14">
        <div>
          <span className="text-[#C9877A] text-[11px] uppercase tracking-[3px] border-l border-[#C9877A] pl-3 mb-4 block">
            Curated for you
          </span>
          <h2 className="font-serif text-[clamp(36px,4vw,52px)] font-light text-[#3A2820]">
            Bestselling Formulas
          </h2>
        </div>
        <Link 
          href={`/collections/${collection.handle}`} 
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
