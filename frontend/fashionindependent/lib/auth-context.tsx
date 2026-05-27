"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { User } from "./data"
import { BACKEND_URL, AUTH_CONFIG } from "@/config"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: "backer" | "creator") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser)
        console.log("[Auth] ✓ Successfully loaded user:", parsedUser)
        setUser(parsedUser)
        setToken(storedToken)
        return true
      } else {
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

    // Also poll localStorage periodically to catch same-tab changes
    // This is needed because storage events don't fire in the same tab
    const pollTimer = setInterval(() => {
      const currentUser = localStorage.getItem("user")
      const currentToken = localStorage.getItem("auth_token")
      
      // If localStorage has data but our state doesn't, reload
      if ((currentUser || currentToken) && (!token || !user)) {
        console.log("[Auth] Detected localStorage update (same tab), loading...")
        loadAuthFromStorage()
      }
    }, 100)

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearTimeout(timer)
      clearInterval(pollTimer)
    }
  }, [loadAuthFromStorage])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Try to login with different user types
      const userTypes = ['customer', 'creator', 'seller', 'admin']
      let response = null
      let lastError = null
      
      for (const userType of userTypes) {
        const url = `${BACKEND_URL}${AUTH_CONFIG.loginEndpoint}`
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
          const mockUser: User = {
            id: data.user?.id || data.data?.id || Math.random().toString(),
            email: data.user?.email || data.data?.email || email,
            name: data.user?.name || data.data?.name || email.split("@")[0],
            role: (data.user?.role || data.data?.role || userType) as "backer" | "creator",
            roles: data.roles || data.user?.roles || data.data?.roles || [userType],
            avatar: data.user?.avatar || data.data?.avatar,
            createdAt: new Date(),
          }

          console.log("[Auth] User logged in:", mockUser)
          setUser(mockUser)
          const authToken = data.token || data.access_token || data.data?.token || ""
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

  const signup = async (email: string, password: string, name: string, role: "backer" | "creator") => {
    setIsLoading(true)
    try {
      // Use different endpoints based on role
      const isCreator = role === "creator"
      const endpoint = isCreator ? AUTH_CONFIG.creatorSignupEndpoint : AUTH_CONFIG.signupEndpoint
      const url = `${BACKEND_URL}${endpoint}`
      
      console.log("[Auth] Signing up with:", { email, name, role, url })
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          role,
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
        throw new Error(data.message || data.error || "Signup failed")
      }

      const newUser: User = {
        id: data.user?.id || data.data?.id || data.creator?.user_id || Math.random().toString(),
        email: data.user?.email || data.data?.email || email,
        name: data.user?.name || data.data?.name || name,
        role: (data.user?.role || data.data?.role || role) as "backer" | "creator",
        roles: data.roles || data.user?.roles || data.data?.roles || [role],
        avatar: data.user?.avatar || data.data?.avatar,
        createdAt: new Date(),
      }

      console.log("[Auth] User signed up:", newUser)
      setUser(newUser)
      const authToken = data.token || data.access_token || data.data?.token || ""
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
