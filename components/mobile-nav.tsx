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
  Scan,
  Settings,
  ChevronUp,
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
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/donations", label: "Donations", icon: Heart },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/body-model", label: "Body Model", icon: Scan },
    { href: "/dashboard/account", label: "Account", icon: Settings },
  ]

  const mainItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "#", label: "Categories", icon: ShoppingBag, action: () => setShowCategoryDrawer(true) },
    { href: "/blog", label: "Blog", icon: BookOpen },
  ]

  const displayItems = isDashboard ? dashboardItems.slice(0, 4) : mainItems.slice(0, 4)
  const hasMore = isDashboard ? dashboardItems.length > 4 : false

  return (
    <>
      <CategoryDrawer open={showCategoryDrawer} onOpenChange={setShowCategoryDrawer} />

      {showMenu && isDashboard && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-40">
          <div className="flex flex-col">
            {dashboardItems.slice(4).map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-neutral-100 transition-colors ${
                    active ? "bg-neutral-100 text-black" : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
            <Link
              href="/"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors border-t border-neutral-200"
            >
              <Home className="h-5 w-5" />
              <span className="text-sm">Back to App</span>
            </Link>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-40">
        <div className="flex items-center justify-around h-16">
          {displayItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-neutral-600 hover:text-black"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  active ? "text-black" : "text-neutral-600"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}

          {isDashboard ? (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex flex-col items-center justify-center w-full h-full gap-1 text-neutral-600 hover:text-black transition-colors"
            >
              <ChevronUp className={`h-5 w-5 transition-transform ${showMenu ? "rotate-180" : ""}`} />
              <span className="text-xs">More</span>
            </button>
          ) : !user ? (
            <Link
              href="/login"
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive("/login") ? "text-black" : "text-neutral-600"
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Login</span>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center w-full h-full gap-1 text-neutral-600 hover:text-black transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs">Logout</span>
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
