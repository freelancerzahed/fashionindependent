import { BACKEND_URL } from "@/config"

interface DiagnosticsResult {
  backendUrl: string
  backendReachable: boolean
  corsWorking: boolean
  authEndpointWorks: boolean
  profileEndpointWorks: boolean
  errors: string[]
  timestamp: string
}

export async function runApiDiagnostics(token?: string): Promise<DiagnosticsResult> {
  const result: DiagnosticsResult = {
    backendUrl: BACKEND_URL,
    backendReachable: false,
    corsWorking: false,
    authEndpointWorks: false,
    profileEndpointWorks: false,
    errors: [],
    timestamp: new Date().toISOString(),
  }

  console.log("[API Diagnostics] Starting diagnostics for:", BACKEND_URL)

  // Test 1: Check if backend is reachable
  try {
    console.log("[API Diagnostics] Test 1: Checking backend reachability...")
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "GET",
      mode: "cors",
    })
    result.backendReachable = true
    result.corsWorking = true
    console.log("[API Diagnostics] Backend is reachable, status:", response.status)
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    result.errors.push(`Backend unreachable: ${errorMsg}`)
    console.error("[API Diagnostics] Backend unreachable:", errorMsg)
    return result
  }

  // Test 2: Check profile endpoint without auth (should fail but differently)
  if (token) {
    try {
      console.log("[API Diagnostics] Test 2: Checking profile endpoint with auth...")
      const response = await fetch(`${BACKEND_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      })
      result.profileEndpointWorks = response.ok || response.status === 404 || response.status === 401
      console.log("[API Diagnostics] Profile endpoint status:", response.status)
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        console.log("[API Diagnostics] Profile endpoint response:", data)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      result.errors.push(`Profile endpoint error: ${errorMsg}`)
      console.error("[API Diagnostics] Profile endpoint error:", errorMsg)
    }
  }

  return result
}

export async function testFileUpload(
  token: string,
  file: File,
  endpoint: string = "/profile/image/upload"
): Promise<{
  success: boolean
  status: number
  statusText: string
  data?: any
  error?: string
}> {
  const uploadUrl = `${BACKEND_URL}${endpoint}`

  console.log("[Test Upload] ===== TEST UPLOAD =====")
  console.log("[Test Upload] URL:", uploadUrl)
  console.log("[Test Upload] File:", { name: file.name, size: file.size, type: file.type })
  console.log("[Test Upload] Token length:", token.length)

  try {
    const formData = new FormData()
    formData.append("image", file)

    console.log("[Test Upload] Sending request...")

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    console.log("[Test Upload] Response received")
    console.log("[Test Upload] Status:", response.status, response.statusText)

    const data = await response.json().catch(() => null)
    console.log("[Test Upload] Response body:", data)

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data,
      error: !response.ok ? data?.message || "Upload failed" : undefined,
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error("[Test Upload] Error:", errorMsg)
    console.error("[Test Upload] Error type:", err?.constructor?.name)
    console.error("[Test Upload] Stack:", err instanceof Error ? err.stack : "N/A")
    return {
      success: false,
      status: 0,
      statusText: "Error",
      error: errorMsg,
    }
  }
}

/**
 * Log backend configuration
 */
export function logBackendConfig() {
  console.group("[Backend Config]")
  console.log("API URL:", BACKEND_URL)
  console.log("Upload Endpoint:", `${BACKEND_URL}/auth/profile/image/upload`)
  console.log("Profile Endpoint:", `${BACKEND_URL}/auth/profile`)
  console.log("Auth Endpoint:", `${BACKEND_URL}/auth/login`)
  console.groupEnd()
}
