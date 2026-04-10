// Improved Auth Context with Security Best Practices
// This version adds:
// 1. CSRF token handling
// 2. Token refresh logic
// 3. Request interception
// 4. Better error handling

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { User } from "./data"
import { BACKEND_URL } from "@/config"

interface AuthContextType {
  user: User | null
  token: string | null
  csrfToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string, role: "backer" | "creator") => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Secure API fetch wrapper
async function secureApiFetch(
  url: string,
  token: string | null,
  csrfToken: string | null,
  options: RequestInit = {}
) {
  const headers = new Headers(options.headers || {})
  
  // Add authorization header if token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  // Add CSRF token for non-GET requests
  if (csrfToken && options.method && options.method !== 'GET') {
    headers.set('X-CSRF-Token', csrfToken)
  }
  
  headers.set('Content-Type', 'application/json')

  return fetch(url, {
    ...options,
    headers,
  })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [tokenRefreshTimeout, setTokenRefreshTimeout] = useState<NodeJS.Timeout | null>(null)

  // Fetch CSRF token on mount
  const fetchCsrfToken = useCallback(async () => {
    try {
      // Note: Your backend should provide a CSRF token endpoint
      // This is a placeholder - adjust to your actual endpoint
      const response = await fetch(`${BACKEND_URL}/csrf-token`)
      if (response.ok) {
        const data = await response.json()
        setCsrfToken(data.csrf_token)
        localStorage.setItem("csrf_token", data.csrf_token)
      }
    } catch (error) {
      console.error("[Auth] Failed to fetch CSRF token:", error)
    }
  }, [])

  // Initialize auth on mount
  useEffect(() => {
    setMounted(true)
    try {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("auth_token")
      const storedCsrfToken = localStorage.getItem("csrf_token")

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser))
          setToken(storedToken)
          if (storedCsrfToken) {
            setCsrfToken(storedCsrfToken)
          }
        } catch (error) {
          console.error("[Auth] Failed to parse stored data:", error)
          // Clear invalid data
          localStorage.removeItem("user")
          localStorage.removeItem("auth_token")
        }
      }

      // Fetch fresh CSRF token
      fetchCsrfToken()
    } catch (error) {
      console.error("[Auth] Failed to load auth data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchCsrfToken])

  // Setup token refresh timer
  useEffect(() => {
    if (token && mounted) {
      // Refresh token every 55 minutes (before 1 hour expiry)
      const refreshTimer = setTimeout(() => {
        refreshToken()
      }, 55 * 60 * 1000)

      setTokenRefreshTimeout(refreshTimer)

      return () => {
        if (refreshTimer) clearTimeout(refreshTimer)
      }
    }
  }, [token, mounted])

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      console.log("[Auth] Logging in with:", { email })

      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken && { "X-CSRF-Token": csrfToken }),
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || `Login failed: ${response.status}`
        console.error("[Auth] Login failed:", errorMsg)
        return { success: false, error: errorMsg }
      }

      if (data.token && data.user) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("auth_token", data.token)
        
        // Fetch fresh CSRF token after login
        await fetchCsrfToken()

        console.log("[Auth] Login successful")
        return { success: true }
      }

      return { success: false, error: "Invalid response from server" }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Login failed"
      console.error("[Auth] Login error:", errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: "backer" | "creator"
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      console.log("[Auth] Signing up with:", { email, role })

      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken && { "X-CSRF-Token": csrfToken }),
        },
        body: JSON.stringify({ email, password, name, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || `Signup failed: ${response.status}`
        console.error("[Auth] Signup failed:", errorMsg)
        return { success: false, error: errorMsg }
      }

      if (data.token && data.user) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("auth_token", data.token)
        
        // Fetch fresh CSRF token after signup
        await fetchCsrfToken()

        console.log("[Auth] Signup successful")
        return { success: true }
      }

      return { success: false, error: "Invalid response from server" }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Signup failed"
      console.error("[Auth] Signup error:", errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    if (!token) return false

    try {
      console.log("[Auth] Refreshing token...")

      const response = await secureApiFetch(
        `${BACKEND_URL}/auth/refresh-token`,
        token,
        csrfToken,
        { method: "POST" }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error("[Auth] Token refresh failed:", data.message)
        // If refresh fails, logout user
        logout()
        return false
      }

      if (data.token) {
        setToken(data.token)
        localStorage.setItem("auth_token", data.token)
        console.log("[Auth] Token refreshed successfully")
        return true
      }

      return false
    } catch (error) {
      console.error("[Auth] Token refresh error:", error)
      logout()
      return false
    }
  }

  const logout = async () => {
    try {
      // Notify backend of logout
      if (token) {
        await secureApiFetch(
          `${BACKEND_URL}/auth/logout`,
          token,
          csrfToken,
          { method: "POST" }
        ).catch(err => {
          console.warn("[Auth] Logout notification failed:", err)
          // Continue with local cleanup even if backend fails
        })
      }

      // Clear local state
      setUser(null)
      setToken(null)
      setCsrfToken(null)
      localStorage.removeItem("user")
      localStorage.removeItem("auth_token")
      localStorage.removeItem("csrf_token")

      // Clear token refresh timer
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout)
        setTokenRefreshTimeout(null)
      }

      console.log("[Auth] Logged out successfully")
    } catch (error) {
      console.error("[Auth] Logout error:", error)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    csrfToken,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
