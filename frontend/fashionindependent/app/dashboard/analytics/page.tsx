"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, BarChart3, Users, TrendingUp, AlertCircle, Loader2, Search, Download, RefreshCw } from "lucide-react"
import { BACKEND_URL } from "@/config"

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
  totalCampaigns: number
  totalEarnings: number
  totalBackers: number
  conversionRate: number
  activeCampaigns: number
  activeSales: number
  activeShowcases: number
  recentlyClosed: number
  totalDonations: number
  outboundBounces: number
  averageOrderValue: number
  sizingBreakdown: Record<string, number>
  questionResponses: Array<{ question: string; responses: Array<{ answer: string; count: number }> }>
  upvotes: number
  returns: number
  returnRate: number
  demographics: {
    ageGroups: Record<string, number>
    genders: Record<string, number>
    locations: Record<string, number>
    education: Record<string, number>
    incomeRanges: Record<string, number>
  }
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
  const [customersPage, setCustomersPage] = useState(1)
  const itemsPerPage = 10

  const fetchAnalyticsData = useCallback(async () => {
    if (!token || user?.role !== "creator") {
      setLoading(false)
      return
    }

    setLoading(true)
    setError("")

    try {
      const analyticsRes = await fetch(`${BACKEND_URL}/analytics/creator`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      let errorData: any = null
      try {
        errorData = await analyticsRes.json()
      } catch {
        // Ignore parse errors
      }

      if (!analyticsRes.ok) {
        const errorMsg = errorData?.message || errorData?.error || `API Error (${analyticsRes.status})`
        throw new Error(errorMsg)
      }

      if (errorData?.status && errorData?.analytics) {
        setAnalytics(errorData.analytics)
      } else {
        throw new Error(errorData?.message || "Invalid analytics response")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load analytics"
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

  // Memoized filtered customers
  const filteredCustomers = useMemo(() => {
    if (!analytics?.customers) return []
    return analytics.customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [analytics?.customers, searchQuery])

  // Memoized paginated customers
  const paginatedCustomers = useMemo(() => {
    const startIdx = (customersPage - 1) * itemsPerPage
    return filteredCustomers.slice(startIdx, startIdx + itemsPerPage)
  }, [filteredCustomers, customersPage])

  const totalCustomersPages = Math.ceil(filteredCustomers.length / itemsPerPage)

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
              <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Analytics</h2>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <Button onClick={() => fetchAnalyticsData()} className="gap-2" size="sm">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "customers", label: `Customers (${analytics.uniqueCustomers})` },
    { id: "questions", label: "Questions" },
    { id: "demographics", label: "Demographics" },
    { id: "feedback", label: `Feedback (${analytics.feedbackComments})` },
  ]

  return (
    <div className="space-y-8">
      <Link href="/dashboard">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

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

      {/* LAZY RENDER: Only render active tab */}
      {activeTab === "overview" && <OverviewTab analytics={analytics} />}
      {activeTab === "customers" && (
        <CustomersTab
          paginatedCustomers={paginatedCustomers}
          totalCustomersPages={totalCustomersPages}
          customersPage={customersPage}
          setCustomersPage={setCustomersPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCount={filteredCustomers.length}
        />
      )}
      {activeTab === "questions" && <QuestionsTab questionResponses={analytics.questionResponses} />}
      {activeTab === "demographics" && <DemographicsTab analytics={analytics} />}
      {activeTab === "feedback" && <FeedbackTab feedbackList={analytics.feedbackList} />}
    </div>
  )
}

// Optimized tab components with memoization
function OverviewTab({ analytics }: { analytics: AnalyticsData }) {
  const overviewStats = useMemo(
    () => [
      { label: "Total Campaigns", value: analytics.totalCampaigns },
      { label: "Total Earnings", value: `$${analytics.totalEarnings.toLocaleString()}` },
      { label: "Total Backers", value: analytics.totalBackers.toLocaleString() },
      { label: "Conversion Rate", value: `${analytics.conversionRate}%` },
    ],
    [analytics]
  )

  const performanceStats = useMemo(
    () => [
      { label: "Active Campaigns", value: analytics.activeCampaigns },
      { label: "Active Sales", value: `$${analytics.activeSales.toLocaleString()}` },
      { label: "Featured Showcases", value: analytics.activeShowcases },
      { label: "Recently Closed", value: analytics.recentlyClosed },
    ],
    [analytics]
  )

  const customerMetrics = useMemo(
    () => [
      { label: "Unique Customers", value: analytics.uniqueCustomers.toLocaleString() },
      { label: "Repeat Customers", value: analytics.repeatCustomers.toLocaleString() },
      { label: "Average Order Value", value: `$${analytics.averageOrderValue}` },
    ],
    [analytics]
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-3xl font-bold mt-2">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Campaign Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {performanceStats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-3xl font-bold mt-2">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Customer Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {customerMetrics.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-3xl font-bold mt-2">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
  )
}

function CustomersTab({
  paginatedCustomers,
  totalCustomersPages,
  customersPage,
  setCustomersPage,
  searchQuery,
  setSearchQuery,
  filteredCount,
}: {
  paginatedCustomers: Customer[]
  totalCustomersPages: number
  customersPage: number
  setCustomersPage: (page: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredCount: number
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search customers..."
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

      {filteredCount === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-neutral-600">No customers found</p>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedCustomers.map((customer) => (
              <Card key={customer.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{customer.name}</p>
                      <p className="text-xs text-neutral-500">{customer.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Total Spent</p>
                    <p className="font-bold">${customer.totalSpent.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Campaigns</p>
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

          {totalCustomersPages > 1 && (
            <div className="flex items-center justify-between py-4 border-t">
              <Button variant="outline" onClick={() => setCustomersPage(Math.max(1, customersPage - 1))} disabled={customersPage === 1}>
                Previous
              </Button>
              <span className="text-sm text-neutral-600">
                Page {customersPage} of {totalCustomersPages}
              </span>
              <Button variant="outline" onClick={() => setCustomersPage(Math.min(totalCustomersPages, customersPage + 1))} disabled={customersPage === totalCustomersPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function QuestionsTab({
  questionResponses,
}: {
  questionResponses: Array<{ question: string; responses: Array<{ answer: string; count: number }> }>
}) {
  return (
    <div className="space-y-4">
      {questionResponses.length > 0 ? (
        questionResponses.map((qr, idx) => (
          <QuestionCard key={idx} question={qr.question} responses={qr.responses} />
        ))
      ) : (
        <Card className="p-12 text-center">
          <p className="text-neutral-600">No questions data</p>
        </Card>
      )}
    </div>
  )
}

function QuestionCard({ question, responses }: { question: string; responses: Array<{ answer: string; count: number }> }) {
  const sortedResponses = useMemo(() => {
    return responses.sort((a, b) => b.count - a.count)
  }, [responses])

  const total = useMemo(() => responses.reduce((sum, r) => sum + r.count, 0), [responses])

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">{question}</h3>
      <div className="space-y-3">
        {sortedResponses.map((response, idx) => {
          const percentage = ((response.count / total) * 100).toFixed(1)
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">{response.answer}</p>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
              </div>
              <div className="ml-4 text-right">
                <span className="font-bold">{response.count}</span>
                <p className="text-xs text-neutral-600">{percentage}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function DemographicsTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="space-y-6">
      {Object.keys(analytics.demographics.ageGroups).length > 0 && (
        <DemographicCard
          title="Age Distribution"
          data={analytics.demographics.ageGroups}
          color="green-500"
        />
      )}
      {Object.keys(analytics.demographics.genders).length > 0 && (
        <DemographicCard
          title="Gender Distribution"
          data={analytics.demographics.genders}
          color="pink-500"
        />
      )}
    </div>
  )
}

function DemographicCard({
  title,
  data,
  color,
}: {
  title: string
  data: Record<string, number>
  color: string
}) {
  const sortedData = useMemo(() => {
    return Object.entries(data).sort(([, a], [, b]) => Number(b) - Number(a))
  }, [data])

  const total = useMemo(() => Object.values(data).reduce((a, b) => a + b, 0), [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedData.map(([category, count]) => {
            const percentage = ((count / total) * 100).toFixed(1)
            return (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium">{category}</span>
                <div className="flex-1 mx-3 bg-neutral-200 rounded-full h-2">
                  <div className={`bg-${color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function FeedbackTab({ feedbackList }: { feedbackList: Array<{ customerId: string; customerName: string; comment: string; date: string; campaign: string }> }) {
  const displayFeedback = useMemo(() => feedbackList.slice(0, 20), [feedbackList])

  return (
    <div className="space-y-4">
      {displayFeedback.length > 0 ? (
        displayFeedback.map((feedback, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{feedback.customerName}</p>
                <p className="text-xs text-neutral-500">{feedback.campaign}</p>
              </div>
              <p className="text-xs text-neutral-500">{new Date(feedback.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-neutral-700">{feedback.comment}</p>
          </Card>
        ))
      ) : (
        <Card className="p-12 text-center">
          <p className="text-neutral-600">No feedback available</p>
        </Card>
      )}
    </div>
  )
}
