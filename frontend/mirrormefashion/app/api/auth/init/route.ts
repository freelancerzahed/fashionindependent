import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Create a response that redirects to the initialization page
    // This is handled by the client-side script in the init page
    const response = NextResponse.redirect(new URL("/auth/init-client", req.url));
    
    return response;
  } catch (error) {
    console.error("Auth init error:", error);
    return NextResponse.redirect(new URL("/profile", req.url));
  }
}
