"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@lib/utils"

type PromoBannerProps = {
  className?: string
}

const tileBaseClass =
  "group relative flex min-h-[280px] overflow-hidden rounded-[var(--radius-card)] px-6 py-7 shadow-[var(--shadow-card)] transition-transform duration-300 hover:scale-[1.01] hover:shadow-[var(--shadow-hover)] sm:px-8 sm:py-8"

export default function PromoBanner({ className }: PromoBannerProps) {
  return (
    <section className={cn("glowhaus-section pt-0", className)}>
      <div className="glowhaus-container">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.article
            className={cn(
              tileBaseClass,
              "bg-[linear-gradient(135deg,#F9D4DC_0%,#FDF0F2_100%)] dark:bg-[linear-gradient(135deg,#2A1A1F_0%,#3A2228_100%)]"
            )}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="z-10 flex max-w-[62%] flex-col justify-center gap-3 pr-4 sm:max-w-[58%]">
              <p className="font-ui text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-primary-deep)] dark:text-[#f6c4cf]">
                Just Arrived 🌸
              </p>
              <h3 className="font-heading text-3xl leading-tight text-[var(--color-text)] sm:text-4xl">
                Fresh From Korea
              </h3>
              <a
                href="/shop?collection=new-arrivals"
                className="font-ui text-sm font-medium text-[var(--color-text)] underline-offset-4 transition hover:underline"
              >
                Shop New In →
              </a>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 w-[44%]">
              <Image
                src="https://images.unsplash.com/photo-1526758097130-bab247274f58?auto=format&fit=crop&w=900&q=80"
                alt="Korean skincare flat-lay products"
                fill
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 34vw, 24vw"
                className="object-cover object-center"
              />
            </div>
          </motion.article>

          <motion.article
            className={cn(
              tileBaseClass,
              "bg-[linear-gradient(135deg,#D4EDD6_0%,#EAF5EA_100%)] dark:bg-[linear-gradient(135deg,#1A2E1C_0%,#22382A_100%)]"
            )}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="z-10 flex max-w-[62%] flex-col justify-center gap-3 pr-4 sm:max-w-[58%]">
              <p className="font-ui text-xs font-medium uppercase tracking-[0.14em] text-[#2c6f42] dark:text-[#b8e3c0]">
                Up to 40% Off 🌿
              </p>
              <h3 className="font-heading text-3xl leading-tight text-[var(--color-text)] sm:text-4xl">
                Limited Time Deals
              </h3>
              <a
                href="/shop?sale=true"
                className="font-ui text-sm font-medium text-[var(--color-text)] underline-offset-4 transition hover:underline"
              >
                Grab Deals →
              </a>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 grid w-[44%] grid-rows-2 gap-2 p-2 sm:p-3">
              <div className="relative overflow-hidden rounded-[10px]">
                <Image
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80"
                  alt="Sale skincare product collage image one"
                  fill
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 34vw, 24vw"
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-[10px]">
                <Image
                  src="https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=80"
                  alt="Sale skincare product collage image two"
                  fill
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 34vw, 24vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}