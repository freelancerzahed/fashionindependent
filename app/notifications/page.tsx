"use client"

import { useState } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "campaign_update",
      title: "Campaign Update: Sustainable Linen Collection",
      message: "Emma Studios posted a new update on your backed campaign",
      timestamp: "2 hours ago",
      read: false,
      icon: "📢",
    },
    {
      id: 2,
      type: "delivery",
      title: "Your Order is on the Way",
      message: "Your Eco-Friendly Accessories order has been shipped",
      timestamp: "1 day ago",
      read: false,
      icon: "📦",
    },
    {
      id: 3,
      type: "campaign_ending",
      title: "Campaign Ending Soon",
      message: "Minimalist Mens Fashion campaign ends in 7 days",
      timestamp: "3 days ago",
      read: true,
      icon: "⏰",
    },
    {
      id: 4,
      type: "new_campaign",
      title: "New Campaign from Favorite Creator",
      message: "Emma Studios launched a new campaign",
      timestamp: "1 week ago",
      read: true,
      icon: "✨",
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">{unreadCount} unread notifications</p>
            </div>
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="container py-12">
        <div className="max-w-2xl space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
                  !notification.read ? "bg-blue-50 border-blue-200" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">{notification.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{notification.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
