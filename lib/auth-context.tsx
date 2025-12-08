"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: "backer" | "creator") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DUMMY_USERS = [
  {
    id: "demo-backer",
    email: "backer@example.com",
    password: "demo123",
    name: "Alex Thompson",
    role: "backer" as const,
  },
  {
    id: "demo-creator",
    email: "creator@example.com",
    password: "demo123",
    name: "Emma Studios",
    role: "creator" as const,
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("[v0] Failed to load user from localStorage:", error)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const dummyUser = DUMMY_USERS.find((u) => u.email === email && u.password === password)
      if (dummyUser) {
        const mockUser: User = {
          id: dummyUser.id,
          email: dummyUser.email,
          name: dummyUser.name,
          role: dummyUser.role,
          createdAt: new Date(),
        }
        setUser(mockUser)
        try {
          localStorage.setItem("user", JSON.stringify(mockUser))
        } catch (error) {
          console.error("[v0] Failed to save user to localStorage:", error)
        }
        return
      }

      // Allow any email/password combination for custom login
      const mockUser: User = {
        id: Math.random().toString(),
        email,
        name: email.split("@")[0],
        role: "backer",
        createdAt: new Date(),
      }

      setUser(mockUser)
      try {
        localStorage.setItem("user", JSON.stringify(mockUser))
      } catch (error) {
        console.error("[v0] Failed to save user to localStorage:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, role: "backer" | "creator") => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newUser: User = {
        id: Math.random().toString(),
        email,
        name,
        role,
        createdAt: new Date(),
      }

      setUser(newUser)
      try {
        localStorage.setItem("user", JSON.stringify(newUser))
      } catch (error) {
        console.error("[v0] Failed to save user to localStorage:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("user")
    } catch (error) {
      console.error("[v0] Failed to remove user from localStorage:", error)
    }
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
