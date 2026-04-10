"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user")
        if (userData) {
          try {
            JSON.parse(userData)
            setIsAuthenticated(true)
          } catch (error) {
            console.error("Invalid user data in localStorage:", error)
            localStorage.removeItem("user")
            setIsAuthenticated(false)
          }
        } else {
          setIsAuthenticated(false)
        }
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated === false) {
      if (pathname !== "/auth/login") {
        localStorage.setItem("redirectAfterLogin", pathname)
      }
      router.push("/auth/login")
    }
  }, [isAuthenticated, router, pathname])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-primary-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
