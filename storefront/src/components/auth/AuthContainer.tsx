import React from "react"

interface AuthContainerProps {
	title: string
	subtitle?: string
	children: React.ReactNode
}

const AuthContainer = ({ title, subtitle, children }: AuthContainerProps) => {
	return (
		<div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center px-4 py-10">
			<div className="w-full rounded-card border border-border bg-bg-card p-6 shadow-card sm:p-8">
				<div className="mb-6 text-center">
					<h1 className="font-heading text-3xl text-[var(--color-text)]">{title}</h1>
					{subtitle ? (
						<p className="mt-2 font-body text-sm text-muted">{subtitle}</p>
					) : null}
				</div>
				{children}
			</div>
		</div>
	)
}

export default AuthContainer
