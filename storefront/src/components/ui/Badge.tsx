import { cn } from "@lib/utils"

type BadgeVariant = "accent" | "new" | "ghost"

type BadgeProps = {
	children: React.ReactNode
	className?: string
	variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
	accent:
		"bg-[var(--color-accent)] text-white shadow-[0_8px_20px_rgba(212,168,83,0.28)]",
	new: "bg-[var(--color-primary)] text-white shadow-[0_8px_20px_rgba(194,116,138,0.22)]",
	ghost:
		"border border-[var(--color-border)] bg-[rgba(255,255,255,0.82)] text-[var(--color-text)] backdrop-blur-sm dark:bg-[rgba(30,30,30,0.82)]",
}

export default function Badge({
	children,
	className,
	variant = "accent",
}: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.18em]",
				variantStyles[variant],
				className
			)}
		>
			{children}
		</span>
	)
}
