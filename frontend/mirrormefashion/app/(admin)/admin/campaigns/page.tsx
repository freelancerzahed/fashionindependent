"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Target,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  Edit,
  Users,
  Eye,
  MousePointer,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const campaigns = [
  {
    id: "CAMP-001",
    name: "Summer Collection Launch",
    type: "product_launch",
    status: "active",
    budget: 15000,
    spent: 8750,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    channels: ["email", "social", "display"],
    impressions: 245000,
    clicks: 12250,
    conversions: 892,
    revenue: 45600,
    targetAudience: "Fashion enthusiasts aged 25-45",
    description: "Promote our new summer collection with targeted ads and email campaigns",
  },
  {
    id: "CAMP-002",
    name: "Back to School Sale",
    type: "seasonal_sale",
    status: "scheduled",
    budget: 8000,
    spent: 0,
    startDate: "2024-08-15",
    endDate: "2024-09-15",
    channels: ["email", "search"],
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    targetAudience: "Students and parents",
    description: "Target students and parents with back-to-school fashion essentials",
  },
  {
    id: "CAMP-003",
    name: "Customer Retention Program",
    type: "retention",
    status: "active",
    budget: 5000,
    spent: 3200,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    channels: ["email", "push"],
    impressions: 89000,
    clicks: 5340,
    conversions: 234,
    revenue: 12800,
    targetAudience: "Existing customers with 2+ purchases",
    description: "Re-engage existing customers with personalized offers and recommendations",
  },
  {
    id: "CAMP-004",
    name: "Holiday Gift Guide",
    type: "seasonal_sale",
    status: "completed",
    budget: 20000,
    spent: 19850,
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    channels: ["email", "social", "display", "search"],
    impressions: 567000,
    clicks: 28350,
    conversions: 1456,
    revenue: 89200,
    targetAudience: "Gift shoppers aged 25-55",
    description: "Holiday season campaign featuring curated gift collections",
  },
]

const stats = [
  { label: "Active Campaigns", value: "8", change: "+2", icon: Target, color: "text-blue-600" },
  { label: "Total Budget", value: "$48K", change: "+15%", icon: DollarSign, color: "text-green-600" },
  { label: "Avg ROAS", value: "3.2x", change: "+0.4x", icon: TrendingUp, color: "text-primary-600" },
  { label: "Total Conversions", value: "2.1K", change: "+28%", icon: Target, color: "text-orange-600" },
]

const tabs = [
  { id: "all", label: "All Campaigns", icon: Target, count: 24 },
  { id: "active", label: "Active", icon: Play, count: 8 },
  { id: "scheduled", label: "Scheduled", icon: Calendar, count: 5 },
  { id: "completed", label: "Completed", icon: TrendingUp, count: 11 },
]

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)

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
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "product_launch":
        return "bg-primary-100 text-primary-800"
      case "seasonal_sale":
        return "bg-orange-100 text-orange-800"
      case "retention":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateROAS = (revenue: number, spent: number) => {
    if (spent === 0) return 0
    return (revenue / spent).toFixed(1)
  }

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return 0
    return ((clicks / impressions) * 100).toFixed(2)
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesTab = activeTab === "all" || campaign.status === activeTab
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Marketing Campaigns</h1>
          <p className="text-sm text-gray-600 truncate">Manage and track marketing campaigns</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 ml-2 bg-transparent">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campaign Title</label>
                <Input placeholder="e.g., Summer Collection Launch" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Campaign description..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Campaign Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product_launch">Product Launch</SelectItem>
                      <SelectItem value="seasonal_sale">Seasonal Sale</SelectItem>
                      <SelectItem value="retention">Customer Retention</SelectItem>
                      <SelectItem value="acquisition">Customer Acquisition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Budget</label>
                  <Input placeholder="e.g., 15000" type="number" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Target Audience</label>
                <Textarea placeholder="Describe your target audience..." rows={2} />
              </div>
              <Button className="w-full">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
          <p className="text-gray-600">Manage and track marketing campaigns performance</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="product_launch">Product Launch</SelectItem>
              <SelectItem value="seasonal_sale">Seasonal Sale</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Campaign Title</label>
                  <Input placeholder="e.g., Summer Collection Launch" />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Campaign description..." rows={2} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Campaign Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product_launch">Product Launch</SelectItem>
                        <SelectItem value="seasonal_sale">Seasonal Sale</SelectItem>
                        <SelectItem value="retention">Customer Retention</SelectItem>
                        <SelectItem value="acquisition">Customer Acquisition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Budget</label>
                    <Input placeholder="e.g., 15000" type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input type="date" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <Textarea placeholder="Describe your target audience..." rows={2} />
                </div>

                <div>
                  <label className="text-sm font-medium">Channels</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Email", "Social Media", "Display Ads", "Search Ads", "Push Notifications", "SMS"].map(
                      (channel) => (
                        <label key={channel} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{channel}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                <Button className="w-full">Create Campaign</Button>
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
                  placeholder="Search campaigns..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="mx-1 md:mx-0 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Campaign Header */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-base truncate">{campaign.name}</h3>
                        <Badge className={getTypeColor(campaign.type)} variant="secondary">
                          {campaign.type.replace("_", " ")}
                        </Badge>
                        <Badge className={getStatusColor(campaign.status)} variant="secondary">
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{campaign.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="truncate">
                            {campaign.startDate} - {campaign.endDate}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="truncate">{campaign.targetAudience}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget</span>
                      <span>
                        ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((campaign.spent / campaign.budget) * 100)}% spent
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {campaign.status !== "scheduled" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-base font-bold text-gray-900">{campaign.impressions.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        Impressions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-gray-900">{campaign.clicks.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <MousePointer className="w-3 h-3" />
                        Clicks
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-gray-900">
                        {calculateCTR(campaign.clicks, campaign.impressions)}%
                      </div>
                      <div className="text-xs text-gray-500">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-gray-900">{campaign.conversions.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-gray-900">${campaign.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Revenue
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-green-600">
                        {calculateROAS(campaign.revenue, campaign.spent)}x
                      </div>
                      <div className="text-xs text-gray-500">ROAS</div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex flex-wrap gap-1">
                    {campaign.channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {campaign.status === "active" && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Pause className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Pause</span>
                      </Button>
                    )}
                    {campaign.status === "scheduled" && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Play className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Start</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <Card className="mx-1 md:mx-0">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-4 text-center">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first marketing campaign to start driving sales"}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
