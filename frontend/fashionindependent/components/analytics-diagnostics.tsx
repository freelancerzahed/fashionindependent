"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Check, X } from "lucide-react"

interface DiagnosticResult {
  name: string
  status: "pass" | "fail" | "warning" | "pending"
  message: string
  details?: string
}

export function AnalyticsDiagnostics() {
  const [expanded, setExpanded] = useState(false)
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [running, setRunning] = useState(false)

  const runDiagnostics = async () => {
    setRunning(true)
    setResults([])
    const testResults: DiagnosticResult[] = []

    // Check 1: API URL configured
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    testResults.push({
      name: "API URL Configured",
      status: apiUrl ? "pass" : "fail",
      message: apiUrl ? `API URL: ${apiUrl}` : "NEXT_PUBLIC_API_URL not configured",
    })

    if (!apiUrl) {
      setResults(testResults)
      setRunning(false)
      return
    }

    // Check 2: API Health
    try {
      const healthRes = await fetch(`${apiUrl}/analytics/health`)
      if (healthRes.ok) {
        const healthData = await healthRes.json()
        testResults.push({
          name: "API Health Check",
          status: "pass",
          message: "API is responding",
          details: `Database: ${healthData.database.campaigns} campaigns, ${healthData.database.pledges} pledges`,
        })
      } else {
        testResults.push({
          name: "API Health Check",
          status: "fail",
          message: `API returned ${healthRes.status}`,
        })
      }
    } catch (err) {
      testResults.push({
        name: "API Health Check",
        status: "fail",
        message: "Cannot connect to API",
        details: err instanceof Error ? err.message : String(err),
      })
    }

    // Check 3: Authentication
    const token = localStorage.getItem("auth_token")
    testResults.push({
      name: "Authentication Token",
      status: token ? "pass" : "warning",
      message: token ? "Token found in localStorage" : "No token found - you may not be logged in",
    })

    // Check 4: Test Analytics Endpoint
    if (token) {
      try {
        const analyticsRes = await fetch(`${apiUrl}/analytics/creator`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (analyticsRes.ok) {
          const data = await analyticsRes.json()
          testResults.push({
            name: "Analytics Endpoint",
            status: "pass",
            message: "Successfully fetched analytics",
            details: `${data.analytics?.totalCampaigns || 0} campaigns found`,
          })
        } else {
          const errorBody = await analyticsRes.text()
          testResults.push({
            name: "Analytics Endpoint",
            status: "fail",
            message: `Request failed: ${analyticsRes.status}`,
            details: errorBody.substring(0, 200),
          })
        }
      } catch (err) {
        testResults.push({
          name: "Analytics Endpoint",
          status: "fail",
          message: "Cannot reach analytics endpoint",
          details: err instanceof Error ? err.message : String(err),
        })
      }
    }

    setResults(testResults)
    setRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <Check className="w-4 h-4 text-green-600" />
      case "fail":
        return <X className="w-4 h-4 text-red-600" />
      case "warning":
        return <X className="w-4 h-4 text-yellow-600" />
      default:
        return <X className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-50 border-green-200"
      case "fail":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-700 p-2"
      >
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span>API Diagnostics</span>
      </button>

      {expanded && (
        <Card className="p-4 space-y-3">
          <Button
            size="sm"
            onClick={runDiagnostics}
            disabled={running}
            className="w-full"
          >
            {running ? "Running..." : "Run Diagnostics"}
          </Button>

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`border rounded p-2 text-xs space-y-1 ${getStatusColor(
                    result.status
                  )}`}
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <p className="text-xs opacity-75">{result.message}</p>
                  {result.details && (
                    <p className="text-xs opacity-60 font-mono">
                      {result.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-neutral-500 space-y-1">
            <p>
              <strong>Tips:</strong>
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Check .env.local for NEXT_PUBLIC_API_URL</li>
              <li>Ensure backend API is running</li>
              <li>Verify you are logged in with a creator account</li>
              <li>Check your token hasn't expired</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  )
}
