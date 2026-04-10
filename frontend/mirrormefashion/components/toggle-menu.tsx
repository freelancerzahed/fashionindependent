"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Home,
  ShoppingBag,
  Package,
  ShoppingCart,
  Heart,
  User,
  MessageCircle,
  Bell,
  Settings,
  HelpCircle,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

export function ToggleMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn] = useState(false) // Mock auth state

  const { state } = useCart()
  const { wishlist } = useWishlist()

  const cartItemCount = state.itemCount
  const wishlistItemCount = wishlist.length

  const mainMenuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Products", href: "/products", icon: Package },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: cartItemCount },
    { name: "Wishlist", href: "/wishlist", icon: Heart, badge: wishlistItemCount },
  ]

  const userMenuItems = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Messages", href: "/messages", icon: MessageCircle, badge: 2 },
    { name: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help", href: "/help", icon: HelpCircle },
  ]

  const authItems = isLoggedIn
    ? [{ name: "Logout", href: "/auth/logout", icon: LogOut }]
    : [
        { name: "Login", href: "/auth/login", icon: LogIn },
        { name: "Register", href: "/auth/register", icon: UserPlus },
      ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-red-100 active:scale-95 transition-all"
        >
          <Menu className="h-5 w-5 text-red-800" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-red-500 text-white">{isLoggedIn ? "JD" : "G"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{isLoggedIn ? "John Doe" : "Welcome!"}</h3>
              <p className="text-red-100 text-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Mirror Me Fashion
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-4">
          <div className="px-6 mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</h4>
          </div>
          {mainMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors active:bg-red-100"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
            </Link>
          ))}

          <Separator className="my-4" />

          {/* User Menu */}
          <div className="px-6 mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h4>
          </div>
          {userMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors active:bg-red-100"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
            </Link>
          ))}

          <Separator className="my-4" />

          {/* Auth Section */}
          {authItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors active:bg-red-100"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
