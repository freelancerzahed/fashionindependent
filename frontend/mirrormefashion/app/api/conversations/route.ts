// app/api/conversations/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "App-Key": "123456",
      Authorization: `Bearer ${token}`,
    };

    // Fetch conversations from backend
    const backendUrl = `${BACKEND_URL}/chat/conversations`;
    console.log("Fetching conversations from backend:", backendUrl);
    
    const res = await fetch(backendUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log("Backend response status:", res.status);
    console.log("Backend response headers:", [...res.headers.entries()]);

    // Check if response is HTML (likely a 404 error page)
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const text = await res.text();
      console.error("Received HTML instead of JSON:", text.substring(0, 200) + "...");
      return NextResponse.json(
        { success: false, message: "Backend API endpoint not found" },
        { status: 404 }
      );
    }

    if (res.status === 401) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || `Failed to fetch conversations`,
          backendStatus: res.status,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data: data.data,
    });

  } catch (err: any) {
    console.error("Error fetching conversations:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}