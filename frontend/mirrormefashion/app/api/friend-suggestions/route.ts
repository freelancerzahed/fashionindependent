import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/config";

export const dynamic = 'force-dynamic';

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

    // Fetch friend suggestions data from backend
    const res = await fetch(`${BACKEND_URL}/friend/suggestions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "App-Key": "123456",
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

    return NextResponse.json({
      success: true,
      data: data,
      message: "Friend suggestions retrieved successfully"
    });

  } catch (err: any) {
    console.error("Error fetching /api/friend-suggestions:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}