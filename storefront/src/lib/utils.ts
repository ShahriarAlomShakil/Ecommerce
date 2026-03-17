import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes without style conflicts.
 * Combines clsx conditional logic with tailwind-merge deduplication.
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price in BDT (৳) for display.
 * @param amount  Amount in the smallest currency unit (paisa / cents)
 * @param currencyCode  ISO currency code (default: "BDT")
 */
export function formatPrice(
  amount: number,
  currencyCode: string = "BDT"
): string {
  if (currencyCode.toUpperCase() === "BDT") {
    const formatted = new Intl.NumberFormat("en-BD").format(amount / 100)
    return `৳${formatted}`
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100)
}

/**
 * Calculate percentage discount between original and sale price.
 */
export function getDiscountPercent(
  originalPrice: number,
  salePrice: number
): number {
  if (!originalPrice || originalPrice <= salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Truncate a string to a given length with an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + "…"
}
