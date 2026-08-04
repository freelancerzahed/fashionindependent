"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, AlertCircle, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_or_phone: email, send_code_by: "email" }),
      })

      const data = await response.json()
      if (!response.ok || !data.result) {
        throw new Error(data.message || "Failed to send reset code")
      }

      setMessage("A reset code has been sent to your email.")
      setStep("code")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verification_code: code, password }),
      })

      const data = await response.json()
      if (!response.ok || !data.result) {
        throw new Error(data.message || "Failed to reset password")
      }

      setMessage("Your password has been reset successfully. You can now sign in.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/login" className="mb-6 inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
        </Link>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Forgot your password?</h1>
          <p className="mt-2 text-sm text-slate-600">
            {step === "email"
              ? "Enter your email and we’ll send you a reset code."
              : "Enter the code we sent and choose a new password."}
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Reset code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
