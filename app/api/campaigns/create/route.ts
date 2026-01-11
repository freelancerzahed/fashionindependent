import { type NextRequest, NextResponse } from "next/server"
import { BACKEND_URL, CAMPAIGN_CONFIG } from "@/config"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const contentType = request.headers.get("content-type")

    const endpoint = `${BACKEND_URL}${CAMPAIGN_CONFIG.createEndpoint}`;
    console.log("[Campaign] API route called", {
      hasAuthHeader: !!authHeader,
      authHeaderPreview: authHeader ? authHeader.substring(0, 30) + "..." : null,
      contentType,
      backendEndpoint: endpoint
    })

    if (!authHeader) {
      console.warn("[Campaign] Missing authorization header")
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      )
    }

    // Read the request body as FormData
    const formData = await request.formData()
    
    console.log("[Campaign] FormData entries:", {
      keys: Array.from(formData.keys()),
      title: formData.get('title'),
      product_name: formData.get('product_name'),
    })

    // Validate required fields
    const requiredFields = ['title', 'description', 'funding_goal', 'product_name']
    const missingFields = requiredFields.filter(field => !formData.get(field))
    
    if (missingFields.length > 0) {
      console.warn("[Campaign] Missing required fields", { missingFields })
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Forward the FormData to the backend with proper headers
    console.log("[Campaign] Calling backend", { url: endpoint })

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        // Do NOT set Content-Type - let fetch handle it for FormData with boundary
      },
      body: formData, // Send FormData directly
    })

    console.log("[Campaign] Backend response status:", response.status)

    // Clone the response to allow reading the body without locking the original
    const responseClone = response.clone()
    let responseText = ""
    
    try {
      responseText = await responseClone.text()
    } catch (e) {
      console.error("[Campaign] Failed to read response text:", e)
      responseText = ""
    }

    if (!response.ok) {
      console.error("Backend error response:", { 
        status: response.status, 
        body: responseText.substring(0, 500) 
      })
      
      try {
        const errorData = JSON.parse(responseText)
        console.log("[Campaign] Parsed error data:", errorData)
        return NextResponse.json(
          { error: errorData.message || errorData.error || "Failed to create campaign" },
          { status: response.status }
        )
      } catch {
        // If response is HTML (error page), just return generic error
        if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
          console.error("[Campaign] Backend returned HTML error page")
          return NextResponse.json(
            { error: "Backend error: Please try again later" },
            { status: response.status }
          )
        }
        
        const errorPreview = responseText.substring(0, 200)
        console.error("[Campaign] Could not parse error response as JSON", { preview: errorPreview })
        return NextResponse.json(
          { error: `Backend error (${response.status}): ${errorPreview}` },
          { status: response.status }
        )
      }
    }

    // Success case - read the JSON response
    try {
      const data = JSON.parse(responseText)
      console.log("[Campaign] Success response:", { id: data.campaign?.id })
      return NextResponse.json(data, { status: 201 })
    } catch (e) {
      console.error("[Campaign] Failed to parse success response:", { error: e, body: responseText.substring(0, 500) })
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 502 }
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Campaign] Creation error:", errorMessage)
    return NextResponse.json(
      { error: `Failed to create campaign: ${errorMessage}` },
      { status: 500 }
    )
  }
}