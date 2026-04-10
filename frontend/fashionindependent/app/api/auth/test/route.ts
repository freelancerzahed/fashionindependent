import { type NextRequest, NextResponse } from "next/server"

/**
 * Debug endpoint to test authentication token directly
 * GET /api/auth/test
 * Authorization: Bearer <token>
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "") || ""

    console.log("[Auth Test] Debug endpoint called", {
      hasAuthHeader: !!authHeader,
      tokenPreview: token ? token.substring(0, 30) + "..." : "no token",
      tokenLength: token.length,
    })

    // Call backend to test the token
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/mirrormefashion/api/v2"
    const testUrl = `${backendUrl}/auth/test`

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Authorization": authHeader || "",
        "Accept": "application/json",
      },
    })

    const data = await response.text()

    return NextResponse.json(
      {
        debug: true,
        tokenSent: !!authHeader,
        backendUrl,
        backendStatus: response.status,
        backendResponse: data.substring(0, 500),
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
