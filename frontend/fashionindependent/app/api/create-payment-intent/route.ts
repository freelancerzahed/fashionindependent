import { type NextRequest, NextResponse } from "next/server"
import { proxyStripeRequest } from "@/lib/stripe-backend-proxy"

interface PaymentIntentRequest {
  amount?: number
  campaignId?: string
  pledgeOptionId?: string
  quantity?: number
  email?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentIntentRequest = await request.json()
    const { amount, campaignId, pledgeOptionId, quantity, email } = body

    if (!amount || !campaignId || !pledgeOptionId || !email) {
      return NextResponse.json(
        { error: "Missing required fields: amount, campaignId, pledgeOptionId, email" },
        { status: 400 },
      )
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const { status, body: responseBody } = await proxyStripeRequest("create-payment-intent", {
      amount: Math.round(amount * 100),
      currency: "usd",
      campaignId,
      pledgeOptionId,
      quantity: quantity || 1,
      email,
    })

    return NextResponse.json(responseBody, { status })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Stripe] Payment Intent Error:", errorMessage)
    const responseBody: Record<string, unknown> = {
      error: "Failed to create payment intent. Please try again.",
      debug: process.env.NODE_ENV !== "production" ? errorMessage : undefined,
    }
    return NextResponse.json(responseBody, { status: 500 })
  }
}
