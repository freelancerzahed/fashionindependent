import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { affiliateId, campaignId, eventType, metadata } = await request.json()

    if (!affiliateId || !campaignId || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Track affiliate event (click, conversion, etc.)
    const event = {
      id: `event_${Math.random().toString(36).substr(2, 9)}`,
      affiliateId,
      campaignId,
      eventType, // 'click', 'conversion', 'pledge'
      metadata,
      createdAt: new Date(),
    }

    console.log("[v0] Affiliate event tracked:", event.id)
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("[v0] Affiliate tracking error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
