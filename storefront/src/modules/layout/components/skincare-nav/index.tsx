"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CategoriesDropdown from "./categories-dropdown"
import MobileCategoriesMenu from "./mobile-categories-menu"
import { useEffect, useState } from "react"

type SkincareNavProps = {
  cartCount?: number
}

const navLinks = [
  { label: "Skincare", href: "/store" },
  { label: "Ingredients", href: "/store" },
  { label: "Rituals", href: "/store" },
  { label: "About", href: "/store" },
]

export default function SkincareNav({ cartCount = 0 }: SkincareNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    onScroll()
    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-6 md:px-12 transition-colors duration-300 ${
          scrolled
            ? "bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#D4B89A]/20"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-[#2E1F14]/80 hover:text-[#C9877A] transition z-50"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          <LocalizedClientLink
            href="/"
            className="font-serif tracking-[4px] uppercase text-[#3A2820] text-[22px]"
            data-testid="nav-store-link"
          >
            LU
            <span className="text-[#C9877A]">M</span>
            ERA
          </LocalizedClientLink>
        </div>

      <nav className="hidden md:flex items-center gap-8">
        <CategoriesDropdown />
        {navLinks.map((link) => (
          <LocalizedClientLink
            key={link.label}
            href={link.href}
            className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#2E1F14]/70 hover:opacity-100 transition"
          >
            {link.label}
          </LocalizedClientLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Search"
          className="text-[#2E1F14]/70 hover:text-[#2E1F14] transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m0 0A7.65 7.65 0 1 0 5.85 5.85a7.65 7.65 0 0 0 10.8 10.8Z"
            />
          </svg>
        </button>

        <LocalizedClientLink
            href="/cart"
            data-testid="nav-cart-link"
            className="bg-[#3A2820] text-[#FAF6F0] rounded-full px-5 py-2 text-[11px] uppercase tracking-[1.5px] hover:bg-[#C9877A] transition"
          >
            <span className="hidden md:inline">Cart ({cartCount})</span>
            <span className="md:hidden">({cartCount})</span>
          </LocalizedClientLink>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileCategoriesMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}
