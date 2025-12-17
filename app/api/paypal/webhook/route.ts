import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook signature (in production, verify with PayPal)
    const eventType = body.event_type

    if (eventType === "CHECKOUT.ORDER.COMPLETED") {
      console.log("[v0] PayPal payment completed:", body.resource.id)
      // Process payment
    } else if (eventType === "CHECKOUT.ORDER.APPROVED") {
      console.log("[v0] PayPal payment approved:", body.resource.id)
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("[v0] PayPal webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
