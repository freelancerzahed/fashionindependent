"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BackerDashboardSidebar } from "@/components/backer-dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Show layout for creator role with creator sidebar
  if (user.role === "creator") {
    return (
      <main className="min-h-screen bg-neutral-50">
        <section className="py-6 md:py-8 lg:py-10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
              {/* Left Sidebar - Creator Navigation */}
              <div className="md:col-span-1 lg:col-span-2">
                <DashboardSidebar userRole="creator" />
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 lg:col-span-4">
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // Show layout for backer/member role with backer sidebar
  if (user.role === "backer") {
    return (
      <main className="min-h-screen bg-neutral-50">
        <section className="py-6 md:py-8 lg:py-10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
              {/* Left Sidebar - Backer/Member Navigation */}
              <div className="md:col-span-1 lg:col-span-2">
                <BackerDashboardSidebar />
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 lg:col-span-4">
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // Fallback for other roles
  return children
}
