import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/config";

export const dynamic = "force-dynamic";

// GET /api/user?username=USERNAME
export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { success: false, message: "Username is required" },
      { status: 400 }
    );
  }

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

    // Fetch user data from backend
    const res = await fetch(`${BACKEND_URL}/auth/user/${username}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

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
          message: errorData.message || `Failed to fetch user data`,
          backendStatus: res.status,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data.status || !data.user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return only the necessary user data for messaging
    const userData = {
      username: data.user.user_name,
      name: data.user.name,
      avatar: data.user.avatar_original || data.user.avatar || null,
    };

    return NextResponse.json({
      success: true,
      data: userData,
    });

  } catch (err: any) {
    console.error("Error fetching user data:", err);
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