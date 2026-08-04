"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Award, DollarSign, TrendingUp, Loader2 } from "lucide-react"

export default function MyPledgesPage() {
  const { user, token } = useAuth()
  const [pledges, setPledges] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPledged: 0,
    activePledges: 0,
    completedCampaigns: 0,
    totalBacked: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPledges = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/pledge/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch pledges")
      }

      const data = await response.json()

      if (data.status && Array.isArray(data.data)) {
        const pledgesList = data.data.map((pledge: any) => ({
          id: pledge.id,
          campaignId: pledge.campaign_id,
          campaignTitle: pledge.campaign?.title || "Unknown Campaign",
          creatorName: pledge.campaign?.creator?.name || "Unknown Creator",
          pledgeAmount: pledge.pledge_amount,
          quantity: pledge.quantity || 1,
          pledgeDate: pledge.created_at,
          status: pledge.status || "Active",
          image: pledge.campaign?.image || "/placeholder.svg",
          daysRemaining: pledge.campaign?.days_remaining || 0,
        }))

        setPledges(pledgesList)

        // Calculate stats
        const totalPledged = pledgesList.reduce((sum: number, p: any) => sum + p.pledgeAmount * p.quantity, 0)
        const activePledges = pledgesList.filter((p: any) => p.daysRemaining > 0).length
        const completedCampaigns = pledgesList.filter((p: any) => p.daysRemaining === 0).length

        setStats({
          totalPledged,
          activePledges,
          completedCampaigns,
          totalBacked: pledgesList.length,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load pledges"
      console.error("Error fetching pledges:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchPledges()
  }, [fetchPledges])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Pledges</h1>
        <p className="text-neutral-600">Track all your campaign pledges and contributions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Pledged</p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  ${stats.totalPledged.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Active Pledges</p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">{stats.activePledges}</p>
              </div>
              <Heart className="h-10 w-10 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Completed</p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">{stats.completedCampaigns}</p>
              </div>
              <Award className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Campaigns Backed</p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">{stats.totalBacked}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pledges List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-neutral-900">Pledge History</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
              {error}
            </div>
          )}

          {pledges.length > 0 ? (
            <div className="space-y-5">
              {pledges.map((pledge) => (
                <div
                  key={pledge.id}
                  className="border border-neutral-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 bg-gradient-to-br from-white to-neutral-50"
                >
                  <div className="flex gap-5">
                    {pledge.image && (
                      <img
                        src={pledge.image}
                        alt={pledge.campaignTitle}
                        className="w-24 h-24 object-cover rounded-xl flex-shrink-0 shadow-sm"
                      />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-900 truncate mb-1">
                          {pledge.campaignTitle}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4">by {pledge.creatorName}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <span className="text-neutral-900 font-bold text-lg">
                          ${(pledge.pledgeAmount * pledge.quantity).toLocaleString()}
                        </span>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            pledge.daysRemaining > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {pledge.daysRemaining > 0
                            ? `${pledge.daysRemaining} days left`
                            : "Completed"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button variant="outline" size="sm" asChild className="whitespace-nowrap">
                        <Link href={`/discover/${pledge.campaignId}`}>View Campaign</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-neutral-200 mx-auto mb-6" />
              <p className="text-neutral-600 mb-6 text-lg">You haven't pledged to any campaigns yet.</p>
              <Button asChild className="px-8">
                <Link href="/discover">Discover Campaigns</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
