"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MobileTabs } from "@/components/mobile-tabs"

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const campaigns = [
    {
      id: 1,
      name: "Sustainable Linen Collection",
      status: "Active",
      funded: 45000,
      goal: 50000,
      backers: 320,
      daysLeft: 7,
      image: "/sustainable-linen-fashion-collection.jpg",
    },
    {
      id: 2,
      name: "Eco-Friendly Accessories",
      status: "Completed",
      funded: 75000,
      goal: 30000,
      backers: 450,
      daysLeft: 0,
      image: "/sustainable-fashion-eco-friendly.jpg",
    },
  ]

  const tabsList = [
    { id: "overview", label: "Overview" },
    { id: "campaigns", label: "My Campaigns" },
    { id: "backers", label: "Backers" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground">Manage your campaigns and track performance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Funded</div>
              <div className="text-3xl font-bold">$120K</div>
              <p className="text-xs text-green-600 mt-2">+15% this month</p>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Active Campaigns</div>
              <div className="text-3xl font-bold">1</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Backers</div>
              <div className="text-3xl font-bold">770</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Completion Rate</div>
              <div className="text-3xl font-bold">100%</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs - Desktop */}
      <div className="border-b hidden md:block">
        <div className="container">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "campaigns"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              My Campaigns
            </button>
            <button
              onClick={() => setActiveTab("backers")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "backers"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Backers
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-b">
        <div className="container px-4">
          <MobileTabs tabs={tabsList} activeTab={activeTab} onTabChange={setActiveTab}>
            <div />
          </MobileTabs>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Funding Trend
                </h3>
                <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
                  Chart placeholder
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Campaign Performance
                </h3>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="pb-4 border-b last:border-0">
                      <p className="font-semibold mb-2">{campaign.name}</p>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div
                          className="bg-foreground h-2 rounded-full"
                          style={{ width: `${(campaign.funded / campaign.goal) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ${campaign.funded.toLocaleString()} of ${campaign.goal.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Campaigns</h2>
              <Link href="/launch-campaign">
                <Button>Launch New Campaign</Button>
              </Link>
            </div>
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 bg-muted flex-shrink-0">
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{campaign.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            campaign.status === "Active" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Funded</p>
                          <p className="font-bold">${campaign.funded.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Backers</p>
                          <p className="font-bold">{campaign.backers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Days Left</p>
                          <p className="font-bold">{campaign.daysLeft}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/campaign/${campaign.id}`}>
                        <Button variant="outline">View Campaign</Button>
                      </Link>
                      <Button variant="outline">Edit</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "backers" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Campaign Backers</h2>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Backer Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Campaign</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Pledge Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Sarah Johnson",
                        campaign: "Sustainable Linen",
                        amount: 150,
                        date: "2025-01-10",
                        status: "Confirmed",
                      },
                      {
                        name: "Michael Chen",
                        campaign: "Sustainable Linen",
                        amount: 200,
                        date: "2025-01-09",
                        status: "Confirmed",
                      },
                      {
                        name: "Emma Davis",
                        campaign: "Eco-Friendly Accessories",
                        amount: 100,
                        date: "2025-01-08",
                        status: "Delivered",
                      },
                    ].map((backer, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="px-6 py-4">{backer.name}</td>
                        <td className="px-6 py-4">{backer.campaign}</td>
                        <td className="px-6 py-4 font-semibold">${backer.amount}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{backer.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              backer.status === "Confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {backer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
