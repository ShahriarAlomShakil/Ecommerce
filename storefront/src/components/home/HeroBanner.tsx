"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@lib/utils"

interface HeroBannerProps {
  className?: string
}

interface HeroSlide {
  id: number
  badge: string
  title: string
  description: string
  cta: string
  backgroundClass: string
  productImage: string
  productAlt: string
}

interface ParticleSeed {
  top: string
  left: string
  size: number
  x: number
  y: number
  delay: number
  duration: number
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    badge: "HEALTHIER HAIR STARTS",
    title: "Save Up To 30%",
    description:
      "Removes dirt, excess oil, and makeup for deep cleansing. Provides moisture to help soften.",
    cta: "Shop Now",
    backgroundClass: "bg-[#eed0c8] dark:bg-[#2b1f21]",
    productImage:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1100&h=900&fit=crop",
    productAlt: "Hair care products",
  },
  {
    id: 2,
    badge: "GLOW FROM WITHIN",
    title: "Nourish, Hydrate",
    description:
      "Cleanse first with a specialized makeup remover or makeup remover wax to remove impurities.",
    cta: "Shop Now",
    backgroundClass: "bg-[#e7dece] dark:bg-[#20262d]",
    productImage:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1100&h=900&fit=crop",
    productAlt: "Hydrating skincare products",
  },
  {
    id: 3,
    badge: "SHINE CONFIDENTLY",
    title: "Just Enhanced",
    description:
      "Advanced manufacturing technology with a light formula for soft lips and naturally smooth glow.",
    cta: "Shop Now",
    backgroundClass: "bg-[#f3c4c8] dark:bg-[#2f1d2a]",
    productImage:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1100&h=900&fit=crop",
    productAlt: "Beauty model and product",
  },
]

const AUTOPLAY_DELAY = 5000

const particleSeeds: ParticleSeed[] = [
  { top: "12%", left: "16%", size: 8, x: -36, y: -22, delay: 0.02, duration: 0.8 },
  { top: "20%", left: "72%", size: 6, x: 32, y: -18, delay: 0.08, duration: 0.72 },
  { top: "38%", left: "28%", size: 10, x: -42, y: 18, delay: 0.04, duration: 0.84 },
  { top: "44%", left: "82%", size: 7, x: 40, y: 24, delay: 0.12, duration: 0.76 },
  { top: "58%", left: "14%", size: 9, x: -30, y: 28, delay: 0.1, duration: 0.82 },
  { top: "64%", left: "62%", size: 5, x: 24, y: 38, delay: 0.16, duration: 0.7 },
  { top: "74%", left: "34%", size: 8, x: -18, y: 32, delay: 0.14, duration: 0.78 },
  { top: "82%", left: "78%", size: 6, x: 28, y: 22, delay: 0.2, duration: 0.68 },
  { top: "26%", left: "48%", size: 4, x: 0, y: -34, delay: 0.06, duration: 0.66 },
  { top: "52%", left: "50%", size: 11, x: 0, y: 0, delay: 0.18, duration: 0.9 },
]

const dissolveVariants = {
  initial: {
    opacity: 0,
    scale: 0.985,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 1.015,
    filter: "blur(12px)",
  },
}

export default function HeroBanner({ className }: HeroBannerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSelectedIndex((current) => (current + 1) % heroSlides.length)
    }, AUTOPLAY_DELAY)

    return () => window.clearInterval(interval)
  }, [])

  const activeSlide = heroSlides[selectedIndex]

  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      <div
        className={cn(
          "relative min-h-[540px] transition-colors duration-700 md:min-h-[620px] lg:min-h-[660px]",
          activeSlide.backgroundClass
        )}
      >
        <div className="absolute inset-0 hidden dark:block dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_30%)]" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="relative z-10 mx-auto grid min-h-[540px] max-w-[1440px] grid-cols-1 items-center gap-6 px-5 py-10 md:min-h-[620px] md:grid-cols-2 md:px-12 lg:min-h-[660px] lg:px-16"
          >
            <motion.div
              variants={dissolveVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, delay: 0.06, ease: "easeInOut" }}
              className="relative max-w-[520px] space-y-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#4f4a46] dark:text-white/70">
                {activeSlide.badge}
              </p>

              <h1 className="font-display text-5xl leading-[1.05] text-[#2f2926] dark:text-white md:text-6xl lg:text-7xl">
                {activeSlide.title}
              </h1>

              <p className="max-w-md text-sm leading-7 text-[#5d5652] dark:text-white/70 md:text-base">
                {activeSlide.description}
              </p>

              <button className="rounded-full bg-white px-8 py-3 text-sm font-medium uppercase tracking-wide text-[#2f2926] transition hover:bg-white/90 dark:bg-white/10 dark:text-white dark:ring-1 dark:ring-white/20 dark:hover:bg-white/16">
                {activeSlide.cta}
              </button>

              <DissolveParticles tone="dark" />
            </motion.div>

            <motion.div
              variants={dissolveVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.68, delay: 0.14, ease: "easeInOut" }}
              className="relative hidden self-end justify-self-end md:block"
            >
              <img
                src={activeSlide.productImage}
                alt={activeSlide.productAlt}
                className="h-[430px] w-[470px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)] lg:h-[520px] lg:w-[560px]"
              />

              <DissolveParticles tone="light" className="inset-[10%]" />
            </motion.div>

            <motion.div
              variants={dissolveVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.58, delay: 0.12, ease: "easeInOut" }}
              className="relative mx-auto mt-2 block md:hidden"
            >
              <img
                src={activeSlide.productImage}
                alt={activeSlide.productAlt}
                className="h-[210px] w-[260px] object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_20px_38px_rgba(0,0,0,0.42)]"
              />

              <DissolveParticles tone="light" className="inset-[8%]" />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3 md:bottom-8">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "h-2.5 w-2.5 rounded-full border border-white/90 transition dark:border-white/40",
                index === selectedIndex
                  ? "bg-white dark:bg-white"
                  : "bg-white/40 hover:bg-white/70 dark:bg-white/15 dark:hover:bg-white/35"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function DissolveParticles({
  tone,
  className,
}: {
  tone: "light" | "dark"
  className?: string
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particleSeeds.map((particle, index) => (
        <motion.span
          key={`${tone}-${index}`}
          className={cn(
            "absolute rounded-full blur-[1px]",
            tone === "light"
              ? "bg-white/70 dark:bg-white/60"
              : "bg-[#6f625b]/35 dark:bg-white/28"
          )}
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          initial={{
            opacity: 0,
            x: particle.x,
            y: particle.y,
            scale: 0.3,
          }}
          animate={{
            opacity: [0, 0.9, 0],
            x: [particle.x, particle.x * 0.32, 0],
            y: [particle.y, particle.y * 0.32, 0],
            scale: [0.2, 1, 0.45],
          }}
          exit={{
            opacity: [0, 0.9, 0],
            x: [0, particle.x * 0.38, particle.x],
            y: [0, particle.y * 0.38, particle.y],
            scale: [0.4, 1, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
