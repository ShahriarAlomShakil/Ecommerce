"use client"

import { useEffect, useState } from "react"

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-fade-up {
          animation: fadeUp 1s ease-out forwards;
        }
        .animate-float {
          animation: float 4s infinite ease-in-out;
        }
        .animate-float-delay-1 {
          animation: float 4s infinite ease-in-out;
          animation-delay: 1s;
        }
        .animate-float-delay-2 {
          animation: float 4s infinite ease-in-out;
          animation-delay: 2s;
        }
      `}</style>
      <div className="min-h-[50vh] grid grid-cols-1 lg:grid-cols-2 pt-[72px]">
        {/* LEFT COLUMN */}
        <div
          className={`flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 lg:py-20 opacity-0 ${
            isMounted ? "animate-fade-up" : ""
          }`}
        >
          <div className="border-l border-[#C9877A] pl-4 mb-6">
            <span className="text-[#C9877A] text-[11px] uppercase tracking-[3px]">
              New Collection 2025
            </span>
          </div>
          
          <h1 className="font-serif text-[clamp(42px,5vw,64px)] font-light leading-[1.08] text-[#3A2820] mb-4">
            Your skin, <br />
            <span className="italic text-[#C9877A]">simply</span> <br />
            radiant.
          </h1>
          
          <p className="font-sans text-[15px] leading-[1.6] text-[#2E1F14]/65 font-light max-w-[380px] mb-8">
            Clean, plant-powered formulas crafted with care.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-[#3A2820] text-[#FAF6F0] px-6 py-2.5 rounded-full text-[12px] uppercase tracking-[1.5px] hover:bg-[#C9877A] transition-colors">
              Shop Now
            </button>
            <button className="border border-[#3A2820]/20 text-[#3A2820] px-6 py-2.5 rounded-full text-[12px] uppercase tracking-[1.5px] hover:border-[#C9877A] hover:text-[#C9877A] transition-colors">
              Learn More
            </button>
          </div>
          
          <div className="border-t border-[#D4B89A]/40 pt-5 mt-6 flex gap-8">
            <div>
              <div className="font-serif text-[28px] font-light text-[#3A2820]">100%</div>
              <div className="text-[11px] uppercase tracking-[1.5px] opacity-50 mt-1 text-[#3A2820]">Natural</div>
            </div>
            <div>
              <div className="font-serif text-[28px] font-light text-[#3A2820]">12k+</div>
              <div className="text-[11px] uppercase tracking-[1.5px] opacity-50 mt-1 text-[#3A2820]">Happy Skin</div>
            </div>
            <div>
              <div className="font-serif text-[28px] font-light text-[#3A2820]">30+</div>
              <div className="text-[11px] uppercase tracking-[1.5px] opacity-50 mt-1 text-[#3A2820]">Formulas</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="overflow-hidden min-h-[400px] lg:min-h-0">
          <div className="relative h-full w-full py-20 lg:py-0" style={{ background: 'linear-gradient(135deg, #E8D5C4 0%, #D4B89A 40%, #C9987A 100%)' }}>
            
            {/* Decorative Circles */}
            <div className="absolute top-[15%] left-[20%] w-64 h-64 rounded-full bg-white/15 blur-sm mix-blend-overlay"></div>
            <div className="absolute bottom-[10%] right-[10%] w-80 h-80 rounded-full bg-white/15 blur-sm mix-blend-overlay"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[160px] h-[220px]">
                {/* Product Card */}
                <div className="w-[160px] h-[220px] rounded-[70px] bg-gradient-to-b from-[#FAF6F0] to-[#F0E6D8] shadow-2xl flex flex-col items-center justify-center gap-1 animate-float relative z-10">
                  <span className="text-4xl mb-1">🌿</span>
                  <span className="font-serif text-[15px] text-[#3A2820]">Radiance Serum</span>
                  <span className="text-[#C9877A] font-medium text-[13px]">$48.00</span>
                </div>
                
                {/* Badges */}
                <div className="absolute -top-3 -right-6 bg-[#8A9F87] text-[#FAF6F0] px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[1px] shadow-lg animate-float-delay-1 z-20 whitespace-nowrap">
                  ✦ Bestseller
                </div>
                
                <div className="absolute bottom-6 -left-8 bg-[#FAF6F0] text-[#3A2820] px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[1px] shadow-lg animate-float-delay-2 z-20 whitespace-nowrap">
                  🌱 Vegan · Cruelty-free
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroSection
