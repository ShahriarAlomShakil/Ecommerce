# 🌸 Korean Skincare E-Commerce Homepage — Design Plan
### Next.js + Medusa Backend | Inspired by Calma (WPBingo Home-5)
**Brand Context:** Authentic Korean & Foreign Skincare Products for the Bangladeshi Market

---

## 📌 Table of Contents
1. [Brand Identity & Design Direction](#1-brand-identity--design-direction)
2. [Tech Stack & Project Setup](#2-tech-stack--project-setup)
3. [Design System — Tokens, Fonts & Themes](#3-design-system--tokens-fonts--themes)
4. [Responsive Breakpoints](#4-responsive-breakpoints)
5. [Homepage Sections — Layout Plan](#5-homepage-sections--layout-plan)
6. [Component-by-Component Build Prompts](#6-component-by-component-build-prompts)
7. [Dark / Light Theme Implementation](#7-dark--light-theme-implementation)
8. [Medusa Integration Points](#8-medusa-integration-points)
9. [Performance & SEO Checklist](#9-performance--seo-checklist)
10. [File Structure](#10-file-structure)

---

## 1. Brand Identity & Design Direction

### 🎨 Aesthetic Direction
- **Style:** Soft Luxe Korean Beauty — clean, airy, and sophisticated
- **Mood:** Dewy, translucent, petal-soft — like a glass-skin finish
- **Inspiration:** Calma Home-5 layout with K-beauty editorial flair
- **Audience:** Urban Bangladeshi women (18–40), K-beauty enthusiasts

### 🌈 Color Palette

#### Light Theme
| Token | Color | Hex | Usage |
|---|---|---|---|
| `--color-primary` | Petal Blush | `#F2A7B3` | CTAs, accents |
| `--color-primary-deep` | Rose Mauve | `#C2748A` | Hover states |
| `--color-secondary` | Celadon Mist | `#B8D8C8` | Tag badges, pills |
| `--color-bg` | Ivory Bloom | `#FDF8F5` | Page background |
| `--color-bg-card` | White Dew | `#FFFFFF` | Cards |
| `--color-surface` | Warm Sand | `#F7EFE9` | Section alternates |
| `--color-text` | Charcoal Ink | `#2C2C2C` | Body text |
| `--color-text-muted` | Fog Gray | `#8A8A8A` | Secondary text |
| `--color-border` | Blush Dust | `#EAD9D3` | Dividers, inputs |
| `--color-accent` | Gold Glow | `#D4A853` | Sale badges, stars |

#### Dark Theme
| Token | Color | Hex | Usage |
|---|---|---|---|
| `--color-bg` | Midnight Velvet | `#141414` | Page background |
| `--color-bg-card` | Obsidian | `#1E1E1E` | Cards |
| `--color-surface` | Charcoal Deep | `#252525` | Section alternates |
| `--color-text` | Pearl White | `#F0EAE8` | Body text |
| `--color-text-muted` | Silver Mist | `#9A9A9A` | Secondary text |
| `--color-primary` | Neon Petal | `#FF8FA3` | CTAs — brighter pop |
| `--color-border` | Dark Rose | `#3A2A2F` | Dividers |
| `--color-accent` | Warm Gold | `#E8B85A` | Badges, stars |

### 🔤 Typography
| Role | Font | Weight | Source |
|---|---|---|---|
| Display / Hero | `Cormorant Garamond` | 300, 400, 600 | Google Fonts |
| Headings | `DM Serif Display` | 400 | Google Fonts |
| Body | `Plus Jakarta Sans` | 300, 400, 500 | Google Fonts |
| Labels / UI | `Space Grotesk` | 400, 500 | Google Fonts |
| Korean accents | `Noto Sans KR` | 300, 400 | Google Fonts |

---

## 2. Tech Stack & Project Setup

### Core Stack
```bash
# Create Next.js project
npx create-next-app@latest glowhaus-bd \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir

cd glowhaus-bd

# Medusa storefront JS SDK
npm install @medusajs/js-sdk @medusajs/types

# UI & Animation
npm install framer-motion
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react
npm install clsx tailwind-merge
npm install next-themes

# Image carousel
npm install embla-carousel-react embla-carousel-autoplay

# Icons & utilities
npm install react-hot-toast
npm install @tanstack/react-query
```

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_SITE_NAME=GlowHaus BD
NEXT_PUBLIC_SITE_URL=https://glowhausbd.com
```

### `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "your-medusa-backend.com" },
      { hostname: "cdn.glowhausbd.com" },
      // Korean brand CDNs
      { hostname: "amorepacific.com" },
      { hostname: "innisfree.com" },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
```

---

## 3. Design System — Tokens, Fonts & Themes

### `src/styles/globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500&family=Space+Grotesk:wght@400;500&family=Noto+Sans+KR:wght@300;400&display=swap');

:root {
  /* Light Theme Tokens */
  --color-primary: #F2A7B3;
  --color-primary-deep: #C2748A;
  --color-secondary: #B8D8C8;
  --color-bg: #FDF8F5;
  --color-bg-card: #FFFFFF;
  --color-surface: #F7EFE9;
  --color-text: #2C2C2C;
  --color-text-muted: #8A8A8A;
  --color-border: #EAD9D3;
  --color-accent: #D4A853;
  --color-nav-bg: rgba(253, 248, 245, 0.92);

  /* Spacing */
  --section-padding: clamp(3rem, 6vw, 6rem);
  --container-max: 1400px;

  /* Radius */
  --radius-card: 16px;
  --radius-btn: 50px;
  --radius-img: 12px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(194, 116, 138, 0.08);
  --shadow-hover: 0 12px 40px rgba(194, 116, 138, 0.18);
  --shadow-nav: 0 2px 20px rgba(44, 44, 44, 0.06);
}

[data-theme="dark"] {
  --color-primary: #FF8FA3;
  --color-primary-deep: #F06080;
  --color-secondary: #6DBFA0;
  --color-bg: #141414;
  --color-bg-card: #1E1E1E;
  --color-surface: #252525;
  --color-text: #F0EAE8;
  --color-text-muted: #9A9A9A;
  --color-border: #3A2A2F;
  --color-accent: #E8B85A;
  --color-nav-bg: rgba(20, 20, 20, 0.95);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 12px 40px rgba(255, 143, 163, 0.15);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-deep": "var(--color-primary-deep)",
        secondary: "var(--color-secondary)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        muted: "var(--color-text-muted)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        heading: ["DM Serif Display", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        ui: ["Space Grotesk", "sans-serif"],
        korean: ["Noto Sans KR", "sans-serif"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        btn: "var(--radius-btn)",
        img: "var(--radius-img)",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 4. Responsive Breakpoints

| Breakpoint | Name | Width | Layout Behavior |
|---|---|---|---|
| `sm` | Mobile | < 640px | Single column, stacked nav, hamburger menu |
| `md` | Tablet | 640–1024px | 2-col grid, simplified nav |
| `lg` | Laptop | 1024–1280px | Full nav, 3-col grid |
| `xl` | Desktop | 1280–1400px | Full layout, 4-col grid |
| `2xl` | Wide | > 1400px | Max-width container centered |

### Mobile-First Principles
- Hero banner: Full-screen on mobile, split 60/40 on desktop
- Product grid: `grid-cols-2 md:grid-cols-3 xl:grid-cols-4`
- Navigation: Hamburger → slide-in drawer on mobile; full mega-menu on desktop
- Typography: `clamp()` for fluid heading sizes
- Images: `sizes` prop on `next/image` for responsive loading

---

## 5. Homepage Sections — Layout Plan

Inspired by Calma Home-5's structure — clean editorial flow from hero to trust signals.

```
┌─────────────────────────────────────────┐
│  01. TOP ANNOUNCEMENT BAR               │
│  "Free shipping above ৳1500 | 100% Auth"│
├─────────────────────────────────────────┤
│  02. STICKY HEADER / NAVBAR             │
│  Logo | Categories | Search | Cart/Acct │
├─────────────────────────────────────────┤
│  03. HERO BANNER (Full-width Carousel)  │
│  Split layout: Text | Mood Image        │
├─────────────────────────────────────────┤
│  04. BRAND STRIP                        │
│  Scrolling logos: COSRX, Laneige, etc. │
├─────────────────────────────────────────┤
│  05. CATEGORY SHOWCASE                  │
│  Visual tiles: Toner / Serum / SPF etc. │
├─────────────────────────────────────────┤
│  06. FEATURED PRODUCTS (Best Sellers)   │
│  4-column grid with hover add-to-cart   │
├─────────────────────────────────────────┤
│  07. PROMOTIONAL SPLIT BANNER           │
│  2-column: "New Arrivals" + "On Sale"   │
├─────────────────────────────────────────┤
│  08. TRENDING NOW — TAB GRID            │
│  Tabs: Korean / Japanese / European     │
├─────────────────────────────────────────┤
│  09. EDITORIAL STORY SECTION            │
│  "Why Korean Skincare?" — with imagery  │
├─────────────────────────────────────────┤
│  10. SKIN CONCERN FINDER                │
│  Interactive quiz CTA widget            │
├─────────────────────────────────────────┤
│  11. INSTAGRAM / UGC GALLERY STRIP      │
│  6-tile photo mosaic                    │
├─────────────────────────────────────────┤
│  12. REVIEWS / TESTIMONIALS             │
│  Star ratings + customer quotes         │
├─────────────────────────────────────────┤
│  13. TRUST BADGES SECTION               │
│  100% Authentic | Fast Delivery | COD  │
├─────────────────────────────────────────┤
│  14. NEWSLETTER SIGNUP                  │
│  Email capture with petal animation     │
├─────────────────────────────────────────┤
│  15. FOOTER                             │
│  Links | Payment Icons | Social Media   │
└─────────────────────────────────────────┘
```

---

## 6. Component-by-Component Build Prompts

Use each prompt below to generate the corresponding component with Claude or an AI coding assistant.

---

### 🔷 Section 01 — Announcement Bar

**Prompt:**
```
Create a Next.js TypeScript component `AnnouncementBar` for a Korean skincare ecommerce site called "GlowHaus BD".

Requirements:
- Rotating announcements using a smooth fade/slide transition every 4 seconds
- Messages: "🌸 Free Shipping on orders above ৳1500", "✨ 100% Authentic Korean & Foreign Skincare", "🎁 New COSRX & Laneige arrivals just dropped"
- Background: var(--color-primary) in light mode, var(--color-surface) in dark mode
- Text: small, centered, font-ui
- Dismissible with a close button (localStorage remembers for 24h)
- Fully responsive — text wraps gracefully on mobile
- Use Framer Motion for the text transition animations
```

---

### 🔷 Section 02 — Sticky Navbar

**Prompt:**
```
Build a `Navbar` component in Next.js TypeScript for GlowHaus BD skincare store.

Layout (desktop):
- Left: Logo (SVG wordmark "GlowHaus" in Cormorant Garamond, with a small cherry blossom icon)
- Center: Navigation links: Home | Shop | Brands | Skin Concerns | Sale | Blog
- Right: Search icon (opens full-width search overlay), Wishlist icon with count badge, Cart icon with count badge, Account icon, Dark/Light theme toggle button

Layout (mobile/tablet):
- Left: Hamburger icon (animated → X on open)
- Center: Logo
- Right: Search + Cart icon only
- On open: Full-screen slide-in menu from left, showing all nav links + social links

Behaviors:
- Sticky on scroll with backdrop-blur and shadow
- Background transitions from transparent (hero) to var(--color-nav-bg) on scroll
- Active link underline animation using Framer Motion
- Cart/Wishlist counts from React Context or Zustand store

Styling:
- Font: font-ui for nav links
- Border-bottom: 1px solid var(--color-border) when scrolled
- Dark mode: nav background becomes var(--color-nav-bg) dark variant
```

---

### 🔷 Section 03 — Hero Banner Carousel

**Prompt:**
```
Create a `HeroBanner` component using Embla Carousel for a Korean skincare homepage.

Slide 1:
- Left panel (60%): Tag "New Collection 2025", Heading "Glass Skin Starts Here" (Cormorant Garamond, 72px), Sub "Discover authentic COSRX, Laneige & more — delivered across Bangladesh", Two CTA buttons: "Shop Now" (filled, pill) + "Explore Brands" (outlined, pill)
- Right panel (40%): Full-bleed product editorial image with a soft peach/pink gradient overlay

Slide 2:
- Full-width overlay layout with centered text on a mood image
- "Korean Beauty ✦ Redefined for Bangladesh"

Slide 3:
- Grid layout: text left, 2 product images stacked right
- "Your Summer SPF Edit" seasonal promo

Carousel settings:
- Auto-play every 5 seconds
- Dot indicators (small, pill-shaped, at bottom-center)
- Left/right chevron arrows (visible on desktop, hidden on mobile)
- Smooth slide transition with Framer Motion crossfade

Responsive:
- Mobile: Single stacked column, image below text, reduced font sizes
- Tablet: Side-by-side but 50/50
- Desktop: 60/40 split

Dark mode: Adjust overlay opacities to keep text readable
```

---

### 🔷 Section 04 — Brand Logo Strip

**Prompt:**
```
Build a `BrandStrip` component — an infinitely scrolling horizontal ticker of brand logos.

Brands to include: COSRX, Laneige, Some By Mi, Etude House, Innisfree, The Ordinary, Cetaphil, La Roche-Posay, Missha, Sulwhasoo, Klairs, Torriden, Beauty of Joseon, Pyunkang Yul

Design:
- Section title: "Brands We Carry" (small uppercase label, centered above)
- Logos in a row that loops endlessly left using CSS animation (marquee-style)
- Logos: grayscale by default, full color on hover
- Light mode: white background with subtle top/bottom border
- Dark mode: var(--color-surface) background
- Pause animation on hover
- Fade masks on left/right edges using CSS gradients
- Height: 80px, logos max-height 40px
- Use two identical sets of logos for seamless loop

Responsive: Same on all devices, just adjust speed on mobile
```

---

### 🔷 Section 05 — Category Showcase

**Prompt:**
```
Create a `CategoryShowcase` section component for a skincare site.

Categories: Cleanser, Toner, Serum, Moisturizer, SPF/Sunscreen, Eye Care, Sheet Masks, Lip Care, Body Care, Men's Skincare

Layout (desktop): Horizontal scroll row of 5–6 visible category tiles
Layout (mobile): 2×N grid

Each tile:
- Rounded square card (var(--radius-card))
- Soft gradient background unique per category (e.g., Toner = #B8E0D2 → #D8F0E8)
- Product illustration or icon centered
- Category name below in font-ui, small caps
- On hover: slight scale up (1.04), shadow increase, slight color shift

Section heading: "Shop by Category" — DM Serif Display, large
Sub-heading: "Find exactly what your skin needs"

Fetch categories from Medusa: `GET /store/product-categories`
Show skeleton loaders while fetching
```

---

### 🔷 Section 06 — Featured Products (Best Sellers)

**Prompt:**
```
Build a `FeaturedProducts` section for a Korean skincare ecommerce homepage.

Section header:
- Left: "Best Sellers" heading (DM Serif Display) + "What everyone's loving right now" subtitle
- Right: "View All →" link

Product Grid:
- Desktop: 4 columns
- Tablet: 3 columns
- Mobile: 2 columns

Each ProductCard includes:
- Image container with aspect-ratio 3/4, rounded corners, overflow hidden
  - On hover: zoom image to 1.08 scale (smooth transition)
  - "New" or "Sale -30%" badge (top-left, rounded pill, accent color)
  - Quick add-to-cart button appearing on hover (slide up from bottom of image)
  - Wishlist heart icon (top-right, toggle filled/outlined)
- Below image:
  - Brand name (small, muted, uppercase, Korean brands in Noto Sans KR)
  - Product name (font-body, medium weight, 2-line clamp)
  - Star rating (4.5★ with review count)
  - Price: "৳1,200" — if discounted: show original struck through + sale price in accent color
  - "Add to Cart" text button (subtle)

Fetch from Medusa: `GET /store/products?limit=8&order=created_at`
Skeleton: 8 placeholder cards while loading
Dark mode: cards use var(--color-bg-card) with subtle border
```

---

### 🔷 Section 07 — Promotional Split Banner

**Prompt:**
```
Create a `PromoBanner` two-column section.

Left tile (New Arrivals):
- Background: soft gradient #F9D4DC → #FDF0F2
- Dark mode: #2A1A1F → #3A2228
- Text: "Just Arrived 🌸", "Fresh From Korea", CTA: "Shop New In →"
- Right side of tile: product flat-lay image

Right tile (Sale):
- Background: soft gradient #D4EDD6 → #EAF5EA
- Dark mode: #1A2E1C → #22382A
- Text: "Up to 40% Off 🌿", "Limited Time Deals", CTA: "Grab Deals →"
- Right side of tile: collage of sale product images

Layout: Side by side on desktop, stacked on mobile
Both tiles: var(--radius-card) border radius, min-height 280px
Hover: subtle scale(1.01) and shadow increase
```

---

### 🔷 Section 08 — Trending Now Tab Grid

**Prompt:**
```
Create a `TrendingNow` tabbed product grid component.

Tabs: "All" | "Korean" | "Japanese" | "European" | "Under ৳500"

- Active tab: pill with var(--color-primary) background
- Inactive tabs: ghost style, hover highlights
- Tab switch: Framer Motion AnimatePresence fade transition

Each tab shows 8 products in a 4-col grid (same ProductCard component from Section 06)

Section title: "Trending Now" (DM Serif Display)
Subtitle: "What Bangladesh is adding to their routines"

Fetch: `GET /store/products?tags[]=trending` + filter by Korean/Japanese/European collection tag
Show "Load More" button at bottom (not pagination — append more products)
```

---

### 🔷 Section 09 — Editorial Story Section

**Prompt:**
```
Build an `EditorialSection` component — magazine-style storytelling block.

Layout (desktop): 
- Left 45%: Full-height image of a Korean skincare routine flat-lay
- Right 55%: Content area with generous padding

Content:
- Eyebrow label: "Why K-Beauty?" (uppercase, tracked, var(--color-primary))
- Headline: "The Science Behind Glass Skin" (Cormorant Garamond, 48px)
- Body: 2–3 short paragraphs about Korean skincare philosophy, layering, and authenticity
- 3 icon+text feature rows: "Multi-step routines", "Gentle, skin-first formulas", "Clinical-grade ingredients"
- CTA: "Read Our Skincare Guide →"

Layout (mobile): Image on top, content below
Scroll-triggered entrance animation: image slides in from left, text fades in from right
Dark mode: Deep moody overlay on image
```

---

### 🔷 Section 10 — Skin Concern Finder

**Prompt:**
```
Create a `SkinConcernFinder` interactive widget.

Heading: "Find Your Routine" (DM Serif Display)
Sub: "Tell us your skin type and concerns — we'll find your perfect products"

Step 1 — Skin Type (icon buttons): Oily | Dry | Combination | Sensitive | Normal
Step 2 — Concern (multi-select chips): Acne | Dark Spots | Dullness | Aging | Hydration | Pores | Redness
Step 3 — CTA: "Show My Routine →"

On submit: Navigate to `/shop?skin_type=oily&concern=acne` (Medusa collection filter URL)

Design:
- Card with soft shadow, rounded corners, centered max-width 720px
- Each selection: pill chip, selected = var(--color-primary) bg with white text
- Step indicator dots at top
- Framer Motion slide transitions between steps
- Background: var(--color-surface) 
```

---

### 🔷 Section 11 — UGC / Instagram Gallery

**Prompt:**
```
Build an `InstagramGallery` static mosaic component.

Layout: 3×2 grid on desktop, 2×3 on tablet, 2×N on mobile
6 tiles: mix of square and slightly taller images

Each tile:
- On hover: overlay with @username, heart icon, and "Shop This Look →" text
- Overlay background: semi-transparent var(--color-primary) gradient
- Smooth scale + opacity transition

Section header: "Tag us @glowhausbd" + Instagram icon
Sub: "Show us your glow routine"

Note: Images are static/placeholder — add a CMS or Instagram API integration note in comments
```

---

### 🔷 Section 12 — Reviews / Testimonials

**Prompt:**
```
Create a `Testimonials` carousel section.

Section heading: "Loved by 10,000+ Glowers Across Bangladesh"

Each testimonial card:
- Star rating (5 stars, accent gold color)
- Quote text (italic, Cormorant Garamond)
- Reviewer name + city (e.g., "Tasnim R. — Dhaka")
- Product purchased (with small product thumbnail image)

Layout: Auto-scrolling carousel, 3 visible on desktop, 1 on mobile
Navigation: dot indicators + left/right arrows

Design:
- Card background: var(--color-bg-card)
- Soft border: 1px solid var(--color-border)
- Rounded corners: var(--radius-card)
- Quote marks: large decorative Cormorant Garamond " " in var(--color-primary), very low opacity

Data: Static JSON array of 8–10 testimonials (Medusa reviews integration optional via plugin)
```

---

### 🔷 Section 13 — Trust Badges

**Prompt:**
```
Create a `TrustBadges` full-width section with 5 feature icons.

Items:
1. ✓ 100% Authentic Products — "Sourced directly from Korean brands"
2. 🚚 Nationwide Delivery — "Dhaka: 24–48hrs, Outside: 3–5 days"
3. 💳 Cash on Delivery — "Available across Bangladesh"
4. 🔄 Easy Returns — "7-day hassle-free return policy"
5. 💬 Expert Support — "Skincare consultation via WhatsApp"

Layout: 5 columns on desktop, 3+2 grid on tablet, 2-col on mobile
Each badge: icon (stroke style, 32px), bold label, small muted description below
Background: var(--color-surface)
Dividers between items on desktop
Subtle entrance animation: stagger-fade-in on scroll
```

---

### 🔷 Section 14 — Newsletter Signup

**Prompt:**
```
Build a `NewsletterSection` component with a beautiful animated background.

Content:
- Headline: "Join the Glow Club 🌸" (Cormorant Garamond, large)
- Sub: "Get skincare tips, exclusive deals & early access to new arrivals"
- Email input + "Subscribe" pill button (side by side on desktop, stacked on mobile)
- Below: Small text "We respect your privacy. Unsubscribe anytime."

Background:
- Light mode: Soft radial gradient #FDF0F5 → #FDE8F0, with floating petal SVG animations
- Dark mode: Deep rose radial gradient #1A0D12 → #2A1520

Floating petals: 8–12 small SVG cherry blossom shapes, slow drift animation (CSS keyframes)
Form submit: POST to `/api/newsletter` Next.js API route → integrate with Mailchimp or Klaviyo
Success state: Replace form with "🌸 You're in! Check your inbox." animated reveal
```

---

### 🔷 Section 15 — Footer

**Prompt:**
```
Create a comprehensive `Footer` component for GlowHaus BD.

Top section (4 columns):
- Col 1: Logo + tagline "Authentic K-Beauty, Delivered to Your Door" + social icons (Instagram, Facebook, TikTok, YouTube)
- Col 2: Shop links (All Products, New Arrivals, Best Sellers, Sale, Brands, Gift Sets)
- Col 3: Help links (Shipping Policy, Return Policy, FAQ, Track Order, WhatsApp Support)
- Col 4: About links (Our Story, Blog, Skin Concern Guide, Careers, Contact)

Bottom bar:
- Left: "© 2025 GlowHaus BD. All rights reserved."
- Center: Payment method icons (bKash, Nagad, Visa, Mastercard, COD)
- Right: "Designed with 🌸 in Dhaka"

Design:
- Background: var(--color-surface)
- Top border: 1px solid var(--color-border)
- Font: font-ui, small
- Social icons: 32px circle buttons with hover color
- Mobile: Single column stacked layout, sections collapsible with accordion
- Dark mode: deeper surface color, lighter text

IMPORTANT: Add "bKash" and "Nagad" payment badges prominently — most relevant for Bangladeshi customers
```

---

## 7. Dark / Light Theme Implementation

### `src/providers/ThemeProvider.tsx`
```typescript
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: "light", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("glowhaus-theme") as Theme;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark" : "light";
    const resolved = stored || preferred;
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("glowhaus-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### Theme Toggle Button Component
```
Create a `ThemeToggle` button component:
- Sun icon for light mode (yellow warm glow)
- Moon icon for dark mode (cool blue-gray)
- Animated transition: icon rotates 180° and fades as theme changes (Framer Motion)
- Shape: 36px circle, border: 1px solid var(--color-border)
- Tooltip: "Switch to dark/light mode"
- Keyboard accessible (aria-label, focus ring)
```

---

## 8. Medusa Integration Points

### Data Fetching Strategy
```typescript
// src/lib/medusa.ts
import Medusa from "@medusajs/js-sdk";

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
});
```

### Key API Endpoints Used

| Section | Endpoint | Notes |
|---|---|---|
| Best Sellers | `GET /store/products?order=created_at&limit=8` | Add `is_featured` tag in Medusa |
| Categories | `GET /store/product-categories` | Create categories in Medusa admin |
| Trending | `GET /store/products?tags[]=trending` | Tag products in admin |
| Hero promo | `GET /store/collections?handle=new-arrivals` | Create collections |
| Cart | `POST /store/carts` + `POST /store/carts/:id/line-items` | Standard cart flow |

### Server Components (Next.js App Router)
```typescript
// app/page.tsx — homepage is a Server Component for initial data
import { medusa } from "@/lib/medusa";

export default async function HomePage() {
  const { products: bestSellers } = await medusa.store.product.list({
    limit: 8,
    fields: "+thumbnail,+variants.calculated_price",
  });

  const { product_categories } = await medusa.store.productCategory.list();

  return (
    <main>
      <HeroBanner />
      <BrandStrip />
      <CategoryShowcase categories={product_categories} />
      <FeaturedProducts products={bestSellers} />
      {/* ... */}
    </main>
  );
}
```

---

## 9. Performance & SEO Checklist

### Performance
- [ ] Use `next/image` for all product images with `sizes` prop
- [ ] Implement React Suspense + skeleton loaders for all Medusa fetches
- [ ] Lazy-load below-the-fold sections with `dynamic(() => import(...), { ssr: false })`
- [ ] Preload hero image with `priority` prop on `next/image`
- [ ] Font preconnect in `layout.tsx`: `<link rel="preconnect" href="https://fonts.googleapis.com">`
- [ ] Use Next.js built-in Image Optimization (WebP/AVIF)
- [ ] Minimize Framer Motion bundle with `LazyMotion` + `domAnimation`

### SEO
- [ ] Metadata in `app/layout.tsx`: title, description, OG image, Twitter card
- [ ] Structured data (JSON-LD) for products: `Product`, `Organization`, `WebSite`
- [ ] Canonical URLs via `generateMetadata` in each route
- [ ] `robots.txt` + `sitemap.xml` via Next.js file conventions
- [ ] Bengali language alt text on product images
- [ ] LocalBusiness schema with Dhaka address for local SEO

### Accessibility
- [ ] WCAG 2.1 AA contrast ratios for all text/background combos
- [ ] All interactive elements keyboard-navigable
- [ ] `aria-label` on icon-only buttons
- [ ] Skip navigation link at top of page
- [ ] Reduced motion: wrap all animations in `@media (prefers-reduced-motion: no-preference)`

---

## 10. File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Homepage (Server Component)
│   ├── globals.css
│   └── (store)/
│       ├── shop/page.tsx
│       ├── product/[handle]/page.tsx
│       └── cart/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── AnnouncementBar.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── BrandStrip.tsx
│   │   ├── CategoryShowcase.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── PromoBanner.tsx
│   │   ├── TrendingNow.tsx
│   │   ├── EditorialSection.tsx
│   │   ├── SkinConcernFinder.tsx
│   │   ├── InstagramGallery.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TrustBadges.tsx
│   │   └── NewsletterSection.tsx
│   │
│   └── ui/
│       ├── ProductCard.tsx
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── SkeletonCard.tsx
│       ├── StarRating.tsx
│       └── SearchOverlay.tsx
│
├── lib/
│   ├── medusa.ts
│   └── utils.ts
│
├── providers/
│   └── ThemeProvider.tsx
│
├── hooks/
│   ├── useCart.ts
│   └── useWishlist.ts
│
└── styles/
    └── globals.css
```

---

## 💡 Quick Start Order

Follow this sequence to build the homepage efficiently:

1. **Setup** → Project init, dependencies, env vars, Tailwind config
2. **Design System** → globals.css tokens, ThemeProvider
3. **Layout Shell** → AnnouncementBar, Navbar, Footer (always visible)
4. **Hero** → HeroBanner with placeholder images
5. **Product Infrastructure** → Medusa client, ProductCard component
6. **Core Sections** → CategoryShowcase → FeaturedProducts → TrendingNow
7. **Supporting Sections** → BrandStrip → PromoBanner → Editorial → TrustBadges
8. **Engagement** → SkinConcernFinder → Testimonials → Newsletter
9. **Refinement** → Animations, dark mode polish, mobile testing
10. **Launch** → SEO metadata, structured data, Lighthouse audit

---

*Document maintained by: GlowHaus BD Dev Team*  
*Last updated: March 2025*  
*Stack: Next.js 15 App Router · Medusa v2 · Tailwind CSS v4 · Framer Motion*