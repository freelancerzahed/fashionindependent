import { type NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "")
}

function extractPublishableKey(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null

  const record = payload as Record<string, unknown>
  const candidates = [
    record.publishableKey,
    record.publicKey,
    record.stripePublishableKey,
    record.stripe_public_key,
    record.key,
    record.clientKey,
    record.stripeKey,
    record.data && typeof record.data === "object" ? (record.data as Record<string, unknown>).publishableKey : null,
    record.data && typeof record.data === "object" ? (record.data as Record<string, unknown>).publicKey : null,
    record.data && typeof record.data === "object" ? (record.data as Record<string, unknown>).stripePublishableKey : null,
    record.data && typeof record.data === "object" ? (record.data as Record<string, unknown>).key : null,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim()
    }
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const envKey = [
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_STRIPE_KEY,
      process.env.STRIPE_PUBLISHABLE_KEY,
      process.env.STRIPE_PUBLIC_KEY,
      process.env.STRIPE_KEY,
    ].find((value) => typeof value === "string" && value.trim())?.trim()

    if (envKey) {
      return NextResponse.json({ publishableKey: envKey })
    }

    const baseUrl = normalizeBaseUrl(BACKEND_URL || "")
    if (!baseUrl) {
      return NextResponse.json({
        publishableKey: null,
        error: "Stripe publishable key is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY or expose a Stripe config endpoint from the backend.",
      }, { status: 404 })
    }

    const candidateUrls = [
      `${baseUrl}/stripe/config`,
      `${baseUrl}/stripe/public-key`,
      `${baseUrl}/stripe/publishable-key`,
      `${baseUrl}/config/stripe`,
      `${baseUrl}/payments/config`,
      `${baseUrl}/api/stripe/config`,
      `${baseUrl}/api/stripe/public-key`,
      `${baseUrl}/api/stripe/publishable-key`,
      `${baseUrl}/api/v2/stripe/config`,
      `${baseUrl}/api/v2/stripe/public-key`,
      `${baseUrl}/api/v2/stripe/publishable-key`,
      `${baseUrl}/api/settings/stripe`,
      `${baseUrl}/api/settings/stripe-config`,
      `${baseUrl}/api/v2/settings/stripe`,
      `${baseUrl}/api/v2/settings/stripe-config`,
    ]

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        })

        if (!response.ok) continue

        const text = await response.text()
        if (!text) continue

        const payload = JSON.parse(text)
        const publishableKey = extractPublishableKey(payload)
        if (publishableKey) {
          return NextResponse.json({ publishableKey })
        }
      } catch {
        // Try the next candidate.
      }
    }

    return NextResponse.json({
      publishableKey: null,
      error: "Stripe publishable key is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY or expose a Stripe config endpoint from the backend.",
    }, { status: 404 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[Stripe Config] Error:", message)
    return NextResponse.json({ publishableKey: null, error: message }, { status: 500 })
  }
}
