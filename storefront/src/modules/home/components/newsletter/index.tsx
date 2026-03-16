"use client"

import React, { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubscribe = async () => {
    if (!email) return

    setStatus("loading")
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      setStatus("error")
    }
  }

  return (
    <section className="bg-[#FAF6F0] py-16 md:py-[100px] px-6 md:px-12 lg:px-20 flex flex-col items-center text-center relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#E8C4B0]/30 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="text-[#C9877A] text-[11px] uppercase tracking-[3px] mb-4">
          Stay in the glow
        </div>
        <h2 className="font-serif text-[clamp(32px,3vw,42px)] font-light text-[#3A2820] mb-4">
          Rituals, tips & early access
        </h2>
        <p className="font-sans text-[14px] text-[#2E1F14]/60 max-w-[400px] leading-[1.6] mb-10">
          Join our community to receive skincare advice and exclusive updates on new product drops.
        </p>

        {/* Email Form (div-based as requested) */}
        {status === "success" ? (
          <div className="text-[#C9877A] font-medium text-[16px]">
            You&apos;re in! ✦
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row w-full max-w-[440px] gap-3 sm:gap-0 sm:bg-[#FAF6F0] sm:border sm:border-[#D4B89A]/50 sm:rounded-full sm:p-1 sm:shadow-sm">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#FAF6F0] sm:bg-transparent border border-[#D4B89A]/50 sm:border-none outline-none rounded-full sm:rounded-none px-6 py-4 sm:py-3 font-sans text-[14px] placeholder:opacity-40 text-[#2E1F14] w-full"
              disabled={status === "loading"}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubscribe()
              }}
            />
            <button
              onClick={handleSubscribe}
              disabled={status === "loading" || !email}
              className="bg-[#3A2820] text-[#FAF6F0] rounded-full px-7 py-4 sm:py-3 text-[11.5px] uppercase tracking-[1.5px] hover:bg-[#C9877A] transition disabled:opacity-70 disabled:hover:bg-[#3A2820] w-full sm:w-auto flex-shrink-0"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </div>
        )}
        
        {status === "error" && (
          <div className="text-red-500 font-sans text-[12px] mt-4">
            Something went wrong. Please try again.
          </div>
        )}
      </div>
    </section>
  )
}
