"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function MirrorMeLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/mirror-me-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform: "mirror-me-fashion" }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid email or password")
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.")
        } else {
          throw new Error("Login failed")
        }
      }

      const data = await response.json()
      localStorage.setItem("mirrorMeToken", data.token)
      localStorage.setItem("userEmail", email)
      window.location.href = "/dashboard"
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid email or password"
      setError(errorMessage)
      console.error("[v0] Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Mirror Me Fashion</h1>
            <p className="text-neutral-600">Unified Login Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login to Mirror Me Fashion"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t space-y-3">
            <p className="text-sm text-neutral-600 text-center">
              This login syncs across The Fashion Independent and Mirror Me Fashion platforms
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href="/">Back to Fashion Independent</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
