import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const csrfToken = request.headers.get("x-csrf-token")
    const cookieHeader = request.headers.get("cookie") || ""

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${BACKEND_URL}/carts`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        Cookie: cookieHeader,
      },
      body: await request.text(),
    })

    const contentType = response.headers.get("content-type") || ""
    const body = contentType.includes("application/json") ? await response.json() : await response.text()

    return NextResponse.json(body, { status: response.status })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed to fetch cart", details: errorMessage }, { status: 500 })
  }
}
