// app/api/send-message/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/config";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

    const body = await request.json();
    const { conversation_id, message } = body;
    
    if (!conversation_id || !message) {
      return NextResponse.json(
        { success: false, message: "conversation_id and message required" }, 
        { status: 400 }
      );
    }

    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "App-Key": "123456",
      Authorization: `Bearer ${token}`,
    };

    // Check if conversation_id is numeric (existing conversation) or a username (new conversation)
    let backendUrl;
    let requestBody;

    if (typeof conversation_id === 'number' || /^\d+$/.test(conversation_id.toString())) {
      // Existing conversation - use the existing endpoint
      backendUrl = `${BACKEND_URL}/chat/messages/send`;
      requestBody = JSON.stringify({ conversation_id, message });
    } else {
      // New conversation with user by username - use the new endpoint
      backendUrl = `${BACKEND_URL}/chat/messages/send-to-user`;
      requestBody = JSON.stringify({ conversation_id, message });
    }

    console.log("Sending request to backend:", backendUrl);
    console.log("Request body:", requestBody);

    // Fetch user data from backend
    const res = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: requestBody,
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
          message: errorData.message || `Failed to send message`,
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
    console.error("Error sending message:", err);
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