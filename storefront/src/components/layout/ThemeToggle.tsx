"use client"

import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

import { cn } from "@lib/utils"
import { useTheme } from "@providers/ThemeProvider"

type ThemeToggleProps = {
	className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, toggleTheme } = useTheme()
	const isDark = theme === "dark"

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			title={isDark ? "Switch to light mode" : "Switch to dark mode"}
			className={cn(
				"relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[color:var(--color-bg-card)]/75 text-[var(--color-text)] shadow-sm backdrop-blur-sm transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
				className
			)}
		>
			<motion.span
				key={theme}
				initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
				animate={{ rotate: 0, opacity: 1, scale: 1 }}
				exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
				transition={{ duration: 0.25, ease: "easeInOut" }}
				className="absolute"
			>
				{isDark ? (
					<Moon className="h-4 w-4 text-slate-400" aria-hidden="true" />
				) : (
					<Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
				)}
			</motion.span>
		</button>
	)
}
