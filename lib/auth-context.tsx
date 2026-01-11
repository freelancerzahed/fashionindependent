"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./data"
import { BACKEND_URL } from "@/config"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: "backer" | "creator") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("auth_token")
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("[Auth] Failed to load user from localStorage:", error)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("[Auth] Logging in with:", { email, url: "/api/auth/login" })
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password,
          login_by: 'email', // Specify login method
          user_type: 'customer', // Specify user type
          recaptcha_token: '' // Empty token if reCAPTCHA is disabled on backend
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
      
      console.log("[Auth] Login response:", { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed")
      }

      const mockUser: User = {
        id: data.user?.id || data.data?.id || Math.random().toString(),
        email: data.user?.email || data.data?.email || email,
        name: data.user?.name || data.data?.name || email.split("@")[0],
        role: (data.user?.role || data.data?.role || "backer") as "backer" | "creator",
        createdAt: new Date(),
      }

      console.log("[Auth] User logged in:", mockUser)
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("auth_token", data.token || data.access_token || data.data?.token || "")

      return
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
      const endpoint = isCreator ? "/api/creator/signup" : "/api/auth/signup"
      
      console.log("[Auth] Signing up with:", { email, name, role, url: endpoint })
      
      const response = await fetch(endpoint, {
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
        createdAt: new Date(),
      }

      console.log("[Auth] User signed up:", newUser)
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("auth_token", data.token || data.access_token || data.data?.token || "")

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
    localStorage.removeItem("user")
    localStorage.removeItem("auth_token")
  }

  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, isLoading: true, login, signup, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
