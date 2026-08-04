import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("fileType") as string
    const campaignId = formData.get("campaignId") as string

    if (!file || !fileType || !campaignId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file type
    const validTypes = {
      productSample: ["image/jpeg", "image/png", "image/webp"],
      techPack: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      cadFile: ["application/zip", "application/x-zip-compressed", "model/vnd.collada+xml"],
    }

    const allowedMimes = validTypes[fileType as keyof typeof validTypes] || []
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // In production, upload to cloud storage (Vercel Blob, S3, etc.)
    const uploadedFile = {
      id: `file_${Math.random().toString(36).substr(2, 9)}`,
      campaignId,
      fileType,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      url: `/uploads/${campaignId}/${file.name}`,
    }

    console.log("[v0] File uploaded:", uploadedFile.id)
    return NextResponse.json(uploadedFile, { status: 201 })
  } catch (error) {
    console.error("[v0] File upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
