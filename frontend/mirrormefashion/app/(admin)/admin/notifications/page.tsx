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
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Search,
  Filter,
  Plus,
  Send,
  Edit,
  Eye,
  Users,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const notifications = [
  {
    id: "NOTIF-001",
    title: "Flash Sale Alert",
    message: "Don't miss out! 50% off on selected items. Limited time offer ending soon!",
    type: "promotional",
    channel: "email",
    status: "sent",
    audience: "all_customers",
    audienceSize: 15420,
    sentDate: "2024-01-15",
    openRate: 24.5,
    clickRate: 8.2,
    deliveryRate: 98.1,
  },
  {
    id: "NOTIF-002",
    title: "Order Confirmation",
    message: "Thank you for your order! Your items are being prepared for shipment.",
    type: "transactional",
    channel: "push",
    status: "sent",
    audience: "recent_buyers",
    audienceSize: 342,
    sentDate: "2024-01-15",
    openRate: 89.2,
    clickRate: 45.1,
    deliveryRate: 99.7,
  },
  {
    id: "NOTIF-003",
    title: "Welcome to Fashion Store",
    message: "Welcome! Here's 15% off your first purchase. Use code WELCOME15",
    type: "welcome",
    channel: "email",
    status: "scheduled",
    audience: "new_customers",
    audienceSize: 89,
    sentDate: "2024-01-16",
    openRate: 0,
    clickRate: 0,
    deliveryRate: 0,
  },
  {
    id: "NOTIF-004",
    title: "Cart Abandonment Reminder",
    message: "You left something in your cart! Complete your purchase and get free shipping.",
    type: "reminder",
    channel: "sms",
    status: "draft",
    audience: "cart_abandoners",
    audienceSize: 567,
    sentDate: null,
    openRate: 0,
    clickRate: 0,
    deliveryRate: 0,
  },
]

const stats = [
  { label: "Total Sent", value: "45.2K", change: "+12%", icon: Send, color: "text-blue-600" },
  { label: "Avg Open Rate", value: "28.4%", change: "+3.2%", icon: Eye, color: "text-green-600" },
  { label: "Avg Click Rate", value: "12.8%", change: "+1.8%", icon: TrendingUp, color: "text-purple-600" },
  { label: "Active Campaigns", value: "8", change: "+2", icon: Bell, color: "text-orange-600" },
]

const tabs = [
  { id: "all", label: "All Notifications", icon: Bell, count: 156 },
  { id: "sent", label: "Sent", icon: Send, count: 89 },
  { id: "scheduled", label: "Scheduled", icon: Clock, count: 12 },
  { id: "draft", label: "Drafts", icon: Edit, count: 55 },
]

export default function NotificationsPage() {
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
      case "sent":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="w-4 h-4" />
      case "push":
        return <Bell className="w-4 h-4" />
      case "sms":
        return <Smartphone className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "promotional":
        return "bg-purple-100 text-purple-800"
      case "transactional":
        return "bg-blue-100 text-blue-800"
      case "welcome":
        return "bg-green-100 text-green-800"
      case "reminder":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredNotifications = notifications.filter((notif) => {
    const matchesTab = activeTab === "all" || notif.status === activeTab
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Notifications</h1>
          <p className="text-sm text-gray-600 truncate">Manage email, push, and SMS campaigns</p>
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
                <Input placeholder="e.g., Flash Sale Alert" />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="Your notification message..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Channel</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="welcome">Welcome</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Target Audience</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_customers">All Customers</SelectItem>
                    <SelectItem value="new_customers">New Customers</SelectItem>
                    <SelectItem value="recent_buyers">Recent Buyers</SelectItem>
                    <SelectItem value="cart_abandoners">Cart Abandoners</SelectItem>
                    <SelectItem value="vip_customers">VIP Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="schedule" />
                <label htmlFor="schedule" className="text-sm font-medium">
                  Schedule for later
                </label>
              </div>
              <Button className="w-full">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600">Manage email, push, and SMS campaigns</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="push">Push</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
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
                <DialogTitle>Create New Notification Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Campaign Title</label>
                  <Input placeholder="e.g., Flash Sale Alert" />
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Your notification message..." rows={4} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Channel</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_customers">All Customers</SelectItem>
                      <SelectItem value="new_customers">New Customers</SelectItem>
                      <SelectItem value="recent_buyers">Recent Buyers</SelectItem>
                      <SelectItem value="cart_abandoners">Cart Abandoners</SelectItem>
                      <SelectItem value="vip_customers">VIP Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="schedule" />
                  <label htmlFor="schedule" className="text-sm font-medium">
                    Schedule for later
                  </label>
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
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 md:gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notif) => (
          <Card key={notif.id} className="mx-1 md:mx-0 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Notification Header */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">{getChannelIcon(notif.channel)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">{notif.title}</h3>
                          <Badge className={getTypeColor(notif.type)} variant="secondary">
                            {notif.type}
                          </Badge>
                          <Badge className={getStatusColor(notif.status)} variant="secondary">
                            {notif.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notif.message}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {notif.audienceSize.toLocaleString()} recipients
                          </span>
                          {notif.sentDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notif.sentDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {notif.status === "sent" && (
                  <div className="grid grid-cols-3 gap-4 text-center pt-3 border-t">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{notif.openRate}%</div>
                      <div className="text-xs text-gray-500">Open Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{notif.clickRate}%</div>
                      <div className="text-xs text-gray-500">Click Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{notif.deliveryRate}%</div>
                      <div className="text-xs text-gray-500">Delivered</div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Edit</span>
                    </Button>
                    {notif.status === "draft" && (
                      <Button size="sm">
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Send</span>
                      </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <Card className="mx-1 md:mx-0">
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600 mb-4 text-center">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first notification campaign to engage with customers"}
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
