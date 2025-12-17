import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { quantity, status } = await request.json()
    const { id } = await context.params

    console.log(`[v0] Updating inventory for product ${id}:`, {
      quantity,
      status,
    })

    return NextResponse.json({
      success: true,
      message: "Inventory updated successfully",
      productId: id,
      quantity,
      status,
    })
  } catch (error) {
    console.error("Inventory update error:", error)
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
  }
}
