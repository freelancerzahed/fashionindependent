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
    const responseText = await res.text();
    let data: Record<string, any> | null = null;

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = null;
      }
    }

    if (data) {
      console.log("[Auth API] Backend response status:", res.status);
      return NextResponse.json(data, { status: res.status });
    }

    console.error("[Auth API] Backend returned an unexpected response:", {
      status: res.status,
      contentType,
      text: responseText.substring(0, 500),
    });

    return NextResponse.json(
      {
        error: "Backend returned an unexpected response",
        details: responseText ? responseText.substring(0, 500) : `HTTP ${res.status}: ${res.statusText}`,
        statusCode: res.status,
      },
      { status: res.status >= 400 ? res.status : 500 }
    );
  } catch (err) {
    console.error("[Auth API] Fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to connect to backend", details: err instanceof Error ? err.message : String(err) }, 
      { status: 500 }
    );
  }
}
