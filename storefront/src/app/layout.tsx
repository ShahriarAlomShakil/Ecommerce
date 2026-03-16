import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import "styles/globals.css"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${cormorantGaramond.variable} ${dmSans.variable}`}
    >
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
