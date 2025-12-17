import { type NextRequest, NextResponse } from "next/server"

interface CampaignCreateRequest {
  title?: string
  description?: string
  goal?: number
  deadline?: string
  creatorId?: string
  category?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CampaignCreateRequest = await request.json()
    const { title, description, goal, deadline, creatorId, category } = body

    if (!title || !description || !goal || !deadline || !creatorId || !category) {
      const missing: string[] = []
      if (!title) missing.push("title")
      if (!description) missing.push("description")
      if (!goal) missing.push("goal")
      if (!deadline) missing.push("deadline")
      if (!creatorId) missing.push("creatorId")
      if (!category) missing.push("category")
      return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 })
    }

    if (typeof goal !== "number" || goal <= 0) {
      return NextResponse.json({ error: "Goal must be a positive number" }, { status: 400 })
    }

    const deadlineDate = new Date(deadline)
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json({ error: "Invalid deadline format" }, { status: 400 })
    }

    if (deadlineDate <= new Date()) {
      return NextResponse.json({ error: "Deadline must be in the future" }, { status: 400 })
    }

    if (title.length < 3 || title.length > 200) {
      return NextResponse.json({ error: "Title must be between 3 and 200 characters" }, { status: 400 })
    }

    if (description.length < 10 || description.length > 5000) {
      return NextResponse.json({ error: "Description must be between 10 and 5000 characters" }, { status: 400 })
    }

    try {
      // Create campaign object
      const campaign = {
        id: `campaign_${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        goal,
        raised: 0,
        deadline: deadlineDate.toISOString(),
        creatorId,
        category,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verificationStatus: "pending",
        manufacturingService: null,
      }

      console.log("[v0] Campaign created:", { id: campaign.id, title, creatorId })
      return NextResponse.json(campaign, { status: 201 })
    } catch (dbError) {
      const errorMessage = dbError instanceof Error ? dbError.message : "Database error"
      console.error("[v0] Database error during campaign creation:", errorMessage)
      return NextResponse.json({ error: "Failed to save campaign. Please try again later." }, { status: 503 })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Campaign creation error:", errorMessage)
    return NextResponse.json({ error: "Failed to create campaign. Please try again." }, { status: 500 })
  }
}
