import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("[Auth API] Forwarding login request to:", `${BACKEND_URL}/auth/login`);
    console.log("[Auth API] Request body:", { ...body, password: "***" });

    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";

    // Check if response is JSON
    if (contentType.includes("application/json")) {
      const data = await res.json();
      console.log("[Auth API] Backend response status:", res.status);
      return NextResponse.json(data, { status: res.status });
    } else {
      // Non-JSON response (error page)
      const text = await res.text();
      console.error("[Auth API] Backend returned non-JSON response:", {
        status: res.status,
        contentType,
        text: text.substring(0, 500),
      });
      return NextResponse.json(
        { 
          error: "Backend returned non-JSON response", 
          details: `HTTP ${res.status}: ${res.statusText}` 
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[Auth API] Fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to connect to backend", details: err instanceof Error ? err.message : String(err) }, 
      { status: 500 }
    );
  }
}
