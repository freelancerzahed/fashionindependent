import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/config";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      const text = await res.text();
      console.warn("Backend logout returned non-JSON:", text);
      return NextResponse.json({ message: "Logout completed (non-JSON response)" });
    }
  } catch (err) {
    console.error("Logout proxy error:", err);
    return NextResponse.json({ error: "Failed to call backend logout" }, { status: 500 });
  }
}
