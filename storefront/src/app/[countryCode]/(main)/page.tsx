import { Metadata } from "next"
import BrandStrip from "@components/home/BrandStrip"
import CategoryShowcase from "@components/home/CategoryShowcase"
import FeaturedProducts from "@components/home/FeaturedProducts"
import HeroBanner from "@components/home/HeroBanner"
import PromoBanner from "@components/home/PromoBanner"
import SkinConcernFinder from "@components/home/SkinConcernFinder"
import TrendingNow from "@components/home/TrendingNow"
import EditorialSection from "@components/home/EditorialSection"
import Testimonials from "@components/home/Testimonials"

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

      {/* Trending Now Tab Grid */}
      <TrendingNow />

      {/* Editorial Story — Why K-Beauty */}
      <EditorialSection />

      {/* Skin Concern Finder */}
      <SkinConcernFinder />

      {/* Reviews / Testimonials */}
      <Testimonials />
    </>
  )
}
