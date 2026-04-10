import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { campaignId, userId, amount, pledgeOptionId, affiliateId } = await request.json()

    // Validate input
    if (!campaignId || !userId || !amount || !pledgeOptionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    // Create pledge
    const pledge = {
      id: `pledge_${Math.random().toString(36).substr(2, 9)}`,
      campaignId,
      userId,
      amount,
      pledgeOptionId,
      affiliateId: affiliateId || null,
      status: "pending",
      createdAt: new Date(),
    }

    // If affiliate, track commission
    if (affiliateId) {
      console.log("[v0] Affiliate commission tracked:", affiliateId, amount)
    }

    console.log("[v0] Pledge created:", pledge.id)
    return NextResponse.json(pledge, { status: 201 })
  } catch (error) {
    console.error("[v0] Pledge creation error:", error)
    return NextResponse.json({ error: "Failed to create pledge" }, { status: 500 })
  }
}
