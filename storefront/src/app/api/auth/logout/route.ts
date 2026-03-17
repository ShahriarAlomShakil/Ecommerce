import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: "_medusa_jwt",
    value: "",
    maxAge: -1,
    path: "/",
  })

  return response
}
