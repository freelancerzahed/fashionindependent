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
import { Slider } from "@/components/ui/slider"
import { Zap, Plus, Pause, BarChart3, TrendingUp, Target, Trophy, AlertCircle, CheckCircle } from "lucide-react"

export default function TestingPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [trafficSplit, setTrafficSplit] = useState([50])

  const activeTests = [
    {
      id: 1,
      name: "Summer Dress Ad Creative",
      status: "running",
      type: "Creative",
      startDate: "Aug 10, 2024",
      duration: "14 days",
      progress: 65,
      variants: [
        {
          name: "Variant A (Control)",
          traffic: 50,
          impressions: "45.2K",
          clicks: "1.8K",
          ctr: "3.98%",
          conversions: 89,
          conversionRate: "4.94%",
          isWinning: false,
        },
        {
          name: "Variant B",
          traffic: 50,
          impressions: "44.8K",
          clicks: "2.1K",
          ctr: "4.69%",
          conversions: 112,
          conversionRate: "5.33%",
          isWinning: true,
        },
      ],
      confidence: 87,
      significance: "High",
    },
    {
      id: 2,
      name: "Headline Copy Test",
      status: "running",
      type: "Copy",
      startDate: "Aug 8, 2024",
      duration: "10 days",
      progress: 80,
      variants: [
        {
          name: "Variant A (Control)",
          traffic: 33,
          impressions: "28.5K",
          clicks: "1.2K",
          ctr: "4.21%",
          conversions: 67,
          conversionRate: "5.58%",
          isWinning: true,
        },
        {
          name: "Variant B",
          traffic: 33,
          impressions: "29.1K",
          clicks: "1.1K",
          ctr: "3.78%",
          conversions: 58,
          conversionRate: "5.27%",
          isWinning: false,
        },
        {
          name: "Variant C",
          traffic: 34,
          impressions: "30.2K",
          clicks: "1.0K",
          ctr: "3.31%",
          conversions: 52,
          conversionRate: "5.20%",
          isWinning: false,
        },
      ],
      confidence: 92,
      significance: "Very High",
    },
  ]

  const completedTests = [
    {
      id: 3,
      name: "CTA Button Color Test",
      status: "completed",
      type: "Design",
      winner: "Red Button (+23% CTR)",
      duration: "7 days",
      improvement: "+23%",
      metric: "CTR",
      completedDate: "Aug 5, 2024",
    },
    {
      id: 4,
      name: "Audience Targeting Test",
      status: "completed",
      type: "Audience",
      winner: "Lookalike Audience (+15% Conv.)",
      duration: "14 days",
      improvement: "+15%",
      metric: "Conversions",
      completedDate: "Aug 1, 2024",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case "Very High":
        return "text-green-600"
      case "High":
        return "text-blue-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">A/B Testing</h1>
          <p className="text-gray-600">Test and optimize your ad performance</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create A/B Test</DialogTitle>
              <DialogDescription>Set up a new test to optimize your campaign performance</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input id="test-name" placeholder="Enter test name" />
                </div>
                <div>
                  <Label htmlFor="test-type">Test Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="copy">Copy</SelectItem>
                      <SelectItem value="audience">Audience</SelectItem>
                      <SelectItem value="placement">Placement</SelectItem>
                      <SelectItem value="bidding">Bidding Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="campaign">Select Campaign</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose campaign to test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summer-fashion">Summer Fashion Collection</SelectItem>
                    <SelectItem value="back-to-school">Back to School Essentials</SelectItem>
                    <SelectItem value="weekend-sale">Weekend Sale Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Traffic Split</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Variant A (Control): {trafficSplit[0]}%</span>
                    <span className="text-sm">Variant B: {100 - trafficSplit[0]}%</span>
                  </div>
                  <Slider
                    value={trafficSplit}
                    onValueChange={setTrafficSplit}
                    max={80}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Test Duration (days)</Label>
                  <Input id="duration" type="number" placeholder="14" />
                </div>
                <div>
                  <Label htmlFor="sample-size">Minimum Sample Size</Label>
                  <Input id="sample-size" type="number" placeholder="1000" />
                </div>
              </div>

              <div>
                <Label htmlFor="hypothesis">Test Hypothesis</Label>
                <Textarea id="hypothesis" placeholder="Describe what you expect to test and why..." />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-winner" />
                <Label htmlFor="auto-winner">Automatically apply winning variant</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">Create Test</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-green-50">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">8</h3>
              <p className="text-sm text-gray-600 mt-1">Active Tests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-50">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8%
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
              <p className="text-sm text-gray-600 mt-1">Completed Tests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-50">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="default" className="text-xs bg-purple-100 text-purple-800">
                High
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">87%</h3>
              <p className="text-sm text-gray-600 mt-1">Avg. Confidence</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-primary-50">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <Badge variant="default" className="text-xs bg-primary-100 text-primary-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18%
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">+23%</h3>
              <p className="text-sm text-gray-600 mt-1">Best Improvement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Tests</TabsTrigger>
          <TabsTrigger value="completed">Completed Tests</TabsTrigger>
          <TabsTrigger value="insights">Test Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeTests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {test.name}
                      <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                      <Badge variant="outline">{test.type}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Started {test.startDate} • {test.duration} • {test.progress}% complete
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pause className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={test.progress} className="mt-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Statistical Significance:</span>
                      <Badge variant="outline" className={getSignificanceColor(test.significance)}>
                        {test.significance} ({test.confidence}%)
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {test.variants.map((variant, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${
                          variant.isWinning ? "border-green-200 bg-green-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{variant.name}</h4>
                            {variant.isWinning && (
                              <Badge className="bg-green-100 text-green-800">
                                <Trophy className="w-3 h-3 mr-1" />
                                Leading
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{variant.traffic}% traffic</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Impressions</p>
                            <p className="font-medium">{variant.impressions}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Clicks</p>
                            <p className="font-medium">{variant.clicks}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CTR</p>
                            <p className="font-medium">{variant.ctr}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Conversions</p>
                            <p className="font-medium">{variant.conversions}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Conv. Rate</p>
                            <p className="font-medium">{variant.conversionRate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tests</CardTitle>
              <CardDescription>Results from your finished A/B tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{test.name}</h3>
                        <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                        <Badge variant="outline">{test.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Duration: {test.duration}</span>
                        <span>Completed: {test.completedDate}</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Winner: {test.winner}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {test.improvement} {test.metric}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Performance Insights</CardTitle>
                <CardDescription>Key learnings from your A/B tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Red CTA buttons perform 23% better</p>
                      <p className="text-sm text-green-700">
                        Across 5 tests, red buttons consistently outperformed blue ones
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Lookalike audiences show 15% higher conversion</p>
                      <p className="text-sm text-blue-700">
                        Custom audiences based on existing customers perform better
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Video ads need longer test duration</p>
                      <p className="text-sm text-yellow-700">
                        Video creative tests require 14+ days for statistical significance
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggested tests based on your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Test Mobile vs Desktop Creative</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Your mobile CTR is 15% lower than desktop. Test mobile-optimized creatives.
                    </p>
                    <Button size="sm" variant="outline">
                      Create Test
                    </Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">A/B Test Seasonal Messaging</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Back-to-school season is approaching. Test seasonal vs evergreen copy.
                    </p>
                    <Button size="sm" variant="outline">
                      Create Test
                    </Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Test Bidding Strategies</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Compare manual bidding vs automated bidding for your top campaigns.
                    </p>
                    <Button size="sm" variant="outline">
                      Create Test
                    </Button>
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
