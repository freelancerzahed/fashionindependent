"use client"

import { Card } from "@/components/ui/card"
import { useAnalytics } from "@/lib/analytics-context"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"

export const dynamic = "force-dynamic"

export default function AnalyticsDashboard() {
  const { getTopCampaigns, getCampaignAnalytics } = useAnalytics()
  const topCampaigns = getTopCampaigns(5)

  const chartData = topCampaigns.map((campaign) => ({
    name: `Campaign ${campaign.campaignId.slice(0, 4)}`,
    views: campaign.totalViews,
    conversions: campaign.pledgeCompleted,
    conversionRate: campaign.conversionRate.toFixed(1),
  }))

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Total Campaigns</p>
              <p className="text-3xl font-bold">{topCampaigns.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-3xl font-bold">{topCampaigns.reduce((sum, c) => sum + c.totalViews, 0)}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Total Pledges</p>
              <p className="text-3xl font-bold">{topCampaigns.reduce((sum, c) => sum + c.pledgeCompleted, 0)}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Avg Conversion Rate</p>
              <p className="text-3xl font-bold">
                {(topCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / topCampaigns.length).toFixed(1)}%
              </p>
            </Card>
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Campaign Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="conversions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Campaigns</h2>
            <div className="space-y-4">
              {topCampaigns.map((campaign) => (
                <div key={campaign.campaignId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">Campaign {campaign.campaignId}</p>
                    <p className="text-sm text-muted-foreground">{campaign.uniqueVisitors} unique visitors</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{campaign.pledgeCompleted} pledges</p>
                    <p className="text-sm text-muted-foreground">{campaign.conversionRate.toFixed(1)}% conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
