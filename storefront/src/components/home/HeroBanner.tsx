"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import AutoPlay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@lib/utils"

interface HeroBannerProps {
  className?: string
}

export default function HeroBanner({ className }: HeroBannerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [AutoPlay({ delay: 5000, stopOnInteraction: false })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedIndex)
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    onSelect()
    return () => emblaApi.off("select", onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const slides = [
    { id: 1, type: "split" as const },
    { id: 2, type: "full-overlay" as const },
    { id: 3, type: "grid" as const },
  ]

  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      {/* Embla Container */}
      <div ref={emblaRef} className="w-full overflow-hidden">
        <div className="flex">
          {/* Slide 1: 60/40 Split Layout */}
          <div className="min-w-full flex-shrink-0">
            <HeroSlide1 />
          </div>

          {/* Slide 2: Full-width Overlay */}
          <div className="min-w-full flex-shrink-0">
            <HeroSlide2 />
          </div>

          {/* Slide 3: Grid Layout */}
          <div className="min-w-full flex-shrink-0">
            <HeroSlide3 />
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Desktop only) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6 md:pointer-events-auto">
        <button
          className={cn(
            "pointer-events-auto p-3 rounded-full transition-all",
            "hidden md:flex items-center justify-center",
            "bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60",
            "text-black dark:text-white",
            !canScrollPrev && "opacity-50 cursor-not-allowed"
          )}
          onClick={scrollPrev}
          disabled={!canScrollPrev}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          className={cn(
            "pointer-events-auto p-3 rounded-full transition-all",
            "hidden md:flex items-center justify-center",
            "bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60",
            "text-black dark:text-white",
            !canScrollNext && "opacity-50 cursor-not-allowed"
          )}
          onClick={scrollNext}
          disabled={!canScrollNext}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            initial={{ opacity: 0.4, width: "8px" }}
            animate={{
              opacity: index === selectedIndex ? 1 : 0.4,
              width: index === selectedIndex ? "24px" : "8px",
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "h-2 rounded-full transition-colors",
              index === selectedIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * Slide 1: 60% Text / 40% Image Split Layout
 */
function HeroSlide1() {
  return (
    <div className="w-full min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-stretch">
      {/* Left Content Panel (60% on desktop, 100% on mobile) */}
      <div className="w-full md:w-3/5 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-0 order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 dark:bg-secondary/15 text-secondary dark:text-secondary border border-secondary/30">
              <span className="text-sm font-medium uppercase tracking-wider font-ui">
                New Collection 2025
              </span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-[72px] font-display font-light leading-tight text-text dark:text-text"
          >
            Glass Skin Starts Here
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-text-muted dark:text-text-muted max-w-md"
          >
            Discover authentic COSRX, Laneige & more — delivered across Bangladesh
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button className="px-8 py-3 rounded-full bg-primary dark:bg-primary text-white dark:text-white font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95">
              Shop Now
            </button>
            <button className="px-8 py-3 rounded-full border-2 border-primary dark:border-primary text-primary dark:text-primary font-medium transition-all hover:bg-primary/5 dark:hover:bg-primary/10 active:scale-95">
              Explore Brands
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Image Panel (40% on desktop, 100% on mobile) */}
      <div className="w-full md:w-2/5 relative h-80 md:h-auto order-1 md:order-2 overflow-hidden">
        <>
          {/* Placeholder Image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-secondary/20 dark:from-primary/30 dark:to-secondary/15">
            <img
              src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop"
              alt="Glass Skin Product"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/20 dark:to-primary/10 pointer-events-none" />

          {/* Soft Peach/Pink Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-[#F2A7B3]/15 dark:from-[#FF8FA3]/10 to-transparent pointer-events-none" />
        </>
      </div>
    </div>
  )
}

/**
 * Slide 2: Full-width Overlay with Centered Text
 */
function HeroSlide2() {
  return (
    <div className="w-full min-h-[600px] md:min-h-[700px] lg:min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&h=800&fit=crop"
          alt="Korean Beauty"
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50 dark:from-black/50 dark:via-black/60 dark:to-black/70" />
      </div>

      {/* Centered Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative text-center px-6 z-10"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-light text-white mb-4">
          Korean Beauty <span className="text-primary">✦</span> Redefined for Bangladesh
        </h2>
      </motion.div>
    </div>
  )
}

/**
 * Slide 3: Grid Layout - Text Left, 2 Product Images Right
 */
function HeroSlide3() {
  return (
    <div className="w-full min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-stretch">
      {/* Left Text Content */}
      <div className="w-full md:w-1/2 bg-surface dark:bg-surface flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-0 order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6 max-w-md"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent/20 dark:bg-accent/15 text-accent dark:text-accent border border-accent/30">
              <span className="text-sm font-medium uppercase tracking-wider font-ui">
                Summer Essentials
              </span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-light leading-tight text-text dark:text-text"
          >
            Your Summer SPF Edit
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-base text-text-muted dark:text-text-muted"
          >
            Protect your glass skin this summer with our curated collection of Korean and Japanese sunscreens. Lightweight, hydrating, and invisible finishes for daily wear.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="pt-4"
          >
            <button className="px-8 py-3 rounded-full bg-primary dark:bg-primary text-white dark:text-white font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95">
              Shop SPF Collection
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Image Grid (2 stacked images) */}
      <div className="w-full md:w-1/2 grid grid-rows-2 gap-6 p-6 md:p-12 order-1 md:order-2 bg-bg dark:bg-bg">
        {/* Top Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-lg"
        >
          <img
              src="https://images.unsplash.com/photo-1585314063955-b76191c69a37?w=600&h=300&fit=crop"
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-lg"
        >
          <img
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=300&fit=crop"
            alt="Sunscreen Product 2"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </div>
    </div>
  )
}
