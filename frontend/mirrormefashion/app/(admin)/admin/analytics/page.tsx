"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Activity,
  Target,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const salesData = [
  { name: "Jan", revenue: 45000, orders: 240, customers: 180 },
  { name: "Feb", revenue: 38000, orders: 198, customers: 165 },
  { name: "Mar", revenue: 52000, orders: 300, customers: 220 },
  { name: "Apr", revenue: 48000, orders: 278, customers: 195 },
  { name: "May", revenue: 61000, orders: 389, customers: 280 },
  { name: "Jun", revenue: 58000, orders: 349, customers: 245 },
  { name: "Jul", revenue: 67000, orders: 420, customers: 310 },
  { name: "Aug", revenue: 72000, orders: 456, customers: 340 },
  { name: "Sep", revenue: 69000, orders: 398, customers: 295 },
  { name: "Oct", revenue: 78000, orders: 489, customers: 365 },
  { name: "Nov", revenue: 85000, orders: 523, customers: 390 },
  { name: "Dec", revenue: 92000, orders: 567, customers: 420 },
]

const categoryPerformance = [
  { name: "Dresses", revenue: 125000, orders: 890, growth: 15.2 },
  { name: "Tops", revenue: 98000, orders: 1240, growth: 8.7 },
  { name: "Bottoms", revenue: 87000, orders: 670, growth: -2.3 },
  { name: "Outerwear", revenue: 156000, orders: 450, growth: 22.1 },
  { name: "Accessories", revenue: 67000, orders: 780, growth: 12.8 },
  { name: "Shoes", revenue: 134000, orders: 560, growth: 18.9 },
]

const trafficSources = [
  { name: "Organic Search", value: 35, color: "#900000" },
  { name: "Direct", value: 25, color: "#b91c1c" },
  { name: "Social Media", value: 20, color: "#dc2626" },
  { name: "Email", value: 12, color: "#ef4444" },
  { name: "Paid Ads", value: 8, color: "#f87171" },
]

const topProducts = [
  { name: "Summer Floral Dress", revenue: 12450, units: 156, conversion: 4.2 },
  { name: "Classic White Tee", revenue: 8960, units: 224, conversion: 6.8 },
  { name: "Denim Jacket", revenue: 15680, units: 98, conversion: 3.1 },
  { name: "Black Skinny Jeans", revenue: 11240, units: 140, conversion: 5.4 },
  { name: "Leather Handbag", revenue: 18900, units: 63, conversion: 2.8 },
]

const tabs = [
  { id: "overview", label: "Overview", icon: TrendingUp, count: 0 },
  { id: "revenue", label: "Revenue", icon: DollarSign, count: 0 },
  { id: "traffic", label: "Traffic", icon: Users, count: 0 },
  { id: "products", label: "Products", icon: ShoppingCart, count: 0 },
  { id: "conversion", label: "Convert", icon: Target, count: 0 },
  { id: "trends", label: "Trends", icon: Activity, count: 0 },
  { id: "reports", label: "Reports", icon: BarChart3, count: 5 },
]

export default function AnalyticsPage() {
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
    {
      title: "Avg Order Value",
      value: "$161.45",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "bg-primary-500",
    },
    { title: "Conversion Rate", value: "3.24%", change: "+0.3%", trend: "up", icon: Eye, color: "bg-orange-500" },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            {/* Revenue Chart */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "revenue" ? `$${value.toLocaleString()}` : value,
                        name === "revenue" ? "Revenue" : "Orders",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#900000"
                      fill="#900000"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "revenue":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Category Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-3">
                  {categoryPerformance.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-xl">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm truncate">{category.name}</h3>
                          <p className="text-xs text-gray-500">{category.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm">${category.revenue.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          {category.growth > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                          <span className={`text-xs ${category.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                            {category.growth > 0 ? "+" : ""}
                            {category.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "traffic":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#900000"
                      dataKey="value"
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "products":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-xl">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.units} units sold</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm">${product.revenue.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">
                          {product.conversion}% conversion
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Analytics</h1>
          <p className="text-sm text-gray-600 truncate">Business insights</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 ml-2 bg-transparent">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
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
      <div className="md:hidden px-1">
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

      {/* Desktop Key Metrics */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {(() => {
                const IconComponent = stat.icon
                return <IconComponent className="h-4 w-4 text-muted-foreground" />
              })()}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Desktop Charts Row */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#900000"
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders vs Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#900000" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" stroke="#b91c1c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
