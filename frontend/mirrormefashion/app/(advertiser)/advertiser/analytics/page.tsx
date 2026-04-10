"use client"

import type React from "react"

import { useState } from "react"
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MetricCard {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  trend: "up" | "down"
}

interface CampaignPerformance {
  name: string
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  spent: number
  conversions: number
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("impressions")
  const [isLoading, setIsLoading] = useState(false)

  const handleDateRangeChange = async (newRange: string) => {
    setIsLoading(true)
    setDateRange(newRange)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log("Data refreshed for range:", newRange)
    }, 1000)
  }

  const handleCustomDateRange = () => {
    console.log("Open custom date range picker")
    // In a real app: open date picker modal
  }

  const metrics: MetricCard[] = [
    {
      title: "Total Impressions",
      value: "2.4M",
      change: 12.5,
      icon: <Eye className="w-5 h-5" />,
      trend: "up",
    },
    {
      title: "Total Clicks",
      value: "48.2K",
      change: 8.3,
      icon: <MousePointer className="w-5 h-5" />,
      trend: "up",
    },
    {
      title: "Total Spent",
      value: "$12,450",
      change: -3.2,
      icon: <DollarSign className="w-5 h-5" />,
      trend: "down",
    },
    {
      title: "Conversions",
      value: "1,234",
      change: 15.7,
      icon: <Users className="w-5 h-5" />,
      trend: "up",
    },
  ]

  const campaignPerformance: CampaignPerformance[] = [
    {
      name: "Summer Fashion Collection 2024",
      impressions: 125000,
      clicks: 3200,
      ctr: 2.56,
      cpc: 0.73,
      spent: 2340,
      conversions: 156,
    },
    {
      name: "Back to School Promotion",
      impressions: 85000,
      clicks: 1800,
      ctr: 2.12,
      cpc: 0.67,
      spent: 1200,
      conversions: 89,
    },
    {
      name: "Weekend Flash Sale",
      impressions: 65000,
      clicks: 2100,
      ctr: 3.23,
      cpc: 0.85,
      spent: 1785,
      conversions: 134,
    },
  ]

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getChangeIcon = (trend: "up" | "down") => {
    return trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your campaign performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleCustomDateRange}>
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">{metric.icon}</div>
                </div>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(metric.change)}`}>
                  {getChangeIcon(metric.trend)}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Performance Overview</CardTitle>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impressions">Impressions</SelectItem>
                <SelectItem value="clicks">Clicks</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
                <SelectItem value="spent">Amount Spent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              ) : (
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-gray-600">
                {isLoading ? "Loading data..." : `Performance chart for ${selectedMetric}`}
              </p>
              {!isLoading && <p className="text-sm text-gray-500">Chart visualization would be implemented here</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Campaign</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Impressions</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Clicks</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">CTR</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">CPC</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Spent</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Conversions</th>
                </tr>
              </thead>
              <tbody>
                {campaignPerformance.map((campaign, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="py-4 px-2 text-right text-gray-900">{campaign.impressions.toLocaleString()}</td>
                    <td className="py-4 px-2 text-right text-gray-900">{campaign.clicks.toLocaleString()}</td>
                    <td className="py-4 px-2 text-right">
                      <Badge variant="outline" className="text-primary-600 border-primary-200">
                        {campaign.ctr}%
                      </Badge>
                    </td>
                    <td className="py-4 px-2 text-right text-gray-900">${campaign.cpc.toFixed(2)}</td>
                    <td className="py-4 px-2 text-right font-medium text-gray-900">
                      ${campaign.spent.toLocaleString()}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <Badge className="bg-green-100 text-green-800 border-green-200">{campaign.conversions}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Audiences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Young Adults (18-25)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Millennials (26-35)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                  <span className="text-sm font-medium">72%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gen X (36-50)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: "58%" }}></div>
                  </div>
                  <span className="text-sm font-medium">58%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ad Format Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Ad format breakdown</p>
                <p className="text-sm text-gray-500">Pie chart would be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
