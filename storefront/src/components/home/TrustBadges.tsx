"use client"

import { motion } from "framer-motion"
import {
  BadgeCheck,
  MessageCircleMore,
  RefreshCw,
  Truck,
  WalletCards,
} from "lucide-react"
import { cn } from "@lib/utils"

type TrustBadgesProps = {
  className?: string
}

type TrustItem = {
  icon: typeof BadgeCheck
  label: string
  description: string
}

const trustItems: TrustItem[] = [
  {
    icon: BadgeCheck,
    label: "100% Authentic Products",
    description: "Sourced directly from Korean brands",
  },
  {
    icon: Truck,
    label: "Nationwide Delivery",
    description: "Dhaka: 24–48hrs, Outside: 3–5 days",
  },
  {
    icon: WalletCards,
    label: "Cash on Delivery",
    description: "Available across Bangladesh",
  },
  {
    icon: RefreshCw,
    label: "Easy Returns",
    description: "7-day hassle-free return policy",
  },
  {
    icon: MessageCircleMore,
    label: "Expert Support",
    description: "Skincare consultation via WhatsApp",
  },
]

export default function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <section className={cn("glowhaus-section bg-[var(--color-surface)]", className)}>
      <div className="glowhaus-container">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-6 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-[var(--color-border)]">
          {trustItems.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "flex h-full flex-col rounded-[var(--radius-card)] p-4 sm:p-5 lg:rounded-none lg:px-6 lg:py-7",
                  "border border-[var(--color-border)] bg-[var(--color-bg-card)] lg:border-0 lg:bg-transparent",
                  "md:col-span-2 lg:col-span-1",
                  index === 3 && "md:col-start-2 lg:col-start-auto",
                  index === 4 && "md:col-start-4 lg:col-start-auto"
                )}
              >
                <span
                  className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-primary-deep)] dark:text-[var(--color-primary)]"
                  aria-hidden="true"
                >
                  <Icon size={32} strokeWidth={1.8} />
                </span>

                <h3 className="font-ui text-sm font-semibold text-[var(--color-text)]">
                  {item.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}