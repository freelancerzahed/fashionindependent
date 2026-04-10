"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MessageSquare, Heart, UserPlus, ShoppingBag, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

type NotificationType = "all" | "mentions" | "likes" | "comments" | "follows" | "orders" | "system"

interface Notification {
  id: string
  type: NotificationType
  message: string
  timestamp: Date
  read: boolean
  link?: string
  icon?: React.ElementType
  colorClass?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "likes",
    message: "John Doe liked your latest post.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    link: "/post/123",
    icon: Heart,
    colorClass: "text-primary-600",
  },
  {
    id: "2",
    type: "comments",
    message: "Jane Smith commented on your product: 'Love this dress!'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    link: "/product/456",
    icon: MessageSquare,
    colorClass: "text-primary-500",
  },
  {
    id: "3",
    type: "follows",
    message: "Alex Johnson started following you.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    link: "/profile/alexjohnson",
    icon: UserPlus,
    colorClass: "text-primary-400",
  },
  {
    id: "4",
    type: "orders",
    message: "Your order #1001 has been shipped!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
    link: "/orders/1001",
    icon: ShoppingBag,
    colorClass: "text-primary-700",
  },
  {
    id: "5",
    type: "system",
    message: "System update: New features are now available!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    read: true,
    link: "/blog/new-features",
    icon: Info,
    colorClass: "text-primary-300",
  },
  {
    id: "6",
    type: "likes",
    message: "Emily White liked your photo.",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    read: false,
    link: "/post/789",
    icon: Heart,
    colorClass: "text-primary-600",
  },
  {
    id: "7",
    type: "comments",
    message: "David Green replied to your comment.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    link: "/post/101",
    icon: MessageSquare,
    colorClass: "text-primary-500",
  },
  {
    id: "8",
    type: "follows",
    message: "Sophia Brown started following you.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    read: true,
    link: "/profile/sophiabrown",
    icon: UserPlus,
    colorClass: "text-primary-400",
  },
]

const tabs = [
  { id: "all", label: "All", icon: Bell },
  { id: "likes", label: "Likes", icon: Heart },
  { id: "comments", label: "Comments", icon: MessageSquare },
  { id: "follows", label: "Follows", icon: UserPlus },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "system", label: "System", icon: Info },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<NotificationType>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setNotifications(mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
      setLoading(false)
    }, 500) // Simulate fetch delay
    return () => clearTimeout(timer)
  }, [])

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6 pb-24 md:pb-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-primary-100 text-sm md:text-base">
                You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}.
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="text-primary-600 border-white bg-white hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
              >
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as NotificationType)}>
          <div className="md:hidden w-full overflow-hidden">
            <Swiper modules={[FreeMode]} spaceBetween={8} slidesPerView="auto" freeMode={true} className="px-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <SwiperSlide key={tab.id} className="!w-auto">
                    <button
                      onClick={() => setActiveTab(tab.id as NotificationType)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap",
                        activeTab === tab.id
                          ? "bg-primary-600 text-white shadow-md"
                          : "bg-white text-primary-600 hover:bg-primary-50 border border-primary-100",
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>

          <TabsList className="hidden md:grid w-full grid-cols-6 bg-white shadow-sm border border-primary-100">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              Likes
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              Comments
            </TabsTrigger>
            <TabsTrigger
              value="follows"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              Follows
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="animate-pulse border-primary-100">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary-100"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-primary-100 rounded w-3/4"></div>
                        <div className="h-3 bg-primary-100 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 w-20 bg-primary-100 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <CardContent className="p-8 text-center text-primary-600">
                  <Bell className="mx-auto h-16 w-16 mb-4 text-primary-400" />
                  <p className="text-xl font-semibold mb-2">No notifications found for this category.</p>
                  <p className="text-sm text-primary-500">Check back later or try another tab.</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification, index) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "relative group transition-all duration-200 hover:shadow-lg border-primary-100",
                    !notification.read && "bg-gradient-to-r from-primary-50 to-white border-primary-200 shadow-sm",
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.5s ease-out forwards",
                  }}
                >
                  <CardContent className="p-4 flex items-center space-x-4">
                    {notification.icon && (
                      <div className={cn("flex-shrink-0 p-2 rounded-full bg-primary-100", notification.colorClass)}>
                        <notification.icon className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 mb-1">{notification.message}</p>
                      <p className="text-xs text-primary-500">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-600 hover:bg-primary-50"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      {notification.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300 bg-transparent"
                        >
                          <a href={notification.link}>View</a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
