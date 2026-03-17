import { Metadata } from "next"
import HeroBanner from "@components/home/HeroBanner"

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

      {/* Placeholder for upcoming sections */}
      <section className="glowhaus-container py-16">
        <div className="rounded-card border border-border bg-bg-card p-6 text-center text-sm text-muted">
          🏗️ More sections coming soon: Brand Strip, Categories, Featured Products, and more...
        </div>
      </section>
    </>
  )
}
