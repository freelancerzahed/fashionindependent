"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BackerDashboardSidebar } from "@/components/backer-dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeRole, setActiveRole] = useState<"creator" | "backer" | null>(null)

  useEffect(() => {
    if (isLoading) {
      console.log("[Dashboard Layout] Still loading auth...")
      return
    }

    if (!user) {
      console.log("[Dashboard Layout] No user found, redirecting to login")
      // Give auth context a moment to load data from localStorage
      const redirectTimer = setTimeout(() => {
        // Check one more time in case data just arrived
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("auth_token")
        
        if (!storedUser || !storedToken) {
          console.log("[Dashboard Layout] Confirmed: No auth data, redirecting to login")
          router.push("/login")
        } else {
          console.log("[Dashboard Layout] Auth data found in localStorage, reloading...")
          // Reload the page to let auth context properly initialize
          window.location.reload()
        }
      }, 100)
      
      return () => clearTimeout(redirectTimer)
    }

    console.log("[Dashboard Layout] User found:", user.name)
  }, [user, isLoading, router])

  // Set active role on mount and when user changes
  useEffect(() => {
    if (user && !activeRole) {
      // Check if user has both roles
      const hasCreatorRole = user.role === "creator" || user.roles?.includes("creator")
      const hasBackerRole = user.role === "backer" || user.roles?.includes("backer")
      
      // Retrieve saved preference from localStorage
      const savedRole = typeof window !== "undefined" ? localStorage.getItem("dashboardActiveRole") : null
      
      if (hasCreatorRole && hasBackerRole && savedRole && ["creator", "backer"].includes(savedRole)) {
        setActiveRole(savedRole as "creator" | "backer")
      } else if (user.role) {
        setActiveRole(user.role as "creator" | "backer")
      }
    }
  }, [user, activeRole])

  const handleRoleChange = (role: "creator" | "backer") => {
    setActiveRole(role)
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardActiveRole", role)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-600">Loading...</p>
      </div>
    )
  }

  if (!user || !activeRole) {
    return null
  }

  // Check if user has both creator and backer roles
  const hasCreatorRole = user.role === "creator" || user.roles?.includes("creator")
  const hasBackerRole = user.role === "backer" || user.roles?.includes("backer")
  const hasBothRoles = hasCreatorRole && hasBackerRole

  // Determine which sidebar to show based on activeRole
  const showCreatorDashboard = activeRole === "creator" && hasCreatorRole
  const showBackerDashboard = activeRole === "backer" && hasBackerRole

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
            {/* Left Sidebar */}
            <div className="md:col-span-1 lg:col-span-2">
              {/* Creator Sidebar */}
              {showCreatorDashboard && <DashboardSidebar userRole="creator" />}

              {/* Backer Sidebar */}
              {showBackerDashboard && <BackerDashboardSidebar />}
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3 lg:col-span-4">{children}</div>
          </div>
        </div>
      </section>
    </main>
  )
}
