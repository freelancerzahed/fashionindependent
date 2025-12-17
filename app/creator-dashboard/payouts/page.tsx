"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePayout } from "@/lib/payout-context"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { DollarSign, TrendingUp, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export default function PayoutsPage() {
  const { user } = useAuth()
  const { payouts, calculatePayout, processPayout } = usePayout()
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorData, setCalculatorData] = useState({
    totalDonations: 0,
    manufacturingCost: 0,
  })

  const handleCalculate = () => {
    if (calculatorData.totalDonations > 0) {
      calculatePayout("demo-campaign", calculatorData.totalDonations, calculatorData.manufacturingCost)
      setShowCalculator(false)
    }
  }

  const totalEarnings = payouts.reduce((sum, p) => sum + p.netPayout, 0)
  const pendingPayouts = payouts.filter((p) => p.status === "pending")
  const processedPayouts = payouts.filter((p) => p.status === "processed" || p.status === "paid")

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Payout Dashboard</h1>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-3xl font-bold">${totalEarnings.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary opacity-20" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-3xl font-bold">{pendingPayouts.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processed</p>
                  <p className="text-3xl font-bold">{processedPayouts.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Payout Calculator</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Calculate your net payout based on donations and manufacturing costs
            </p>
            {!showCalculator ? (
              <Button onClick={() => setShowCalculator(true)}>Open Calculator</Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Total Donations</label>
                  <input
                    type="number"
                    placeholder="Enter total donations"
                    value={calculatorData.totalDonations}
                    onChange={(e) => setCalculatorData({ ...calculatorData, totalDonations: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Manufacturing Cost</label>
                  <input
                    type="number"
                    placeholder="Enter manufacturing cost"
                    value={calculatorData.manufacturingCost}
                    onChange={(e) =>
                      setCalculatorData({ ...calculatorData, manufacturingCost: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-md mt-1"
                  />
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Platform Fee (10%)</p>
                      <p className="font-semibold">${(calculatorData.totalDonations * 0.1).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Your Net Payout</p>
                      <p className="font-semibold text-green-600">
                        $
                        {(
                          calculatorData.totalDonations -
                          calculatorData.totalDonations * 0.1 -
                          calculatorData.manufacturingCost
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCalculate} className="flex-1">
                    Calculate
                  </Button>
                  <Button onClick={() => setShowCalculator(false)} variant="outline" className="flex-1">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payout History</h2>
            {payouts.length === 0 ? (
              <p className="text-muted-foreground">No payouts yet. Launch a campaign to start earning!</p>
            ) : (
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div key={payout.campaignId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Campaign {payout.campaignId}</p>
                      <p className="text-sm text-muted-foreground">
                        Total Donations: ${payout.totalDonations.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Manufacturing Cost: ${payout.manufacturingCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${payout.netPayout.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{payout.status}</p>
                      {payout.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => processPayout(payout.campaignId)}
                          className="mt-2"
                        >
                          Process Payout
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}
