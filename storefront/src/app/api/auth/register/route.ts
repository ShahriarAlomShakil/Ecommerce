import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  process.env.MEDUSA_PUBLISHABLE_KEY

export async function POST(req: NextRequest) {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    newsletter_opted_in,
  } = await req.json()

  if (!email || !password || !first_name || !last_name || !phone) {
    return NextResponse.json(
      { message: "Please fill in all required fields" },
      { status: 400 }
    )
  }

  try {
    const registerTokenResponse = await fetch(
      `${BACKEND_URL}/auth/customer/emailpass/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(PUBLISHABLE_KEY
            ? { "x-publishable-api-key": PUBLISHABLE_KEY }
            : {}),
        },
        body: JSON.stringify({ email, password }),
      }
    )

    const registerTokenData = await registerTokenResponse.json().catch(() => ({}))

    if (!registerTokenResponse.ok || !registerTokenData?.token) {
      const message =
        registerTokenData?.message ||
        registerTokenData?.error ||
        "Unable to create account"

      return NextResponse.json({ message }, { status: registerTokenResponse.status || 400 })
    }

    const customerResponse = await fetch(`${BACKEND_URL}/store/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${registerTokenData.token}`,
        ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name,
        phone,
        metadata: {
          newsletter_opted_in: !!newsletter_opted_in,
          source: "web_signup",
          signup_date: new Date().toISOString(),
        },
      }),
    })

    const customerData = await customerResponse.json().catch(() => ({}))

    if (!customerResponse.ok) {
      const message =
        customerData?.message || customerData?.error || "Unable to complete registration"

      return NextResponse.json({ message }, { status: customerResponse.status || 400 })
    }

    const loginResponse = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
      },
      body: JSON.stringify({ email, password }),
    })

    const loginData = await loginResponse.json().catch(() => ({}))

    if (!loginResponse.ok || !loginData?.token) {
      return NextResponse.json(
        { message: "Account created, but auto-login failed. Please sign in." },
        { status: 201 }
      )
    }

    const response = NextResponse.json(
      { success: true, token: loginData.token, customer: customerData?.customer },
      { status: 201 }
    )

    response.cookies.set({
      name: "_medusa_jwt",
      value: loginData.token,
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
