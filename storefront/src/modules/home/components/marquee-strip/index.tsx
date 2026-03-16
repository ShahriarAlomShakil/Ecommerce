import React from "react"

const labels = [
  "Free of Parabens",
  "Dermatologist Tested",
  "Cruelty Free",
  "Plant-Powered",
  "Sustainably Sourced",
  "Vegan Certified",
]

export default function MarqueeStrip() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
          display: flex;
          white-space: nowrap;
          width: max-content;
        }
      `}</style>
      <div className="w-full bg-[#3A2820] py-[14px] overflow-hidden">
        <div className="animate-marquee items-center">
          {/* First set */}
          {labels.map((label, index) => (
            <React.Fragment key={`set1-${index}`}>
              <span className="font-sans text-[11.5px] uppercase tracking-[2px] text-[#FAF6F0]/85">
                {label}
              </span>
              <span className="text-[#C9877A] mx-4">✦</span>
            </React.Fragment>
          ))}
          {/* Second set for seamless loop */}
          {labels.map((label, index) => (
            <React.Fragment key={`set2-${index}`}>
              <span className="font-sans text-[11.5px] uppercase tracking-[2px] text-[#FAF6F0]/85">
                {label}
              </span>
              <span className="text-[#C9877A] mx-4">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
