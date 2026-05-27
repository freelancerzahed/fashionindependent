"use client"

import { Briefcase, Heart } from "lucide-react"

interface RoleTogglePillProps {
  activeRole: "creator" | "backer"
  onRoleChange: (role: "creator" | "backer") => void
  hasBothRoles: boolean
}

export function RoleTogglePill({ activeRole, onRoleChange, hasBothRoles }: RoleTogglePillProps) {
  return (
    <div className="flex items-center gap-1 bg-neutral-100 rounded-full p-1 w-full">
      {/* Creator Option */}
      <button
        onClick={() => hasBothRoles && onRoleChange("creator")}
        disabled={!hasBothRoles && activeRole !== "creator"}
        className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out ${
          activeRole === "creator"
            ? "bg-white text-purple-700 shadow-md ring-2 ring-purple-200"
            : hasBothRoles 
            ? "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 cursor-pointer"
            : "text-neutral-400 cursor-not-allowed"
        }`}
        title={!hasBothRoles ? "Creator role only - cannot switch" : "Switch to Creator"}
      >
        <Briefcase className="h-4 w-4" />
        <span>Creator</span>
      </button>

      {/* Backer Option */}
      <button
        onClick={() => hasBothRoles && onRoleChange("backer")}
        disabled={!hasBothRoles && activeRole !== "backer"}
        className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out ${
          activeRole === "backer"
            ? "bg-white text-blue-700 shadow-md ring-2 ring-blue-200"
            : hasBothRoles 
            ? "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 cursor-pointer"
            : "text-neutral-400 cursor-not-allowed"
        }`}
        title={!hasBothRoles ? "Backer role not available - only creators can switch" : "Switch to Backer"}
      >
        <Heart className="h-4 w-4" />
        <span>Backer</span>
      </button>
    </div>
  )
}
