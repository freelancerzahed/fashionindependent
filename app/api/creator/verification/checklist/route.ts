import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    const response = await fetch(`${BACKEND_URL}/creator/verification/checklist`, {
      method: "GET",
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
    console.error("[Creator Verification Checklist Proxy] Error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
