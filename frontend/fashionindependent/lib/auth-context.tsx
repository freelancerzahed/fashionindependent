"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { User } from "./data"
import { BACKEND_URL, AUTH_CONFIG } from "@/config"

const API_BASE = "/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    name: string,
    role: "backer" | "creator",
    options?: {
      gender?: string
      ageRange?: string
      providerId?: string
    }
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const sanitizeStoredToken = (token: string | null | undefined) => {
  if (!token) return null

  const trimmedToken = token.trim()
  if (!trimmedToken) return null

  if (/^demo[-_]?token$/i.test(trimmedToken) || trimmedToken.length < 10) {
    return null
  }

  return trimmedToken
}

const getApiErrorMessage = (data: any) => {
  if (!data) return "Signup failed"
  if (typeof data === "string") return data
  if (data.message) return data.message
  if (data.error) return data.error
  if (data.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors)
      .flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
      .filter(Boolean)
      .map((entry) => String(entry))
    if (messages.length) return messages.join("; ")
  }
  return "Signup failed"
}

const normalizeUserRole = (role: string | undefined | null, fallback: string) => {
  const rawRole = (role || fallback || "backer").toString().toLowerCase()
  if (rawRole === "customer") return "backer"
  if (rawRole === "seller") return "creator"
  if (rawRole === "admin") return "admin"
  return rawRole as "backer" | "creator" | "admin"
}

