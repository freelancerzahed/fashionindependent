"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  MousePointer,
  Plus,
  Users,
  ShoppingCart,
  Eye,
  Clock,
  Target,
  TrendingUp,
  Edit,
  Trash2,
  Play,
  Pause,
} from "lucide-react"

export default function RetargetingPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const retargetingCampaigns = [
    {
      id: 1,
      name: "Cart Abandoners - Summer Sale",
      status: "active",
      audienceSize: "12.5K",
      type: "Cart Abandonment",
      createdDate: "Aug 5, 2024",
      budget: "$850",
      spent: "$623",
      impressions: "89.2K",
      clicks: "3.2K",
      conversions: 156,
      ctr: "3.6%",
      conversionRate: "4.9%",
      roas: "3.8x",
    },
    {
      id: 2,
      name: "Website Visitors - Fashion Collection",
      status: "active",
      audienceSize: "28.7K",
      type: "Website Visitors",
      createdDate: "Aug 1, 2024",
      budget: "$1,200",
      spent: "$945",
      impressions: "156.8K",
      clicks: "5.8K",
      conversions: 289,
      ctr: "3.7%",
      conversionRate: "5.0%",
      roas: "4.2x",
    },
    {
      id: 3,
      name: "Product Viewers - Denim Collection",
      status: "paused",
      audienceSize: "8.9K",
      type: "Product Viewers",
      createdDate: "Jul 28, 2024",
      budget: "$600",
      spent: "$456",
      impressions: "67.3K",
      clicks: "2.1K",
      conversions: 98,
      ctr: "3.1%",
      conversionRate: "4.7%",
      roas: "3.2x",
    },
  ]

  const audienceSegments = [
    {
      name: "Cart Abandoners (Last 7 Days)",
      size: "12.5K",
      growth: "+8.2%",
      type: "Behavioral",
      lastUpdated: "2 hours ago",
    },
    {
      name: "Product Page Visitors",
      size: "28.7K",
      growth: "+12.5%",
      type: "Engagement",
      lastUpdated: "1 hour ago",
    },
    {
      name: "Past Purchasers (30 Days)",
      size: "15.3K",
      growth: "+5.1%",
      type: "Purchase",
      lastUpdated: "3 hours ago",
    },
    {
      name: "High-Value Customers",
      size: "4.2K",
      growth: "+3.8%",
      type: "Value-Based",
      lastUpdated: "4 hours ago",
    },
  ]

  const performanceMetrics = [
    {
      title: "Active Campaigns",
      value: "8",
      change: "+2",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Audience",
      value: "64.3K",
      change: "+12.5%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg. ROAS",
      value: "3.8x",
      change: "+0.4x",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Conversion Rate",
      value: "4.9%",
      change: "+0.7%",
      icon: MousePointer,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Cart Abandonment":
        return ShoppingCart
      case "Website Visitors":
        return Eye
      case "Product Viewers":
        return Target
      default:
        return Users
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retargeting Management</h1>
          <p className="text-gray-600">Re-engage your audience with targeted campaigns</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Retargeting Campaign</DialogTitle>
              <DialogDescription>Set up a new retargeting campaign to re-engage your audience</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input id="campaign-name" placeholder="Enter campaign name" />
                </div>
                <div>
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cart-abandonment">Cart Abandonment</SelectItem>
                      <SelectItem value="website-visitors">Website Visitors</SelectItem>
                      <SelectItem value="product-viewers">Product Viewers</SelectItem>
                      <SelectItem value="past-purchasers">Past Purchasers</SelectItem>
                      <SelectItem value="custom">Custom Audience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="audience-segment">Target Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cart-abandoners">Cart Abandoners (Last 7 Days) - 12.5K</SelectItem>
                    <SelectItem value="product-viewers">Product Page Visitors - 28.7K</SelectItem>
                    <SelectItem value="past-purchasers">Past Purchasers (30 Days) - 15.3K</SelectItem>
                    <SelectItem value="high-value">High-Value Customers - 4.2K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Daily Budget</Label>
                  <Input id="budget" placeholder="$0.00" type="number" />
                </div>
                <div>
                  <Label htmlFor="duration">Campaign Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Campaign Message</Label>
                <Textarea id="message" placeholder="Enter your retargeting message..." />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="frequency-cap" />
                  <Label htmlFor="frequency-cap">Enable frequency capping (max 3 ads per day)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-optimize" />
                  <Label htmlFor="auto-optimize">Enable automatic bid optimization</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="audiences">Audience Segments</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retargeting Campaigns</CardTitle>
              <CardDescription>Manage your active retargeting campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retargetingCampaigns.map((campaign) => {
                  const TypeIcon = getTypeIcon(campaign.type)
                  return (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-gray-50">
                            <TypeIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                              <Badge variant="outline">{campaign.type}</Badge>
                              <span className="text-xs text-gray-500">
                                <Users className="w-3 h-3 inline mr-1" />
                                {campaign.audienceSize}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Budget</p>
                            <p className="font-medium">{campaign.budget}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Spent</p>
                            <p className="font-medium">{campaign.spent}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CTR</p>
                            <p className="font-medium">{campaign.ctr}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Conversions</p>
                            <p className="font-medium">{campaign.conversions}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Conv. Rate</p>
                            <p className="font-medium">{campaign.conversionRate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">ROAS</p>
                            <p className="font-medium text-green-600">{campaign.roas}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audiences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Segments</CardTitle>
              <CardDescription>Manage your retargeting audience segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audienceSegments.map((segment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{segment.name}</h3>
                      <Badge variant="outline">{segment.type}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Audience Size</span>
                        <span className="font-medium">{segment.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Growth</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {segment.growth}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Updated</span>
                        <span className="text-sm text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {segment.lastUpdated}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Create Campaign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Comparison</CardTitle>
                <CardDescription>Compare ROAS across different campaign types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cart Abandonment</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="h-2 bg-primary-500 rounded-full" style={{ width: "76%" }}></div>
                      </div>
                      <span className="text-sm font-medium">3.8x</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Website Visitors</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: "84%" }}></div>
                      </div>
                      <span className="text-sm font-medium">4.2x</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Product Viewers</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: "64%" }}></div>
                      </div>
                      <span className="text-sm font-medium">3.2x</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Track user journey through retargeting funnel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ad Impressions</span>
                    <span className="font-medium">312.3K</span>
                  </div>
                  <Progress value={100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ad Clicks</span>
                    <span className="font-medium">11.1K (3.6%)</span>
                  </div>
                  <Progress value={36} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Landing Page Views</span>
                    <span className="font-medium">9.8K (88.3%)</span>
                  </div>
                  <Progress value={31} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversions</span>
                    <span className="font-medium">543 (5.5%)</span>
                  </div>
                  <Progress value={17} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
