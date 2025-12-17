import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { eventType, campaignId, userId, metadata } = await request.json()

    if (!eventType) {
      return NextResponse.json({ error: "Missing event type" }, { status: 400 })
    }

    const event = {
      id: `analytics_${Math.random().toString(36).substr(2, 9)}`,
      eventType, // 'page_view', 'campaign_view', 'pledge_started', 'pledge_completed'
      campaignId,
      userId,
      metadata,
      timestamp: new Date(),
    }

    console.log("[v0] Analytics event tracked:", event.id)
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("[v0] Analytics tracking error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
