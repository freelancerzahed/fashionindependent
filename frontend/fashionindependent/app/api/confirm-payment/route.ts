import { type NextRequest, NextResponse } from "next/server"
import { proxyStripeRequest } from "@/lib/stripe-backend-proxy"

interface PaymentConfirmationRequest {
  paymentIntentId?: string
  campaignId?: string
  pledgeOptionId?: string
  quantity?: number
  email?: string
  amount?: number
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentConfirmationRequest = await request.json()
    const { paymentIntentId, campaignId, pledgeOptionId, quantity, email, amount } = body

    if (!paymentIntentId || !campaignId || !email || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: paymentIntentId, campaignId, email, amount" },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    const { status, body: responseBody } = await proxyStripeRequest("confirm-payment", {
      paymentIntentId,
      campaignId,
      pledgeOptionId,
      quantity: quantity || 1,
      email,
      amount,
      ...body,
    })

    return NextResponse.json(responseBody, { status })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Stripe] Confirm Payment Error:", errorMessage)
    return NextResponse.json({ error: "Failed to confirm payment. Please try again." }, { status: 500 })
  }
}
