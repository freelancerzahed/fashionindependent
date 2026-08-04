"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, History, Settings, LogOut, User, ChevronDown, ShoppingCart, Briefcase } from "lucide-react"
import { useState, useEffect } from "react"
import { RoleTogglePill } from "@/components/role-toggle-pill"

const DASHBOARD_ROLE_EVENT = "dashboard-role-changed"

export function BackerDashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [activeRole, setActiveRole] = useState<"creator" | "backer" | null>(null)

  // Check if user has both roles
  const hasCreatorRole = user?.role === "creator" || Boolean(user?.roles?.includes("creator"))
  const hasBackerRole = user?.role === "backer" || Boolean(user?.roles?.includes("backer"))
  const hasBothRoles = hasCreatorRole && hasBackerRole

  const backerTabs = [
    { id: "overview", label: "Overview", href: "/dashboard" },
    { id: "pledges", label: "My Pledges", href: "/dashboard/pledges" },
    { id: "cart", label: "Shopping Cart", href: "/dashboard/backer/cart" },
    { id: "favorites", label: "Favorites", href: "/dashboard/favorites" },
    { id: "orders", label: "Order History", href: "/dashboard/history" },
    { id: "settings", label: "Settings", href: "/dashboard/settings" },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleSwitchRole = (newRole: "creator" | "backer") => {
    setActiveRole(newRole)
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardActiveRole", newRole)
      window.dispatchEvent(new CustomEvent(DASHBOARD_ROLE_EVENT, { detail: newRole }))
      router.push(newRole === "creator" ? "/dashboard" : "/dashboard/backer")
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardActiveRole")
      if (saved && (saved === "creator" || saved === "backer")) {
        setActiveRole(saved as "creator" | "backer")
      } else {
        setActiveRole("backer")
      }
    }
  }, [])

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

  if (!user) return null

  const userInitials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  const profileImageUrl = user.avatar
    ? user.avatar.startsWith("/") || user.avatar.startsWith("http")
      ? user.avatar
      : `/api/storage/${user.avatar}`
    : null

  return (
    <div className="w-full min-w-0 overflow-hidden bg-white rounded-lg shadow-sm p-4 sm:p-6 md:sticky md:top-4 space-y-6 border border-neutral-100">
      {/* User Profile Card */}
      <div className="pb-6 border-b border-neutral-200">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Avatar and User Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-12 sm:h-14 w-12 sm:w-14 border-2 border-blue-200 flex-shrink-0 mt-1">
              <AvatarImage src={profileImageUrl || ""} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-50 text-xs sm:text-sm font-semibold text-blue-700">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 pt-1">
              <h3 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">{user.name}</h3>
              <p className="text-xs text-neutral-600 truncate mt-1">{user.email}</p>
            </div>
          </div>

          {/* User Submenu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Role Toggle Pill */}
        {hasBothRoles && activeRole && (
          <RoleTogglePill 
            activeRole={activeRole} 
            onRoleChange={handleSwitchRole}
            hasBothRoles={hasBothRoles}
          />
        )}
      </div>

      {/* Navigation Tabs - Member/Backer Specific */}
      <nav className="space-y-2">
        {backerTabs.map((tab) => (
          <Link key={tab.id} href={tab.href}>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ease-in-out ${
                isActive(tab.href)
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border-l-4 border-blue-600 shadow-sm"
                  : "text-neutral-700 hover:bg-neutral-50 border-l-4 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          </Link>
        ))}
      </nav>
    </div>
  )
}
