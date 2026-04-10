"use client"

import { useState, useEffect } from "react"

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user")
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
          } catch (error) {
            console.error("Invalid user data in localStorage:", error)
            localStorage.removeItem("user")
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
