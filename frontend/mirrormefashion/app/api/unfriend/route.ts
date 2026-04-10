import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/config";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
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

    // Parse the request body
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing user ID" },
        { status: 400 }
      );
    }

    // Send unfriend request to backend
    const res = await fetch(`${BACKEND_URL}/friend/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "App-Key": "123456",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.status === 401) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || "Failed to unfriend user",
          error: errorData
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data: data,
      message: "Friend removed successfully"
    });

  } catch (err: any) {
    console.error("Error unfriending user:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}