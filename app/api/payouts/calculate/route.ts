import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { campaignId, totalRaised, manufacturingCost } = await request.json()

    if (!campaignId || !totalRaised) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate payout: Total - 10% platform fee - manufacturing costs
    const platformFee = totalRaised * 0.1
    const pledgeFee = 2 // $2 per pledge (approximate)
    const netPayout = totalRaised - platformFee - (manufacturingCost || 0)

    const payout = {
      id: `payout_${Math.random().toString(36).substr(2, 9)}`,
      campaignId,
      totalRaised,
      platformFee,
      pledgeFee,
      manufacturingCost: manufacturingCost || 0,
      netPayout: Math.max(0, netPayout),
      status: "pending",
      createdAt: new Date(),
    }

    console.log("[v0] Payout calculated:", payout.id)
    return NextResponse.json(payout)
  } catch (error) {
    console.error("[v0] Payout calculation error:", error)
    return NextResponse.json({ error: "Failed to calculate payout" }, { status: 500 })
  }
}
