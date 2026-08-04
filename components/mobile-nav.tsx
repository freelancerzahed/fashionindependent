"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Home,
  Compass,
  ShoppingBag,
  BookOpen,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  History,
  Settings,
  ChevronUp,
  Sparkles,
  Package,
} from "lucide-react"
import { useState } from "react"
import { CategoryDrawer } from "@/components/category-drawer"
import type { LucideIcon } from "lucide-react"

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  action?: () => void
}

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false)

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isDashboard = pathname.startsWith("/dashboard")

  const dashboardItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/campaigns", label: "Campaigns", icon: Sparkles },
    { href: "/dashboard/pledges", label: "Pledges", icon: Heart },
    { href: "/dashboard/analytics", label: "Analytics", icon: Compass },
    { href: "/dashboard/documents", label: "Docs", icon: BookOpen },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const mainItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "#", label: "Categories", icon: ShoppingBag, action: () => setShowCategoryDrawer(true) },
    { href: "/blog", label: "Blog", icon: BookOpen },
  ]

  const displayItems = isDashboard ? dashboardItems.slice(0, 4) : mainItems.slice(0, 4)
  const overflowItems = isDashboard ? dashboardItems.slice(4) : []

  return (
    <>
      <CategoryDrawer open={showCategoryDrawer} onOpenChange={setShowCategoryDrawer} />

      {showMenu && isDashboard && (
        <div className="fixed bottom-16 left-0 right-0 border-t border-neutral-200 bg-white/95 backdrop-blur md:hidden z-40">
          <div className="flex flex-col gap-1 px-2 py-2">
            {overflowItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMenu(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <Link
              href="/"
              onClick={() => setShowMenu(false)}
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              <Home className="h-4 w-4" />
              <span>Back to App</span>
            </Link>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/95 backdrop-blur md:hidden z-40">
        <div className="flex h-15 items-center justify-around px-1">
          {displayItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center w-full h-full gap-0.5 px-1 transition-colors text-neutral-600 hover:text-black"
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span className="text-[10px] leading-none">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-0.5 px-1 transition-colors ${
                  active ? "text-black" : "text-neutral-600"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="text-[10px] leading-none">{item.label}</span>
              </Link>
            )
          })}

          {isDashboard ? (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex flex-col items-center justify-center w-full h-full gap-0.5 px-1 text-neutral-600 hover:text-black transition-colors"
            >
              <ChevronUp className={`h-4.5 w-4.5 transition-transform ${showMenu ? "rotate-180" : ""}`} />
              <span className="text-[10px] leading-none">More</span>
            </button>
          ) : !user ? (
            <Link
              href="/login"
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 px-1 transition-colors ${
                isActive("/login") ? "text-black" : "text-neutral-600"
              }`}
            >
              <User className="h-4.5 w-4.5" />
              <span className="text-[10px] leading-none">Login</span>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center w-full h-full gap-0.5 px-1 text-neutral-600 hover:text-black transition-colors"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span className="text-[10px] leading-none">Logout</span>
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
