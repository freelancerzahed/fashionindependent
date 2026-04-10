"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface DashboardSidebarProps {
  userRole?: "creator" | "backer"
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const role = userRole || user?.role

  const creatorTabs = [
    { id: "overview", label: "Overview", href: "/dashboard" },
    { id: "campaigns", label: "Campaigns", href: "/dashboard/campaigns" },
    { id: "backers", label: "Backers", href: "/dashboard/backers" },
    { id: "settings", label: "Settings", href: "/dashboard/settings" },
    { id: "documents", label: "Documents", href: "/dashboard/documents" },
  ]

  const tabs = creatorTabs

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4 space-y-2">
      {tabs.map((tab) => (
        <Link key={tab.id} href={tab.href}>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive(tab.href)
                ? "bg-blue-100 text-blue-900 border-l-4 border-blue-600"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {tab.label}
          </button>
        </Link>
      ))}
    </div>
  )
}
