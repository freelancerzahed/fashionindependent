"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useAnalytics } from "@/lib/analytics-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardRecentCampaigns } from "@/components/dashboard-recent-campaigns"
import { ArrowRight, Heart, DollarSign, Clock } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { getConversionMetrics } = useAnalytics()

  // Creator specific data
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
  ]

  // Backer specific data
  const activePledges = [
    {
      id: 1,
      productName: "Sustainable Linen Collection",
      creatorName: "Emma Studios",
      pledgeAmount: 150,
      daysRemaining: 7,
      status: "Active",
      image: "/sustainable-linen-fashion-collection.jpg",
    },
    {
      id: 2,
      productName: "Minimalist Mens Fashion",
      creatorName: "Marcus Design",
      pledgeAmount: 200,
      daysRemaining: 14,
      status: "Active",
      image: "/minimalist-mens-fashion-clothing.jpg",
    },
  ]

  const conversionMetrics = getConversionMetrics()
  const dashboardStats = {
    totalCampaigns: mockCampaigns.length,
    totalEarnings: mockCampaigns.reduce((sum, c) => sum + c.fundedAmount, 0),
    conversionRate: conversionMetrics.avgConversionRate,
    totalBackers: mockCampaigns.reduce((sum, c) => sum + c.backers, 0),
  }

  // CREATOR VIEW
  if (user?.role === "creator") {
    return (
      <div className="space-y-8">
        <DashboardStats {...dashboardStats} />
        <DashboardRecentCampaigns campaigns={mockCampaigns} />
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/launch-campaign">
                <Button className="w-full" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Launch New Campaign
                </Button>
              </Link>
              <Link href="/dashboard/body-model">
                <Button className="w-full" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Update Body Model
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // BACKER VIEW
  if (user?.role === "backer") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b">
          <div className="container py-8">
            <h1 className="text-4xl font-bold mb-2">Backers Dashboard</h1>
            <p className="text-muted-foreground">Manage your pledges and track your orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b">
          <div className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Pledged</div>
                <div className="text-3xl font-bold">$450</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Active Pledges</div>
                <div className="text-3xl font-bold">2</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Completed Orders</div>
                <div className="text-3xl font-bold">1</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Saved Campaigns</div>
                <div className="text-3xl font-bold">5</div>
              </Card>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="space-y-6">
            {activePledges.map((pledge) => (
              <Card key={pledge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 bg-muted flex-shrink-0">
                    <img
                      src={pledge.image || "/placeholder.svg"}
                      alt={pledge.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{pledge.productName}</h3>
                      <p className="text-muted-foreground mb-4">by {pledge.creatorName}</p>
                      <div className="flex gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${pledge.pledgeAmount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{pledge.daysRemaining} days remaining</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/campaign/${pledge.id}`}>
                        <Button variant="outline">View Campaign</Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
