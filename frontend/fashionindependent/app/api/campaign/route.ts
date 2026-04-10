import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL, CAMPAIGN_CONFIG } from "@/config";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      console.warn("[Campaign] Missing authorization header");
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    // Use the listEndpoint which should point to the backend campaigns list endpoint
    const endpoint = `${BACKEND_URL}${CAMPAIGN_CONFIG.listEndpoint}`;
    console.log("[Campaign] Fetching campaigns", {
      hasAuthHeader: !!authHeader,
      backendEndpoint: endpoint
    });

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Backend error response:", { 
        status: response.status 
      });
      
      return NextResponse.json(
        { error: "Failed to fetch campaigns" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Campaign] Fetch error:", errorMessage);
    return NextResponse.json(
      { error: `Failed to fetch campaigns: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const contentType = request.headers.get("content-type");

    // Use the createEndpoint which should point to the backend campaign creation endpoint
    const endpoint = `${BACKEND_URL}${CAMPAIGN_CONFIG.createEndpoint}`;
    console.log("[Campaign] API route called", {
      hasAuthHeader: !!authHeader,
      authHeaderPreview: authHeader ? authHeader.substring(0, 30) + "..." : null,
      contentType,
      backendEndpoint: endpoint
    });

    if (!authHeader) {
      console.warn("[Campaign] Missing authorization header");
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    // Read the request body as JSON
    const body = await request.json()
    
    console.log("[Campaign] Request body received:", {
      hasTitle: !!body.title,
      hasDescription: !!body.description,
      hasFundingGoal: !!body.funding_goal,
      materialsCount: Array.isArray(body.materials) ? body.materials.length : 0,
      colorsCount: Array.isArray(body.colors) ? body.colors.length : 0,
      sizesCount: Array.isArray(body.sizes) ? body.sizes.length : 0,
    });

    // Validate required fields
    const requiredFields = ['title', 'description', 'funding_goal', 'product_name'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.warn("[Campaign] Missing required fields", { missingFields });
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Forward the JSON payload to the backend
    console.log("[Campaign] Calling backend", { url: endpoint, bodyKeys: Object.keys(body) });

    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Send JSON directly
      });
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error("[Campaign] Fetch request failed", {
        endpoint,
        error: errorMsg,
        type: fetchError instanceof TypeError ? "TypeError (Network error)" : typeof fetchError,
      });
      
      // Check if it's a network connectivity issue
      if (fetchError instanceof TypeError) {
        return NextResponse.json(
          { 
            error: `Cannot connect to backend server. ${errorMsg}. Endpoint: ${endpoint}` 
          },
          { status: 503 }
        );
      }
      
      throw fetchError;
    }

    console.log("[Campaign] Backend response status:", response.status);

    // Clone the response to allow reading the body without locking the original
    const responseClone = response.clone();
    let responseText = "";
    
    try {
      responseText = await responseClone.text();
    } catch (e) {
      console.error("[Campaign] Failed to read response text:", e);
      responseText = "";
    }

    if (!response.ok) {
      console.error("Backend error response:", { 
        status: response.status, 
        body: responseText.substring(0, 500) 
      });
      
      try {
        const errorData = JSON.parse(responseText);
        console.log("[Campaign] Parsed error data:", errorData);
        return NextResponse.json(
          { error: errorData.message || errorData.error || "Failed to create campaign" },
          { status: response.status }
        );
      } catch {
        // If response is HTML (error page), just return generic error
        if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
          console.error("[Campaign] Backend returned HTML error page");
          return NextResponse.json(
            { error: "Backend error: Please try again later" },
            { status: response.status }
          );
        }
        
        const errorPreview = responseText.substring(0, 200);
        console.error("[Campaign] Could not parse error response as JSON", { preview: errorPreview });
        return NextResponse.json(
          { error: `Backend error (${response.status}): ${errorPreview}` },
          { status: response.status }
        );
      }
    }

    // Success case - read the JSON response
    try {
      const data = JSON.parse(responseText);
      console.log("[Campaign] Success response:", { id: data.campaign?.id });
      return NextResponse.json(data, { status: 201 });
    } catch (e) {
      console.error("[Campaign] Failed to parse success response:", { error: e, body: responseText.substring(0, 500) });
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 502 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Campaign] Creation error:", errorMessage);
    return NextResponse.json(
      { error: `Failed to create campaign: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      "Allow": "GET, POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}