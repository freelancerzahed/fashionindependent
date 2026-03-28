import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/mirrormefashion/api/v2"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      )
    }

    // Read the raw body without parsing as FormData
    const buffer = await request.arrayBuffer()
    const contentType = request.headers.get("content-type")

    console.log("[API Upload] Content-Type:", contentType)
    console.log("[API Upload] Buffer size:", buffer.byteLength)

    // Forward the request to the backend with the exact same content-type and body
    const response = await fetch(`${BACKEND_URL}/creator/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": contentType || "multipart/form-data",
      },
      body: buffer,
    })

    console.log("[API Upload] Backend response status:", response.status)
    
    const responseText = await response.text()

    if (!responseText) {
      return NextResponse.json(
        { error: "Empty response from backend" },
        { status: 500 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("[API Upload] Failed to parse response:", responseText.substring(0, 200))
      return NextResponse.json(
        { error: `Backend response: ${responseText.substring(0, 200)}` },
        { status: response.status || 500 }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[API Upload] Error:", errorMsg)
    return NextResponse.json(
      { error: "Upload failed: " + errorMsg },
      { status: 500 }
    )
  }
}
