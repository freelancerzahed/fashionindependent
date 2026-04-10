"use client"

import Link from "next/link"
import type { LegalSection as LegalSectionType } from "@/types/main-sidebar"

export default function LegalSection({
  section,
  pathname,
  sidebarCollapsed,
}: {
  section: LegalSectionType
  pathname: string
  sidebarCollapsed: boolean
}) {
  if (sidebarCollapsed) return null

  return (
    <div className="px-3 mt-4">
      <div className="space-y-0.5">
        {section.items.map((item) => {
          const isActive = pathname === item.href
          const Icon: any = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                isActive ? "bg-red-50 text-red-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
