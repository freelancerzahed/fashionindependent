"use client"

import { Briefcase, Heart } from "lucide-react"

interface RoleTogglePillProps {
  activeRole: "creator" | "backer"
  onRoleChange: (role: "creator" | "backer") => void
  hasBothRoles: boolean
}

export function RoleTogglePill({ activeRole, onRoleChange, hasBothRoles }: RoleTogglePillProps) {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 shadow-inner ring-1 ring-slate-200">
      {/* Creative Option */}
      <button
        onClick={() => hasBothRoles && onRoleChange("creator")}
        disabled={!hasBothRoles && activeRole !== "creator"}
        className={`flex-1 min-w-0 rounded-2xl px-3 py-2.5 font-semibold text-[12px] transition-all duration-200 ease-in-out sm:px-4 sm:text-sm ${
          activeRole === "creator"
            ? "bg-white text-purple-700 shadow-sm ring-1 ring-purple-200"
            : hasBothRoles
              ? "cursor-pointer text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              : "cursor-not-allowed text-slate-400"
        }`}
        title={!hasBothRoles ? "Creative role only - cannot switch" : "Switch to Creative"}
      >
        <span className="flex items-center justify-center gap-1.5">
          <Briefcase className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Creative</span>
        </span>
      </button>

      {/* Backer Option */}
      <button
        onClick={() => hasBothRoles && onRoleChange("backer")}
        disabled={!hasBothRoles && activeRole !== "backer"}
        className={`flex-1 min-w-0 rounded-2xl px-3 py-2.5 font-semibold text-[12px] transition-all duration-200 ease-in-out sm:px-4 sm:text-sm ${
          activeRole === "backer"
            ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-200"
            : hasBothRoles
              ? "cursor-pointer text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              : "cursor-not-allowed text-slate-400"
        }`}
        title={!hasBothRoles ? "Backer role not available - only creatives can switch" : "Switch to Backer"}
      >
        <span className="flex items-center justify-center gap-1.5">
          <Heart className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Backer</span>
        </span>
      </button>
    </div>
  )
}
