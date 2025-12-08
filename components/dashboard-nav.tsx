"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Heart, History, Settings, Scan, LogOut } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: User },
    { href: "/dashboard/account", label: "Account Settings", icon: Settings },
    { href: "/dashboard/donations", label: "Active Donations", icon: Heart },
    { href: "/dashboard/history", label: "Donation History", icon: History },
    { href: "/dashboard/body-model", label: "ShapeMe Body Model", icon: Scan },
  ]

  return (
    <nav className="hidden md:block lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        <div className="pt-4 border-t">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 w-full">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
