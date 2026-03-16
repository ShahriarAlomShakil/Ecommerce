"use client"

import { useState, useEffect } from "react"

export default function FooterCollapse({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex flex-col gap-y-2 md:gap-y-4 border-b border-[#FAF6F0]/10 md:border-none py-4 md:py-0">
      <button 
        type="button"
        className="flex items-center justify-between w-full text-left md:cursor-auto"
        onClick={() => {
          if (isMobile) {
            setIsOpen(!isOpen)
          }
        }}
      >
        <span className="font-sans text-[11px] tracking-[2.5px] uppercase text-[#FAF6F0]/40">
          {title}
        </span>
        <span className={`md:hidden text-[#FAF6F0]/40 text-xl font-light transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out md:max-h-none md:opacity-100 md:mt-0 ${
          isMobile 
            ? (isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0") 
            : "block"
        }`}
      >
        {children}
      </div>
    </div>
  )
}
