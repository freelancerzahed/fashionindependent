"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Suspense } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
  MessageSquare,
  Store,
  Truck,
  CreditCard,
  FileText,
  UserCheck,
  TrendingUp,
  Calendar,
  Tag,
  Palette,
  LogOut,
  Search,
} from "lucide-react"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"

const adminMenuItems = [
  {
    title: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
      { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
      { icon: TrendingUp, label: "Reports", href: "/admin/reports" },
    ],
  },
  {
    title: "Catalog Management",
    items: [
      { icon: Package, label: "Products", href: "/admin/products", badge: "124" },
      { icon: Tag, label: "Categories", href: "/admin/categories" },
      { icon: Palette, label: "Brands", href: "/admin/brands" },
      { icon: Store, label: "Inventory", href: "/admin/inventory" },
    ],
  },
  {
    title: "Order Management",
    items: [
      { icon: ShoppingCart, label: "Orders", href: "/admin/orders", badge: "12" },
      { icon: Truck, label: "Shipping", href: "/admin/shipping" },
      { icon: CreditCard, label: "Payments", href: "/admin/payments" },
      { icon: FileText, label: "Invoices", href: "/admin/invoices" },
    ],
  },
  {
    title: "Customer Management",
    items: [
      { icon: Users, label: "Customers", href: "/admin/customers" },
      { icon: UserCheck, label: "Reviews", href: "/admin/reviews" },
      { icon: MessageSquare, label: "Support", href: "/admin/support", badge: "3" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { icon: Tag, label: "Promotions", href: "/admin/promotions" },
      { icon: Bell, label: "Notifications", href: "/admin/notifications" },
      { icon: Calendar, label: "Campaigns", href: "/admin/campaigns" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/admin/settings" },
      { icon: Users, label: "Admin Users", href: "/admin/admin-users" },
    ],
  },
]

// Mobile bottom navigation items
const mobileNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products", badge: "124" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders", badge: "12" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Settings, label: "More", href: "/admin/settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        // For demo purposes, we'll create an admin user if none exists
        if (!parsedUser.role) {
          parsedUser.role = "admin"
          parsedUser.name = "Admin User"
          parsedUser.email = "admin@fashion.com"
          localStorage.setItem("user", JSON.stringify(parsedUser))
        }
        setUser(parsedUser)
      } catch (error) {
        router.push("/auth/login")
        return
      }
    } else {
      router.push("/auth/login")
      return
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const getCurrentPageTitle = () => {
    const currentItem = adminMenuItems.flatMap((group) => group.items).find((item) => item.href === pathname)
    return currentItem?.label || "Admin Panel"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Desktop Sidebar */}
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar className="hidden md:flex border-r bg-white">
            <SidebarHeader className="border-b p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Fashion Admin</h2>
                  <p className="text-xs text-gray-500">Retailer Portal</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-2">
              {adminMenuItems.map((group, index) => (
                <SidebarGroup key={index}>
                  <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                    {group.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={pathname === item.href} className="w-full justify-start">
                            <Link href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || "Admin User"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || "admin@fashion.com"}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </SidebarFooter>
          </Sidebar>
        </Suspense>

        {/* Mobile Layout */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <Suspense fallback={<div>Loading...</div>}>
            <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-base">Fashion Admin</h2>
                  <p className="text-xs text-gray-500">{getCurrentPageTitle()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback className="text-xs">AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 p-0">
                    <div className="flex flex-col h-full">
                      {/* Profile Section */}
                      <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border-2 border-white/20">
                            <AvatarImage src="/placeholder.svg?height=64&width=64" />
                            <AvatarFallback className="text-lg bg-white/20">AD</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{user?.name || "Admin User"}</h3>
                            <p className="text-primary-100 text-sm">{user?.email || "admin@fashion.com"}</p>
                            <Badge className="mt-1 bg-white/20 text-white border-white/20">Admin</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="flex-1 overflow-y-auto p-4">
                        {adminMenuItems.map((group, index) => (
                          <div key={index} className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2 mb-2">
                              {group.title}
                            </h3>
                            <div className="space-y-1">
                              {group.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                                    pathname === item.href
                                      ? "bg-primary-50 text-primary-600 font-medium shadow-sm"
                                      : "hover:bg-gray-50 active:bg-gray-100"
                                  }`}
                                >
                                  <div
                                    className={`p-2 rounded-lg ${
                                      pathname === item.href ? "bg-primary-100" : "bg-gray-100"
                                    }`}
                                  >
                                    <item.icon className="w-4 h-4" />
                                  </div>
                                  <span className="flex-1">{item.label}</span>
                                  {item.badge && (
                                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-600">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Logout Button */}
                      <div className="p-4 border-t bg-gray-50">
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full justify-start gap-3 py-3 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </header>
          </Suspense>

          {/* Desktop Header */}
          <Suspense fallback={<div>Loading...</div>}>
            <header className="hidden md:flex bg-white border-b px-6 py-4 items-center gap-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900">{getCurrentPageTitle()}</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm" className="relative bg-transparent">
                  <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
              </div>
            </header>
          </Suspense>

          {/* Main Content */}
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            <div className="p-4 md:p-6">{children}</div>
          </main>

          {/* Mobile Bottom Navigation */}
          <Suspense fallback={<div>Loading...</div>}>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
              <div className="grid grid-cols-5 py-2">
                {mobileNavItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-200 ${
                        isActive ? "text-primary-600" : "text-gray-500 active:text-primary-600 active:scale-95"
                      }`}
                    >
                      <div
                        className={`relative p-2 rounded-xl transition-all duration-200 ${
                          isActive ? "bg-primary-50" : ""
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.badge && (
                          <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs mt-1 font-medium">{item.label}</span>
                      {isActive && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </Suspense>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
