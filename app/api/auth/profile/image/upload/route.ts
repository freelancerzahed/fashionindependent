import { type NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const contentType = request.headers.get("content-type") || ""

    // If multipart form-data, forward formData
    if (contentType.includes("multipart/form-data") || contentType.includes("form-data")) {
      const formData = await request.formData()

      // Forward to backend
      const response = await fetch(`${BACKEND_URL}/auth/profile/image/upload`, {
        method: "POST",
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: formData as any,
      })

      const text = await response.text()
      try {
        const data = JSON.parse(text)
        return NextResponse.json(data, { status: response.status })
      } catch {
        return NextResponse.json({ raw: text }, { status: response.status })
      }
    }

    // If not multipart, attempt to forward raw body
    const bodyText = await request.text()
    const response = await fetch(`${BACKEND_URL}/auth/profile/image/upload`, {
      method: "POST",
      headers: {
        "Content-Type": contentType || "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: bodyText,
    })

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      return NextResponse.json(data, { status: response.status })
    } catch {
      return NextResponse.json({ raw: text }, { status: response.status })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("[Profile Image Upload Proxy] Error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Allow": "POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  })
}
