import { type NextRequest, NextResponse } from "next/server"

interface AccountSettingsRequest {
  name?: string
  email?: string
  bio?: string
  avatar?: string
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - User ID required" }, { status: 401 })
    }

    const formData: AccountSettingsRequest = await request.json()

    if (!formData || Object.keys(formData).length === 0) {
      return NextResponse.json({ error: "No settings provided to update" }, { status: 400 })
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
      }
    }

    if (formData.name) {
      if (typeof formData.name !== "string" || formData.name.length < 2 || formData.name.length > 100) {
        return NextResponse.json({ error: "Name must be between 2 and 100 characters" }, { status: 400 })
      }
    }

    if (formData.bio) {
      if (typeof formData.bio !== "string" || formData.bio.length > 500) {
        return NextResponse.json({ error: "Bio must not exceed 500 characters" }, { status: 400 })
      }
    }

    try {
      // In production, this would update the user record in the database
      console.log(`[v0] Updating account settings for user ${userId}:`, {
        ...formData,
        email: formData.email ? "***" : undefined,
      })

      return NextResponse.json({
        success: true,
        message: "Account settings updated successfully",
        data: formData,
      })
    } catch (dbError) {
      const errorMessage = dbError instanceof Error ? dbError.message : "Database error"
      console.error("[v0] Database error during settings update:", errorMessage)
      return NextResponse.json({ error: "Failed to update settings. Please try again later." }, { status: 503 })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Settings update error:", errorMessage)
    return NextResponse.json({ error: "Failed to update settings. Please try again." }, { status: 500 })
  }
}
