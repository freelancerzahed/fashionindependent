"use client"

import { useState } from "react"
import { BACKEND_URL, CAMPAIGN_CONFIG } from "@/config"

export default function CampaignDebugPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const addResult = (testName: string, result: any) => {
    setResults((prev) => ({
      ...prev,
      [testName]: {
        ...result,
        timestamp: new Date().toISOString(),
      },
    }))
  }

  const testBackendConnectivity = async () => {
    setLoading(true)
    try {
      console.log("[Debug] Testing backend connectivity to:", BACKEND_URL)
      const response = await fetch(BACKEND_URL, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      })
      
      addResult("Backend Connectivity", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers),
        message: "Backend server is responding",
      })
    } catch (error) {
      addResult("Backend Connectivity", {
        error: error instanceof Error ? error.message : String(error),
        type: error instanceof TypeError ? "Network Error" : typeof error,
        message: "Failed to connect to backend server",
      })
    } finally {
      setLoading(false)
    }
  }

  const testCampaignEndpoint = async () => {
    setLoading(true)
    try {
      const endpoint = `${BACKEND_URL}${CAMPAIGN_CONFIG.createEndpoint}`
      console.log("[Debug] Testing campaign endpoint:", endpoint)
      
      const response = await fetch(endpoint, {
        method: "OPTIONS", // Test with OPTIONS first
        headers: {
          "Accept": "application/json",
        },
      })
      
      addResult("Campaign Endpoint (OPTIONS)", {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        headers: Object.fromEntries(response.headers),
        message: "Campaign endpoint responded to OPTIONS request",
      })
    } catch (error) {
      addResult("Campaign Endpoint (OPTIONS)", {
        error: error instanceof Error ? error.message : String(error),
        type: error instanceof TypeError ? "Network Error" : typeof error,
        endpoint: `${BACKEND_URL}${CAMPAIGN_CONFIG.createEndpoint}`,
        message: "Failed to reach campaign endpoint",
      })
    } finally {
      setLoading(false)
    }
  }

  const testProxyEndpoint = async () => {
    setLoading(true)
    try {
      console.log("[Debug] Testing proxy endpoint at /api/campaign")
      const response = await fetch("/api/campaign", {
        method: "GET",
        headers: {
          "Authorization": "Bearer test_token",
        },
      })
      
      addResult("Proxy Endpoint (/api/campaign)", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        message: "Proxy endpoint is accessible",
      })
    } catch (error) {
      addResult("Proxy Endpoint (/api/campaign)", {
        error: error instanceof Error ? error.message : String(error),
        type: error instanceof TypeError ? "Network Error" : typeof error,
        message: "Failed to reach proxy endpoint",
      })
    } finally {
      setLoading(false)
    }
  }

  const testAuthToken = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("auth_token")
      addResult("Auth Token", {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? token.substring(0, 50) + "..." : "No token found",
        message: token ? "Auth token is available" : "No auth token found in localStorage",
      })
    } catch (error) {
      addResult("Auth Token", {
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to check auth token",
      })
    } finally {
      setLoading(false)
    }
  }

  const testNetworkConnection = async () => {
    setLoading(true)
    try {
      // Test with a simple external request to verify general network connectivity
      const response = await fetch("https://www.google.com/", {
        method: "HEAD",
        mode: "no-cors",
      })
      
      addResult("Network Connection", {
        status: response.status,
        ok: response.ok,
        message: "General network connectivity appears to be working",
      })
    } catch (error) {
      addResult("Network Connection", {
        error: error instanceof Error ? error.message : String(error),
        message: "Network connectivity test failed",
      })
    } finally {
      setLoading(false)
    }
  }

  const configStatus = {
    "Backend URL": BACKEND_URL,
    "Campaign Create Endpoint": `${BACKEND_URL}${CAMPAIGN_CONFIG.createEndpoint}`,
    "Campaign List Endpoint": `${BACKEND_URL}${CAMPAIGN_CONFIG.listEndpoint}`,
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Campaign Debug Dashboard</h1>
        <p className="text-neutral-600 mb-8">
          Use this page to diagnose campaign submission issues and test backend connectivity.
        </p>

        {/* Configuration Display */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Configuration</h2>
          <div className="space-y-3">
            {Object.entries(configStatus).map(([key, value]) => (
              <div key={key} className="border-b pb-3 last:border-b-0">
                <p className="font-semibold text-sm text-neutral-600">{key}:</p>
                <p className="text-sm bg-neutral-100 p-2 rounded mt-1 break-all font-mono">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Diagnostic Tests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={testNetworkConnection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Test Network Connection
            </button>
            <button
              onClick={testAuthToken}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition"
            >
              Check Auth Token
            </button>
            <button
              onClick={testBackendConnectivity}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              Test Backend Connectivity
            </button>
            <button
              onClick={testCampaignEndpoint}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition"
            >
              Test Campaign Endpoint
            </button>
            <button
              onClick={testProxyEndpoint}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition"
            >
              Test Proxy Endpoint
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {Object.entries(results).length === 0 ? (
            <div className="bg-neutral-100 rounded-lg p-8 text-center text-neutral-600">
              <p>Click the buttons above to run diagnostic tests</p>
            </div>
          ) : (
            Object.entries(results).map(([testName, result]) => (
              <div key={testName} className="bg-white rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{testName}</h3>
                  {result.error && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-semibold">
                      FAILED
                    </span>
                  )}
                  {!result.error && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold">
                      PASSED
                    </span>
                  )}
                </div>
                <div className="bg-neutral-50 p-4 rounded font-mono text-sm max-h-64 overflow-auto">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">Troubleshooting Guide</h3>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>
              <strong>Backend Connectivity Failed:</strong> Ensure the backend server is running at the
              configured URL. Check that{" "}
              <code className="bg-blue-100 px-2 py-1 rounded">{BACKEND_URL}</code> is accessible.
            </li>
            <li>
              <strong>Network Connection Failed:</strong> Check your internet connection and try again.
            </li>
            <li>
              <strong>No Auth Token:</strong> You must be logged in to create campaigns. Check the login
              page and verify your session is valid.
            </li>
            <li>
              <strong>Campaign Endpoint Failed:</strong> The backend campaign endpoint may not be properly
              configured. Check the backend logs for more details.
            </li>
            <li>
              <strong>Proxy Endpoint Failed:</strong> There may be an issue with the Next.js API route.
              Check the browser console and server logs for errors.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
