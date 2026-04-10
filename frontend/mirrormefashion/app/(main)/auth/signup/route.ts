// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/config";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "App-Key": "123456", // if backend requires
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      const text = await res.text();
      return NextResponse.json({ error: "Backend returned non-JSON response", raw: text }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 500 });
  }
}
