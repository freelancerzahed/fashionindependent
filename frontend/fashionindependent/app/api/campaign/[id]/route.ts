import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL, CAMPAIGN_CONFIG } from "@/config";

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      console.warn("[Campaign] Missing authorization header");
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Campaign ID is required" }, 
        { status: 400 }
      );
    }

    // Using the correct endpoint pattern from CAMPAIGN_CONFIG
    const endpoint = `${BACKEND_URL}${CAMPAIGN_CONFIG.getEndpoint(id)}`;
    console.log("[Campaign] Fetching specific campaign", {
      id,
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
        { error: "Failed to fetch campaign" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Campaign] Fetch error:", errorMessage);
    return NextResponse.json(
      { error: `Failed to fetch campaign: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const authHeader = request.headers.get("authorization");
    const updates = await request.json();

    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
    }

    // Using the correct endpoint pattern for updating campaigns
    const endpoint = `${BACKEND_URL}/campaign/${id}`;
    console.log("[Campaign] Updating campaign", { id, endpoint });

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend update error:", { 
        status: response.status, 
        body: errorText 
      });
      
      return NextResponse.json(
        { error: "Failed to update campaign" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[Campaign] Updated:", id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Campaign] Update error:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      "Allow": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}