"use client"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardRecentCampaigns } from "@/components/dashboard-recent-campaigns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useAnalytics } from "@/lib/analytics-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { getConversionMetrics } = useAnalytics()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const mockCampaigns = [
    {
      id: "campaign-1",
      title: "Sustainable Fashion Collection",
      fundedAmount: 15000,
      fundingGoal: 20000,
      backers: 145,
      status: "active",
    },
    {
      id: "campaign-2",
      title: "Eco-Friendly Accessories",
      fundedAmount: 8500,
      fundingGoal: 10000,
      backers: 89,
      status: "active",
    },
    {
      id: "campaign-3",
      title: "Vintage Inspired Dresses",
      fundedAmount: 22000,
      fundingGoal: 20000,
      backers: 234,
      status: "completed",
    },
  ]

  const conversionMetrics = getConversionMetrics()

  const dashboardStats = {
    totalCampaigns: mockCampaigns.length,
    totalEarnings: mockCampaigns.reduce((sum, c) => sum + c.fundedAmount, 0),
    conversionRate: conversionMetrics.avgConversionRate,
    totalBackers: mockCampaigns.reduce((sum, c) => sum + c.backers, 0),
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DashboardNav />

            <div className="lg:col-span-3 space-y-8">
              {/* Welcome Section */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Designer"}!</h1>
                <p className="text-neutral-600">Here's an overview of your campaign performance and activity.</p>
              </div>

              {/* Stats Cards */}
              <DashboardStats {...dashboardStats} />

              {/* Recent Campaigns */}
              <DashboardRecentCampaigns campaigns={mockCampaigns} />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/launch-campaign">
                      <Button className="w-full bg-transparent" variant="outline">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Launch New Campaign
                      </Button>
                    </Link>
                    <Link href="/dashboard/body-model">
                      <Button className="w-full bg-transparent" variant="outline">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Update Body Model
                      </Button>
                    </Link>
                    <Link href="/dashboard/account">
                      <Button className="w-full bg-transparent" variant="outline">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                    </Link>
                    <Link href="/dashboard/donations">
                      <Button className="w-full bg-transparent" variant="outline">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        View Donations
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                      <span className="text-sm font-medium">Average Conversion Rate</span>
                      <span className="text-lg font-bold">{conversionMetrics.avgConversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                      <span className="text-sm font-medium">Total Conversions</span>
                      <span className="text-lg font-bold">{conversionMetrics.totalConversions}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                      <span className="text-sm font-medium">Pledges Initiated</span>
                      <span className="text-lg font-bold">{conversionMetrics.totalInitiated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
