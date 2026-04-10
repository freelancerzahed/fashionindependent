"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  DollarSign,
  Settings,
  Trash2,
  BookMarkedIcon as MarkAsUnread,
} from "lucide-react"

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "budget",
      title: "Budget Alert: Summer Fashion Campaign",
      message: "Your campaign has spent 90% of its daily budget ($180 of $200)",
      timestamp: "2 minutes ago",
      isRead: false,
      priority: "high",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: 2,
      type: "performance",
      title: "Campaign Performance Update",
      message: "Back to School Essentials campaign CTR increased by 15% today",
      timestamp: "1 hour ago",
      isRead: false,
      priority: "medium",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      type: "system",
      title: "Scheduled Maintenance",
      message: "Platform maintenance scheduled for tonight 11 PM - 1 AM EST",
      timestamp: "3 hours ago",
      isRead: true,
      priority: "low",
      icon: Info,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 4,
      type: "campaign",
      title: "Campaign Approved",
      message: "Your Weekend Sale Promotion campaign has been approved and is now live",
      timestamp: "5 hours ago",
      isRead: true,
      priority: "medium",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 5,
      type: "budget",
      title: "Monthly Budget Reminder",
      message: "You have $1,200 remaining in your monthly advertising budget",
      timestamp: "1 day ago",
      isRead: true,
      priority: "low",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 6,
      type: "performance",
      title: "Low Performance Alert",
      message: "Denim Collection campaign CTR dropped below 2% threshold",
      timestamp: "2 days ago",
      isRead: false,
      priority: "high",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  const notificationSettings = [
    {
      category: "Budget Alerts",
      description: "Get notified about budget limits and spending",
      settings: [
        { name: "Daily budget alerts", enabled: true },
        { name: "Monthly budget warnings", enabled: true },
        { name: "Budget depletion alerts", enabled: true },
      ],
    },
    {
      category: "Campaign Performance",
      description: "Notifications about campaign metrics and performance",
      settings: [
        { name: "Performance improvements", enabled: true },
        { name: "Performance drops", enabled: true },
        { name: "Weekly performance summaries", enabled: false },
      ],
    },
    {
      category: "System Updates",
      description: "Platform updates and maintenance notifications",
      settings: [
        { name: "Maintenance notifications", enabled: true },
        { name: "Feature updates", enabled: false },
        { name: "Policy changes", enabled: true },
      ],
    },
    {
      category: "Campaign Status",
      description: "Updates about campaign approvals and status changes",
      settings: [
        { name: "Campaign approvals", enabled: true },
        { name: "Campaign rejections", enabled: true },
        { name: "Scheduled campaign starts", enabled: true },
      ],
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.isRead
    if (filter === "read") return notification.isRead
    return notification.type === filter
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
          </h1>
          <p className="text-gray-600">Stay updated with your campaign alerts and system notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="budget">Budget Alerts</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="campaign">Campaign Updates</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Notification Tabs */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Your latest alerts and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 ${
                      !notification.isRead ? "border-l-4 border-l-primary-500 bg-primary-50/30" : ""
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${notification.bgColor} flex-shrink-0`}>
                      <notification.icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getPriorityColor(notification.priority)} variant="outline">
                            {notification.priority}
                          </Badge>
                          {!notification.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full"></div>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <MarkAsUnread className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Customize when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {notificationSettings.map((category, index) => (
                  <div key={index} className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{category.category}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                      {category.settings.map((setting, settingIndex) => (
                        <div key={settingIndex} className="flex items-center justify-between">
                          <Label htmlFor={`${index}-${settingIndex}`} className="text-sm">
                            {setting.name}
                          </Label>
                          <Switch
                            id={`${index}-${settingIndex}`}
                            checked={setting.enabled}
                            className="data-[state=checked]:bg-primary-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-4">Delivery Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email notifications</Label>
                      <Switch id="email-notifications" defaultChecked className="data-[state=checked]:bg-primary-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push notifications</Label>
                      <Switch id="push-notifications" defaultChecked className="data-[state=checked]:bg-primary-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">SMS notifications (critical only)</Label>
                      <Switch id="sms-notifications" className="data-[state=checked]:bg-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
