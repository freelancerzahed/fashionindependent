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
import { DollarSign, Users, TrendingUp, Package } from "lucide-react"

export default function AdminReportsPage() {
  const revenueData = [
    { month: "Sep", revenue: 12500, fees: 1250, payouts: 11250 },
    { month: "Oct", revenue: 18750, fees: 1875, payouts: 16875 },
  ]

  const campaignData = [
    { week: "Week 1", active: 5, closed: 2, pending: 3 },
    { week: "Week 2", active: 7, closed: 3, pending: 2 },
    { week: "Week 3", active: 8, closed: 4, pending: 1 },
  ]

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Financial Reports</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Revenue</p>
                <p className="text-3xl font-bold">$31,250</p>
              </div>
              <DollarSign className="h-8 w-8 text-neutral-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Platform Fees</p>
                <p className="text-3xl font-bold">$3,125</p>
              </div>
              <TrendingUp className="h-8 w-8 text-neutral-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Creator Payouts</p>
                <p className="text-3xl font-bold">$28,125</p>
              </div>
              <Users className="h-8 w-8 text-neutral-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Campaigns</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Package className="h-8 w-8 text-neutral-400" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Total Revenue" />
                <Bar dataKey="fees" fill="#ef4444" name="Platform Fees" />
                <Bar dataKey="payouts" fill="#10b981" name="Creator Payouts" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#10b981" name="Active" />
                <Line type="monotone" dataKey="closed" stroke="#3b82f6" name="Closed" />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </main>
  )
}
