"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useTransition } from "react"
import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"

export default function SkincareProductCard({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { countryCode } = useParams()
  const [isPending, startTransition] = useTransition()

  const { cheapestPrice } = getProductPrice({ product })
  const price = cheapestPrice?.calculated_price || ""

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.variants?.length) return

    const variantId = product.variants[0].id

    startTransition(async () => {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode: countryCode as string,
      })
      window.dispatchEvent(new CustomEvent("open-cart"))
    })
  }

  const thumbnailUrl = product.thumbnail

  const firstTag = product.tags?.length ? product.tags[0].value : "Natural Formula"
  
  // collection might not be returned depending on fields, fallback gracefully
  const collectionTitle = product.collection?.title

  return (
    <Link href={`/${countryCode}/products/${product.handle}`} className="cursor-pointer group hover:-translate-y-1 transition-transform duration-300 block">
      <div className="aspect-[3/4] rounded-[20px] overflow-hidden relative mb-[18px]">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F5E6D3] to-[#E8C8A8] flex items-center justify-center">
            <span className="text-4xl">🌿</span>
          </div>
        )}
        
        {collectionTitle && (
          <div className="absolute top-3 left-3 bg-[#3A2820] text-[#FAF6F0] text-[10px] uppercase tracking-[1.5px] px-3 py-1 rounded-full">
            {collectionTitle}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-serif text-[20px] text-[#3A2820]">{product.title}</h3>
        <p className="text-[12px] text-[#2E1F14]/50 mb-[10px]">
          {firstTag}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-[15px] font-medium text-[#C9877A]">{price}</span>
          <button 
            onClick={handleAddToCart}
            disabled={isPending}
            className="w-[34px] h-[34px] rounded-full bg-[#3A2820] text-[#FAF6F0] flex items-center justify-center hover:bg-[#C9877A] hover:scale-110 transition shrink-0"
            aria-label="Add to cart"
          >
            {isPending ? (
              <span className="h-4 w-4 rounded-full border-2 border-[#FAF6F0] border-t-transparent animate-spin"/>
            ) : (
              <span className="text-lg leading-none mb-1">+</span>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}
