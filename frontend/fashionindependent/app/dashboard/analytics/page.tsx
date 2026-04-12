"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AnalyticsDiagnostics } from "@/components/analytics-diagnostics"
import { ArrowLeft, BarChart3, Users, TrendingUp, MessageCircle, AlertCircle, Loader2, Search, Filter, Download, RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"

interface Customer {
  id: string
  name: string
  email: string
  totalSpent: number
  campaignsBacked: number
  joinDate: string
  isEarlyAdopter: boolean
}

interface AnalyticsData {
  // Overview metrics
  totalCampaigns: number
  totalEarnings: number
  totalBackers: number
  conversionRate: number
  
  // Campaign performance
  activeCampaigns: number
  activeSales: number
  activeShowcases: number
  recentlyClosed: number
  
  // Backer metrics
  totalDonations: number
  outboundBounces: number
  averageOrderValue: number
  
  // Product analytics
  sizingBreakdown: Record<string, number>
  questionResponses: Array<{ question: string; responses: Array<{ answer: string; count: number }> }>
  upvotes: number
  returns: number
  returnRate: number
  
  // Demographics
  demographics: {
    ageGroups: Record<string, number>
    genders: Record<string, number>
    locations: Record<string, number>
    education: Record<string, number>
    incomeRanges: Record<string, number>
  }
  
  // Customer insights
  uniqueCustomers: number
  repeatCustomers: number
  earlyAdopters: number
  feedbackComments: number
  customers: Customer[]
  feedbackList: Array<{ customerId: string; customerName: string; comment: string; date: string; campaign: string }>
}

export default function AnalyticsDashboardPage() {
  const { user, token } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalyticsData = useCallback(async () => {
    if (!token || user?.role !== "creator") {
      setLoading(false)
      return
    }

    setLoading(true)
    setError("")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        const msg = "API URL not configured. Check NEXT_PUBLIC_API_URL in .env"
        setError(msg)
        console.error(msg)
        setLoading(false)
        return
      }

      console.log("Fetching analytics from:", `${apiUrl}/analytics/creator`)
      console.log("Token present:", !!token)
      console.log("User role:", user?.role)

      // Call the unified analytics endpoint
      const analyticsRes = await fetch(`${apiUrl}/analytics/creator`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      console.log("Response status:", analyticsRes.status)
      console.log("Response headers:", analyticsRes.headers)

      let errorData: any = null
      let responseText = ""

      try {
        responseText = await analyticsRes.clone().text()
        console.log("Response body:", responseText)
        errorData = JSON.parse(responseText)
      } catch (parseErr) {
        console.warn("Could not parse response as JSON:", parseErr)
      }

      if (!analyticsRes.ok) {
        const errorMsg =
          errorData?.message ||
          errorData?.error ||
          `API Error (${analyticsRes.status}): ${analyticsRes.statusText}`
        throw new Error(errorMsg)
      }

      const analyticsData = errorData || (await analyticsRes.json())

      if (analyticsData.status && analyticsData.analytics) {
        setAnalytics(analyticsData.analytics)
        setLastUpdated(new Date())
        console.log("✓ Analytics data loaded successfully:", {
          totalCampaigns: analyticsData.analytics.totalCampaigns,
          uniqueCustomers: analyticsData.analytics.uniqueCustomers,
        })
      } else {
        throw new Error(
          analyticsData.message ||
            "Invalid analytics response - missing status or data"
        )
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load analytics"
      console.error("❌ Analytics error:", errorMessage)
      console.error("Error details:", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [token, user?.role])

  useEffect(() => {
    if (token && user?.role === "creator") {
      fetchAnalyticsData()
    }
  }, [token, user?.role, fetchAnalyticsData])

  if (user?.role !== "creator") {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-600">Only creators can access analytics.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
        <span className="ml-2 text-neutral-600">Loading analytics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Analytics
              </h2>
              <p className="text-sm text-red-800 mb-4">
                We encountered an error while loading your analytics data:
              </p>
              <div className="bg-red-100 border border-red-300 rounded p-3 mb-4">
                <p className="text-sm font-mono text-red-700 break-all">{error}</p>
              </div>
              <div className="space-y-2 text-xs text-red-700 mb-4">
                <p>
                  <strong>What to try:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your internet connection</li>
                  <li>Verify you are logged in as a creator</li>
                  <li>
                    Open browser DevTools (F12) → Console tab to see detailed logs
                  </li>
                  <li>Try refreshing the page</li>
                  <li>
                    Check that the API server is running on{" "}
                    <code>{process.env.NEXT_PUBLIC_API_URL}</code>
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => fetchAnalyticsData()}
                className="gap-2"
                size="sm"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <strong>Debug Info:</strong> API URL:
            <code className="ml-1 bg-blue-100 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_API_URL || "Not configured"}
            </code>
          </p>
        </div>

        <AnalyticsDiagnostics />
      </div>
    )
  }

  if (!analytics) return null

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "customers", label: `Customers (${analytics.uniqueCustomers})` },
    { id: "sizing", label: "Sizing Breakdown" },
    { id: "questions", label: "Campaign Questions" },
    { id: "demographics", label: "Demographics" },
    { id: "feedback", label: `Feedback (${analytics.feedbackComments})` },
  ]

  // Filter customers based on search
  const filteredCustomers = analytics.customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/dashboard">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Campaign Analytics</h1>
        <p className="text-lg text-neutral-600">Comprehensive insights into your campaigns and customer behavior</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Overview Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total Campaigns</div>
                  <div className="text-3xl font-bold mt-2">{analytics.totalCampaigns}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                  <div className="text-3xl font-bold mt-2">${analytics.totalEarnings.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total Backers</div>
                  <div className="text-3xl font-bold mt-2">{analytics.totalBackers.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  <div className="text-3xl font-bold mt-2">{analytics.conversionRate}%</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Campaign Performance */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Campaign Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Active Campaigns</div>
                  <div className="text-3xl font-bold mt-2">{analytics.activeCampaigns}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Active Sales</div>
                  <div className="text-3xl font-bold mt-2">${analytics.activeSales.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Featured Showcases</div>
                  <div className="text-3xl font-bold mt-2">{analytics.activeShowcases}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Recently Closed</div>
                  <div className="text-3xl font-bold mt-2">{analytics.recentlyClosed}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Customer Metrics */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Customer Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Unique Customers</div>
                  <div className="text-3xl font-bold mt-2">{analytics.uniqueCustomers.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Repeat Customers</div>
                  <div className="text-3xl font-bold mt-2">{analytics.repeatCustomers.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Average Order Value</div>
                  <div className="text-3xl font-bold mt-2">${analytics.averageOrderValue}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Analytics */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Product Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total Donations</div>
                  <div className="text-3xl font-bold mt-2">{analytics.totalDonations.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Upvotes</div>
                  <div className="text-3xl font-bold mt-2">{analytics.upvotes.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Returns</div>
                  <div className="text-3xl font-bold mt-2">{analytics.returns.toLocaleString()}</div>
                  <p className="text-xs text-neutral-500 mt-2">Return Rate: {analytics.returnRate}%</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === "customers" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search customers by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {filteredCustomers.length > 0 ? (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-xs text-neutral-500">{customer.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 mb-1">Total Spent</p>
                      <p className="font-bold">${customer.totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 mb-1">Campaigns Backed</p>
                      <p className="font-bold">{customer.campaignsBacked}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 mb-1">Member Since</p>
                      <p className="text-sm">{new Date(customer.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-end">
                      {customer.isEarlyAdopter && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          Early Adopter ⭐
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-2 border-dashed border-neutral-300">
              <Users className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <p className="text-neutral-600 mb-2">No customers found</p>
              <p className="text-sm text-neutral-500">Try adjusting your search</p>
            </Card>
          )}
        </div>
      )}

      {/* SIZING BREAKDOWN TAB */}
      {activeTab === "sizing" && (
        <div className="space-y-4">
          {Object.keys(analytics.sizingBreakdown).length > 0 ? (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Size Distribution Across All Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {Object.entries(analytics.sizingBreakdown)
                      .sort(([, a], [, b]) => Number(b) - Number(a))
                      .map(([size, count]) => {
                        const total = Object.values(analytics.sizingBreakdown).reduce((a, b) => a + b, 0)
                        const percentage = ((count / total) * 100).toFixed(1)
                        return (
                          <div key={size} className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <div className="text-sm font-semibold text-neutral-700 mb-2">{size}</div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">{count}</div>
                            <div className="text-xs text-neutral-600">{percentage}% of total</div>
                            <div className="w-full bg-neutral-200 rounded-full h-2 mt-3">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center border-2 border-dashed border-neutral-300">
              <p className="text-neutral-600">No sizing data available</p>
            </Card>
          )}
        </div>
      )}

      {/* CAMPAIGN QUESTIONS TAB */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          {analytics.questionResponses.length > 0 ? (
            <div className="space-y-4">
              {analytics.questionResponses.map((qr, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="font-bold text-lg mb-4">{qr.question}</h3>
                  <div className="space-y-3">
                    {qr.responses
                      .sort((a, b) => b.count - a.count)
                      .map((response, ridx) => {
                        const total = qr.responses.reduce((sum, r) => sum + r.count, 0)
                        const percentage = ((response.count / total) * 100).toFixed(1)
                        return (
                          <div key={ridx} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">{response.answer}</p>
                              <div className="w-full bg-neutral-200 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <span className="font-bold text-lg">{response.count}</span>
                              <p className="text-xs text-neutral-600">{percentage}%</p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-2 border-dashed border-neutral-300">
              <p className="text-neutral-600">No campaign questions data available</p>
            </Card>
          )}
        </div>
      )}

      {/* DEMOGRAPHICS TAB */}
      {activeTab === "demographics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Groups */}
            {Object.keys(analytics?.demographics?.ageGroups ?? {}).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics?.demographics?.ageGroups ?? {})
                      .sort(([, a], [, b]) => Number(b) - Number(a))
                      .map(([age, count]) => {
                        const total = Object.values(analytics?.demographics?.ageGroups ?? {}).reduce((a, b) => a + b, 0)
                        const percentage = ((count / total) * 100).toFixed(1)
                        return (
                          <div key={age} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{age}</span>
                            <div className="flex-1 mx-3 bg-neutral-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-right whitespace-nowrap">{count} ({percentage}%)</span>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gender */}
            {Object.keys(analytics?.demographics?.genders ?? {}).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics?.demographics?.genders ?? {}).map(([gender, count]) => {
                      const total = Object.values(analytics?.demographics?.genders ?? {}).reduce((a, b) => a + b, 0)
                      const percentage = ((count / total) * 100).toFixed(1)
                      return (
                        <div key={gender} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{gender}</span>
                          <div className="flex-1 mx-3 bg-neutral-200 rounded-full h-2">
                            <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-right whitespace-nowrap">{count} ({percentage}%)</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {Object.keys(analytics?.demographics?.locations ?? {}).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.demographics.locations)
                      .sort(([, a], [, b]) => Number(b) - Number(a))
                      .slice(0, 8)
                      .map(([location, count]) => {
                        const total = Object.values(analytics.demographics.locations).reduce((a, b) => a + b, 0)
                        const percentage = ((count / total) * 100).toFixed(1)
                        return (
                          <div key={location} className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate">{location}</span>
                            <div className="flex-1 mx-3 bg-neutral-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-right whitespace-nowrap">{count}</span>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {Object.keys(analytics?.demographics?.education ?? {}).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Education Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics?.demographics?.education ?? {}).map(([edu, count]) => {
                      const total = Object.values(analytics?.demographics?.education ?? {}).reduce((a, b) => a + b, 0)
                      const percentage = ((count / total) * 100).toFixed(1)
                      return (
                        <div key={edu} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{edu}</span>
                          <div className="flex-1 mx-3 bg-neutral-200 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-right whitespace-nowrap">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Income Ranges */}
            {Object.keys(analytics?.demographics?.incomeRanges ?? {}).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Income Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics?.demographics?.incomeRanges ?? {})
                      .sort(([, a], [, b]) => Number(b) - Number(a))
                      .map(([income, count]) => {
                        const total = Object.values(analytics?.demographics?.incomeRanges ?? {}).reduce((a, b) => a + b, 0)
                        const percentage = ((count / total) * 100).toFixed(1)
                        return (
                          <div key={income} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{income}</span>
                            <div className="flex-1 mx-3 bg-neutral-200 rounded-full h-2">
                              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-right whitespace-nowrap">{count}</span>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Early Adopters Insight */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Early Adopters' Behavior 🚀</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-2">Total Early Adopters</p>
                  <p className="text-3xl font-bold text-orange-600">{analytics.earlyAdopters}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-2">Percentage of Backers</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {analytics.totalBackers > 0 ? ((analytics.earlyAdopters / analytics.totalBackers) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-2">Avg. Adoption Value</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${analytics.earlyAdopters > 0 ? (analytics.totalEarnings / analytics.earlyAdopters).toFixed(2) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FEEDBACK TAB */}
      {activeTab === "feedback" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Customer Feedback & Comments</h2>
            <div className="text-sm text-neutral-600">Total: {analytics.feedbackList.length} comments</div>
          </div>

          {analytics.feedbackList.length > 0 ? (
            <div className="space-y-3">
              {analytics.feedbackList.map((feedback, idx) => (
                <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {feedback.customerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="font-semibold">{feedback.customerName}</p>
                        <span className="text-xs text-neutral-500 whitespace-nowrap">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mb-2">Campaign: <span className="font-medium">{feedback.campaign}</span></p>
                      <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded border border-neutral-200">
                        {feedback.comment}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-2 border-dashed border-neutral-300">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <p className="text-neutral-600 mb-2">No feedback comments yet</p>
              <p className="text-sm text-neutral-500">Comments from customers will appear here</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
