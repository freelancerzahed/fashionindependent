import { type NextRequest, NextResponse } from "next/server"

// Mock data for development
const mockMediaItems = [
  {
    id: "1",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    name: "Fashion Shoot 1",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    size: "2.4 MB",
  },
  {
    id: "2",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=400&width=600",
    name: "Style Vlog Episode 1",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    size: "15.2 MB",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type")

    // TODO: Implement actual database query
    // const mediaItems = await db.media.findMany({
    //   where: {
    //     userId: userId || undefined,
    //     type: type || undefined,
    //   },
    //   orderBy: { uploadedAt: 'desc' }
    // })

    let filteredItems = mockMediaItems

    if (type) {
      filteredItems = filteredItems.filter((item) => item.type === type)
    }

    return NextResponse.json({
      success: true,
      items: filteredItems,
      total: filteredItems.length,
    })
  } catch (error) {
    console.error("Get media error:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}
