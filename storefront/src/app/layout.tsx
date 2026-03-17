import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import {
  Cormorant_Garamond,
  DM_Serif_Display,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Noto_Sans_KR,
} from "next/font/google"
import { ThemeProvider } from "@providers/ThemeProvider"
import "styles/globals.css"

/* ── Display / Hero font ── */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
})

/* ── Section headings ── */
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
})

/* ── Body copy ── */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
})

/* ── UI labels / nav ── */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ui",
  display: "swap",
})

/* ── Korean brand names ── */
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-korean",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "GlowHaus BD — Authentic Korean Skincare",
    template: "%s | GlowHaus BD",
  },
  description:
    "Shop 100% authentic Korean & foreign skincare products delivered across Bangladesh. COSRX, Laneige, Some By Mi and more.",
  keywords: ["Korean skincare", "K-beauty Bangladesh", "COSRX", "Laneige", "authentic skincare"],
  openGraph: {
    siteName: "GlowHaus BD",
    locale: "en_BD",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="light"
      className={[
        cormorantGaramond.variable,
        dmSerifDisplay.variable,
        plusJakartaSans.variable,
        spaceGrotesk.variable,
        notoSansKR.variable,
      ].join(" ")}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <div className="grain-overlay" aria-hidden="true" />
          {/* Skip-to-content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-btn focus:outline-none"
          >
            Skip to content
          </a>
          <main id="main-content" className="relative">
            {props.children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
