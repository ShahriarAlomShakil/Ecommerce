import { redirect } from "next/navigation"

export default async function ShopPage(props: {
	params: Promise<{ countryCode: string }>
}) {
	const { countryCode } = await props.params

	redirect(`/${countryCode}/store`)
}