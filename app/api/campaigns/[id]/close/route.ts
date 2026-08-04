import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 })
    }

    // Close campaign and trigger payout calculation
    const closedCampaign = {
      id,
      status: "closed",
      closedAt: new Date(),
    }

    console.log("[v0] Campaign closed:", id)
    return NextResponse.json(closedCampaign)
  } catch (error) {
    console.error("[v0] Campaign close error:", error)
    return NextResponse.json({ error: "Failed to close campaign" }, { status: 500 })
  }
}
