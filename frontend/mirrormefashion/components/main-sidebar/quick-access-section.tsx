"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import CartQuickAccessItem from "@/components/main-sidebar/cart-quick-access-item"
import type { QuickAccessSection as QuickAccessSectionType } from "@/types/main-sidebar"

export default function QuickAccessSection({
  section,
  pathname,
  sidebarCollapsed,
}: {
  section: QuickAccessSectionType
  pathname: string
  sidebarCollapsed: boolean
}) {
  return (
    <div className="px-3 mb-4">
      {!sidebarCollapsed && section.showTitle !== false && (
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="h-3 w-3 text-red-600 flex-shrink-0" />
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {section.title}
          </h4>
        </div>
      )}
      <div className="space-y-1">
        {section.items.map((item) => {
          const isActive = pathname === item.href

          if (item.custom) {
            return (
              <CartQuickAccessItem
                key={item.href}
                href={item.href}
                isActive={isActive}
                sidebarCollapsed={sidebarCollapsed}
              />
            )
          }

          const Icon: any = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-red-50 text-red-700 shadow-sm border-l-3 border-red-600"
                  : "hover:bg-gray-50 hover:text-gray-900 text-gray-600"
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className={`p-1 rounded-md flex-shrink-0 ${isActive ? "bg-red-100" : "bg-gray-100 group-hover:bg-gray-200"}`}>
                <Icon className={`h-3.5 w-3.5 ${isActive ? item.color : "text-gray-600"}`} />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="font-medium text-sm truncate">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-red-600 hover:bg-red-600 text-xs h-4 px-1.5 flex-shrink-0 ml-2 text-white">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
