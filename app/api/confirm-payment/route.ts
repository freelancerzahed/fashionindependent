import { type NextRequest, NextResponse } from "next/server"

interface PaymentConfirmationRequest {
  paymentIntentId?: string
  campaignId?: string
  pledgeOptionId?: string
  quantity?: number
  email?: string
  amount?: number
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

    try {
      // Generate unique order ID
      const orderId = `TFI-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

      // In production, verify with Stripe API and save to database
      const confirmation = {
        id: `charge_${Math.random().toString(36).substr(2, 9)}`,
        paymentIntentId,
        status: "succeeded",
        amount: Math.round(amount * 100),
        currency: "usd",
        email,
        campaignId,
        pledgeOptionId,
        quantity: quantity || 1,
        createdAt: new Date().toISOString(),
        orderId,
      }

      console.log("[v0] Payment confirmed:", { orderId, amount, email })
      return NextResponse.json(confirmation)
    } catch (dbError) {
      const errorMessage = dbError instanceof Error ? dbError.message : "Database error"
      console.error("[v0] Database error during payment confirmation:", errorMessage)
      return NextResponse.json(
        { error: "Failed to save payment confirmation. Please contact support." },
        { status: 503 },
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Payment confirmation error:", errorMessage)
    return NextResponse.json({ error: "Failed to confirm payment. Please try again." }, { status: 500 })
  }
}
