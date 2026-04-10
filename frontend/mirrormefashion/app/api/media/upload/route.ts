import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // TODO: Implement actual file upload to cloud storage
    // For now, return mock response
    const mockResponse = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      url: `/uploads/${file.name}`, // This would be the actual uploaded file URL
      thumbnail: type === "video" ? `/thumbnails/${file.name}.jpg` : undefined,
      name: file.name.replace(/\.[^/.]+$/, ""),
      type: file.type.startsWith("image/") ? "image" : "video",
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
