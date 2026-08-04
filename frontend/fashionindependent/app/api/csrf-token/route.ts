import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/csrf-token`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
    })

    const contentType = response.headers.get("content-type") || ""
    const body = contentType.includes("application/json") ? await response.json() : await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch CSRF token", details: body },
        { status: response.status }
      )
    }

    return NextResponse.json(body, { status: response.status })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "CSRF token request failed", details: errorMessage }, { status: 500 })
  }
}
