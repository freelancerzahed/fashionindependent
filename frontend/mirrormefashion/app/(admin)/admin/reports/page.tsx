"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Calendar from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Download,
  CalendarIcon,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  ShoppingCart,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const reportTemplates = [
  {
    id: "sales",
    name: "Sales Report",
    description: "Comprehensive sales performance analysis",
    type: "sales",
    frequency: "monthly",
    lastGenerated: "2024-01-20",
    status: "ready",
  },
  {
    id: "inventory",
    name: "Inventory Report",
    description: "Stock levels and inventory valuation",
    type: "inventory",
    frequency: "weekly",
    lastGenerated: "2024-01-18",
    status: "ready",
  },
  {
    id: "customers",
    name: "Customer Analytics",
    description: "Customer behavior and demographics",
    type: "customers",
    frequency: "monthly",
    lastGenerated: "2024-01-15",
    status: "processing",
  },
  {
    id: "products",
    name: "Product Performance",
    description: "Top performing products and categories",
    type: "products",
    frequency: "weekly",
    lastGenerated: "2024-01-19",
    status: "ready",
  },
  {
    id: "financial",
    name: "Financial Summary",
    description: "Revenue, costs, and profit analysis",
    type: "financial",
    frequency: "monthly",
    lastGenerated: "2024-01-17",
    status: "ready",
  },
]

const tabs = [
  { id: "all", label: "All", icon: FileText, count: reportTemplates.length },
  { id: "sales", label: "Sales", icon: TrendingUp, count: reportTemplates.filter((r) => r.type === "sales").length },
  {
    id: "inventory",
    label: "Inventory",
    icon: BarChart3,
    count: reportTemplates.filter((r) => r.type === "inventory").length,
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    count: reportTemplates.filter((r) => r.type === "customers").length,
  },
  {
    id: "products",
    label: "Products",
    icon: ShoppingCart,
    count: reportTemplates.filter((r) => r.type === "products").length,
  },
  {
    id: "financial",
    label: "Financial",
    icon: DollarSign,
    count: reportTemplates.filter((r) => r.type === "financial").length,
  },
  { id: "custom", label: "Custom", icon: PieChart, count: 3 },
  { id: "scheduled", label: "Scheduled", icon: CalendarIcon, count: 8 },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [date, setDate] = useState<Date>()

  const filteredReports = reportTemplates.filter((report) => {
    return activeTab === "all" || report.type === activeTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800 text-xs">Ready</Badge>
      case "processing":
        return <Badge className="bg-primary-100 text-primary-800 text-xs">Processing</Badge>
      case "scheduled":
        return <Badge className="bg-purple-100 text-purple-800 text-xs">Scheduled</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  const statsCards = [
    { title: "Total Reports", value: "24", icon: FileText, color: "bg-primary-500" },
    { title: "Generated Today", value: "5", icon: TrendingUp, color: "bg-green-500" },
    { title: "Scheduled Reports", value: "8", icon: CalendarIcon, color: "bg-primary-600" },
    { title: "Custom Reports", value: "3", icon: PieChart, color: "bg-primary-700" },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "custom":
        return (
          <div className="space-y-4">
            <Card className="mx-2 md:mx-0">
              <CardContent className="p-4 md:p-6">
                <div className="text-center py-6 md:py-8">
                  <PieChart className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-3 md:mb-4" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">Custom Report Builder</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 px-2">
                    Create custom reports with your specific metrics
                  </p>
                  <Button size="sm" className="md:size-default bg-primary-600 hover:bg-primary-700">
                    Create Custom Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "scheduled":
        return (
          <div className="space-y-4">
            <Card className="mx-2 md:mx-0">
              <CardContent className="p-4 md:p-6">
                <div className="text-center py-6 md:py-8">
                  <CalendarIcon className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-3 md:mb-4" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">Scheduled Reports</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 px-2">
                    Manage your automated report schedules
                  </p>
                  <Button size="sm" className="md:size-default bg-primary-600 hover:bg-primary-700">
                    View Schedules
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            {/* Reports List */}
            <Card className="mx-2 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Available Reports ({filteredReports.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-3">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="border rounded-xl hover:bg-gray-50 transition-colors overflow-hidden"
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden p-3">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate">{report.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{report.description}</p>
                          </div>
                          <div className="flex-shrink-0">{getStatusBadge(report.status)}</div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {report.frequency}
                            </Badge>
                            <span className="text-xs text-gray-500 truncate">
                              Last: {new Date(report.lastGenerated).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-1 flex-shrink-0 ml-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:flex items-center justify-between p-4">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-base truncate">{report.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{report.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {report.frequency}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Last: {new Date(report.lastGenerated).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusBadge(report.status)}
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="rounded-full">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
      <div className="flex items-center justify-between md:hidden px-2">
        <div className="min-w-0 flex-1 pr-3">
          <h1 className="text-lg md:text-xl font-bold truncate">Reports</h1>
          <p className="text-xs md:text-sm text-gray-600 truncate">Generate business reports</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 h-8 w-8 p-0 bg-transparent">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive business reports and insights</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button className="bg-primary-600 hover:bg-primary-700">
            <FileText className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="w-full max-w-[85vw] overflow-hidden md:hidden mx-auto">
        <Swiper
          modules={[FreeMode]}
          spaceBetween={8}
          slidesPerView="auto"
          freeMode={true}
          className="px-4 !overflow-visible"
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <SwiperSlide key={tab.id} className="!w-auto">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mb-1" />
                  <span className="text-xs font-medium leading-tight truncate max-w-full px-1">{tab.label}</span>
                  <Badge
                    variant="secondary"
                    className={`absolute -top-1 -right-1 text-xs min-w-4 h-4 px-1 ${
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"
                    }`}
                  >
                    {tab.count > 99 ? "99+" : tab.count}
                  </Badge>
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
                <Badge
                  variant="secondary"
                  className={`text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"}`}
                >
                  {tab.count}
                </Badge>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Stats Slider */}
      <div className="md:hidden px-2">
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-4 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {(() => {
                  const IconComponent = statsCards[currentStatsIndex].icon
                  return <IconComponent className="w-5 h-5 flex-shrink-0" />
                })()}
                <span className="text-sm font-medium opacity-90 truncate">{statsCards[currentStatsIndex].title}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStats}
                  className="text-white hover:bg-white/20 p-1 h-7 w-7"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextStats}
                  className="text-white hover:bg-white/20 p-1 h-7 w-7"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-2xl md:text-3xl font-bold mb-2">{statsCards[currentStatsIndex].value}</div>
          </div>

          <div className="flex justify-center mt-3 gap-1">
            {statsCards.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
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
      {renderTabContent()}
    </div>
  )
}
