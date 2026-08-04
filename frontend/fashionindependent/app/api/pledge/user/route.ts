import { NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized", details: "Missing authorization header" },
        { status: 401 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/pledge/user`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: "Failed to fetch pledges", details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch pledges", details: errorMessage },
      { status: 500 }
    )
  }
}
