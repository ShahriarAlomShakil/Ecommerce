import { Star } from "lucide-react"
import { cn } from "@lib/utils"

type StarRatingProps = {
	rating?: number
	reviewCount?: number
	className?: string
}

export default function StarRating({
	rating = 4.5,
	reviewCount,
	className,
}: StarRatingProps) {
	const clampedRating = Math.max(0, Math.min(5, rating))
	const width = `${(clampedRating / 5) * 100}%`

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="relative inline-flex">
				<div className="flex text-[var(--color-border)] dark:text-[rgba(255,255,255,0.16)]">
					{Array.from({ length: 5 }).map((_, index) => (
						<Star key={`empty-${index}`} className="h-4 w-4 fill-current" />
					))}
				</div>
				<div
					className="absolute inset-y-0 left-0 overflow-hidden text-[var(--color-accent)]"
					style={{ width }}
				>
					<div className="flex w-max">
						{Array.from({ length: 5 }).map((_, index) => (
							<Star key={`filled-${index}`} className="h-4 w-4 fill-current" />
						))}
					</div>
				</div>
			</div>

			<span className="font-ui text-xs font-medium text-[var(--color-text-muted)]">
				{clampedRating.toFixed(1)}
				{typeof reviewCount === "number" ? ` (${reviewCount})` : ""}
			</span>
		</div>
	)
}
