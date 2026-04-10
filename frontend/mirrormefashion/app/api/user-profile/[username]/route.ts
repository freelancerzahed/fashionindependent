import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ensures logs if needed, can remove in pure production

// GET /api/user-profile/[username]
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  console.log("BACKEND_URL:", BACKEND_URL);

  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    console.log("Token from cookies:", token);

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

    console.log("Fetching user data from backend:", `${BACKEND_URL}/auth/user/${username}`);
    
    // Fetch user data from backend
    const res = await fetch(`${BACKEND_URL}/auth/user/${username}`, {
      method: "GET",
      headers,
      cache: "no-store", // avoid stale responses
    });

    console.log("Backend response status:", res.status);
    console.log("Backend response headers:", [...res.headers.entries()]);

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
    console.log("Backend response data:", data);

    if (!data.status || !data.user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Make sure the isFollowing field is a boolean
    if (data.user && typeof data.user.isFollowing === 'undefined') {
      data.user.isFollowing = false;
    }

    return NextResponse.json({
      success: true,
      data: data.user,
    });

  } catch (err: any) {
    if (err.cause?.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot connect to backend server",
          error: "Connection refused",
        },
        { status: 500 }
      );
    }

    console.error("Error fetching /api/user-profile:", err);
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