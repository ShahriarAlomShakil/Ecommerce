import { NextResponse } from "next/server"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeMailchimpServerPrefix(apiKey: string): string {
  const fromKey = apiKey.split("-")[1]
  return process.env.MAILCHIMP_SERVER_PREFIX || fromKey || ""
}

async function subscribeWithKlaviyo(email: string) {
  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (!apiKey || !listId) return false

  const response = await fetch("https://a.klaviyo.com/client/subscriptions/?company_id=" + apiKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Revision: "2025-01-15",
    },
    body: JSON.stringify({
      data: {
        type: "subscription",
        attributes: {
          profile: {
            data: {
              type: "profile",
              attributes: {
                email,
              },
            },
          },
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: listId,
            },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    const details = await response.text().catch(() => "")
    throw new Error(`Klaviyo subscription failed (${response.status}): ${details}`)
  }

  return true
}

async function subscribeWithMailchimp(email: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

  if (!apiKey || !audienceId) return false

  const serverPrefix = normalizeMailchimpServerPrefix(apiKey)
  if (!serverPrefix) {
    throw new Error("Mailchimp server prefix is missing")
  }

  const response = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`any:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    }
  )

  if (!response.ok && response.status !== 400) {
    const details = await response.text().catch(() => "")
    throw new Error(`Mailchimp subscription failed (${response.status}): ${details}`)
  }

  return true
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body?.email === "string" ? body.email.trim() : ""

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      )
    }

    let provider = "none"

    try {
      const klaviyoSubscribed = await subscribeWithKlaviyo(email)
      if (klaviyoSubscribed) {
        provider = "klaviyo"
      } else {
        const mailchimpSubscribed = await subscribeWithMailchimp(email)
        if (mailchimpSubscribed) {
          provider = "mailchimp"
        }
      }
    } catch (providerError) {
      console.error("Newsletter provider error:", providerError)
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, email, provider })
  } catch (error) {
    console.error("Newsletter API Error:", error)
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    )
  }
}
