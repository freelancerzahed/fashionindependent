import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()

    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")

    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown middleware error"
    console.error("[v0] Middleware error:", errorMessage)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/admin/:path*"],
}
