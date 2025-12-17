"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { mockCampaigns, mockPledges, mockAffiliates } from "@/lib/data"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (user?.role !== "admin") {
    return null
  }

  // Calculate metrics
  const totalCampaigns = mockCampaigns.length
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active").length
  const totalPledges = mockPledges.length
  const totalFunded = mockCampaigns.reduce((sum, c) => sum + c.fundedAmount, 0)
  const totalGoal = mockCampaigns.reduce((sum, c) => sum + c.fundingGoal, 0)
  const totalBackers = mockCampaigns.reduce((sum, c) => sum + c.backers, 0)
  const totalAffiliates = mockAffiliates.length
  const affiliateEarnings = mockAffiliates.reduce((sum, a) => sum + a.totalEarnings, 0)

  // Campaign status breakdown
  const campaignStatusData = [
    { name: "Active", value: mockCampaigns.filter((c) => c.status === "active").length },
    { name: "Funded", value: mockCampaigns.filter((c) => c.status === "funded").length },
    { name: "Closing Soon", value: mockCampaigns.filter((c) => c.status === "closing-soon").length },
    { name: "Ended", value: mockCampaigns.filter((c) => c.status === "ended").length },
  ]

  // Revenue by category
  const revenueByCategory = mockCampaigns.reduce(
    (acc, campaign) => {
      const existing = acc.find((item) => item.name === campaign.category)
      if (existing) {
        existing.value += campaign.fundedAmount
      } else {
        acc.push({ name: campaign.category, value: campaign.fundedAmount })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  // Funding progress
  const fundingProgressData = mockCampaigns.map((c) => ({
    name: c.title.substring(0, 15),
    funded: c.fundedAmount,
    goal: c.fundingGoal,
  }))

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Campaigns</p>
              <p className="text-3xl font-bold">{totalCampaigns}</p>
              <p className="text-xs text-green-600 mt-2">{activeCampaigns} active</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Funded</p>
              <p className="text-3xl font-bold">${totalFunded.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">of ${totalGoal.toLocaleString()} goal</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Backers</p>
              <p className="text-3xl font-bold">{totalBackers}</p>
              <p className="text-xs text-muted-foreground mt-2">{totalPledges} pledges</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Affiliate Earnings</p>
              <p className="text-3xl font-bold">${affiliateEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">{totalAffiliates} affiliates</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Campaign Status */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={campaignStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {campaignStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue by Category */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Funding Progress */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Campaign Funding Progress</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={fundingProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="funded" fill="#10b981" name="Funded" />
                <Bar dataKey="goal" fill="#e5e7eb" name="Goal" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Campaigns */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Campaign</th>
                    <th className="text-left py-2 px-4">Designer</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Funded</th>
                    <th className="text-left py-2 px-4">Backers</th>
                    <th className="text-left py-2 px-4">Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-muted">
                      <td className="py-3 px-4 font-medium">{campaign.title}</td>
                      <td className="py-3 px-4">{campaign.designer}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${campaign.status === "active" ? "bg-green-100 text-green-800" : campaign.status === "funded" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">${campaign.fundedAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">{campaign.backers}</td>
                      <td className="py-3 px-4">{campaign.daysRemaining}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
