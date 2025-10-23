import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const updates = await request.json()

    // Validate campaign exists
    if (!id) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 })
    }

    // Update campaign
    const updatedCampaign = {
      id,
      ...updates,
      updatedAt: new Date(),
    }

    console.log("[v0] Campaign updated:", id)
    return NextResponse.json(updatedCampaign)
  } catch (error) {
    console.error("[v0] Campaign update error:", error)
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 })
  }
}
