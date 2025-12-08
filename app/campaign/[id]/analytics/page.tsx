"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Eye, Users, TrendingUp, DollarSign } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CampaignAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const chartData = [
    { day: "Day 1", views: 120, pledges: 5, revenue: 250 },
    { day: "Day 2", views: 200, pledges: 8, revenue: 400 },
    { day: "Day 3", views: 150, pledges: 6, revenue: 300 },
    { day: "Day 4", views: 300, pledges: 12, revenue: 600 },
    { day: "Day 5", views: 250, pledges: 10, revenue: 500 },
  ]

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Campaign Analytics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Views</p>
                <p className="text-3xl font-bold">1,020</p>
              </div>
              <Eye className="h-8 w-8 text-neutral-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Pledges</p>
                <p className="text-3xl font-bold">41</p>
              </div>
              <Users className="h-8 w-8 text-neutral-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Conversion Rate</p>
                <p className="text-3xl font-bold">4.0%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-neutral-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Revenue</p>
                <p className="text-3xl font-bold">$2,050</p>
              </div>
              <DollarSign className="h-8 w-8 text-neutral-400" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Views & Pledges Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Views" />
                <Line type="monotone" dataKey="pledges" stroke="#10b981" name="Pledges" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </main>
  )
}
