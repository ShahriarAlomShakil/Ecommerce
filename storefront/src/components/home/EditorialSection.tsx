"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { cn } from "@lib/utils"

// ── Feature row data ──────────────────────────────────────────────────────────
interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

function IconLayers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function IconLeaf() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function IconFlask() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M9 3h6v11l4 6H5l4-6V3z" />
      <line x1="6" y1="14" x2="18" y2="14" />
    </svg>
  )
}

const features: Feature[] = [
  {
    icon: <IconLayers />,
    title: "Multi-step routines",
    description:
      "Layer essences, serums, and emulsions to build a personalised regimen that works synergistically.",
  },
  {
    icon: <IconLeaf />,
    title: "Gentle, skin-first formulas",
    description:
      "K-beauty prioritises barrier health — low-pH cleansers, soothing actives, and zero unnecessary irritants.",
  },
  {
    icon: <IconFlask />,
    title: "Clinical-grade ingredients",
    description:
      "Niacinamide, centella asiatica, snail mucin — backed by dermatological research and time-tested results.",
  },
]

// Framer Motion v12: cubicBezier must be a typed 4-element tuple
const SPRING_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ── Component ─────────────────────────────────────────────────────────────────
interface EditorialSectionProps {
  className?: string
}

export default function EditorialSection({ className }: EditorialSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-20% 0px" })

  return (
    <section
      ref={sectionRef}
      className={cn("relative overflow-hidden bg-[var(--color-bg)]", className)}
      aria-label="Editorial — Why K-Beauty"
    >
      <div className="flex flex-col lg:flex-row min-h-[560px] lg:min-h-[640px] xl:min-h-[700px]">

        {/* ── LEFT: Image panel (45%) ─────────────────────────────────────── */}
        <motion.div
          className="relative w-full lg:w-[45%] min-h-[340px] lg:min-h-full"
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 0.85, ease: SPRING_EASE }}
        >
          <Image
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&h=1100&fit=crop&q=80"
            alt="Korean skincare flat-lay — layered toners, essences and serums arranged on marble"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover object-center"
            priority={false}
          />

          {/* Light mode: warm tint  |  Dark mode: deep moody overlay */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-300",
              "bg-gradient-to-br from-[rgba(242,167,179,0.12)] to-[rgba(44,44,44,0.04)]",
              "dark:from-[rgba(20,10,15,0.65)] dark:to-[rgba(60,20,35,0.45)]"
            )}
            aria-hidden="true"
          />

          {/* Floating badge — bottom-left, desktop only */}
          <div className="absolute bottom-6 left-6 hidden lg:flex items-center gap-2
            bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-sm
            rounded-[var(--radius-btn)] px-4 py-2 shadow-[var(--shadow-card)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <span className="font-ui text-[11px] uppercase tracking-widest text-[var(--color-text)]">
              Est. Dhaka, Bangladesh
            </span>
          </div>
        </motion.div>

        {/* ── RIGHT: Content panel (55%) ──────────────────────────────────── */}
        <motion.div
          className={cn(
            "relative flex flex-col justify-center w-full lg:w-[55%]",
            "px-6 py-12 sm:px-10 lg:px-16 xl:px-20",
            "bg-[var(--color-surface)]"
          )}
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 0.85, ease: SPRING_EASE, delay: 0.15 }}
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72
            rounded-full bg-[var(--color-primary)] opacity-[0.06] blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-16 left-8 w-48 h-48
            rounded-full bg-[var(--color-secondary)] opacity-[0.07] blur-2xl" aria-hidden="true" />

          {/* Eyebrow */}
          <p className="font-ui text-[11px] font-medium uppercase tracking-[0.22em]
            text-[var(--color-primary)] mb-4">
            Why K-Beauty?
          </p>

          {/* Headline */}
          <h2
            className="font-display font-light leading-[1.15] mb-6
              text-[clamp(2rem,4vw,3rem)] text-[var(--color-text)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Science Behind
            <br />
            <em className="not-italic font-semibold text-[var(--color-primary-deep)] dark:text-[var(--color-primary)]">
              Glass Skin
            </em>
          </h2>

          {/* Body copy */}
          <div className="space-y-4 mb-8 max-w-[520px]">
            <p className="font-body text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
              Korean skincare is not just a routine — it&apos;s a philosophy built on
              patience, layering, and respect for the skin&apos;s natural barrier.
              Rather than stripping or over-treating, K-beauty teaches you to
              listen to your skin and respond with targeted, gentle care.
            </p>
            <p className="font-body text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
              The iconic 10-step routine is less about product count and more
              about the principle of{" "}
              <span className="text-[var(--color-text)] font-medium">
                layering from lightest to heaviest
              </span>
              . Each step preps the skin for the next, amplifying ingredient
              absorption and locking in hydration for that coveted glass-skin
              luminosity.
            </p>
            <p className="font-body text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
              At GlowHaus BD, every product is sourced directly from authentic
              Korean and international brands — so you get the real science, not
              imitations.
            </p>
          </div>

          {/* Feature rows */}
          <ul className="space-y-4 mb-10" role="list">
            {features.map((feat, i) => (
              <motion.li
                key={feat.title}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.12, ease: "easeOut" as const }}
              >
                <span className="flex-shrink-0 mt-0.5 w-10 h-10 flex items-center justify-center
                  rounded-full bg-[var(--color-primary)] bg-opacity-[0.12]
                  text-[var(--color-primary-deep)] dark:text-[var(--color-primary)]
                  shadow-[var(--shadow-card)]" aria-hidden="true">
                  {feat.icon}
                </span>
                <div>
                  <p className="font-ui text-[0.9rem] font-medium text-[var(--color-text)] leading-snug">
                    {feat.title}
                  </p>
                  <p className="font-body text-[0.8125rem] text-[var(--color-text-muted)] leading-relaxed mt-0.5">
                    {feat.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          {/* Divider */}
          <div className="w-16 h-px bg-[var(--color-border)] mb-8" aria-hidden="true" />

          {/* CTA */}
          <Link
            href="/blog/skincare-guide"
            className={cn(
              "group inline-flex items-center gap-2 self-start",
              "font-ui text-[0.9375rem] font-medium",
              "text-[var(--color-text)] hover:text-[var(--color-primary-deep)]",
              "dark:hover:text-[var(--color-primary)]",
              "transition-colors duration-200",
              "border-b border-[var(--color-primary)] pb-0.5",
              "hover:border-[var(--color-primary-deep)] dark:hover:border-[var(--color-primary)]"
            )}
          >
            Read Our Skincare Guide
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
