"use client"

import { useState } from "react"
import { BACKEND_URL } from "@/config"

export default function APITestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testHealthCheck = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/health`)
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "test123",
        }),
      })
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test</h1>

        <div className="bg-white rounded-lg p-6 space-y-4">
          <div>
            <p className="font-semibold mb-2">Backend URL:</p>
            <p className="text-sm bg-neutral-100 p-3 rounded">{BACKEND_URL}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={testHealthCheck}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test Health Check
            </button>
            <button
              onClick={testLogin}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test Login
            </button>
          </div>

          {result && (
            <div className="bg-neutral-100 p-4 rounded font-mono text-sm max-h-96 overflow-auto">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
