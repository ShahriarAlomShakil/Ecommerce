"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Mail } from "lucide-react"
import { type CSSProperties, type FormEvent, useState } from "react"

interface PetalConfig {
  id: number
  size: number
  left: string
  delay: number
  duration: number
  opacity: number
  initialY: number
  rotate: number
  color: string
}

const PETALS: PetalConfig[] = [
  { id: 1,  size: 18, left: "5%",  delay: 0,    duration: 14, opacity: 0.55, initialY: -30,  rotate: 0,   color: "#F2A7B3" },
  { id: 2,  size: 14, left: "12%", delay: 2.5,  duration: 18, opacity: 0.4,  initialY: -20,  rotate: 45,  color: "#EFC5CE" },
  { id: 3,  size: 22, left: "22%", delay: 1,    duration: 16, opacity: 0.6,  initialY: -40,  rotate: 90,  color: "#F7B8C5" },
  { id: 4,  size: 16, left: "35%", delay: 4,    duration: 20, opacity: 0.45, initialY: -25,  rotate: 135, color: "#F2A7B3" },
  { id: 5,  size: 20, left: "48%", delay: 0.5,  duration: 15, opacity: 0.5,  initialY: -35,  rotate: 180, color: "#EBB8C5" },
  { id: 6,  size: 12, left: "58%", delay: 3,    duration: 22, opacity: 0.35, initialY: -15,  rotate: 225, color: "#F9C8D3" },
  { id: 7,  size: 24, left: "68%", delay: 1.5,  duration: 17, opacity: 0.55, initialY: -45,  rotate: 270, color: "#F2A7B3" },
  { id: 8,  size: 15, left: "75%", delay: 5,    duration: 19, opacity: 0.4,  initialY: -20,  rotate: 315, color: "#EFC5CE" },
  { id: 9,  size: 19, left: "83%", delay: 2,    duration: 21, opacity: 0.5,  initialY: -30,  rotate: 60,  color: "#F7B8C5" },
  { id: 10, size: 13, left: "91%", delay: 3.5,  duration: 16, opacity: 0.45, initialY: -25,  rotate: 120, color: "#F2A7B3" },
  { id: 11, size: 21, left: "16%", delay: 6,    duration: 23, opacity: 0.35, initialY: -38,  rotate: 200, color: "#EBB8C5" },
  { id: 12, size: 17, left: "44%", delay: 7,    duration: 18, opacity: 0.5,  initialY: -22,  rotate: 340, color: "#F9C8D3" },
]

/* ─────────────────────────────────────────────
   Single floating petal (pure CSS animation)
   ───────────────────────────────────────────── */
