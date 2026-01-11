"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

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

  // Show layout only for creator role - backer has different layout
  if (user.role === "creator") {
    return (
      <main className="min-h-screen bg-neutral-50">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Sidebar - Creator Navigation */}
              <div className="lg:col-span-1">
                <DashboardSidebar userRole="creator" />
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-4 space-y-8">
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // For backer role, render children directly (different layout)
  return children
}
