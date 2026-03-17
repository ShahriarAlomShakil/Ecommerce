"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { cn } from "@lib/utils"

type SkinType = "oily" | "dry" | "combination" | "sensitive" | "normal"
type Concern =
  | "acne"
  | "dark_spots"
  | "dullness"
  | "aging"
  | "hydration"
  | "pores"
  | "redness"

type SkinConcernFinderProps = {
  className?: string
}

const skinTypeOptions: { value: SkinType; label: string; icon: string }[] = [
  { value: "oily", label: "Oily", icon: "💧" },
  { value: "dry", label: "Dry", icon: "🌵" },
  { value: "combination", label: "Combination", icon: "⚖️" },
  { value: "sensitive", label: "Sensitive", icon: "🫧" },
  { value: "normal", label: "Normal", icon: "🌿" },
]

const concernOptions: { value: Concern; label: string }[] = [
  { value: "acne", label: "Acne" },
  { value: "dark_spots", label: "Dark Spots" },
  { value: "dullness", label: "Dullness" },
  { value: "aging", label: "Aging" },
  { value: "hydration", label: "Hydration" },
  { value: "pores", label: "Pores" },
  { value: "redness", label: "Redness" },
]

const transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

export default function SkinConcernFinder({ className }: SkinConcernFinderProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [skinType, setSkinType] = useState<SkinType | null>(null)
  const [concerns, setConcerns] = useState<Concern[]>([])

  const selectedConcernsText = useMemo(() => {
    if (concerns.length === 0) {
      return "None selected"
    }

    return concernOptions
      .filter((option) => concerns.includes(option.value))
      .map((option) => option.label)
      .join(", ")
  }, [concerns])

  const toggleConcern = (concern: Concern) => {
    setConcerns((current) =>
      current.includes(concern)
        ? current.filter((item) => item !== concern)
        : [...current, concern]
    )
  }

  const handleSubmit = () => {
    if (!skinType) {
      return
    }

    const params = new URLSearchParams()
    params.set("skin_type", skinType)

    if (concerns.length > 0) {
      params.set("concern", concerns.join(","))
    }

    router.push(`/shop?${params.toString()}`)
  }

  return (
    <section className={cn("glowhaus-section", className)}>
      <div className="glowhaus-container">
        <div
          className="mx-auto w-full max-w-[720px] rounded-[var(--radius-card)] border border-border
            bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8"
        >
          <h2 className="text-center font-heading text-3xl text-[var(--color-text)] sm:text-4xl">
            Find Your Routine
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-sm text-muted sm:text-base">
            Tell us your skin type and concerns — we&apos;ll find your perfect products
          </p>

          <div className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
            {[1, 2, 3].map((index) => (
              <span
                key={index}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-300",
                  step === index ? "w-6 bg-primary" : "bg-[var(--color-border)]"
                )}
              />
            ))}
          </div>

          <div className="relative mt-8 min-h-[260px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={transition}
                  className="space-y-6"
                >
                  <p className="text-center font-ui text-xs font-medium uppercase tracking-[0.14em] text-muted">
                    Step 1 — Select Your Skin Type
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {skinTypeOptions.map((option) => {
                      const selected = skinType === option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSkinType(option.value)}
                          className={cn(
                            "flex items-center justify-center gap-2 rounded-btn border px-4 py-3 text-sm",
                            "font-ui transition-all duration-200",
                            selected
                              ? "border-transparent bg-primary text-white"
                              : "border-border bg-[var(--color-bg-card)] text-[var(--color-text)] hover:border-primary"
                          )}
                        >
                          <span aria-hidden="true">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!skinType}
                      onClick={() => setStep(2)}
                      className={cn(
                        "rounded-btn px-6 py-2.5 font-ui text-sm font-medium transition",
                        skinType
                          ? "bg-primary text-white hover:bg-[var(--color-primary-deep)]"
                          : "cursor-not-allowed bg-[var(--color-border)] text-muted"
                      )}
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={transition}
                  className="space-y-6"
                >
                  <p className="text-center font-ui text-xs font-medium uppercase tracking-[0.14em] text-muted">
                    Step 2 — Select Skin Concerns
                  </p>

                  <div className="flex flex-wrap justify-center gap-2.5">
                    {concernOptions.map((option) => {
                      const selected = concerns.includes(option.value)

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleConcern(option.value)}
                          className={cn(
                            "rounded-btn border px-4 py-2 text-sm font-ui transition-all duration-200",
                            selected
                              ? "border-transparent bg-primary text-white"
                              : "border-border bg-[var(--color-bg-card)] text-[var(--color-text)] hover:border-primary"
                          )}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-btn border border-border px-5 py-2.5 font-ui text-sm text-[var(--color-text)] transition hover:border-primary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="rounded-btn bg-primary px-6 py-2.5 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-primary-deep)]"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={transition}
                  className="space-y-6"
                >
                  <p className="text-center font-ui text-xs font-medium uppercase tracking-[0.14em] text-muted">
                    Step 3 — Get Your Routine
                  </p>

                  <div className="space-y-3 rounded-[12px] border border-border bg-[var(--color-bg-card)] p-4 sm:p-5">
                    <p className="text-sm text-[var(--color-text)]">
                      <span className="font-medium">Skin Type:</span>{" "}
                      {skinTypeOptions.find((option) => option.value === skinType)?.label || "Not selected"}
                    </p>
                    <p className="text-sm text-[var(--color-text)]">
                      <span className="font-medium">Concerns:</span> {selectedConcernsText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="rounded-btn border border-border px-5 py-2.5 font-ui text-sm text-[var(--color-text)] transition hover:border-primary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="rounded-btn bg-primary px-6 py-2.5 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-primary-deep)]"
                    >
                      Show My Routine →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
