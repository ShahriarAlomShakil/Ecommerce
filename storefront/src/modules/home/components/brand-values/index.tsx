"use client"

import React from "react"

export default function BrandValues() {
  const cards = [
    {
      emoji: "🌱",
      name: "Clean Formula",
      desc: "Free from parabens, sulfates, and artificial fragrances.",
    },
    {
      emoji: "🔬",
      name: "Clinically Tested",
      desc: "Dermatologist-backed results you can see and feel.",
    },
    {
      emoji: "♻️",
      name: "Sustainable",
      desc: "Eco-conscious packaging and responsible sourcing.",
    },
    {
      emoji: "🐰",
      name: "Cruelty-Free",
      desc: "Certified vegan. Never tested on animals. Ever.",
    },
  ]

  return (
    <section className="bg-[#F2EDE6] py-16 md:py-[100px] px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
      <style>
        {`
          @keyframes morphBlob {
            0% { border-radius: 60% 40% 55% 45% / 50% 50% 50% 50%; }
            33% { border-radius: 45% 55% 40% 60% / 55% 45% 55% 45%; }
            66% { border-radius: 55% 45% 60% 40% / 45% 55% 45% 55%; }
            100% { border-radius: 60% 40% 55% 45% / 50% 50% 50% 50%; }
          }
          .animate-morph-blob {
            animation: morphBlob 8s infinite ease-in-out;
            box-shadow: 0 32px 80px rgba(201,135,122,0.25);
          }
        `}
      </style>

      {/* LEFT SIDE */}
      <div>
        <div className="text-[#C9877A] text-[11px] uppercase tracking-[3px] mb-4">Why Lumera</div>
        <h2 className="font-serif text-[clamp(36px,4vw,52px)] font-light text-[#3A2820] leading-[1.1]">
          Skin science meets nature&apos;s{" "}
          <span className="italic text-[#C9877A]">wisdom</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mt-11">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="bg-[#FAF6F0] rounded-[20px] p-7 hover:-translate-y-[3px] transition group"
            >
              <div className="text-[28px] mb-[14px]">
                {card.emoji}
              </div>
              <h3 className="font-serif text-[20px] text-[#3A2820] mb-1">
                {card.name}
              </h3>
              <p className="text-[13px] text-[#2E1F14]/55 leading-[1.7] font-light">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative h-[380px] md:h-[480px] flex items-center justify-center">
        <div className="w-[280px] md:w-[380px] h-[340px] md:h-[460px] bg-gradient-to-br from-[#E8C4B0] via-[#D4A898] to-[#C9877A] flex items-center justify-center text-[80px] animate-morph-blob">
        </div>

        <div className="absolute bottom-[20px] md:bottom-[60px] left-0 md:left-[-20px] bg-[#3A2820] text-[#FAF6F0] p-5 rounded-[18px] shadow-xl max-w-[200px]">
          <span className="font-serif text-[24px] font-light block mb-1">94%</span>
          <span className="font-sans text-[13px] text-[#FAF6F0]/80 leading-snug block">
            noticed glowing skin within 2 weeks
          </span>
        </div>
      </div>
    </section>
  )
}
