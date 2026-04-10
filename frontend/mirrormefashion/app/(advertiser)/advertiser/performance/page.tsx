"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Eye, MousePointer, DollarSign, Target, Download, RefreshCw } from "lucide-react"

export default function PerformancePage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const performanceMetrics = [
    {
      title: "Total Impressions",
      value: "2.4M",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Click-Through Rate",
      value: "3.2%",
      change: "+0.8%",
      trend: "up",
      icon: MousePointer,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Cost Per Click",
      value: "$0.45",
      change: "-$0.05",
      trend: "down",
      icon: DollarSign,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
    {
      title: "Conversion Rate",
      value: "2.8%",
      change: "+0.3%",
      trend: "up",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const campaignPerformance = [
    {
      name: "Summer Fashion Collection",
      status: "Active",
      impressions: "850K",
      clicks: "27.2K",
      ctr: "3.2%",
      spend: "$1,224",
      conversions: 156,
      roas: "4.2x",
    },
    {
      name: "Back to School Essentials",
      status: "Active",
      impressions: "620K",
      clicks: "18.6K",
      ctr: "3.0%",
      spend: "$892",
      conversions: 98,
      roas: "3.8x",
    },
    {
      name: "Weekend Sale Promotion",
      status: "Paused",
      impressions: "340K",
      clicks: "10.2K",
      ctr: "3.0%",
      spend: "$456",
      conversions: 45,
      roas: "2.9x",
    },
  ]

  const topPerformingAds = [
    {
      name: "Floral Summer Dress - Video Ad",
      impressions: "245K",
      ctr: "4.2%",
      conversions: 89,
      spend: "$340",
    },
    {
      name: "Casual Sneakers - Carousel",
      impressions: "198K",
      ctr: "3.8%",
      conversions: 67,
      spend: "$285",
    },
    {
      name: "Denim Jacket - Single Image",
      impressions: "156K",
      ctr: "3.5%",
      conversions: 52,
      spend: "$220",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600">Track and analyze your advertising performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <Badge variant={metric.trend === "up" ? "default" : "secondary"} className="text-xs">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
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

      {/* Performance Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="ads">Top Performing Ads</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Overview</CardTitle>
              <CardDescription>Detailed performance metrics for all active campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Impressions</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Clicks</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">CTR</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Spend</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Conversions</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignPerformance.map((campaign, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{campaign.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{campaign.impressions}</td>
                        <td className="py-3 px-4 text-gray-600">{campaign.clicks}</td>
                        <td className="py-3 px-4 text-gray-600">{campaign.ctr}</td>
                        <td className="py-3 px-4 text-gray-600">{campaign.spend}</td>
                        <td className="py-3 px-4 text-gray-600">{campaign.conversions}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            {campaign.roas}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Ads</CardTitle>
              <CardDescription>Your best performing ad creatives this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingAds.map((ad, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{ad.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{ad.impressions} impressions</span>
                        <span>{ad.ctr} CTR</span>
                        <span>{ad.conversions} conversions</span>
                        <span>{ad.spend} spend</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Key metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Click-Through Rate</span>
                      <span className="text-green-600">+12%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Conversion Rate</span>
                      <span className="text-green-600">+8%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Cost Efficiency</span>
                      <span className="text-green-600">+15%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Engagement</CardTitle>
                <CardDescription>How your audience interacts with ads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Video Views</span>
                    <span className="font-medium">89.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Engagement Rate</span>
                    <span className="font-medium">4.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Share Rate</span>
                    <span className="font-medium">1.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Save Rate</span>
                    <span className="font-medium">2.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
