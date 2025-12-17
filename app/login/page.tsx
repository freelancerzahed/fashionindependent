"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setError("")
    setIsLoading(true)
    try {
      await login(demoEmail, demoPassword)
      router.push("/dashboard")
    } catch (err) {
      setError("Demo login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-center text-slate-600 text-sm">Sign in to your FashionIndependent account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Demo Login Section */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Quick Demo Login
              </p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-sm bg-white hover:bg-slate-50 border-blue-200 text-slate-700 transition-all duration-200"
                  onClick={() => handleDemoLogin("backer@example.com", "demo123")}
                  disabled={isLoading}
                >
                  Backer Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-sm bg-white hover:bg-slate-50 border-blue-200 text-slate-700 transition-all duration-200"
                  onClick={() => handleDemoLogin("creator@example.com", "demo123")}
                  disabled={isLoading}
                >
                  Creator Demo
                </Button>
              </div>
              <p className="text-xs text-blue-700 mt-3 leading-relaxed">
                <strong>Demo:</strong> Use any demo button or email <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono">backer@example.com</code> / <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono">demo123</code>
              </p>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-500 font-medium">Or sign in with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Email Address
                </Label>
                <div className={`relative transition-all duration-200 ${
                  focusedField === 'email' ? 'ring-2 ring-blue-500 rounded-lg' : ''
                }`}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                      focusedField === 'email' 
                        ? 'border-blue-500 bg-blue-50 ring-0' 
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    } focus:outline-none`}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className={`relative transition-all duration-200 ${
                  focusedField === 'password' ? 'ring-2 ring-blue-500 rounded-lg' : ''
                }`}>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 pr-10 ${
                      focusedField === 'password' 
                        ? 'border-blue-500 bg-blue-50 ring-0' 
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    } focus:outline-none`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  defaultChecked
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-600 cursor-pointer">
                  Keep me signed in
                </label>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Google Login */}
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Create one now
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-slate-700 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-slate-700 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link href="/support" className="hover:text-slate-700 transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center text-xs text-slate-600 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Secure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Encrypted
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
