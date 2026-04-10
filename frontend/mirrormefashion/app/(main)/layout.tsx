"use client"

import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Navigation from "@/components/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import GlobalSofiaAssistant from "@/components/global-sofia-assistant"
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "@/components/main-sidebar"
import { UserProvider, useUserContext } from "@/contexts/UserContext"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUserContext()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showTopBar, setShowTopBar] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // 🚨 Protect routes based on auth state
  useEffect(() => {
    if (loading) return

    const isDashboard = pathname.startsWith("/profile")
    const isAuthPage = pathname.startsWith("/auth")
    const isHome = pathname === "/"

    if (!user && isDashboard) {
      // Not logged in → block dashboard
      router.push("login")
    } else if (user && (isAuthPage || isHome)) {
      // Logged in → block auth + home
      router.push("/profile")
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // 🚫 Hide nav/sidebar on auth pages
  if (pathname.startsWith("/auth")) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Mobile */}
      <div className="md:hidden">
        <Navigation />
        <main
          className="pb-16 transition-all duration-300 ease-in-out"
          style={{ paddingTop: "4rem" }}
        >
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
        <MobileBottomNav />
      </div>

      {/* ✅ Desktop */}
      <div className="hidden md:block">
        <Navigation />

        {/* Sidebar only on dashboard */}
        {(pathname.startsWith("/profile") || pathname.startsWith("/user")) && (
          <Sidebar
            user={user}
            pathname={pathname}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            expandedSection={expandedSection}
            toggleSection={(title) =>
              setExpandedSection((prev) => (prev === title ? null : title))
            }
            style={{
              top: showTopBar ? "6rem" : "4rem",
              height: showTopBar ? "calc(100vh - 6rem)" : "calc(100vh - 4rem)",
            }}
          />
        )}

        {/* Main Content */}
        <div
          className={`${
            pathname.startsWith("/profile") || pathname.startsWith("/user")
              ? sidebarCollapsed
                ? "ml-16"
                : "ml-72"
              : ""
          } transition-all duration-300 ease-in-out`}
          style={{ paddingTop: showTopBar ? "5rem" : "4rem" }}
        >
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[calc(100vh-8rem)]">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <LayoutContent>{children}</LayoutContent>
          <GlobalSofiaAssistant />
          <Toaster />
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  )
}
