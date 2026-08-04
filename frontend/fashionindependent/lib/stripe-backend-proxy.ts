import { BACKEND_URL } from "@/config"

export type StripeProxyAction = "create-payment-intent" | "confirm-payment"

interface ProxyResponse {
  status: number
  body: Record<string, unknown>
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "")
}

function getBaseUrls(baseUrl: string): string[] {
  const urls = [baseUrl]
  const apiV2Suffix = "/api/v2"

  if (baseUrl.endsWith(apiV2Suffix)) {
    urls.push(baseUrl.slice(0, -apiV2Suffix.length))
  } else {
    urls.push(`${baseUrl}/api`, `${baseUrl}/api/v2`)
  }

  return Array.from(new Set(urls.map(normalizeBaseUrl)))
}

function buildCandidateUrls(action: StripeProxyAction): string[] {
  const baseUrl = normalizeBaseUrl(BACKEND_URL || "")

  if (!baseUrl) {
    return []
  }

  const baseUrls = getBaseUrls(baseUrl)

  if (action === "create-payment-intent") {
    return baseUrls.flatMap((url) => [
      `${url}/stripe/create-payment-intent`,
      `${url}/stripe/payment-intents`,
      `${url}/stripe/payment-intent`,
      `${url}/payments/payment-intent`,
      `${url}/payments/payment-intents`,
      `${url}/payment-intents`,
      `${url}/api/stripe/create-payment-intent`,
      `${url}/api/stripe/payment-intents`,
    ])
  }

  return baseUrls.flatMap((url) => [
    `${url}/stripe/confirm-payment`,
    `${url}/stripe/confirm`,
    `${url}/payments/confirm`,
    `${url}/payments/checkout/confirm`,
    `${url}/payment-confirmation`,
    `${url}/api/stripe/confirm-payment`,
    `${url}/api/stripe/confirm`,
    `${url}/api/v2/stripe/confirm-payment`,
    `${url}/api/v2/stripe/confirm`,
    `${url}/api/payments/confirm`,
    `${url}/api/v2/payments/confirm`,
  ])
}

export async function proxyStripeRequest(action: StripeProxyAction, payload: Record<string, unknown>): Promise<ProxyResponse> {
  const candidateUrls = buildCandidateUrls(action)

  if (candidateUrls.length === 0) {
    throw new Error("Stripe backend URL is not configured.")
  }

  const errors: Array<{ url: string; status?: number; body?: string; message: string }> = []

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const responseText = await response.text()
      let parsedBody: Record<string, unknown> = {}

      if (responseText) {
        try {
          parsedBody = JSON.parse(responseText) as Record<string, unknown>
        } catch {
          parsedBody = { raw: responseText }
        }
      }

      if (!response.ok) {
        const errorMessage =
          typeof parsedBody.error === "string"
            ? parsedBody.error
            : typeof parsedBody.message === "string"
              ? parsedBody.message
              : typeof parsedBody.detail === "string"
                ? parsedBody.detail
                : `Stripe request failed with status ${response.status}`
        errors.push({ url, status: response.status, body: responseText, message: errorMessage })
        continue
      }

      return {
        status: response.status,
        body: parsedBody,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Stripe request failed"
      errors.push({ url, message })
    }
  }

  const debugMessage = errors
    .map((err) => `URL=${err.url} status=${err.status ?? 'N/A'} message=${err.message} body=${err.body ?? 'N/A'}`)
    .join(" | ")

  throw new Error(`Unable to reach the Stripe backend endpoint. Debug: ${debugMessage}`)
}