const normalizeUserRoles = (roles: any[] | undefined, fallback: string) => {
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return [normalizeUserRole(undefined, fallback)]
  }
  return roles.map((role) => normalizeUserRole(role, fallback))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Function to load auth from localStorage
  const loadAuthFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("auth_token")
      
      console.log("[Auth] Loading from localStorage...", {
        hasUser: !!storedUser,
        hasToken: !!storedToken,
      })

      const normalizedToken = sanitizeStoredToken(storedToken)

      if (storedUser && normalizedToken) {
        const parsedUser = JSON.parse(storedUser)
        console.log("[Auth] ✓ Successfully loaded user:", parsedUser)
        setUser(parsedUser)
        setToken(normalizedToken)
        return true
      } else {
        if (storedToken && !normalizedToken) {
          console.warn("[Auth] ✗ Stored token was invalid or placeholder. Clearing session.")
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
        }
        console.log("[Auth] ✗ Missing user or token in localStorage")
        setUser(null)
        setToken(null)
        return false
      }
    } catch (error) {
      console.error("[Auth] Failed to load user from localStorage:", error)
      setUser(null)
      setToken(null)
      return false
    }
  }, [])

  useEffect(() => {
    console.log("[Auth] AuthProvider mounted, initializing...")
    setMounted(true)
    
    // Load auth from storage immediately
    loadAuthFromStorage()
    
    // Set isLoading to false after a minimal delay
    // This ensures the component mounts before we start redirects
    const timer = setTimeout(() => {
      console.log("[Auth] Initialization complete, isLoading = false")
      setIsLoading(false)
    }, 0)
    
    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "user") {
        console.log("[Auth] Storage changed (other tab):", e.key, "Reloading...")
        loadAuthFromStorage()
      }
    }

    // Listen for custom in-window auth change events (e.g. after OAuth redirect)
    const handleAuthChanged = () => {
      console.log("[Auth] Received in-window auth change event: authChanged. Reloading...")
      loadAuthFromStorage()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("authChanged", handleAuthChanged)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("authChanged", handleAuthChanged)
      clearTimeout(timer)
    }
  }, [loadAuthFromStorage])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Try to login with different user types,
      // including backer because signup creates backers as a separate user_type.
      const userTypes = ['customer', 'creator', 'backer', 'seller', 'admin']
      let response = null
      let lastError = null
      
      for (const userType of userTypes) {
        const url = `${API_BASE}/auth/login`
        console.log(`[Auth] Attempting login as ${userType}:`, { email, url })
        
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email, 
            password,
            login_by: 'email',
            user_type: userType,
            recaptcha_token: ''
          }),
        })

        let data
        try {
          data = await response.json()
        } catch (parseError) {
          const text = await response.text()
          console.error(`[Auth] Server returned non-JSON for ${userType}:`, text.substring(0, 500))
          lastError = new Error(`Server error: ${response.status} - ${response.statusText}`)
          continue
        }

        console.log(`[Auth] Login response (${userType}):`, { status: response.status, data })

        if (response.ok && data.user) {
          // Success! Found the user
          const rawRole = data.user?.role || data.user?.type || data.data?.role || data.data?.type || userType
          const normalizedRole = normalizeUserRole(rawRole, userType)

          const normalizedRoles = normalizeUserRoles(
            data.roles || data.user?.roles || data.data?.roles || [normalizedRole],
            normalizedRole
          )

          const mockUser: User = {
            id: data.user?.id || data.data?.id || Math.random().toString(),
            email: data.user?.email || data.data?.email || email,
            name: data.user?.name || data.data?.name || email.split("@")[0],
            role: normalizedRole as "backer" | "creator",
            roles: normalizedRoles,
            avatar: data.user?.avatar || data.data?.avatar,
            createdAt: new Date(),
          }

          console.log("[Auth] User logged in:", mockUser)
          setUser(mockUser)
          const authToken = sanitizeStoredToken(data.token || data.access_token || data.data?.token || "")

          if (!authToken) {
            throw new Error("Authentication token was not returned by the backend")
          }

          setToken(authToken)
          localStorage.setItem("user", JSON.stringify(mockUser))
          localStorage.setItem("auth_token", authToken)
          return
        } else {
          lastError = new Error(data.message || data.error || `Login failed as ${userType}`)
        }
      }
      
      // All user types failed
      throw lastError || new Error("User not found")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("[Auth] Login failed:", errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: "backer" | "creator",
    options?: {
      gender?: string
      ageRange?: string
      providerId?: string
    }
  ) => {
    setIsLoading(true)
    try {
      const isCreator = role === "creator"
      const endpoint = "/auth/signup"
      const url = `${API_BASE}${endpoint}`

      console.log("[Auth] Signing up with:", { email, name, role, url, providerId: options?.providerId })

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          // If providerId exists, still send the password the user typed (if any).
          // Previously we always sent empty password when providerId was present which
          // caused server-side "password required" errors even when the user typed one.
          password: options?.providerId && (!password || password.trim().length === 0) ? "" : password,
          name,
          role,
          gender: options?.gender || null,
          age_range: options?.ageRange || null,
          provider_id: options?.providerId || null,
          alphanumeric_code: `FI-${Date.now().toString(36).toUpperCase()}`,
          ...(isCreator && {
            has_inventory: true,
            has_tech_pack: false,
            accepted_terms: false,
            accepted_collaboration_agreement: false,
            accepted_delivery_obligation: false,
          })
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        // If JSON parsing fails, it means the server returned HTML (error page)
        const text = await response.text()
        console.error("[Auth] Server returned non-JSON response:", text.substring(0, 500))
        throw new Error(`Server error: ${response.status} - ${response.statusText}`)
      }

      console.log("[Auth] Signup response:", { status: response.status, data })

      if (!response.ok) {
        throw new Error(getApiErrorMessage(data) || `Signup failed: ${response.status}`)
      }

      const rawRole = data.user?.role || data.user?.type || data.data?.role || data.data?.type || role
      const normalizedRole = normalizeUserRole(rawRole, role)
      const normalizedRoles = normalizeUserRoles(data.roles || data.user?.roles || data.data?.roles || [normalizedRole], normalizedRole)

      const newUser: User = {
        id: data.user?.id || data.data?.id || data.creator?.user_id || Math.random().toString(),
        email: data.user?.email || data.data?.email || email,
        name: data.user?.name || data.data?.name || name,
        role: normalizedRole as "backer" | "creator",
        roles: normalizedRoles,
        avatar: data.user?.avatar || data.data?.avatar,
        createdAt: new Date(),
      }

      console.log("[Auth] User signed up:", newUser)
      setUser(newUser)
      const authToken = sanitizeStoredToken(data.token || data.access_token || data.data?.token || "")

      if (!authToken) {
        throw new Error("Authentication token was not returned by the backend")
      }

      setToken(authToken)
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("auth_token", authToken)

      return
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("[Auth] Signup failed:", errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("auth_token")
  }

  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, token: null, isLoading: true, login, signup, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
