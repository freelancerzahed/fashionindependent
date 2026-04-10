"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Calendar from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Tag,
  Percent,
  Gift,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit,
  Copy,
  CalendarIcon,
  Users,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  DollarSign,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import { format } from "date-fns"

const promotions = [
  {
    id: "PROMO-001",
    name: "Summer Sale 2024",
    code: "SUMMER30",
    type: "percentage",
    value: 30,
    description: "30% off on all summer collection",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    usageLimit: 1000,
    usageCount: 245,
    minOrderValue: 50,
    categories: ["Summer", "Clothing"],
    customers: "all",
  },
  {
    id: "PROMO-002",
    name: "New Customer Welcome",
    code: "WELCOME15",
    type: "percentage",
    value: 15,
    description: "15% off for first-time customers",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 500,
    usageCount: 89,
    minOrderValue: 25,
    categories: ["All"],
    customers: "new",
  },
  {
    id: "PROMO-003",
    name: "Free Shipping Weekend",
    code: "FREESHIP",
    type: "fixed",
    value: 10,
    description: "Free shipping on orders over $75",
    status: "scheduled",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    usageLimit: 200,
    usageCount: 0,
    minOrderValue: 75,
    categories: ["All"],
    customers: "all",
  },
  {
    id: "PROMO-004",
    name: "Buy 2 Get 1 Free",
    code: "BUY2GET1",
    type: "bogo",
    value: 0,
    description: "Buy 2 items, get 1 free from selected categories",
    status: "expired",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    usageLimit: 300,
    usageCount: 287,
    minOrderValue: 0,
    categories: ["Accessories", "Shoes"],
    customers: "all",
  },
]

const stats = [
  { label: "Active Promos", value: "12", change: "+3", icon: Tag, color: "text-green-600" },
  { label: "Total Redemptions", value: "1,234", change: "+18%", icon: Gift, color: "text-blue-600" },
  { label: "Revenue Impact", value: "$45.2K", change: "+25%", icon: DollarSign, color: "text-purple-600" },
  { label: "Avg Discount", value: "22%", change: "-2%", icon: Percent, color: "text-orange-600" },
]

const tabs = [
  { id: "all", label: "All Promos", icon: Tag, count: 24 },
  { id: "active", label: "Active", icon: TrendingUp, count: 12 },
  { id: "scheduled", label: "Scheduled", icon: CalendarIcon, count: 5 },
  { id: "expired", label: "Expired", icon: Gift, count: 7 },
]

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % stats.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + stats.length) % stats.length)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="w-4 h-4" />
      case "fixed":
        return <Tag className="w-4 h-4" />
      case "bogo":
        return <Gift className="w-4 h-4" />
      default:
        return <Tag className="w-4 h-4" />
    }
  }

  const filteredPromotions = promotions.filter((promo) => {
    const matchesTab = activeTab === "all" || promo.status === activeTab
    const matchesSearch =
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Promotions</h1>
          <p className="text-sm text-gray-600 truncate">Manage discount codes and campaigns</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 ml-2 bg-transparent">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Promotion Name</label>
                <Input placeholder="e.g., Summer Sale 2024" />
              </div>
              <div>
                <label className="text-sm font-medium">Promo Code</label>
                <Input placeholder="e.g., SUMMER30" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Promotion description..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Discount Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="bogo">Buy One Get One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Discount Value</label>
                  <Input placeholder="e.g., 30" type="number" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" />
                <label htmlFor="active" className="text-sm font-medium">
                  Activate immediately
                </label>
              </div>
              <Button className="w-full">Create Promotion</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Promotions</h1>
          <p className="text-gray-600">Manage discount codes and promotional campaigns</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
              <SelectItem value="bogo">BOGO</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium">Promotion Name</label>
                    <Input placeholder="e.g., Summer Sale 2024" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Promo Code</label>
                    <Input placeholder="e.g., SUMMER30" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Promotion description..." rows={2} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Discount Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="bogo">Buy One Get One</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Discount Value</label>
                    <Input placeholder="e.g., 30" type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Usage Limit</label>
                    <Input placeholder="e.g., 1000" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Min Order Value</label>
                    <Input placeholder="e.g., 50" type="number" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Target Customers</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="new">New Customers</SelectItem>
                      <SelectItem value="returning">Returning Customers</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <label htmlFor="active" className="text-sm font-medium">
                    Activate immediately
                  </label>
                </div>

                <Button className="w-full">Create Promotion</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  <Badge
                    variant="secondary"
                    className={`absolute -top-1 -right-1 text-xs min-w-5 h-5 px-1 ${
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"
                    }`}
                  >
                    {tab.count > 999 ? "999+" : tab.count}
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
      <div className="md:hidden px-1">
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {(() => {
                  const IconComponent = stats[currentStatsIndex].icon
                  return <IconComponent className="w-6 h-6 flex-shrink-0" />
                })()}
                <span className="text-sm font-medium opacity-90 truncate">{stats[currentStatsIndex].label}</span>
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

            <div className="text-3xl font-bold mb-2">{stats[currentStatsIndex].value}</div>

            <div className="flex items-center text-sm">
              <span>{stats[currentStatsIndex].change} from last month</span>
            </div>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            {stats.map((_, index) => (
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
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {(() => {
                const IconComponent = stat.icon
                return <IconComponent className="h-4 w-4 text-muted-foreground" />
              })()}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-500">
                <span>{stat.change} from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mx-1 md:mx-0">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 md:gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotions List */}
      <div className="space-y-4">
        {filteredPromotions.map((promo) => (
          <Card key={promo.id} className="mx-1 md:mx-0 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Promo Header */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">{getTypeIcon(promo.type)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">{promo.name}</h3>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {promo.code}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{promo.description}</p>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <div className="text-lg font-bold text-gray-900">
                          {promo.type === "percentage"
                            ? `${promo.value}%`
                            : promo.type === "fixed"
                              ? `$${promo.value}`
                              : "BOGO"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {promo.type === "percentage" ? "OFF" : promo.type === "fixed" ? "OFF" : "FREE"}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span className="truncate">
                          {promo.startDate} - {promo.endDate}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {promo.usageCount}/{promo.usageLimit} used
                      </span>
                      {promo.minOrderValue > 0 && (
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          Min ${promo.minOrderValue}
                        </span>
                      )}
                    </div>

                    {/* Status and Progress */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(promo.status)} variant="secondary">
                          {promo.status}
                        </Badge>
                      </div>
                      <div className="flex-1 max-w-[120px] mx-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Usage</span>
                          <span>{Math.round((promo.usageCount / promo.usageLimit) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Copy className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Copy</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPromotions.length === 0 && (
        <Card className="mx-1 md:mx-0">
          <CardContent className="p-8 text-center">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No promotions found</h3>
            <p className="text-gray-600 mb-4 text-center">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first promotion to start offering discounts"}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Promotion
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
