import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params
    const authHeader = request.headers.get("authorization")

    const response = await fetch(`${BACKEND_URL}/creator/documents/type/${type}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      return NextResponse.json(data, { status: response.status })
    } catch {
      return NextResponse.json({ error: "Invalid backend response" }, { status: 502 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("[Creator Documents Delete Proxy] Error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
