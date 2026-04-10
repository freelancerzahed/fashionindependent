"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  ShoppingCart,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Camera,
  Star,
  Gift,
  Bookmark,
  Lightbulb,
} from "lucide-react"

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  const quickActions = [
    {
      name: "Add to Cart",
      icon: ShoppingCart,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Add to cart"),
    },
    {
      name: "Wishlist",
      icon: Heart,
      color: "bg-red-500 hover:bg-red-600",
      action: () => console.log("Add to wishlist"),
    },
    {
      name: "Messages",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Open messages"),
    },
    { name: "Share", icon: Share2, color: "bg-purple-500 hover:bg-purple-600", action: () => console.log("Share") },
    { name: "Search", icon: Search, color: "bg-orange-500 hover:bg-orange-600", action: () => console.log("Search") },
    { name: "Camera", icon: Camera, color: "bg-pink-500 hover:bg-pink-600", action: () => console.log("Open camera") },
    { name: "Reviews", icon: Star, color: "bg-yellow-500 hover:bg-yellow-600", action: () => console.log("Reviews") },
    { name: "Gifts", icon: Gift, color: "bg-indigo-500 hover:bg-indigo-600", action: () => console.log("Gifts") },
    {
      name: "Bookmarks",
      icon: Bookmark,
      color: "bg-teal-500 hover:bg-teal-600",
      action: () => console.log("Bookmarks"),
    },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-red-100 active:scale-95 transition-all relative"
        >
          <Zap className="h-5 w-5 text-red-800" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">9</Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[400px] rounded-t-3xl">
        <div className="py-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h3>
            <p className="text-gray-500 text-sm">Tap any action to get started</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.action()
                  setIsOpen(false)
                }}
                className="flex flex-col items-center p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-2 shadow-lg`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{action.name}</span>
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 border border-red-100">
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 rounded-full p-2">
                <Lightbulb className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900 text-sm mb-1">Pro Tip</h4>
                <p className="text-red-700 text-xs">Long press any action for more options and shortcuts!</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