function FloatingPetal({ petal }: { petal: PetalConfig }) {
  const style: CSSProperties = {
    position: "absolute",
    left: petal.left,
    top: "-60px",
    width: petal.size,
    height: petal.size,
    opacity: petal.opacity,
    animation: `petalDrift ${petal.duration}s ${petal.delay}s infinite linear`,
    pointerEvents: "none",
    willChange: "transform",
  }

  return (
    <div style={style} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        width={petal.size}
        height={petal.size}
        style={{ transform: `rotate(${petal.rotate}deg)` }}
      >
        {/* 5-petal cherry blossom shape */}
        <g fill={petal.color}>
          <ellipse cx="12" cy="6"  rx="3.2" ry="5.5" transform="rotate(0 12 12)"   opacity="0.9" />
          <ellipse cx="12" cy="6"  rx="3.2" ry="5.5" transform="rotate(72 12 12)"  opacity="0.85" />
          <ellipse cx="12" cy="6"  rx="3.2" ry="5.5" transform="rotate(144 12 12)" opacity="0.9" />
          <ellipse cx="12" cy="6"  rx="3.2" ry="5.5" transform="rotate(216 12 12)" opacity="0.85" />
          <ellipse cx="12" cy="6"  rx="3.2" ry="5.5" transform="rotate(288 12 12)" opacity="0.9" />
          <circle cx="12" cy="12" r="2" fill="#F9E0E6" opacity="0.95" />
        </g>
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main NewsletterSection Component
   ───────────────────────────────────────────── */
type Status = "idle" | "loading" | "success" | "error"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || status === "loading") return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.")
      return
    }

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus("success")
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || "Something went wrong. Please try again.")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Network error. Please try again.")
      setStatus("error")
    }
  }

  return (
    <>
      {/* ─── Keyframe styles (inserted once in the DOM) ─── */}
      <style>{`
        @keyframes petalDrift {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          5% { opacity: 1; }
          85% { opacity: 0.8; }
          100% {
            transform: translateY(calc(100vh + 80px)) translateX(50px) rotate(420deg);
            opacity: 0;
          }
        }

        @keyframes petalSway {
          0%   { margin-left: 0; }
          25%  { margin-left: 18px; }
          75%  { margin-left: -18px; }
          100% { margin-left: 0; }
        }

        .newsletter-section {
          background: radial-gradient(ellipse at 50% 40%, #FDF0F5 0%, #FDE8F0 60%, #F9D9E8 100%);
        }

        [data-theme="dark"] .newsletter-section {
          background: radial-gradient(ellipse at 50% 40%, #1A0D12 0%, #2A1520 60%, #1F1018 100%);
        }

        .newsletter-input {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(12px);
          border: 1.5px solid #EAD9D3;
          color: #2C2C2C;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #F2A7B3;
          box-shadow: 0 0 0 3px rgba(242, 167, 179, 0.25);
        }

        [data-theme="dark"] .newsletter-input {
          background: rgba(42, 21, 32, 0.65);
          border-color: #4A2A35;
          color: #F0EAE8;
        }

        [data-theme="dark"] .newsletter-input::placeholder {
          color: #7A6A70;
        }

        [data-theme="dark"] .newsletter-input:focus {
          border-color: #FF8FA3;
          box-shadow: 0 0 0 3px rgba(255, 143, 163, 0.2);
        }
      `}</style>

      <section
        className="newsletter-section relative overflow-hidden"
        style={{ padding: "var(--section-padding) 1rem" }}
        aria-labelledby="newsletter-heading"
      >
        {/* ── Floating petals ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {PETALS.map((petal) => (
            <FloatingPetal key={petal.id} petal={petal} />
          ))}
        </div>

        {/* ── Content container ── */}
        <div
          className="relative z-10 mx-auto flex flex-col items-center text-center"
          style={{ maxWidth: "680px" }}
        >
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-3 text-xs font-medium uppercase tracking-[0.18em]"
            style={{ color: "var(--color-primary-deep)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Exclusive Members Club
          </motion.span>

          {/* Headline */}
          <motion.h2
            id="newsletter-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: 1.15,
              color: "var(--color-text)",
            }}
          >
            Join the Glow Club 🌸
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8 leading-relaxed"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(0.95rem, 2vw, 1.08rem)",
              color: "var(--color-text-muted)",
              maxWidth: "500px",
            }}
          >
            Get skincare tips, exclusive deals &amp; early access to new arrivals
          </motion.p>

          {/* ── Form / Success state ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                /* ── Success Message ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.88, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="flex flex-col items-center gap-3 py-6"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 14, delay: 0.1 }}
                    style={{ fontSize: "2.8rem" }}
                  >
                    🌸
                  </motion.span>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.25rem, 3vw, 1.65rem)",
                      fontWeight: 400,
                      color: "var(--color-text)",
                    }}
                  >
                    You&rsquo;re in! Check your inbox.
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                    Welcome to the Glow Club — your first treat is on its way.
                  </p>
                </motion.div>
              ) : (
                /* ── Subscription Form ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  noValidate
                  aria-label="Newsletter signup form"
                >
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
                    {/* Email input */}
                    <div className="relative flex-1">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "var(--color-text-muted)" }}
                        aria-hidden="true"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errorMsg) setErrorMsg("")
                          if (status === "error") setStatus("idle")
                        }}
                        placeholder="your@email.com"
                        required
                        disabled={status === "loading"}
                        aria-label="Email address"
                        aria-describedby={errorMsg ? "newsletter-error" : undefined}
                        className="newsletter-input w-full pl-10 pr-4 py-3.5 text-sm"
                        style={{ borderRadius: "var(--radius-btn)" }}
                      />
                    </div>

                    {/* Subscribe button */}
                    <motion.button
                      type="submit"
                      disabled={status === "loading" || !email.trim()}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium text-white whitespace-nowrap overflow-hidden"
                      style={{
                        borderRadius: "var(--radius-btn)",
                        background:
                          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-deep) 100%)",
                        boxShadow: "0 4px 18px rgba(194, 116, 138, 0.35)",
                        fontFamily: "'Space Grotesk', sans-serif",
                        letterSpacing: "0.04em",
                        cursor: status === "loading" ? "not-allowed" : "pointer",
                        opacity: !email.trim() ? 0.7 : 1,
                        transition: "opacity 0.2s",
                      }}
                      aria-live="polite"
                    >
                      {/* Shimmer overlay */}
                      <span
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                        }}
                        aria-hidden="true"
                      />
                      {status === "loading" ? (
                        <>
                          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                          <span>Subscribing…</span>
                        </>
                      ) : (
                        "Subscribe 🌸"
                      )}
                    </motion.button>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.p
                        id="newsletter-error"
                        key="error"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        role="alert"
                        className="mt-2 text-xs text-left px-2"
                        style={{ color: "#E05A6F" }}
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Privacy note */}
          {status !== "success" && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-4 text-xs"
              style={{ color: "var(--color-text-muted)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              We respect your privacy. Unsubscribe anytime.
            </motion.p>
          )}
        </div>

        {/* ── Decorative soft orbs ── */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(242,167,179,0.18) 0%, transparent 70%)",
            transform: "translate(-40%, -40%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(242,167,179,0.14) 0%, transparent 70%)",
            transform: "translate(35%, 35%)",
          }}
        />
      </section>
    </>
  )
}
