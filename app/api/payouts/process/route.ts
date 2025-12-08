import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { payoutId, paymentMethod, bankDetails } = await request.json()

    if (!payoutId || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process payout
    const processedPayout = {
      id: payoutId,
      status: "processed",
      paymentMethod,
      bankDetails,
      processedAt: new Date(),
    }

    console.log("[v0] Payout processed:", payoutId)
    return NextResponse.json(processedPayout)
  } catch (error) {
    console.error("[v0] Payout processing error:", error)
    return NextResponse.json({ error: "Failed to process payout" }, { status: 500 })
  }
}
