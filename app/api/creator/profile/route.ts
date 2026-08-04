import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

const joinUrl = (base: string, path: string) => {
  const trimmedBase = base.replace(/\/$/, "")
  const trimmedPath = path.replace(/^\//, "")
  return `${trimmedBase}/${trimmedPath}`
}

const candidateBackendUrls = () => {
  const normalizedBackendUrl = BACKEND_URL.replace(/\/$/, "")

  if (/\/api\/v2$/i.test(normalizedBackendUrl)) {
    return [joinUrl(normalizedBackendUrl, "creator/profile")]
  }

  if (/\/api$/i.test(normalizedBackendUrl)) {
    return [joinUrl(normalizedBackendUrl, "v2/creator/profile"), joinUrl(normalizedBackendUrl, "creator/profile")]
  }

  if (/\/v2$/i.test(normalizedBackendUrl)) {
    return [joinUrl(normalizedBackendUrl, "creator/profile")]
  }

  return Array.from(new Set([
    joinUrl(normalizedBackendUrl, "creator/profile"),
    joinUrl(normalizedBackendUrl, "v2/creator/profile"),
    joinUrl(normalizedBackendUrl, "api/v2/creator/profile"),
  ]))
}

const parseResponse = async (text: string, status: number) => {
  if (!text) {
    return { data: {}, status }
  }

  try {
    return { data: JSON.parse(text), status }
  } catch {
    return { data: { raw: text }, status }
  }
}

const isRouteError = (status: number, text: string) => {
  return status === 404 || /invalid route|route not found/i.test(text)
}

const getAuthHeader = (request: NextRequest) => {
  const authorization = request.headers.get("authorization")
  if (authorization) return authorization
  const xAuthToken = request.headers.get("x-auth-token")
  return xAuthToken ? `Bearer ${xAuthToken}` : null
}

const proxyFetch = async (backendUrls: string[], request: NextRequest, method: string, body?: string) => {
  const authHeader = getAuthHeader(request)
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(authHeader ? { Authorization: authHeader } : {}),
  }

  const contentType = request.headers.get("content-type")
  if (contentType && method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = contentType
  }

  let lastError: unknown = null
  let lastResponseData: any = null
  let lastStatus = 502

  for (const backendUrl of backendUrls) {
    try {
      console.log(`[Creator Profile Proxy] Trying backend URL: ${backendUrl}`, { method, hasAuthHeader: !!authHeader })
      const fetchOptions: Record<string, unknown> = { method, headers }
      if (method !== "GET" && method !== "HEAD" && body !== undefined) {
        fetchOptions.body = body
      }

      const response = await fetch(backendUrl, fetchOptions as RequestInit)
      const text = await response.text()
      const parsed = await parseResponse(text, response.status)
      lastResponseData = parsed.data
      lastStatus = response.status

      if (response.ok) {
        return { data: parsed.data, status: response.status }
      }

      if (!isRouteError(response.status, text)) {
        return { data: parsed.data, status: response.status }
      }

      lastError = text || `Route not found at ${backendUrl}`
      console.warn(`[Creator Profile Proxy] Route error on backend URL: ${backendUrl}`, { status: response.status, message: lastError })
    } catch (error) {
      lastError = error
      console.error(`[Creator Profile Proxy] Network error contacting backend URL: ${backendUrl}`, error)
    }
  }

  return {
    data: lastResponseData || { error: lastError instanceof Error ? lastError.message : String(lastError || "Unknown backend error") },
    status: lastStatus,
  }
}

export async function GET(request: NextRequest) {
  try {
    const backendUrls = candidateBackendUrls()
    const result = await proxyFetch(backendUrls, request, "GET")

    if (!result.data || (result.status === 404 && !result.data.error)) {
      return NextResponse.json({ error: "Creator profile endpoint could not be reached" }, { status: 502 })
    }

    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("[Creator Profile Proxy GET] Error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const bodyText = await request.text()
    const backendUrls = candidateBackendUrls()
    const result = await proxyFetch(backendUrls, request, "PUT", bodyText)

    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("[Creator Profile Proxy PUT] Error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
