import { cn } from "@lib/utils"

type SkeletonCardProps = {
	className?: string
}

export default function SkeletonCard({ className }: SkeletonCardProps) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 shadow-[var(--shadow-card)]",
				className
			)}
			aria-hidden="true"
		>
			<div className="aspect-[3/4] animate-pulse rounded-[calc(var(--radius-card)-4px)] bg-[rgba(194,116,138,0.12)] dark:bg-[rgba(255,143,163,0.08)]" />

			<div className="mt-4 space-y-3">
				<div className="h-3 w-20 animate-pulse rounded-full bg-[rgba(194,116,138,0.12)] dark:bg-[rgba(255,143,163,0.08)]" />
				<div className="space-y-2">
					<div className="h-4 w-full animate-pulse rounded-full bg-[rgba(194,116,138,0.12)] dark:bg-[rgba(255,143,163,0.08)]" />
					<div className="h-4 w-4/5 animate-pulse rounded-full bg-[rgba(194,116,138,0.12)] dark:bg-[rgba(255,143,163,0.08)]" />
				</div>
				<div className="h-4 w-28 animate-pulse rounded-full bg-[rgba(194,116,138,0.12)] dark:bg-[rgba(255,143,163,0.08)]" />
				<div className="flex items-end justify-between gap-3 pt-1">
					<div className="space-y-2">
						<div className="h-3 w-16 animate-pulse rounded-full bg-[rgba(194,116,138,0.12)] dark:bg-[rgba(255,143,163,0.08)]" />
						<div className="h-5 w-24 animate-pulse rounded-full bg-[rgba(194,116,138,0.12)] dark:bg-[rgba(255,143,163,0.08)]" />
					</div>
					<div className="h-9 w-24 animate-pulse rounded-full bg-[rgba(194,116,138,0.12)] dark:bg-[rgba(255,143,163,0.08)]" />
				</div>
			</div>
		</div>
	)
}
