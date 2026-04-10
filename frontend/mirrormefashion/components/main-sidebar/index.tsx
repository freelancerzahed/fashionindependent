"use client"

import { useMemo } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react"
import QuickAccessSection from "./quick-access-section"
import CollapsibleSection from "./collapsible-section"
import LegalSection from "./legal-section"
import { sidebarData } from "@/lib/data/main-sidebar-data"
import Link from "next/link"

export default function Sidebar({
  user,
  pathname,
  sidebarCollapsed,
  setSidebarCollapsed,
  expandedSection,
  toggleSection,
  style,
}: {
  user: any
  pathname: string
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  expandedSection: string | null
  toggleSection: (title: string) => void
  style: { top: string; height: string }
}) {
  const sectionGroups = useMemo(() => {
    return {
      quickAccess: sidebarData.find((s) => s.type === "quickAccess"),
      sections: sidebarData.filter((s) => s.type === "section"),
      legal: sidebarData.find((s) => s.type === "legal"),
    }
  }, [])

  return (
    <div
      className={`${sidebarCollapsed ? "w-16" : "w-72"} fixed left-0 z-40 transition-all duration-300 ease-in-out bg-white border-r border-gray-200 shadow-sm overflow-hidden`}
      style={style}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
         {!sidebarCollapsed && (
        <Link
          href="/profile"
          className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer hover:bg-gray-50 rounded-md p-1"
        >
          <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-red-100">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-red-100 text-red-700 text-xs font-medium">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm text-gray-900 truncate">
              {user?.name ||
                `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                "User"}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              @{user?.username || user?.email?.split("@")[0] || "user"}
            </p>
          </div>
        </Link>
      )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-7 w-7 flex-shrink-0 hover:bg-red-50 hover:text-red-600"
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {/* Quick Access */}
          {sectionGroups.quickAccess && (
            <QuickAccessSection
              section={sectionGroups.quickAccess as any}
              pathname={pathname}
              sidebarCollapsed={sidebarCollapsed}
            />
          )}

          <Separator className="mx-3 mb-3" />

          {/* Main + Secondary sections (collapsible) */}
          <div className="px-3 space-y-3">
            {(sectionGroups.sections as any[]).map((section) => (
              <div key={section.title}>
                <CollapsibleSection
                  section={section}
                  pathname={pathname}
                  sidebarCollapsed={sidebarCollapsed}
                  expandedSection={expandedSection}
                  toggleSection={toggleSection}
                />
              </div>
            ))}
          </div>

          <Separator className="mx-3 my-3" />

          {/* Legal */}
          {sectionGroups.legal && (
            <LegalSection
              section={sectionGroups.legal as any}
              pathname={pathname}
              sidebarCollapsed={sidebarCollapsed}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-gray-100">
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.removeItem("user")
              // navigation handled by parent to preserve behavior; parent will perform router push
              window.dispatchEvent(new CustomEvent("sidebar:signout"))
            }}
            className={`w-full ${sidebarCollapsed ? "justify-center px-2" : "justify-start gap-2 px-4"}`}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
