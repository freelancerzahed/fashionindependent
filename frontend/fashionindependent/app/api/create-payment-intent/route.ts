import { type NextRequest, NextResponse } from "next/server"

interface PaymentIntentRequest {
  amount?: number
  campaignId?: string
  pledgeOptionId?: string
  quantity?: number
  email?: string
}

interface PaymentIntentResponse {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
  metadata: Record<string, string | number>
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentIntentRequest = await request.json()
    const { amount, campaignId, pledgeOptionId, quantity, email } = body

    // Validate all required fields
    if (!amount || !campaignId || !pledgeOptionId || !email) {
      return NextResponse.json(
        { error: "Missing required fields: amount, campaignId, pledgeOptionId, email" },
        { status: 400 },
      )
    }

    // Validate amount is positive
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      // In production, replace with actual Stripe API call:
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: Math.round(amount * 100),
      //   currency: 'usd',
      //   metadata: { campaignId, pledgeOptionId, quantity, email }
      // })

      const paymentIntent: PaymentIntentResponse = {
        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
        client_secret: `${Math.random().toString(36).substr(2, 24)}_secret_${Math.random().toString(36).substr(2, 24)}`,
        amount: Math.round(amount * 100),
        currency: "usd",
        status: "requires_payment_method",
        metadata: {
          campaignId,
          pledgeOptionId,
          quantity: quantity || 1,
          email,
        },
      }

      console.log("[v0] Payment intent created:", { id: paymentIntent.id, amount, email })
      return NextResponse.json(paymentIntent)
    } catch (apiError) {
      const errorMessage = apiError instanceof Error ? apiError.message : "Payment API error"
      console.error("[v0] Payment API error:", errorMessage)
      return NextResponse.json({ error: "Failed to create payment intent. Please try again later." }, { status: 503 })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Payment Intent Error:", errorMessage)
    return NextResponse.json({ error: "Failed to create payment intent. Please try again." }, { status: 500 })
  }
}
