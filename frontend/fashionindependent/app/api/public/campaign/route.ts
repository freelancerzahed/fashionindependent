import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/config";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    // Build backend endpoint with same query params
    const backendUrl = new URL(`${BACKEND_URL}/campaign/active`);
    params.forEach((value, key) => backendUrl.searchParams.append(key, value));

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) headers["Authorization"] = authHeader;

    const res = await fetch(backendUrl.toString(), {
      method: "GET",
      headers,
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ error: "Invalid backend response" }, { status: 502 });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Public Campaign Proxy] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
