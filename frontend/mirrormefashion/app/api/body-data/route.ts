// app/api/body-data/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/config";

// GET /api/body-data
export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    // Fetch body data from backend
    const res = await fetch(`${BACKEND_URL}/auth/body-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch body data" },
        { status: 400 }
      );
    }

    // Ensure shape_keys and slider_values are objects
    if (data.data) {
      if (typeof data.data.shape_keys === "string" && data.data.shape_keys) {
        try {
          data.data.shape_keys = JSON.parse(data.data.shape_keys);
        } catch (e) {
          console.error("Error parsing shape_keys:", e);
          data.data.shape_keys = {}; // fallback to empty object
        }
      }
      
      if (typeof data.data.slider_values === "string" && data.data.slider_values) {
        try {
          data.data.slider_values = JSON.parse(data.data.slider_values);
        } catch (e) {
          console.error("Error parsing slider_values:", e);
          data.data.slider_values = {}; // fallback to empty object
        }
      }
      
      // Ensure they are objects even if they were null/undefined
      data.data.shape_keys = data.data.shape_keys || {};
      data.data.slider_values = data.data.slider_values || {};
    }
   
    return NextResponse.json({
      success: true,
      data: data.data,
    });

  } catch (err) {
    console.error("Error fetching /api/body-data:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/body-data
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward the request to your backend API
    const backendResponse = await fetch(`${BACKEND_URL}/auth/body-data/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    // Log response details for debugging
    console.log("Backend response status:", backendResponse.status);
    console.log("Backend response headers:", [...backendResponse.headers.entries()]);
    
    // Get response text first for debugging
    const responseText = await backendResponse.text();
    console.log("Backend raw response text:", responseText);
    
    // If response is empty
    if (!responseText) {
      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          message: "Body data updated successfully"
        });
      } else {
        return NextResponse.json(
          { 
            success: false, 
            message: `Server error: ${backendResponse.status} ${backendResponse.statusText}` 
          },
          { status: backendResponse.status }
        );
      }
    }
    
    // Try to parse JSON response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing backend response:", parseError);
      // If we can't parse but status is OK, return success
      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          message: "Body data updated successfully"
        });
      } else {
        // If we can't parse and status is not OK, return error
        return NextResponse.json(
          { 
            success: false, 
            message: `Server returned invalid response: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}` 
          },
          { status: backendResponse.status }
        );
      }
    }

    if (backendResponse.ok) {
      return NextResponse.json({
        success: true,
        message: responseData.message || "Body data updated successfully",
        data: responseData.data
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: responseData.message || "Failed to update body data" 
        },
        { status: backendResponse.status }
      );
    }
  } catch (error) {
    console.error("Error updating body data:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
