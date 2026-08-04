import { NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

const fallbackQuestionStats = {
  total_responses: 0,
  questions: [],
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
    }

    const endpoint = `${BACKEND_URL}/campaign/${id}/question-statistics`

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json(
        { status: true, data: fallbackQuestionStats, source: "fallback" },
        { status: 200 }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      status: true,
      data: data?.data ?? data ?? fallbackQuestionStats,
      source: "backend",
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch question statistics", details: errorMessage },
      { status: 500 }
    )
  }
}
