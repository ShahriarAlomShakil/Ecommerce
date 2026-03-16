import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import MarqueeStrip from "@modules/home/components/marquee-strip"
import BrandValues from "@modules/home/components/brand-values"
import Newsletter from "@modules/home/components/newsletter"
import ScrollReveal from "../../../components/scroll-reveal"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <ScrollReveal />
      <Hero />
      <MarqueeStrip />
      
      <div className="reveal-section">
        <FeaturedProducts collections={collections} region={region} />
      </div>

      <div className="reveal-section">
        <BrandValues />
      </div>

      <div className="reveal-section">
        <Newsletter />
      </div>
    </>
  )
}
