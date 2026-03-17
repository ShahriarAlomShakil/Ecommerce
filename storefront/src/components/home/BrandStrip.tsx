const brands = [
  "COSRX",
  "Laneige",
  "Some By Mi",
  "Etude House",
  "Innisfree",
  "The Ordinary",
  "Cetaphil",
  "La Roche-Posay",
  "Missha",
  "Sulwhasoo",
  "Klairs",
  "Torriden",
  "Beauty of Joseon",
  "Pyunkang Yul",
]

export default function BrandStrip() {
  return (
    <section className="border-y border-[var(--color-border)] bg-white py-6 dark:bg-[var(--color-surface)]">
      <div className="glowhaus-container">
        <div className="mb-4 flex items-center justify-center">
          <span className="font-ui text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
            Brands We Carry
          </span>
        </div>

        <div className="brand-strip-mask relative overflow-hidden rounded-full">
          <div className="brand-strip-track flex w-max items-center gap-4 md:gap-5">
            {[0, 1].map((copyIndex) => (
              <div
                key={copyIndex}
                className="flex h-20 shrink-0 items-center gap-4 pr-4 md:gap-5 md:pr-5"
                aria-hidden={copyIndex === 1}
              >
                {brands.map((brand) => (
                  <div
                    key={`${copyIndex}-${brand}`}
                    className="brand-strip-logo flex h-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] px-4 text-center shadow-[0_4px_18px_rgba(194,116,138,0.06)] backdrop-blur-sm transition-all duration-300 dark:bg-[rgba(255,255,255,0.03)]"
                  >
                    <span className="whitespace-nowrap font-ui text-sm font-medium uppercase tracking-[0.18em] md:text-[15px]">
                      {brand}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-[var(--color-surface)] dark:via-[rgba(37,37,37,0.94)] md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-[var(--color-surface)] dark:via-[rgba(37,37,37,0.94)] md:w-24" />
        </div>
      </div>
    </section>
  )
}