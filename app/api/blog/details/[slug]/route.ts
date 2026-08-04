import { type NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const backendUrl = `${BACKEND_URL}/blog-details/${encodeURIComponent(slug)}`

    const res = await fetch(backendUrl, {
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
    console.error("[Blog Details Proxy] Error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
