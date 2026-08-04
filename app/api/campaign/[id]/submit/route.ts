import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/config";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const authHeader = request.headers.get("authorization");

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required. Please log in." }, { status: 401 });
    }

    const endpoint = `${BACKEND_URL}/campaign/${id}/submit`;
    console.log("[Campaign Submit] Forwarding submit request", { id, endpoint });

    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
        },
        body: await request.text(),
      });
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error("[Campaign Submit] Fetch request failed", { endpoint, error: errorMsg });
      if (fetchError instanceof TypeError) {
        return NextResponse.json({ error: `Cannot connect to backend server. ${errorMsg}. Endpoint: ${endpoint}` }, { status: 503 });
      }
      throw fetchError;
    }

    const respText = await response.text().catch(() => "");

    if (!response.ok) {
      try {
        const err = JSON.parse(respText || "{}");
        return NextResponse.json({ error: err.message || err.error || respText || "Failed to submit campaign" }, { status: response.status });
      } catch {
        return NextResponse.json({ error: respText || `Backend returned status ${response.status}` }, { status: response.status });
      }
    }

    try {
      const data = respText ? JSON.parse(respText) : {};
      return NextResponse.json(data, { status: response.status });
    } catch (e) {
      return NextResponse.json({ success: true }, { status: response.status });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Campaign Submit] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Allow": "POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}
