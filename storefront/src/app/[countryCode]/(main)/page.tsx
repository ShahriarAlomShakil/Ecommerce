import { Metadata } from "next"
import BrandStrip from "@components/home/BrandStrip"
import CategoryShowcase from "@components/home/CategoryShowcase"
import FeaturedProducts from "@components/home/FeaturedProducts"
import HeroBanner from "@components/home/HeroBanner"
import PromoBanner from "@components/home/PromoBanner"

export const metadata: Metadata = {
  title: "GlowHaus BD - Korean Skincare for Bangladesh",
  description: "Shop authentic Korean and foreign skincare products delivered across Bangladesh. Premium brands like COSRX, Laneige, Innisfree, and more.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  await props.params

  return (
    <>
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Brand Logo Strip */}
      <BrandStrip />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Promotional Split Banner */}
      <PromoBanner />

      {/* Placeholder for upcoming sections */}
      <section className="glowhaus-container py-16">
        <div className="rounded-card border border-border bg-bg-card p-6 text-center text-sm text-muted">
          🏗️ More sections coming soon: Trending Now, Editorial Story, and more...
        </div>
      </section>
    </>
  )
}
