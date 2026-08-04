import { NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${BACKEND_URL}/auth/password/confirm_reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    return NextResponse.json(
      { result: false, message: error instanceof Error ? error.message : "Failed to connect to backend" },
      { status: 500 }
    )
  }
}
