import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const params = url.searchParams
    const backendUrl = new URL(`${BACKEND_URL}/press-media-kit`)

    params.forEach((value, key) => backendUrl.searchParams.append(key, value))

    const res = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const text = await res.text()
    try {
      const data = JSON.parse(text)
      return NextResponse.json(data, { status: res.status })
    } catch {
      return NextResponse.json({ error: "Invalid backend response" }, { status: 502 })
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("[Press Media Kit Proxy] Error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
