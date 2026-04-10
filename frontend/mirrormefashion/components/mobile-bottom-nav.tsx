"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Home, Sparkles, MessageCircle, ShoppingBag, Menu } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

const bottomNavItems = [
  {
    icon: Home,
    label: "Home",
    href: "/dashboard",
    color: "text-blue-600",
  },
  {
    icon: ShoppingBag,
    label: "Shop",
    href: "/shop",
    color: "text-primary-600",
  },
  {
    icon: Home,
    label: "Wishlist",
    href: "/wishlist",
    color: "text-red-600",
    showWishlistBadge: true,
  },
  {
    icon: ShoppingBag,
    label: "Cart",
    href: "/cart",
    color: "text-green-600",
    showCartBadge: true,
  },
  {
    icon: Home,
    label: "Profile",
    href: "/profile",
    color: "text-purple-600",
  },
]

export default function MobileBottomNavGeneral() {
  const pathname = usePathname()
  const { state } = useCart()
  const { wishlist } = useWishlist()
  const wishlistItemCount = wishlist.length

  const cartItemCount = state.itemCount

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-0.5 md:hidden">
      <div className="flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          let badgeCount = 0
          if (item.showCartBadge) {
            badgeCount = cartItemCount
          } else if (item.showWishlistBadge) {
            badgeCount = wishlistItemCount
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-0.5 rounded-lg transition-all duration-200 min-w-0 ${
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="relative">
                <div className={`p-0.5 rounded-lg ${isActive ? "bg-primary-100" : "bg-transparent"}`}>
                  <item.icon className={`h-4 w-4 ${isActive ? item.color : "text-gray-600"}`} />
                </div>
                {badgeCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-primary-600 hover:bg-primary-600">
                    {badgeCount}
                  </Badge>
                )}
              </div>
              <span
                className={`text-xs font-medium truncate max-w-12 ${isActive ? "text-primary-700" : "text-gray-600"}`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

interface MobileBottomNavProps {
  currentSection: string
  onSectionChange: (section: string) => void
}

export function MobileBottomNav({ currentSection, onSectionChange }: MobileBottomNavProps) {
  const navItems = [
    {
      id: "hero",
      name: "Home",
      icon: Home,
      action: () => onSectionChange("hero"),
    },
    {
      id: "features",
      name: "Features",
      icon: Sparkles,
      action: () => onSectionChange("features"),
    },
    {
      id: "chat",
      name: "AI Stylist",
      icon: MessageCircle,
      action: () => onSectionChange("chat"),
    },
    {
      id: "shop",
      name: "Shop",
      icon: ShoppingBag,
      action: () => window.open("/shop", "_blank"),
    },
    {
      id: "menu",
      name: "Menu",
      icon: Menu,
      action: () => onSectionChange("beta"),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl md:hidden">
      <div className="safe-area-inset-bottom">
        <div className="grid grid-cols-5 py-0.5">
          {navItems.map((item) => {
            const isActive =
              currentSection === item.id ||
              (item.id === "hero" && currentSection === "hero") ||
              (item.id === "features" && currentSection === "features") ||
              (item.id === "chat" &&
                (currentSection === "chat" || currentSection === "bodyModeler" || currentSection === "registration")) ||
              (item.id === "menu" &&
                (currentSection === "beta" ||
                  currentSection === "professional" ||
                  currentSection === "retailer" ||
                  currentSection === "advertiser"))

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex flex-col items-center justify-center py-0.5 px-1 relative transition-all duration-300 ${
                  isActive ? "text-primary-600 scale-110" : "text-gray-500 hover:text-primary-500 active:scale-95"
                }`}
              >
                <div className={`relative transition-all duration-300 ${isActive ? "transform -translate-y-1" : ""}`}>
                  <item.icon className={`h-5 w-5 transition-all duration-300 ${isActive ? "scale-110" : ""}`} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span
                  className={`text-xs mt-0.5 font-medium transition-all duration-300 ${
                    isActive ? "text-primary-600 font-semibold" : "text-gray-500"
                  }`}
                >
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute inset-0 bg-primary-50 rounded-2xl -z-10 scale-75 opacity-50"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
