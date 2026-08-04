import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { campaignId, serviceType, quantity, specifications } = await request.json()

    if (!campaignId || !serviceType || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate manufacturing cost based on service tier
    const serviceCosts = {
      basic: 2500,
      premium: 5000,
      enterprise: 10000,
    }

    const cost = serviceCosts[serviceType as keyof typeof serviceCosts] || 0

    const order = {
      id: `mfg_${Math.random().toString(36).substr(2, 9)}`,
      campaignId,
      serviceType,
      quantity,
      specifications,
      cost,
      status: "pending",
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }

    console.log("[v0] Manufacturing order created:", order.id)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("[v0] Manufacturing order error:", error)
    return NextResponse.json({ error: "Failed to create manufacturing order" }, { status: 500 })
  }
}
