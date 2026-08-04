import { BACKEND_URL } from "@/config"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params in Next.js 16
    const { slug } = await params

    console.log("[Creator API] Received slug:", slug)

    if (!slug) {
      return Response.json({ error: "Slug not provided" }, { status: 400 })
    }

    // Construct the backend API URL
    const creatorUrl = `${BACKEND_URL}/creators/${slug}`
    console.log("[Creator API] BACKEND_URL:", BACKEND_URL)
    console.log("[Creator API] Fetching from:", creatorUrl)

    const response = await fetch(creatorUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[Creator API] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[Creator API] Error response text:", errorText)
      return Response.json(
        { error: `Failed to fetch creator profile: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("[Creator API] Success! Data:", data)
    return Response.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[Creator API] Error:", error)
    return Response.json(
      { error: `Failed to fetch creator profile: ${errorMessage}` },
      { status: 500 }
    )
  }
}
