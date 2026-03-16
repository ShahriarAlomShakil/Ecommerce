import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import FooterCollapse from "@modules/layout/components/footer-collapse"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-[#3A2820] text-[#FAF6F0] pt-10 pb-6 md:pt-16 md:pb-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-4 md:gap-12 px-6 md:px-12 lg:px-20 mb-8 md:mb-16">
        {/* Column 1 (Brand) */}
        <div className="flex flex-col mb-8 md:mb-0">
          <LocalizedClientLink
            href="/"
            className="font-serif text-[22px] tracking-[4px] uppercase mb-4"
          >
            LU<span className="text-[#C9877A]">M</span>ERA
          </LocalizedClientLink>
          <p className="font-sans text-[13px] font-light text-[#FAF6F0]/45 max-w-[220px] leading-[1.7]">
            Clean, plant-powered formulas crafted with care. Skin science meets nature's wisdom.
          </p>
        </div>

        {/* Column 2 (Products) */}
        <FooterCollapse title="Products">
          <ul className="flex flex-col gap-y-3">
            {productCategories && productCategories?.length > 0 ? (
              productCategories?.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition"
                    href={`/categories/${c.handle}`}
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              ))
            ) : (
              // Static fallback if no categories fetched
              <>
                <li><LocalizedClientLink href="/store" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Serums</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/store" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Moisturisers</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/store" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Cleansers</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/store" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Masks</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/store" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Eye Care</LocalizedClientLink></li>
              </>
            )}
          </ul>
        </FooterCollapse>

        {/* Column 3 (Company) */}
        <FooterCollapse title="Company">
          <ul className="flex flex-col gap-y-3">
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Our Story</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Ingredients</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Sustainability</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Press</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Careers</LocalizedClientLink></li>
          </ul>
        </FooterCollapse>

        {/* Column 4 (Support) */}
        <FooterCollapse title="Support">
          <ul className="flex flex-col gap-y-3">
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Skin Quiz</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">FAQ</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Shipping</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Returns</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/" className="font-sans text-[14px] font-light text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition">Contact</LocalizedClientLink></li>
          </ul>
        </FooterCollapse>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#FAF6F0]/10 pt-7 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-4">
        <Text className="text-[12.5px] text-[#FAF6F0]/35 font-sans">
          © 2025 Lumera. All rights reserved.
        </Text>
        <div className="flex items-center gap-3">
          {["X", "in", "▶", "◎"].map((icon, i) => (
            <button
              key={i}
              className="w-[36px] h-[36px] rounded-full border border-[#FAF6F0]/15 flex items-center justify-center hover:border-[#C9877A] hover:bg-[#C9877A]/15 transition text-[#FAF6F0]/60 hover:text-[#C9877A]"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}
