import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Homepage",
  description: "Homepage is being redesigned.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  await props.params

  return (
    <section className="glowhaus-container py-16">
      <div className="rounded-card border border-border bg-bg-card p-6 text-center text-sm text-muted">
        Homepage cleared for redesign.
      </div>
    </section>
  )
}
