"use client"

import { Card } from "@/components/ui/card"
import { usePayout } from "@/lib/payout-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export const dynamic = "force-dynamic"

export default function AdminPayoutsPage() {
  const { payouts } = usePayout()

  const totalDonations = payouts.reduce((sum, p) => sum + p.totalDonations, 0)
  const totalPlatformFees = payouts.reduce((sum, p) => sum + p.platformFee, 0)
  const totalManufacturingCosts = payouts.reduce((sum, p) => sum + p.manufacturingCost, 0)
  const totalPayouts = payouts.reduce((sum, p) => sum + p.netPayout, 0)

  const chartData = payouts.map((p) => ({
    campaign: `Campaign ${p.campaignId.slice(0, 4)}`,
    donations: p.totalDonations,
    platformFee: p.platformFee,
    manufacturing: p.manufacturingCost,
    payout: p.netPayout,
  }))

  const pieData = [
    { name: "Platform Fees", value: totalPlatformFees },
    { name: "Manufacturing Costs", value: totalManufacturingCosts },
    { name: "Creator Payouts", value: totalPayouts },
  ]

  const COLORS = ["#3b82f6", "#ef4444", "#10b981"]

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Payout Administration</h1>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Total Donations</p>
              <p className="text-3xl font-bold">${totalDonations.toFixed(2)}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Platform Fees (10%)</p>
              <p className="text-3xl font-bold text-blue-600">${totalPlatformFees.toFixed(2)}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Manufacturing Costs</p>
              <p className="text-3xl font-bold text-red-600">${totalManufacturingCosts.toFixed(2)}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Creator Payouts</p>
              <p className="text-3xl font-bold text-green-600">${totalPayouts.toFixed(2)}</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Revenue Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const { name, value } = props.payload || {}
                      return `${name}: $${value?.toFixed(0) || 0}`
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${typeof value === "number" ? value.toFixed(2) : Number(value).toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Payouts</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `$${typeof value === "number" ? value.toFixed(2) : Number(value).toFixed(2)}`}
                  />
                  <Legend />
                  <Bar dataKey="donations" fill="#8884d8" />
                  <Bar dataKey="payout" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Payout Report</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Campaign</th>
                    <th className="text-right py-3 px-4">Donations</th>
                    <th className="text-right py-3 px-4">Platform Fee</th>
                    <th className="text-right py-3 px-4">Manufacturing</th>
                    <th className="text-right py-3 px-4">Creator Payout</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.campaignId} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Campaign {payout.campaignId}</td>
                      <td className="text-right py-3 px-4">${payout.totalDonations.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">${payout.platformFee.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">${payout.manufacturingCost.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-green-600">
                        ${payout.netPayout.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 capitalize">{payout.status}</td>
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
