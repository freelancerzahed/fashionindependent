"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Store, Mail, Lock, User, Shield, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ReCaptchaProvider, useReCaptcha } from "@/components/recaptcha-provider"

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { isLoaded: recaptchaLoaded, executeRecaptcha } = useReCaptcha()

  useEffect(() => {
    if (!password) {
      setPasswordStrength(null)
      return
    }

    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length

    if (score < 3) setPasswordStrength("weak")
    else if (score < 5) setPasswordStrength("medium")
    else setPasswordStrength("strong")
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let recaptchaToken = null
      if (recaptchaLoaded) {
        try {
          recaptchaToken = await executeRecaptcha("login")
          if (!recaptchaToken) {
            throw new Error("reCAPTCHA verification failed")
          }
        } catch (recaptchaError) {
          console.warn("reCAPTCHA failed, proceeding without it:", recaptchaError)
        }
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          recaptchaToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
      })

      // Redirect based on role
      if (data.user.role === "admin" || data.user.role === "manager") {
        router.push("/admin/dashboard")
      } else if (data.user.role === "advertiser") {
        router.push("/advertiser/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(error.message)
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      })

      // Clear form fields on invalid credentials
      if (error.message.includes("Invalid email or password")) {
        setPassword("")
        // Focus back to email field for retry
        setTimeout(() => {
          const emailInput = document.getElementById("email")
          emailInput?.focus()
        }, 100)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      email: "admin@fashion.com",
      password: "password",
      role: "Admin",
      description: "Full access to admin panel",
      icon: Shield,
      color: "text-red-600 bg-red-50",
    },
    {
      email: "manager@fashion.com",
      password: "password",
      role: "Manager",
      description: "Store management access",
      icon: User,
      color: "text-blue-600 bg-blue-50",
    },
    {
      email: "advertiser@fashion.com",
      password: "password",
      role: "Advertiser",
      description: "Campaign & ads management",
      icon: Store,
      color: "text-purple-600 bg-purple-50",
    },
    {
      email: "user@fashion.com",
      password: "password",
      role: "Customer",
      description: "Customer portal access",
      icon: User,
      color: "text-green-600 bg-green-50",
    },
  ]

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fashion Retailer Portal
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {!recaptchaLoaded && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Loading security verification...</AlertDescription>
          </Alert>
        )}

        {recaptchaLoaded && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Security verification ready</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordStrength && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex gap-1">
                      <div
                        className={`h-1 w-4 rounded ${passwordStrength === "weak" ? "bg-red-400" : passwordStrength === "medium" ? "bg-yellow-400" : "bg-green-400"}`}
                      />
                      <div
                        className={`h-1 w-4 rounded ${passwordStrength === "medium" || passwordStrength === "strong" ? "bg-yellow-400" : "bg-gray-200"}`}
                      />
                      <div
                        className={`h-1 w-4 rounded ${passwordStrength === "strong" ? "bg-green-400" : "bg-gray-200"}`}
                      />
                    </div>
                    <span
                      className={`${passwordStrength === "weak" ? "text-red-600" : passwordStrength === "medium" ? "text-yellow-600" : "text-green-600"}`}
                    >
                      {passwordStrength === "weak" ? "Weak" : passwordStrength === "medium" ? "Medium" : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
                disabled={isLoading || !recaptchaLoaded}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/auth/register" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Don't have an account? Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-center">Demo Accounts</CardTitle>
            <CardDescription className="text-center">Click to auto-fill credentials for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemoCredentials(account.email, account.password)}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${account.color} group-hover:scale-105 transition-transform`}
                  >
                    <account.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{account.role}</h3>
                      <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                        {account.email}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{account.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Fashion Retailer Portal. All rights reserved.</p>
          <p className="mt-1 text-xs">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="https://policies.google.com/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <ReCaptchaProvider siteKey={RECAPTCHA_SITE_KEY}>
      <LoginForm />
    </ReCaptchaProvider>
  )
}
