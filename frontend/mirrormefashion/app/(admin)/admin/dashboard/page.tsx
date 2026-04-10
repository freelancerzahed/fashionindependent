"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const tabs = [
  { id: "overview", label: "Overview", icon: Home, count: 0 },
  { id: "orders", label: "Orders", icon: ShoppingCart, count: 23 },
  { id: "products", label: "Products", icon: Package, count: 156 },
  { id: "customers", label: "Customers", icon: Users, count: 89 },
  { id: "analytics", label: "Analytics", icon: TrendingUp, count: 0 },
  { id: "reports", label: "Reports", icon: FileText, count: 5 },
  { id: "settings", label: "Settings", icon: Settings, count: 2 },
]

const salesData = [
  { name: "Jan", revenue: 45000, orders: 240 },
  { name: "Feb", revenue: 38000, orders: 198 },
  { name: "Mar", revenue: 52000, orders: 300 },
  { name: "Apr", revenue: 48000, orders: 278 },
  { name: "May", revenue: 61000, orders: 389 },
  { name: "Jun", revenue: 58000, orders: 349 },
]

const recentOrders = [
  { id: "#12345", customer: "Sarah Johnson", amount: 156.0, status: "completed" },
  { id: "#12346", customer: "Mike Chen", amount: 89.5, status: "processing" },
  { id: "#12347", customer: "Emma Davis", amount: 234.0, status: "shipped" },
  { id: "#12348", customer: "John Smith", amount: 67.25, status: "pending" },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)

  const statsCards = [
    {
      title: "Total Revenue",
      value: "$847,231",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    { title: "Total Orders", value: "5,247", change: "+8.2%", trend: "up", icon: ShoppingCart, color: "bg-blue-500" },
    { title: "Total Customers", value: "2,847", change: "+15.3%", trend: "up", icon: Users, color: "bg-primary-500" },
    { title: "Conversion Rate", value: "3.24%", change: "+0.3%", trend: "up", icon: Eye, color: "bg-orange-500" },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Processing</Badge>
      case "shipped":
        return <Badge className="bg-primary-100 text-primary-800 text-xs">Shipped</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            {/* Revenue Chart */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                    <Line type="monotone" dataKey="revenue" stroke="#900000" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-xl">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{order.id}</p>
                          <p className="text-xs text-gray-500 truncate">{order.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusBadge(order.status)}
                        <span className="font-semibold text-sm">${order.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "orders":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Orders Management</h3>
                  <p className="text-gray-600 mb-4">View and manage all customer orders</p>
                  <Button>Go to Orders</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "products":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Product Catalog</h3>
                  <p className="text-gray-600 mb-4">Manage your product inventory and catalog</p>
                  <Button>Go to Products</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "customers":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Customer Management</h3>
                  <p className="text-gray-600 mb-4">View and manage customer relationships</p>
                  <Button>Go to Customers</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
                  <p className="text-gray-600 mb-4">Deep dive into your business metrics</p>
                  <Button>Go to Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "reports":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Reports & Export</h3>
                  <p className="text-gray-600 mb-4">Generate and export business reports</p>
                  <Button>Go to Reports</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "settings":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">System Settings</h3>
                  <p className="text-gray-600 mb-4">Configure your store settings</p>
                  <Button>Go to Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold truncate">Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 truncate">Welcome back! Here's your business overview</p>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="w-full max-w-[85vw] overflow-hidden md:hidden mx-auto">
          <Swiper modules={[FreeMode]} spaceBetween={6} slidesPerView="auto" freeMode={true} className="px-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <SwiperSlide key={tab.id} className="!w-auto">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium leading-tight">{tab.label}</span>
                    {tab.count > 0 && (
                      <Badge
                        variant="secondary"
                        className={`absolute -top-1 -right-1 text-xs min-w-5 h-5 px-1 ${
                          activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"
                        }`}
                      >
                        {tab.count > 999 ? "999+" : tab.count}
                      </Badge>
                    )}
                  </button>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {tab.count > 0 && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"}`}
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Stats Slider */}
        <div className="md:hidden w-full px-4">
          <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {(() => {
                    const IconComponent = statsCards[currentStatsIndex].icon
                    return <IconComponent className="w-6 h-6 flex-shrink-0" />
                  })()}
                  <span className="text-sm font-medium opacity-90 truncate">{statsCards[currentStatsIndex].title}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStats}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1 h-8 w-8">
                    {/* Placeholder for missing button content */}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextStats}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-3xl font-bold mb-2">{statsCards[currentStatsIndex].value}</div>

              <div className="flex items-center text-sm">
                {statsCards[currentStatsIndex].trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {statsCards[currentStatsIndex].change} from last month
              </div>
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {statsCards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStatsIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Stats Cards */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div
                      className={`flex items-center text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {stat.change} from last month
                    </div>
                  </div>
                  <div className={`w-8 h-8 ${stat.color} rounded-full flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = stat.icon
                      return <IconComponent className="w-4 h-4 text-white" />
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  )
}
