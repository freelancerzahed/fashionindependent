"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Heart,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { BACKEND_URL } from "@/config"

export default function BackerOverviewPage() {
  const { user, token } = useAuth()
  const [pledges, setPledges] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPledged: 0,
    activePledges: 0,
    completedOrders: 0,
    savedCampaigns: 0,
  })
  const [recentPledges, setRecentPledges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBackerData = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      // Fetch pledges
      const pledgesResponse = await fetch(`${BACKEND_URL}/pledge/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!pledgesResponse.ok) {
        throw new Error("Failed to fetch pledges")
      }

      const pledgesData = await pledgesResponse.json()

      if (pledgesData.status && Array.isArray(pledgesData.data)) {
        const pledgesList = pledgesData.data.map((pledge: any) => ({
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
        setRecentPledges(pledgesList.slice(0, 3))

        // Calculate stats
        const totalPledged = pledgesList.reduce((sum: number, p: any) => sum + p.pledgeAmount * p.quantity, 0)
        const activePledges = pledgesList.filter((p: any) => p.daysRemaining > 0).length
        const completedOrders = pledgesList.filter((p: any) => p.daysRemaining === 0).length

        setStats({
          totalPledged,
          activePledges,
          completedOrders,
          savedCampaigns: 0, // Would need separate API call
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load data"
      console.error("Error fetching backer data:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchBackerData()
  }, [fetchBackerData])

  const handleRetry = () => {
    fetchBackerData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col sm:flex-row items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 sm:mt-0.5 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 text-sm sm:text-base">Error loading pledges</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-red-600 hover:text-red-700 text-xs sm:text-sm"
              onClick={handleRetry}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Header - No Background */}
      <div className="pt-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-slate-900">Backer Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600">Manage your pledges and track your investments</p>
      </div>

      {/* Stats Cards - Improved Design */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-0 bg-gradient-to-br from-slate-50 to-white shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-xs sm:text-sm text-slate-600 font-medium mb-2">Total Pledged</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">${stats.totalPledged.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-2">Across campaigns</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-xs sm:text-sm text-blue-600 font-medium mb-2">Active Pledges</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.activePledges}</div>
            <p className="text-xs text-slate-500 mt-2">Supporting</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-xs sm:text-sm text-green-600 font-medium mb-2">Completed Orders</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.completedOrders}</div>
            <p className="text-xs text-slate-500 mt-2">Delivered</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-xs sm:text-sm text-purple-600 font-medium mb-2">Saved Campaigns</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.savedCampaigns}</div>
            <p className="text-xs text-slate-500 mt-2">Watchlist</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pledges Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Pledges</h2>
          <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm border-slate-200 hover:bg-slate-50">
            <Link href="/dashboard/pledges">View All</Link>
          </Button>
        </div>

        {recentPledges.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {recentPledges.map((pledge) => (
              <Card key={pledge.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-white">
                <div className="flex flex-col sm:flex-row">
                  {pledge.image && (
                    <div className="w-full sm:w-48 h-40 sm:h-48 bg-slate-100 flex-shrink-0 overflow-hidden">
                      <img
                        src={pledge.image}
                        alt={pledge.campaignTitle}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-2 text-slate-900">{pledge.campaignTitle}</h3>
                      <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">by <span className="font-medium text-slate-900">{pledge.creatorName}</span></p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-3 sm:mb-4">
                        <div className="inline-block">
                          <span className="text-sm sm:text-base font-bold text-slate-900">${(pledge.pledgeAmount * pledge.quantity).toLocaleString()}</span>
                        </div>
                        <div className="inline-block text-xs sm:text-sm text-slate-600">
                          {pledge.daysRemaining > 0 
                            ? `${pledge.daysRemaining} days remaining` 
                            : "Completed"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm p-6 sm:p-8 text-center bg-gradient-to-br from-slate-50 to-white">
            <p className="text-sm sm:text-base text-slate-600 mb-4">No active pledges yet</p>
            <Link href="/discover">
              <Button size="sm" className="text-xs sm:text-sm bg-slate-900 hover:bg-slate-800">Discover Campaigns</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <Link href="/discover">
              <Button className="w-full text-xs sm:text-sm border-slate-200 hover:bg-slate-50" variant="outline">
                Discover Campaigns
              </Button>
            </Link>
            <Link href="/dashboard/backer/cart">
              <Button className="w-full text-xs sm:text-sm border-slate-200 hover:bg-slate-50" variant="outline">
                Shopping Cart
              </Button>
            </Link>
            <Link href="/dashboard/favorites">
              <Button className="w-full text-xs sm:text-sm border-slate-200 hover:bg-slate-50" variant="outline">
                View Favorites
              </Button>
            </Link>
            <Link href="/dashboard/pledges">
              <Button className="w-full text-xs sm:text-sm border-slate-200 hover:bg-slate-50" variant="outline">
                My Pledges
              </Button>
            </Link>
            <Link href="/dashboard/account">
              <Button className="w-full text-xs sm:text-sm border-slate-200 hover:bg-slate-50" variant="outline">
                Account Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
