"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { CollapsibleSection as CollapsibleSectionType } from "@/types/main-sidebar"

export default function CollapsibleSection({
  section,
  pathname,
  sidebarCollapsed,
  expandedSection,
  toggleSection,
}: {
  section: CollapsibleSectionType
  pathname: string
  sidebarCollapsed: boolean
  expandedSection: string | null
  toggleSection: (title: string) => void
}) {
  const isExpanded = expandedSection === section.title
  const SectionIcon: any = section.icon

  return (
    <Collapsible open={!!isExpanded} onOpenChange={() => toggleSection(section.title)}>
      <CollapsibleTrigger
        className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors ${
          sidebarCollapsed ? "justify-center" : ""
        }`}
        title={sidebarCollapsed ? section.title : undefined}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1 rounded-md flex-shrink-0 ${section.bgColor ?? "bg-gray-100"}`}>
            <SectionIcon className={`h-3.5 w-3.5 ${section.color}`} />
          </div>
          {!sidebarCollapsed && (
            <span className="font-medium text-sm text-gray-700 truncate">{section.title}</span>
          )}
        </div>
        {!sidebarCollapsed && (
          <ChevronRight
            className={`h-3.5 w-3.5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`}
          />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-1">
        <div className="space-y-0.5 ml-5">
          {section.items.map((item) => {
            const isActive = pathname === item.href
            const ItemIcon: any = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <ItemIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
