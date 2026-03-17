/**
 * GlowHaus BD — Medusa JS SDK client
 *
 * Re-exports the configured sdk instance from config.ts.
 * Use this import path for all homepage data fetching as
 * described in the design plan (src/lib/medusa.ts).
 *
 * Usage (Server Component):
 *   import { medusa } from "@/lib/medusa"
 *   const { products } = await medusa.store.product.list({ limit: 8 })
 */
export { sdk as medusa } from "@lib/config"
