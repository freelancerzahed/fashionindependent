"use client"

import Link from "next/link"
import { CartCounter } from "@/components/cart-counter"

export default function CartQuickAccessItem({
  href,
  isActive,
  sidebarCollapsed,
}: { href: string; isActive: boolean; sidebarCollapsed: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-red-50 text-red-700 shadow-sm border-l-3 border-red-600"
          : "hover:bg-gray-50 hover:text-gray-900 text-gray-600"
      }`}
      title={sidebarCollapsed ? "Cart" : undefined}
    >
      <div className={`p-1 rounded-md flex-shrink-0 ${isActive ? "bg-red-100" : "bg-gray-100 group-hover:bg-gray-200"}`}>
        <CartCounter className="text-red-600" showIcon />
      </div>
      {!sidebarCollapsed && (
        <div className="flex-1 flex items-center justify-between min-w-0">
          <span className="font-medium text-sm truncate">Cart</span>
        </div>
      )}
    </Link>
  )
}
