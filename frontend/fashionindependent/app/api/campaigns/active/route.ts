import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/config";
import { mockCampaigns } from "@/lib/data";

function buildFallbackCampaigns() {
  return mockCampaigns.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    funding_goal: campaign.fundingGoal,
    current_funding: campaign.fundedAmount,
    backer_count: campaign.backers,
    upvote_goal: campaign.upvoteGoal,
    upvote_count: campaign.upvoteCount,
    product_name: campaign.category,
    product_images: campaign.image ? [{ path: campaign.image }] : [],
    creator: { id: campaign.id, name: campaign.designer, image: campaign.image },
    end_date: campaign.createdAt?.toISOString?.() ?? null,
    days_remaining: campaign.daysRemaining,
    funding_percentage: campaign.fundingGoal > 0 ? Math.round((campaign.fundedAmount / campaign.fundingGoal) * 100) : 0,
    is_funded: campaign.status === "funded",
    views: 0,
    shares: 0,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    const endpoints = [
      `${BACKEND_URL}/campaign/active`,
      `${BACKEND_URL}/campaigns/active`,
      `${BACKEND_URL}/campaigns`,
      `${BACKEND_URL}/active`,
    ];

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    let lastError: unknown = null;
    for (const endpoint of endpoints) {
      try {
        const backendUrl = new URL(endpoint);
        params.forEach((value, key) => backendUrl.searchParams.append(key, value));

        const res = await fetch(backendUrl.toString(), { method: "GET", headers });
        const text = await res.text();

        if (res.ok) {
          let data: unknown = {};
          try {
            data = JSON.parse(text);
          } catch {
            data = { raw: text };
          }

          if (typeof data === "object" && data !== null && "data" in data) {
            return NextResponse.json(data, { status: res.status });
          }

          return NextResponse.json({ status: true, data: Array.isArray(data) ? data : [] }, { status: res.status });
        }

        const fallbackPayload = { status: true, data: buildFallbackCampaigns(), source: "fallback" };
        const isRouteError = res.status === 404 || text.includes("Invalid Route") || text.includes("Route not found");
        if (!isRouteError) {
          try {
            const data = JSON.parse(text);
            return NextResponse.json({ ...data, source: "backend" }, { status: res.status });
          } catch {
            if ([401, 403, 404, 429, 500, 502, 503].includes(res.status)) {
              return NextResponse.json(fallbackPayload, { status: 200 });
            }

            return NextResponse.json({ error: text || "Invalid backend response" }, { status: res.status });
          }
        }

        if ([401, 403, 404, 429, 500, 502, 503].includes(res.status)) {
          return NextResponse.json(fallbackPayload, { status: 200 });
        }

        lastError = text;
      } catch (error) {
        lastError = error;
      }
    }

    return NextResponse.json({ status: false, data: [], error: lastError instanceof Error ? lastError.message : String(lastError) }, { status: 502 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Campaigns Active Proxy] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
