import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Example: token stored in cookies (adjust to your auth logic)
  const token = req.cookies.get("token")?.value;

  // If user is logged in, block access to `/` and `/login`
  if (token && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // If user is NOT logged in, block access to `/dashboard`
  if (!token && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware to specific routes
export const config = {
  matcher: ["/", "/login", "/profile/:path*"],
};
