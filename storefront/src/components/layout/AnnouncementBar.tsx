"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const ANNOUNCEMENTS = [
  "🌸 Free Shipping on orders above ৳1500",
  "✨ 100% Authentic Korean & Foreign Skincare",
  "🎁 New COSRX & Laneige arrivals just dropped",
]

const STORAGE_KEY = "glowhaus-announcement-dismissed"
const HIDE_DURATION_MS = 24 * 60 * 60 * 1000
const ROTATION_MS = 4000

export default function AnnouncementBar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const dismissedUntil = localStorage.getItem(STORAGE_KEY)

    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      setDismissed(true)
      return
    }

    if (dismissedUntil) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (dismissed) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % ANNOUNCEMENTS.length)
    }, ROTATION_MS)

    return () => window.clearInterval(timer)
  }, [dismissed])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + HIDE_DURATION_MS))
    setDismissed(true)
  }

  const currentMessage = useMemo(() => ANNOUNCEMENTS[activeIndex], [activeIndex])

  if (dismissed) {
    return null
  }

  return (
    <div className="relative border-b border-border bg-primary px-10 py-2 dark:bg-surface">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center">
        <div className="min-h-5 w-full overflow-hidden text-center font-ui text-xs leading-5 text-[var(--color-text)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="mx-auto max-w-3xl"
            >
              {currentMessage}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement bar"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--color-text)] transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)]"
      >
        <X size={14} />
      </button>
    </div>
  )
}