"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BackerDashboardSidebar } from "@/components/backer-dashboard-sidebar"

export default function TestRoleTogglePage() {
  const [activeRole, setActiveRole] = useState<"creator" | "backer" | null>("creator")

  useEffect(() => {
    // Simulate a user with both creator and backer roles
    const savedRole = localStorage.getItem("dashboardActiveRole")
    if (savedRole && ["creator", "backer"].includes(savedRole)) {
      setActiveRole(savedRole as "creator" | "backer")
    }
  }, [])

  const handleRoleChange = (role: "creator" | "backer") => {
    setActiveRole(role)
    localStorage.setItem("dashboardActiveRole", role)
  }

  const hasCreatorRole = true
  const hasBackerRole = true
  const hasBothRoles = hasCreatorRole && hasBackerRole

  const showCreatorDashboard = activeRole === "creator" && hasCreatorRole
  const showBackerDashboard = activeRole === "backer" && hasBackerRole

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">Dashboard Role Toggle Test</h1>
            <p className="text-neutral-600 mb-4">
              This page demonstrates the role toggle feature for users with both creator and backer roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
            {/* Left Sidebar */}
            <div className="md:col-span-1 lg:col-span-2">
              {/* Role Toggle Buttons - Show only if user has both roles */}
              {hasBothRoles && (
                <div className="mb-4 flex gap-2">
                  <Button
                    onClick={() => handleRoleChange("creator")}
                    variant={activeRole === "creator" ? "default" : "outline"}
                    className="flex-1 text-sm"
                  >
                    Creative
                  </Button>
                  <Button
                    onClick={() => handleRoleChange("backer")}
                    variant={activeRole === "backer" ? "default" : "outline"}
                    className="flex-1 text-sm"
                  >
                    Backer
                  </Button>
                </div>
              )}

              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-2">Current Role: <strong>{activeRole?.toUpperCase()}</strong></p>
                <p className="text-xs text-neutral-500">Active role buttons shown above switch between creator and backer dashboards.</p>
              </div>

              {/* Creator Sidebar */}
              {showCreatorDashboard && <DashboardSidebar userRole="creator" />}

              {/* Backer Sidebar */}
              {showBackerDashboard && <BackerDashboardSidebar />}
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3 lg:col-span-4">
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
                
                {showCreatorDashboard && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-neutral-700">Creative Dashboard</h3>
                    <p className="text-neutral-600">
                      This is the creative dashboard view. You can see the creative sidebar on the left with options for:
                    </p>
                    <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                      <li>Overview - Campaign statistics and summaries</li>
                      <li>Products - Manage your products</li>
                      <li>Campaigns - View and manage your campaigns</li>
                      <li>Analytics - View detailed analytics</li>
                      <li>Settings - Account and notification settings</li>
                      <li>Documents - Upload and manage documents</li>
                    </ul>
                  </div>
                )}

                {showBackerDashboard && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-neutral-700">Backer Dashboard</h3>
                    <p className="text-neutral-600">
                      This is the backer dashboard view. You can see the backer sidebar on the left with options for:
                    </p>
                    <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                      <li>Overview - Your backed campaigns and stats</li>
                      <li>My Pledges - View your active pledges</li>
                      <li>Shopping Cart - Manage your shopping cart</li>
                      <li>Favorites - View your favorite campaigns</li>
                      <li>Order History - Track your purchases</li>
                      <li>Settings - Account and notification settings</li>
                    </ul>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ✅ <strong>Feature Working:</strong> Click the "Creative" and "Backer" buttons above to switch between different dashboard views. Your choice is saved in localStorage and will persist across page refreshes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
