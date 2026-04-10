"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Menu,
  Search,
  Bell,
  ShoppingCart,
  Home,
  MessageCircle,
  Users,
  Store,
  Sparkles,
  BookOpen,
  Settings,
  Star,
  ChevronRight,
  User,
  ShoppingBag,
  Heart,
  CreditCard,
  ImageIcon,
  BarChart3,
  Info,
  Mail,
  HelpCircle,
  MessageSquare,
  Shield,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

// Same sidebar data structure as desktop
const sidebarData = {
  quickAccess: [
    { icon: Home, label: "Dashboard", href: "/dashboard", color: "text-blue-600" },
    { icon: Bell, label: "Notifications", href: "/notifications", badge: 5, color: "text-orange-600" },
    { icon: MessageCircle, label: "Messages", href: "/messages", badge: 3, color: "text-green-600" },
    { icon: ShoppingCart, label: "Cart", href: "/cart", color: "text-primary-600", showCartBadge: true },
  ],
  mainSections: [
    {
      title: "Social & Community",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        { icon: User, label: "My Profile", href: "/profile" },
        { icon: Users, label: "All Profiles", href: "/profiles" },
        { icon: Users, label: "Friends", href: "/friends" },
      ],
    },
    {
      title: "Shopping",
      icon: Store,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      items: [
        { icon: Store, label: "Shop", href: "/shop" },
        { icon: ShoppingBag, label: "Products", href: "/products" },
        { icon: Heart, label: "Wishlist", href: "/wishlist" },
        { icon: CreditCard, label: "Checkout", href: "/checkout" },
      ],
    },
    {
      title: "Personal Tools",
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        { icon: ImageIcon, label: "Media", href: "/media" },
        { icon: BarChart3, label: "Body Shape", href: "/body-shape" },
        { icon: BarChart3, label: "Recommendations", href: "/recommendations" },
      ],
    },
  ],
  secondarySections: [
    {
      title: "Information",
      icon: BookOpen,
      color: "text-gray-600",
      items: [
        { icon: BookOpen, label: "Blog", href: "/blog" },
        { icon: Info, label: "About", href: "/about" },
        { icon: Mail, label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Support & Settings",
      icon: Settings,
      color: "text-gray-600",
      items: [
        { icon: Settings, label: "Settings", href: "/settings" },
        { icon: HelpCircle, label: "Help & Support", href: "/help" },
        { icon: MessageSquare, label: "Send Feedback", href: "/feedback" },
      ],
    },
  ],
  legal: [
    { icon: Shield, label: "Privacy Policy", href: "/privacy" },
    { icon: FileText, label: "Terms of Service", href: "/terms" },
  ],
}

interface MobileHeaderProps {
  user: any
  sidebarItems: any[]
  groupedSidebarItems: any
}

export default function MobileHeader({ user }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["Social & Community", "Shopping"])

  const { state } = useCart()
  const { wishlist } = useWishlist()

  const cartItemCount = state.itemCount
  const wishlistItemCount = wishlist.length

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(sectionTitle)
        ? prevSections.filter((title) => title !== sectionTitle)
        : [...prevSections, sectionTitle],
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-primary-50 hover:text-primary-600"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Header */}
                <SheetHeader className="flex-shrink-0 p-4 border-b border-gray-100">
                  <SheetTitle className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex-shrink-0">
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Mirror</span>
                  </SheetTitle>
                </SheetHeader>

                {/* User Profile Section */}
                <div className="flex-shrink-0 p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-primary-100">
                      {(() => {
                        let avatarSrc = "/placeholder.svg"
                        if (user?.avatar) {
                          avatarSrc = user.avatar.startsWith('/') || user.avatar.startsWith('http')
                            ? user.avatar
                            : `/api/storage/${user.avatar}`
                        }
                        return <AvatarImage src={avatarSrc} />
                      })()}
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-sm font-medium">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        @{user?.username || user?.email?.split("@")[0] || "user"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Content */}
                <ScrollArea className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-6">
                    {/* Quick Access */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-primary-600 flex-shrink-0" />
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Access</h4>
                      </div>
                      <div className="space-y-1">
                        {sidebarData.quickAccess.map((item) => {
                          const isActive = window.location.pathname === item.href
                          let badgeCount = item.badge
                          if (item.showCartBadge) {
                            badgeCount = cartItemCount
                          }

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                isActive
                                  ? "bg-primary-50 text-primary-700 shadow-sm border-l-4 border-primary-600"
                                  : "hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                              }`}
                            >
                              <div
                                className={`p-1.5 rounded-md flex-shrink-0 ${
                                  isActive ? "bg-primary-100" : "bg-gray-100"
                                }`}
                              >
                                <item.icon className={`h-4 w-4 ${isActive ? item.color : "text-gray-600"}`} />
                              </div>
                              <div className="flex-1 flex items-center justify-between min-w-0">
                                <span className="font-medium text-sm truncate">{item.label}</span>
                                {badgeCount && badgeCount > 0 && (
                                  <Badge className="bg-primary-600 hover:bg-primary-600 text-xs h-5 px-2 flex-shrink-0 ml-2">
                                    {badgeCount}
                                  </Badge>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Main Sections */}
                    <div className="space-y-4">
                      {sidebarData.mainSections.map((section) => {
                        const isExpanded = expandedSections.includes(section.title)
                        return (
                          <div key={section.title}>
                            <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.title)}>
                              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`p-1.5 rounded-md flex-shrink-0 ${section.bgColor}`}>
                                    <section.icon className={`h-4 w-4 ${section.color}`} />
                                  </div>
                                  <span className="font-semibold text-sm text-gray-700 truncate">{section.title}</span>
                                </div>
                                <ChevronRight
                                  className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <div className="space-y-1 ml-6">
                                  {section.items.map((item) => {
                                    const isActive = window.location.pathname === item.href
                                    return (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                          isActive
                                            ? "bg-primary-50 text-primary-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                      >
                                        <item.icon className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                      </Link>
                                    )
                                  })}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        )
                      })}
                    </div>

                    <Separator />

                    {/* Secondary Sections */}
                    <div className="space-y-4">
                      {sidebarData.secondarySections.map((section) => {
                        const isExpanded = expandedSections.includes(section.title)
                        return (
                          <div key={section.title}>
                            <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.title)}>
                              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="p-1.5 rounded-md bg-gray-100 flex-shrink-0">
                                    <section.icon className={`h-4 w-4 ${section.color}`} />
                                  </div>
                                  <span className="font-medium text-sm text-gray-600 truncate">{section.title}</span>
                                </div>
                                <ChevronRight
                                  className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <div className="space-y-1 ml-6">
                                  {section.items.map((item) => {
                                    const isActive = window.location.pathname === item.href
                                    return (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                          isActive
                                            ? "bg-primary-50 text-primary-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                      >
                                        <item.icon className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                      </Link>
                                    )
                                  })}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        )
                      })}
                    </div>

                    <Separator />

                    {/* Legal Links */}
                    <div>
                      <div className="space-y-1">
                        {sidebarData.legal.map((item) => {
                          const isActive = window.location.pathname === item.href
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
                                isActive
                                  ? "bg-primary-50 text-primary-700"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                              }`}
                            >
                              <item.icon className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-gray-100">
                  <LogoutButton className="w-full justify-start gap-3 text-sm bg-primary-600 hover:bg-primary-700 text-white h-10" />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Mirror
            </h1>
          </Link>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary-50 hover:text-primary-600">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-lg hover:bg-primary-50 hover:text-primary-600"
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary-600 hover:bg-primary-600">
              3
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>
          <Link href="/profile">
            <Avatar className="h-8 w-8 ring-2 ring-primary-100 hover:ring-primary-200 transition-all">
              {(() => {
                let avatarSrc = "/placeholder.svg"
                if (user?.avatar) {
                  avatarSrc = user.avatar.startsWith('/') || user.avatar.startsWith('http')
                    ? user.avatar
                    : `/api/storage/${user.avatar}`
                }
                return <AvatarImage src={avatarSrc} />
              })()}
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-medium">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
