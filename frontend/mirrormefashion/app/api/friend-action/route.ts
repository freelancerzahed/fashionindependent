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

    const { action, userId } = await request.json();
    
    if (!action || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing action or userId" },
        { status: 400 }
      );
    }

    let endpoint = '';
    switch (action) {
      case 'accept':
        endpoint = `${BACKEND_URL}/friend/${userId}/accept`;
        break;
      case 'decline':
        endpoint = `${BACKEND_URL}/friend/${userId}/decline`;
        break;
      case 'cancel':
        endpoint = `${BACKEND_URL}/friend/${userId}/cancel`;
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }

    const res = await fetch(endpoint, {
      method: "POST",
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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || `Failed to ${action} friend request`,
          error: errorData
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data: data,
      message: `Friend request ${action}ed successfully`
    });

  } catch (err: any) {
    console.error("Error performing friend action:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}