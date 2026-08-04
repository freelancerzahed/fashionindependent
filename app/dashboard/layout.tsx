"use client"

import { useAuth } from "@/lib/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BackerDashboardSidebar } from "@/components/backer-dashboard-sidebar"
import { RoleTogglePill } from "@/components/role-toggle-pill"

const DASHBOARD_ROLE_EVENT = "dashboard-role-changed"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [activeRole, setActiveRole] = useState<"creator" | "backer" | null>(null)

  useEffect(() => {
    if (isLoading) {
      console.log("[Dashboard Layout] Still loading auth...")
      return
    }

    if (!user) {
      console.log("[Dashboard Layout] No user found, checking stored auth state")

      const redirectTimer = setTimeout(() => {
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

        if (!storedUser || !storedToken) {
          console.log("[Dashboard Layout] Confirmed: No auth data, redirecting to login")
          router.replace("/login")
          return
        }

        console.log("[Dashboard Layout] Auth data found in localStorage, refreshing route state")
        router.refresh()
      }, 100)

      return () => clearTimeout(redirectTimer)
    }

    console.log("[Dashboard Layout] User found:", user.name)
  }, [user, isLoading, router])

  // Set active role on mount and when user changes
  useEffect(() => {
    if (!user) return

    const hasCreatorRole = user.role === "creator" || user.roles?.includes("creator")
    const hasBackerRole = user.role === "backer" || user.roles?.includes("backer")
    const fallbackRole = hasCreatorRole ? "creator" : hasBackerRole ? "backer" : null

    const savedRole = typeof window !== "undefined" ? localStorage.getItem("dashboardActiveRole") : null

    if (hasCreatorRole && hasBackerRole && savedRole && ["creator", "backer"].includes(savedRole)) {
      setActiveRole(savedRole as "creator" | "backer")
    } else if (fallbackRole) {
      setActiveRole(fallbackRole)
    }
  }, [user])

  useEffect(() => {
    if (typeof window === "undefined") return

    const syncActiveRole = (event: Event) => {
      const role = (event as CustomEvent).detail
      if (role === "creator" || role === "backer") {
        setActiveRole(role)
      }
    }

    window.addEventListener(DASHBOARD_ROLE_EVENT, syncActiveRole as EventListener)
    return () => window.removeEventListener(DASHBOARD_ROLE_EVENT, syncActiveRole as EventListener)
  }, [])

  const handleRoleChange = (role: "creator" | "backer") => {
    setActiveRole(role)
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardActiveRole", role)
      window.dispatchEvent(new CustomEvent(DASHBOARD_ROLE_EVENT, { detail: role }))
    }
  }

  useEffect(() => {
    if (!user || isLoading || !activeRole) return

    const hasCreatorRole = user.role === "creator" || user.roles?.includes("creator")
    const hasBackerRole = user.role === "backer" || user.roles?.includes("backer")
    const hasBothRoles = hasCreatorRole && hasBackerRole

    const isBackerOnlyRoute =
      pathname === "/dashboard/backer" ||
      pathname.startsWith("/dashboard/backer/") ||
      pathname === "/dashboard/pledges" ||
      pathname.startsWith("/dashboard/pledges/") ||
      pathname === "/dashboard/favorites" ||
      pathname.startsWith("/dashboard/favorites/") ||
      pathname === "/dashboard/history" ||
      pathname.startsWith("/dashboard/history/")

    const isCreatorOnlyRoute =
      pathname === "/dashboard" ||
      pathname === "/dashboard/products" ||
      pathname.startsWith("/dashboard/products/") ||
      pathname === "/dashboard/campaigns" ||
      pathname.startsWith("/dashboard/campaigns/") ||
      pathname === "/dashboard/analytics" ||
      pathname.startsWith("/dashboard/analytics/") ||
      pathname === "/dashboard/documents" ||
      pathname.startsWith("/dashboard/documents/") ||
      pathname === "/dashboard/profile" ||
      pathname.startsWith("/dashboard/profile/")

    if (!hasBothRoles) return

    if (activeRole === "creator" && isBackerOnlyRoute) {
      router.replace("/dashboard")
      return
    }

    if (activeRole === "backer" && isCreatorOnlyRoute) {
      router.replace("/dashboard/backer")
    }
  }, [activeRole, isLoading, pathname, router, user])

  if (isLoading || !user || !activeRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-600">Loading your dashboard...</p>
      </div>
    )
  }

  // Check if user has both creator and backer roles
  const hasCreatorRole = user.role === "creator" || user.roles?.includes("creator")
  const hasBackerRole = user.role === "backer" || user.roles?.includes("backer")
  const hasBothRoles = hasCreatorRole && hasBackerRole

  // Determine which sidebar to show based on activeRole
  const showCreatorDashboard = activeRole === "creator" && hasCreatorRole
  const showBackerDashboard = activeRole === "backer" && hasBackerRole

  return (
    <main className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <section className="py-6 md:py-8 lg:py-10">
        <div className="container mx-auto w-full max-w-full px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8 lg:gap-10">
            {/* Left Sidebar - hidden on mobile for app-like layout */}
            <div className="hidden md:block md:col-span-2 lg:col-span-2">
              {/* Creator Sidebar */}
              {showCreatorDashboard && <DashboardSidebar userRole="creator" />}

              {/* Backer Sidebar */}
              {showBackerDashboard && <BackerDashboardSidebar />}
            </div>

            {/* Main Content Area */}
            <div className="w-full min-w-0 md:col-span-4 lg:col-span-4">
              {hasBothRoles && (
                <div className="mb-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:hidden">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Switch dashboard
                  </p>
                  <RoleTogglePill
                    activeRole={activeRole}
                    onRoleChange={handleRoleChange}
                    hasBothRoles={hasBothRoles}
                  />
                </div>
              )}

              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
