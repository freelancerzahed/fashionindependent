import { type NextRequest, NextResponse } from "next/server"
import { BACKEND_URL, CAMPAIGN_CONFIG } from "@/config"

export async function POST(request: NextRequest, { params }: { params: Promise<{ campaignId: string }> }) {
  try {
    // Await params in Next.js 15+
    const { campaignId } = await params

    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      console.warn("[Campaign Upload] Missing authorization header")
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      )
    }

    // Read the FormData from the request
    const formData = await request.formData()

    const formDataEntries = Array.from(formData.entries()).map(([key, value]) => ({
      key,
      type: value instanceof File ? 'File' : typeof value,
      name: value instanceof File ? value.name : undefined,
      size: value instanceof File ? value.size : undefined,
    }))

    console.log("[Campaign Upload] API route called", {
      campaignId,
      hasAuthHeader: !!authHeader,
      contentType: request.headers.get("content-type"),
      formDataKeys: Array.from(formData.keys()),
      formDataEntries: formDataEntries,
      totalEntries: Array.from(formData.entries()).length,
    })

    // Build the backend endpoint
    const endpoint = `${BACKEND_URL}${CAMPAIGN_CONFIG.createEndpoint}/${campaignId}/upload-files`
    
    console.log("[Campaign Upload] Calling backend", {
      url: endpoint,
      campaignId,
      authHeaderPreview: authHeader ? authHeader.substring(0, 30) + "..." : "none",
    })

    // Forward the FormData to the backend
    let response
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          // Let fetch handle the Content-Type with boundary for FormData
        },
        body: formData,
      })
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError)
      console.error("[Campaign Upload] Fetch request failed", {
        endpoint,
        error: errorMsg,
        type: fetchError instanceof TypeError ? "Network error" : typeof fetchError,
      })

      if (fetchError instanceof TypeError) {
        return NextResponse.json(
          {
            status: false,
            error: `Cannot connect to backend server. ${errorMsg}. Endpoint: ${endpoint}`,
          },
          { status: 503 }
        )
      }

      throw fetchError
    }

    console.log("[Campaign Upload] Backend response status:", response.status)

    // Clone the response to read the body
    const responseClone = response.clone()
    let responseText = ""

    try {
      responseText = await responseClone.text()
      console.log("[Campaign Upload] Backend response body length:", responseText.length)
      if (responseText.length < 500) {
        console.log("[Campaign Upload] Backend response body:", responseText)
      }
    } catch (e) {
      console.error("[Campaign Upload] Failed to read response text:", e)
      responseText = ""
    }

    if (!response.ok) {
      console.error("[Campaign Upload] Backend error response:", {
        status: response.status,
        statusText: response.statusText,
        bodyLength: responseText.length,
        bodyPreview: responseText.substring(0, 500),
      })

      try {
        const errorData = JSON.parse(responseText)
        return NextResponse.json(
          {
            status: false,
            error: errorData.message || errorData.error || "Failed to upload files",
          },
          { status: response.status }
        )
      } catch {
        if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
          console.error("[Campaign Upload] Backend returned HTML error page")
          return NextResponse.json(
            { status: false, error: "Backend error: Please try again later" },
            { status: response.status }
          )
        }

        const errorPreview = responseText.substring(0, 200)
        console.error("[Campaign Upload] Could not parse error response as JSON", {
          preview: errorPreview,
        })
        return NextResponse.json(
          { 
            status: false,
            error: `Backend error (${response.status}): ${errorPreview}` 
          },
          { status: response.status }
        )
      }
    }

    // Success case - read the JSON response
    try {
      const data = JSON.parse(responseText)
      console.log("[Campaign Upload] Success response:", {
        campaign_id: data.campaign_id,
        uploaded_images: data.uploaded_images?.length || 0,
        tech_pack_uploaded: data.tech_pack_uploaded,
        status: data.status,
      })
      return NextResponse.json(data, { status: 200 })
    } catch (e) {
      console.error("[Campaign Upload] Failed to parse success response:", {
        error: e,
        bodyLength: responseText.length,
        bodyPreview: responseText.substring(0, 500),
      })
      return NextResponse.json(
        { 
          status: false,
          error: "Invalid response from backend" 
        },
        { status: 502 }
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Campaign Upload] Error:", errorMessage, error)
    return NextResponse.json(
      { 
        status: false,
        error: `Failed to upload campaign files: ${errorMessage}` 
      },
      { status: 500 }
    )
  }
}
