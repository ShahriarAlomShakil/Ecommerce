import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  process.env.MEDUSA_PUBLISHABLE_KEY

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    )
  }

  try {
    const loginResponse = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(PUBLISHABLE_KEY
          ? { "x-publishable-api-key": PUBLISHABLE_KEY }
          : {}),
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await loginResponse.json().catch(() => ({}))

    if (!loginResponse.ok || !data?.token) {
      return NextResponse.json(
        {
          message:
            data?.message ||
            data?.error ||
            "Email or password is incorrect. Try again.",
        },
        { status: loginResponse.status || 401 }
      )
    }

    const response = NextResponse.json({ success: true, token: data.token })

    response.cookies.set({
      name: "_medusa_jwt",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json(
      { message: "Connection failed. Please try again." },
      { status: 500 }
    )
  }
}
