"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@lib/utils"

type TestimonialsProps = {
  className?: string
}

type Testimonial = {
  id: number
  quote: string
  reviewer: string
  city: string
  productName: string
  productImage: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "My skin calmed down in just two weeks. The products were authentic, fresh, and exactly what I needed for my routine.",
    reviewer: "Tasnim R.",
    city: "Dhaka",
    productName: "COSRX Advanced Snail 96 Essence",
    productImage:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 2,
    quote:
      "I finally found a cleanser that does not strip my skin. Delivery to Chattogram was quick and packaging felt premium.",
    reviewer: "Farzana I.",
    city: "Chattogram",
    productName: "Innisfree Green Tea Amino Cleanser",
    productImage:
      "https://images.unsplash.com/photo-1526758097130-bab247274f58?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 3,
    quote:
      "The glow after adding this serum was unreal. I get compliments every week and I love how lightweight it feels.",
    reviewer: "Mim N.",
    city: "Sylhet",
    productName: "Torriden Dive-In Serum",
    productImage:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 4,
    quote:
      "This SPF sits beautifully under makeup in Dhaka heat. No white cast, no pilling, just clean hydration.",
    reviewer: "Nusrat A.",
    city: "Dhaka",
    productName: "Beauty of Joseon Relief Sun SPF50+",
    productImage:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 5,
    quote:
      "I was scared to switch routines, but the recommendations were perfect. My redness has visibly reduced.",
    reviewer: "Sadia K.",
    city: "Rajshahi",
    productName: "Klairs Unscented Toner",
    productImage:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 6,
    quote:
      "Original products at fair pricing is hard to find. GlowHaus has become my go-to store for K-beauty restocks.",
    reviewer: "Jannat M.",
    city: "Khulna",
    productName: "Laneige Cream Skin Refiner",
    productImage:
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 7,
    quote:
      "My acne marks started fading after one month. Texture and tone are both better now, and I feel more confident.",
    reviewer: "Raisa T.",
    city: "Narayanganj",
    productName: "Some By Mi Miracle Toner",
    productImage:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 8,
    quote:
      "Customer support helped me pick a routine for sensitive skin. Everything arrived safely and worked as promised.",
    reviewer: "Mahi S.",
    city: "Cumilla",
    productName: "Etude SoonJung 2x Barrier Cream",
    productImage:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 9,
    quote:
      "The hydration boost is immediate. My makeup no longer cracks by midday, and my skin feels balanced all day.",
    reviewer: "Afsana H.",
    city: "Barishal",
    productName: "Hada Labo Gokujyun Lotion",
    productImage:
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=240&q=80",
  },
]

const AUTOPLAY_INTERVAL = 4200

export default function Testimonials({ className }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")

    const updateLayout = () => {
      setIsDesktop(mediaQuery.matches)
    }

    updateLayout()
    mediaQuery.addEventListener("change", updateLayout)

    return () => mediaQuery.removeEventListener("change", updateLayout)
  }, [])

  const cardsPerView = isDesktop ? 3 : 1

  const maxStartIndex = useMemo(
    () => Math.max(testimonials.length - cardsPerView, 0),
    [cardsPerView]
  )

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxStartIndex))
  }, [maxStartIndex])

  useEffect(() => {
    if (maxStartIndex === 0) {
      return
    }

    const autoplay = window.setInterval(() => {
      setActiveIndex((current) => (current >= maxStartIndex ? 0 : current + 1))
    }, AUTOPLAY_INTERVAL)

    return () => window.clearInterval(autoplay)
  }, [maxStartIndex])

  const totalDots = maxStartIndex + 1

  const goPrevious = () => {
    setActiveIndex((current) => (current <= 0 ? maxStartIndex : current - 1))
  }

  const goNext = () => {
    setActiveIndex((current) => (current >= maxStartIndex ? 0 : current + 1))
  }

  return (
    <section className={cn("glowhaus-section pt-0", className)}>
      <div className="glowhaus-container">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <h2 className="font-heading text-3xl leading-tight text-[var(--color-text)] sm:text-4xl">
            Loved by 10,000+ Glowers Across Bangladesh
          </h2>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={goPrevious}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              aria-label="View previous testimonials"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              aria-label="View next testimonials"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${(100 / cardsPerView) * activeIndex}%)` }}
          >
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="relative w-full shrink-0 basis-full px-1 lg:basis-1/3"
              >
                <div className="relative h-full min-h-[290px] rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-[var(--shadow-card)]">
                  <span className="pointer-events-none absolute -left-1 top-1 font-display text-[88px] leading-none text-[var(--color-primary)] opacity-10">
                    “
                  </span>

                  <div className="relative z-10 flex h-full flex-col gap-5">
                    <div className="flex items-center gap-1 text-[var(--color-accent)]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={15} fill="currentColor" strokeWidth={1.8} />
                      ))}
                    </div>

                    <p className="font-display text-xl italic leading-relaxed text-[var(--color-text)]">
                      {item.quote}
                    </p>

                    <div className="mt-auto space-y-3">
                      <p className="font-ui text-sm font-medium tracking-wide text-[var(--color-text)]">
                        {item.reviewer} — {item.city}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-[10px] border border-[var(--color-border)]">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {item.productName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 sm:mt-7">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2.5 rounded-full border border-[var(--color-border)] transition",
                index === activeIndex
                  ? "w-7 bg-[var(--color-primary)]"
                  : "w-2.5 bg-transparent hover:border-[var(--color-primary)]"
              )}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={goPrevious}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            aria-label="View previous testimonials"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            aria-label="View next testimonials"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
