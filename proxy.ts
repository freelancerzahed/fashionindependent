import { type NextRequest, NextResponse } from "next/server"

// Default export for the proxy function
export default async function(request: NextRequest) {
  try {
    const response = NextResponse.next()

    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")

    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown middleware error"
    console.error("[v0] Proxy error:", errorMessage)
    return NextResponse.next()
  }
}

// Config for path matching
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/admin/:path*"],
}