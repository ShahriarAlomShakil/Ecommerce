import { listCategories } from "@lib/data/categories"

export async function GET() {
  try {
    const categories = await listCategories()

    if (!categories) {
      return Response.json([])
    }

    return Response.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return Response.json([], { status: 500 })
  }
}
