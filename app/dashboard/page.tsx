"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useAnalytics } from "@/lib/analytics-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardRecentCampaigns } from "@/components/dashboard-recent-campaigns"
import { ArrowRight, Heart, DollarSign, Clock, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { BACKEND_URL } from "@/config"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const { user, token } = useAuth()
  const { getConversionMetrics } = useAnalytics()

  // Creator state
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [creatorStats, setCreatorStats] = useState({ totalCampaigns: 0, totalEarnings: 0, totalBackers: 0 })
  const [creatorLoading, setCreatorLoading] = useState(true)
  const [creatorError, setCreatorError] = useState("")
  
  // Backer state
  const [pledges, setPledges] = useState<any[]>([])
  const [backerStats, setBackerStats] = useState({ totalPledged: 0, activePledges: 0, completedOrders: 0, savedCampaigns: 0 })
  const [backerLoading, setBackerLoading] = useState(true)
  const [backerError, setBackerError] = useState("")
  
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch creator campaigns and stats
  const fetchCreatorData = useCallback(async (showLoading = true) => {
    if (!token || user?.role !== "creator") return

    if (showLoading) setCreatorLoading(true)
    setCreatorError("")
    
    try {
      const response = await fetch(`${BACKEND_URL}/campaign`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.status && Array.isArray(data.data)) {
        setCampaigns(data.data)
        
        // Calculate stats
        const totalEarnings = data.data.reduce((sum: number, c: any) => sum + (c.funded_amount || 0), 0)
        const totalBackers = data.data.reduce((sum: number, c: any) => sum + (c.backers_count || 0), 0)
        
        setCreatorStats({
          totalCampaigns: data.data.length,
          totalEarnings,
          totalBackers,
        })
        setLastUpdated(new Date())
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load creator data"
      console.error("Creator data error:", errorMessage)
      setCreatorError(errorMessage)
    } finally {
      setCreatorLoading(false)
    }
  }, [token, user?.role])

  // Fetch backer pledges
  const fetchBackerData = useCallback(async (showLoading = true) => {
    if (!token || user?.role !== "backer") return

    if (showLoading) setBackerLoading(true)
    setBackerError("")
    
    try {
      const response = await fetch(`${BACKEND_URL}/pledge/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch pledges: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.status && Array.isArray(data.data)) {
        // Group pledges by campaign
        const pledgesByUser = data.data.map((pledge: any) => ({
          id: pledge.id,
          campaignId: pledge.campaign_id,
          campaignTitle: pledge.campaign?.title || "Unknown Campaign",
          creatorName: pledge.campaign?.creator?.name || "Unknown Creator",
          pledgeAmount: pledge.pledge_amount,
          daysRemaining: pledge.campaign?.days_remaining || 0,
          status: pledge.status || "Active",
          image: pledge.campaign?.image || "/placeholder.svg",
        }))
        
        setPledges(pledgesByUser)
        
        const totalPledged = pledgesByUser.reduce((sum: number, p: any) => sum + p.pledgeAmount, 0)
        const activePledges = pledgesByUser.filter((p: any) => p.status === "Active").length
        
        setBackerStats({
          totalPledged,
          activePledges,
          completedOrders: 0,
          savedCampaigns: 0,
        })
        setLastUpdated(new Date())
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load backer data"
      console.error("Backer data error:", errorMessage)
      setBackerError(errorMessage)
    } finally {
      setBackerLoading(false)
    }
  }, [token, user?.role])

  // Initial fetch on mount
  useEffect(() => {
    if (token) {
      if (user?.role === "creator") {
        fetchCreatorData(true)
      } else if (user?.role === "backer") {
        fetchBackerData(true)
      }
    }
  }, [token, user?.role, fetchCreatorData, fetchBackerData])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    let isMounted = true
    let refreshTimer: NodeJS.Timeout

    const autoRefresh = () => {
      if (isMounted) {
        if (user?.role === "creator") {
          fetchCreatorData(false)
        } else if (user?.role === "backer") {
          fetchBackerData(false)
        }
      }
    }

    refreshTimer = setInterval(autoRefresh, 30000) // 30 seconds

    return () => {
      isMounted = false
      clearInterval(refreshTimer)
    }
  }, [fetchCreatorData, fetchBackerData, user?.role])

  const conversionMetrics = getConversionMetrics()

  // CREATOR VIEW
  if (user?.role === "creator") {
    return (
      <div className="space-y-8">
        {/* Last Updated and Refresh Button */}
        <div className="flex items-center justify-between">
          <div>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchCreatorData(true)}
            disabled={creatorLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${creatorLoading ? "animate-spin" : ""}`} />
            {creatorLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Error Alert */}
        {creatorError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error loading campaigns</p>
              <p className="text-sm text-red-700">{creatorError}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-red-600 hover:text-red-700"
                onClick={() => fetchCreatorData(true)}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {creatorLoading && !campaigns.length ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
            <span className="ml-2 text-neutral-600">Loading campaigns...</span>
          </div>
        ) : (
          <>
            <DashboardStats
              totalCampaigns={creatorStats.totalCampaigns}
              totalEarnings={creatorStats.totalEarnings}
              conversionRate={conversionMetrics.avgConversionRate}
              totalBackers={creatorStats.totalBackers}
            />
            <DashboardRecentCampaigns campaigns={campaigns} />
          </>
        )}

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Backers Dashboard</h1>
                <p className="text-muted-foreground">Manage your pledges and track your orders</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchBackerData(true)}
                disabled={backerLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${backerLoading ? "animate-spin" : ""}`} />
                {backerLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {backerError && (
          <div className="border-b">
            <div className="container py-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900">Error loading pledges</p>
                  <p className="text-sm text-red-700">{backerError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-red-600 hover:text-red-700"
                    onClick={() => fetchBackerData(true)}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {backerLoading && !pledges.length ? (
          <div className="border-b">
            <div className="container py-12 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
              <span className="ml-2 text-neutral-600">Loading your pledges...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="border-b">
              <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">Total Pledged</div>
                    <div className="text-3xl font-bold">${backerStats.totalPledged}</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">Active Pledges</div>
                    <div className="text-3xl font-bold">{backerStats.activePledges}</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">Completed Orders</div>
                    <div className="text-3xl font-bold">{backerStats.completedOrders}</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">Saved Campaigns</div>
                    <div className="text-3xl font-bold">{backerStats.savedCampaigns}</div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="container py-12">
              <div className="space-y-6">
                {pledges.length > 0 ? (
                  pledges.map((pledge) => (
                    <Card key={pledge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-48 bg-muted flex-shrink-0">
                          <img
                            src={pledge.image}
                            alt={pledge.campaignTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{pledge.campaignTitle}</h3>
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
                            <Link href={`/campaign/${pledge.campaignId}`}>
                              <Button variant="outline">View Campaign</Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">No active pledges yet</p>
                    <Link href="/discover">
                      <Button>Discover Campaigns</Button>
                    </Link>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return null
}
