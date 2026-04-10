"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  Settings,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3, count: 0 },
  { id: "campaigns", label: "Campaigns", icon: Target, count: 8 },
  { id: "performance", label: "Performance", icon: TrendingUp, count: 0 },
  { id: "audience", label: "Audience", icon: Users, count: 0 },
  { id: "budget", label: "Budget", icon: DollarSign, count: 0 },
  { id: "creative", label: "Creative", icon: Eye, count: 12 },
  { id: "settings", label: "Settings", icon: Settings, count: 2 },
]

const performanceData = [
  { name: "Mon", impressions: 12000, clicks: 450, conversions: 23 },
  { name: "Tue", impressions: 15000, clicks: 580, conversions: 31 },
  { name: "Wed", impressions: 18000, clicks: 720, conversions: 42 },
  { name: "Thu", impressions: 14000, clicks: 520, conversions: 28 },
  { name: "Fri", impressions: 22000, clicks: 890, conversions: 56 },
  { name: "Sat", impressions: 25000, clicks: 1100, conversions: 67 },
  { name: "Sun", impressions: 20000, clicks: 780, conversions: 45 },
]

const activeCampaigns = [
  { id: "CAMP001", name: "Summer Fashion Sale", budget: 5000, spent: 3200, status: "active", ctr: "2.8%" },
  { id: "CAMP002", name: "New Arrivals Promo", budget: 3000, spent: 1800, status: "active", ctr: "3.2%" },
  { id: "CAMP003", name: "Weekend Special", budget: 2000, spent: 1950, status: "paused", ctr: "2.1%" },
  { id: "CAMP004", name: "Brand Awareness", budget: 8000, spent: 4500, status: "active", ctr: "1.9%" },
]

export default function AdvertiserDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)

  const statsCards = [
    {
      title: "Total Spend",
      value: "$12,450",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Impressions",
      value: "2.4M",
      change: "+15.3%",
      trend: "up",
      icon: Eye,
      color: "bg-blue-500",
    },
    {
      title: "Click Rate",
      value: "2.8%",
      change: "+0.4%",
      trend: "up",
      icon: MousePointer,
      color: "bg-primary-500",
    },
    {
      title: "Conversions",
      value: "892",
      change: "+12.1%",
      trend: "up",
      icon: Target,
      color: "bg-orange-500",
    },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Paused</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Completed</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  const handleCampaignToggle = (campaignId: string) => {
    console.log("Toggle campaign:", campaignId)
    // In a real app: make API call to toggle campaign status
  }

  const handleTabNavigation = (tabId: string, route: string) => {
    console.log("Navigate to:", route)
    // In a real app: router.push(route)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            {/* Performance Chart */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="impressions" stroke="#dc2626" strokeWidth={2} name="Impressions" />
                    <Line type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={2} name="Clicks" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Active Campaigns */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-3">
                  {activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-xl">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{campaign.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            ${campaign.spent} / ${campaign.budget} • CTR: {campaign.ctr}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusBadge(campaign.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleCampaignToggle(campaign.id)}
                        >
                          {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "campaigns":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Campaign Management</h3>
                  <p className="text-gray-600 mb-4">Create and manage your advertising campaigns</p>
                  <Button
                    className="bg-primary-600 hover:bg-primary-700"
                    onClick={() => handleTabNavigation("campaigns", "/advertiser/campaigns")}
                  >
                    Create New Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "performance":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
                  <p className="text-gray-600 mb-4">Deep dive into your campaign performance metrics</p>
                  <Button
                    className="bg-primary-600 hover:bg-primary-700"
                    onClick={() => handleTabNavigation("performance", "/advertiser/analytics")}
                  >
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "audience":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Audience Insights</h3>
                  <p className="text-gray-600 mb-4">Understand your target audience better</p>
                  <Button className="bg-primary-600 hover:bg-primary-700">View Audiences</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "budget":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Budget Management</h3>
                  <p className="text-gray-600 mb-4">Monitor and optimize your advertising spend</p>
                  <Button className="bg-primary-600 hover:bg-primary-700">Manage Budget</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "creative":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Creative Assets</h3>
                  <p className="text-gray-600 mb-4">Manage your ad creatives and assets</p>
                  <Button className="bg-primary-600 hover:bg-primary-700">Upload Assets</Button>
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
                  <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
                  <p className="text-gray-600 mb-4">Configure your advertiser account settings</p>
                  <Button className="bg-primary-600 hover:bg-primary-700">Go to Settings</Button>
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
            <h1 className="text-xl md:text-2xl font-bold truncate">Advertiser Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 truncate">
              Monitor your advertising performance and campaigns
            </p>
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
