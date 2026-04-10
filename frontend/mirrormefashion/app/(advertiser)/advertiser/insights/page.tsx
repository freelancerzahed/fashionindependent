"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Eye, Heart, Share2, TrendingUp, MapPin, Smartphone, Monitor, Tablet } from "lucide-react"

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedAudience, setSelectedAudience] = useState("all")

  const audienceOverview = [
    {
      title: "Total Reach",
      value: "2.8M",
      change: "+15.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Engagement Rate",
      value: "4.7%",
      change: "+0.8%",
      trend: "up",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Share Rate",
      value: "1.2%",
      change: "+0.3%",
      trend: "up",
      icon: Share2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "View Through Rate",
      value: "89.3%",
      change: "+2.1%",
      trend: "up",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const demographicData = [
    { ageGroup: "18-24", percentage: 28, color: "bg-blue-500" },
    { ageGroup: "25-34", percentage: 35, color: "bg-green-500" },
    { ageGroup: "35-44", percentage: 22, color: "bg-yellow-500" },
    { ageGroup: "45-54", percentage: 12, color: "bg-purple-500" },
    { ageGroup: "55+", percentage: 3, color: "bg-red-500" },
  ]

  const genderData = [
    { gender: "Female", percentage: 68, color: "bg-pink-500" },
    { gender: "Male", percentage: 30, color: "bg-blue-500" },
    { gender: "Other", percentage: 2, color: "bg-gray-500" },
  ]

  const topLocations = [
    { city: "New York", country: "USA", percentage: 18.5, users: "518K" },
    { city: "Los Angeles", country: "USA", percentage: 14.2, users: "398K" },
    { city: "London", country: "UK", percentage: 12.8, users: "358K" },
    { city: "Toronto", country: "Canada", percentage: 9.3, users: "260K" },
    { city: "Sydney", country: "Australia", percentage: 7.1, users: "199K" },
  ]

  const deviceData = [
    { device: "Mobile", percentage: 72, icon: Smartphone, color: "text-blue-600" },
    { device: "Desktop", percentage: 23, icon: Monitor, color: "text-green-600" },
    { device: "Tablet", percentage: 5, icon: Tablet, color: "text-purple-600" },
  ]

  const interests = [
    { category: "Fashion & Style", percentage: 89, engagement: "High" },
    { category: "Beauty & Cosmetics", percentage: 76, engagement: "High" },
    { category: "Lifestyle", percentage: 68, engagement: "Medium" },
    { category: "Travel", percentage: 54, engagement: "Medium" },
    { category: "Food & Dining", percentage: 47, engagement: "Medium" },
    { category: "Fitness & Health", percentage: 42, engagement: "Low" },
    { category: "Technology", percentage: 38, engagement: "Low" },
    { category: "Entertainment", percentage: 35, engagement: "Low" },
  ]

  const behaviorInsights = [
    {
      title: "Peak Activity Hours",
      description: "Your audience is most active between 7-9 PM",
      metric: "7-9 PM",
      trend: "+23% engagement",
    },
    {
      title: "Shopping Behavior",
      description: "Average time from ad view to purchase",
      metric: "2.3 days",
      trend: "-0.5 days",
    },
    {
      title: "Content Preference",
      description: "Video content performs 40% better than images",
      metric: "Video",
      trend: "+40% engagement",
    },
    {
      title: "Purchase Intent",
      description: "Users showing high purchase intent signals",
      metric: "34%",
      trend: "+8% this month",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audience Insights</h1>
          <p className="text-gray-600">Understand your audience demographics and behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedAudience} onValueChange={setSelectedAudience}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Audiences</SelectItem>
              <SelectItem value="lookalike">Lookalike Audience</SelectItem>
              <SelectItem value="custom">Custom Audience</SelectItem>
              <SelectItem value="interest">Interest-based</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {audienceOverview.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Tabs */}
      <Tabs defaultValue="demographics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="devices">Devices & Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Audience breakdown by age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demographicData.map((item) => (
                    <div key={item.ageGroup} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm font-medium w-12">{item.ageGroup}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium ml-3">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Audience breakdown by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {genderData.map((item) => (
                    <div key={item.gender} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm font-medium w-12">{item.gender}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium ml-3">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {behaviorInsights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary-600">{insight.metric}</div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {insight.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>When your audience is most active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-2 mb-4">
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i
                  const activity = Math.random() * 100
                  const isPeak = hour >= 19 && hour <= 21
                  return (
                    <div key={i} className="text-center">
                      <div
                        className={`h-16 rounded-t ${isPeak ? "bg-primary-500" : "bg-gray-300"} mb-1 flex items-end`}
                        style={{ height: `${Math.max(activity, 20)}px` }}
                      ></div>
                      <span className="text-xs text-gray-600">{hour}h</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded"></div>
                  <span>Peak Hours (7-9 PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Regular Activity</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interest Categories</CardTitle>
              <CardDescription>What your audience is interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interests.map((interest, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{interest.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              interest.engagement === "High"
                                ? "text-green-600 border-green-200"
                                : interest.engagement === "Medium"
                                  ? "text-yellow-600 border-yellow-200"
                                  : "text-gray-600 border-gray-200"
                            }
                          >
                            {interest.engagement} Engagement
                          </Badge>
                          <span className="text-sm font-medium">{interest.percentage}%</span>
                        </div>
                      </div>
                      <Progress value={interest.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>How your audience accesses your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-50">
                          <device.icon className={`w-5 h-5 ${device.color}`} />
                        </div>
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-primary-500 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Where your audience is located</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-50">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{location.city}</p>
                          <p className="text-xs text-gray-600">{location.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{location.percentage}%</p>
                        <p className="text-xs text-gray-600">{location.users}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
