"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { logBackendConfig, runApiDiagnostics, testFileUpload } from "@/lib/api-diagnostics"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export function ApiDiagnosticsPanel() {
  const { token, user } = useAuth()
  const [running, setRunning] = useState(false)
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [uploadTest, setUploadTest] = useState<any>(null)
  const [testingUpload, setTestingUpload] = useState(false)

  const handleRunDiagnostics = async () => {
    setRunning(true)
    logBackendConfig()
    const result = await runApiDiagnostics(token || undefined)
    setDiagnostics(result)
    setRunning(false)
  }

  const handleTestUpload = async () => {
    if (!token) {
      alert("No authentication token found. Please login first.")
      return
    }

    setTestingUpload(true)
    // Create a test image file
    const canvas = document.createElement("canvas")
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "blue"
      ctx.fillRect(0, 0, 100, 100)
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setUploadTest({ error: "Failed to create test image" })
        setTestingUpload(false)
        return
      }

      const file = new File([blob], "test-profile.png", { type: "image/png" })
      const result = await testFileUpload(token, file)
      setUploadTest(result)
      setTestingUpload(false)
    }, "image/png")
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-2">API Diagnostics Panel</p>
            <p>Use this panel to debug upload issues. Make sure your Laragon server is running.</p>
          </div>
        </div>
      </Card>

      {/* Backend Configuration */}
      <Card className="p-6 space-y-3">
        <h3 className="font-semibold">Backend Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Backend URL:</span>
            <code className="bg-neutral-100 px-2 py-1 rounded text-xs">{process.env.NEXT_PUBLIC_API_URL}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Authenticated:</span>
            <span>{token ? "✓ Yes" : "✗ No"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">User:</span>
            <span>{user?.name || "Not logged in"}</span>
          </div>
        </div>
      </Card>

      {/* Diagnostics Result */}
      {diagnostics && (
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Diagnostics Result</h3>
            {diagnostics.backendReachable ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Backend Reachable:</span>
              <span>{diagnostics.backendReachable ? "✓" : "✗"}</span>
            </div>
            <div className="flex justify-between">
              <span>CORS Working:</span>
              <span>{diagnostics.corsWorking ? "✓" : "✗"}</span>
            </div>
            <div className="flex justify-between">
              <span>Profile Endpoint:</span>
              <span>{diagnostics.profileEndpointWorks ? "✓" : "✗"}</span>
            </div>
          </div>
          {diagnostics.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
              <p className="text-sm font-semibold text-red-800 mb-2">Errors:</p>
              <ul className="text-xs text-red-700 space-y-1">
                {diagnostics.errors.map((err: string, i: number) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Upload Test Result */}
      {uploadTest && (
        <Card
          className={`p-6 space-y-3 ${uploadTest.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Upload Test Result</h3>
            {uploadTest.success ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <code className="bg-neutral-100 px-2 py-1 rounded text-xs">{uploadTest.status} {uploadTest.statusText}</code>
            </div>
            {uploadTest.error && (
              <div className="bg-red-100 border border-red-300 rounded p-2 mt-2">
                <p className="text-xs text-red-800 font-mono break-words">{uploadTest.error}</p>
              </div>
            )}
            {uploadTest.data && (
              <pre className="bg-neutral-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(uploadTest.data, null, 2)}
              </pre>
            )}
          </div>
        </Card>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleRunDiagnostics} disabled={running} variant="outline" className="flex-1">
          {running ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>
        <Button onClick={handleTestUpload} disabled={testingUpload || !token} className="flex-1">
          {testingUpload ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Upload"
          )}
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
        <p className="font-semibold mb-1">Troubleshooting Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Make sure Laragon/Apache is running (check taskbar)</li>
          <li>Verify you are logged in (token should show above)</li>
          <li>Check browser console for detailed error messages</li>
          <li>Ensure the API URL is correct: {process.env.NEXT_PUBLIC_API_URL}</li>
        </ul>
      </div>
    </div>
  )
}
