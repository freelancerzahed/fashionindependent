import { NextResponse } from "next/server";
import { BACKEND_URL, AUTH_CONFIG } from "@/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const endpoint = `${BACKEND_URL}${AUTH_CONFIG.creatorSignupEndpoint}`;
    console.log("[Creator Signup API] Forwarding to:", endpoint);
    console.log("[Creator Signup API] Request body:", { ...body, password: "***" });

    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(body || {})) {
      if (value === undefined || value === null) continue;
      if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: formData.toString(),
    });

    const contentType = res.headers.get("content-type") || "";

    // Check if response is JSON
    if (contentType.includes("application/json")) {
      const data = await res.json();
      console.log("[Creator Auth API] Backend response status:", res.status);
      return NextResponse.json(data, { status: res.status });
    } else {
      // Non-JSON response (error page)
      const text = await res.text();
      console.error("[Creator Auth API] Backend returned non-JSON response:", {
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
    console.error("[Creator Auth API] Fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to connect to backend", details: err instanceof Error ? err.message : String(err) }, 
      { status: 500 }
    );
  }
}
