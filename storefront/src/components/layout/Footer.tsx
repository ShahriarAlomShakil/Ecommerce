"use client"

import { ChevronDown, Facebook, Instagram, Music2, Youtube } from "lucide-react"
import { useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type FooterSection = {
	title: string
	links: Array<{ label: string; href: string }>
}

const FOOTER_SECTIONS: FooterSection[] = [
	{
		title: "Shop",
		links: [
			{ label: "All Products", href: "/store" },
			{ label: "New Arrivals", href: "/store?sortBy=created_at" },
			{ label: "Best Sellers", href: "/store?tag=best-seller" },
			{ label: "Sale", href: "/sale" },
			{ label: "Brands", href: "/brands" },
			{ label: "Gift Sets", href: "/store?category=gift-sets" },
		],
	},
	{
		title: "Help",
		links: [
			{ label: "Shipping Policy", href: "/shipping-policy" },
			{ label: "Return Policy", href: "/return-policy" },
			{ label: "FAQ", href: "/faq" },
			{ label: "Track Order", href: "/track-order" },
			{ label: "WhatsApp Support", href: "/contact" },
		],
	},
	{
		title: "About",
		links: [
			{ label: "Our Story", href: "/our-story" },
			{ label: "Blog", href: "/blog" },
			{ label: "Skin Concern Guide", href: "/skin-concern-guide" },
			{ label: "Careers", href: "/careers" },
			{ label: "Contact", href: "/contact" },
		],
	},
]

const SOCIAL_LINKS = [
	{ label: "Instagram", href: "https://instagram.com", Icon: Instagram },
	{ label: "Facebook", href: "https://facebook.com", Icon: Facebook },
	{ label: "TikTok", href: "https://www.tiktok.com", Icon: Music2 },
	{ label: "YouTube", href: "https://youtube.com", Icon: Youtube },
]

function GlowHausLogo() {
	return (
		<svg
			width="184"
			height="34"
			viewBox="0 0 184 34"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label="GlowHaus"
			role="img"
		>
			<g transform="translate(2,4)">
				<circle cx="8" cy="8" r="3.4" fill="var(--color-primary)" />
				<ellipse cx="8" cy="2.3" rx="2.2" ry="3.1" fill="var(--color-primary)" />
				<ellipse cx="8" cy="13.7" rx="2.2" ry="3.1" fill="var(--color-primary)" />
				<ellipse
					cx="2.4"
					cy="8"
					rx="2.2"
					ry="3.1"
					transform="rotate(-90 2.4 8)"
					fill="var(--color-primary)"
				/>
				<ellipse
					cx="13.6"
					cy="8"
					rx="2.2"
					ry="3.1"
					transform="rotate(-90 13.6 8)"
					fill="var(--color-primary)"
				/>
				<circle cx="8" cy="8" r="1" fill="var(--color-primary-deep)" />
			</g>
			<text
				x="26"
				y="22"
				fill="currentColor"
				style={{
					fontFamily: "Cormorant Garamond, serif",
					fontWeight: 600,
					fontSize: 24,
					letterSpacing: "0.02em",
				}}
			>
				GlowHaus
			</text>
		</svg>
	)
}

export default function Footer() {
	const [openSection, setOpenSection] = useState<string>(FOOTER_SECTIONS[0].title)

	return (
		<footer className="border-t border-border bg-surface text-[var(--color-text)]">
			<div className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-10 font-ui text-sm sm:px-6 lg:px-8 lg:pt-14">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
					<div className="space-y-4">
						<LocalizedClientLink href="/" className="inline-flex text-[var(--color-text)]">
							<GlowHausLogo />
						</LocalizedClientLink>
						<p className="max-w-[260px] text-sm leading-6 text-[var(--color-text-muted)]">
							Authentic K-Beauty, Delivered to Your Door
						</p>
						<div className="flex items-center gap-2.5">
							{SOCIAL_LINKS.map(({ label, href, Icon }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noreferrer"
									aria-label={label}
									className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-[var(--color-text-muted)] transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								>
									<Icon className="h-4 w-4" />
								</a>
							))}
						</div>
					</div>

					{FOOTER_SECTIONS.map((section) => {
						const isOpen = openSection === section.title

						return (
							<div key={section.title} className="border-b border-border pb-4 md:border-none md:pb-0">
								<button
									type="button"
									onClick={() => setOpenSection(isOpen ? "" : section.title)}
									aria-expanded={isOpen}
									className="flex w-full items-center justify-between py-1 text-left text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-text)] md:cursor-default md:py-0"
								>
									<span>{section.title}</span>
									<ChevronDown
										className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform md:hidden ${
											isOpen ? "rotate-180" : ""
										}`}
									/>
								</button>

								<ul className={`mt-3 space-y-2 text-sm md:mt-4 md:block ${isOpen ? "block" : "hidden"}`}>
									{section.links.map((link) => (
										<li key={link.label}>
											<LocalizedClientLink
												href={link.href}
												className="text-[var(--color-text-muted)] transition-colors hover:text-primary"
											>
												{link.label}
											</LocalizedClientLink>
										</li>
									))}
								</ul>
							</div>
						)
					})}
				</div>

				<div className="mt-8 flex flex-col gap-4 border-t border-border pt-5 text-xs text-[var(--color-text-muted)] lg:mt-10 lg:flex-row lg:items-center lg:justify-between">
					<p className="text-center lg:text-left">© 2025 GlowHaus BD. All rights reserved.</p>

					<div className="flex flex-wrap items-center justify-center gap-2">
						<span className="rounded-full border border-primary bg-primary/10 px-3 py-1 font-semibold uppercase tracking-[0.08em] text-primary">
							bKash
						</span>
						<span className="rounded-full border border-primary bg-primary/10 px-3 py-1 font-semibold uppercase tracking-[0.08em] text-primary">
							Nagad
						</span>
						<span className="rounded-full border border-border px-3 py-1">Visa</span>
						<span className="rounded-full border border-border px-3 py-1">Mastercard</span>
						<span className="rounded-full border border-border px-3 py-1">COD</span>
					</div>

					<p className="text-center lg:text-right">Designed with 🌸 in Dhaka</p>
				</div>
			</div>
		</footer>
	)
}
