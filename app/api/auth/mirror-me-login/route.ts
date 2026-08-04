import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, platform } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const apiUrl = process.env.MIRROR_ME_API_URL || "https://api.mirrormefashion.com"

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }
        throw new Error(`API returned ${response.status}`)
      }

      const data = await response.json()

      return NextResponse.json({
        token: data.token,
        user: data.user,
        platform: "mirror-me-fashion",
      })
    } catch (fetchError) {
      console.error("[v0] External API error:", fetchError)
      return NextResponse.json({ error: "Authentication service temporarily unavailable" }, { status: 503 })
    }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
