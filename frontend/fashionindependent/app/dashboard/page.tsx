"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useAnalytics } from "@/lib/analytics-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardRecentCampaigns } from "@/components/dashboard-recent-campaigns"
import { ArrowRight, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import { BACKEND_URL } from "@/config"

export const dynamic = "force-dynamic"

// Memoized calculation function to avoid recalculation on every render
const calculateStats = (campaigns: any[]) => {
  const totalEarnings = campaigns.reduce((sum: number, c: any) => sum + (c.fundedAmount || c.funded_amount || 0), 0)
  const totalBackers = campaigns.reduce((sum: number, c: any) => sum + (c.backers || c.backers_count || 0), 0)
  const activeCampaigns = campaigns.filter((c: any) => (c.days_remaining && c.days_remaining > 0) || c.status === 'active' || c.status === 'live').length
  const activeSales = campaigns
    .filter((c: any) => (c.days_remaining && c.days_remaining > 0) || c.status === 'active' || c.status === 'live')
    .reduce((sum: number, c: any) => sum + (c.fundedAmount || c.funded_amount || 0), 0)
  const activeShowcases = campaigns.filter((c: any) => c.status === 'showcase' || c.status === 'featured' || c.is_featured).length
  const recentlyClosed = campaigns.filter((c: any) => (c.days_remaining === 0 || c.status === 'closed') && (c.updated_at || c.updatedAt)).length
  const totalDonations = campaigns.reduce((sum: number, c: any) => sum + (c.pledges_count || c.upvoteCount || 0), 0)
  const outboundBounces = campaigns.reduce((sum: number, c: any) => sum + (c.bounced_notifications || 0), 0)

  return {
    totalCampaigns: campaigns.length,
    totalEarnings,
    totalBackers,
    activeCampaigns,
    activeSales,
    activeShowcases,
    recentlyClosed,
    totalDonations,
    outboundBounces,
  }
}

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const { getConversionMetrics } = useAnalytics()

  // Redirect backers to their dashboard
  useEffect(() => {
    if (!isLoading && user?.role === "backer") {
      router.push("/dashboard/backer")
    }
  }, [user, isLoading, router])

  // Creator state
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [creatorStats, setCreatorStats] = useState<ReturnType<typeof calculateStats> | null>(null)
  const [creatorLoading, setCreatorLoading] = useState(true)
  const [creatorError, setCreatorError] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Cache for campaigns to enable progressive loading
  const [cachedCampaigns, setCachedCampaigns] = useState<any[]>([])

  // Memoize stats calculation to prevent unnecessary recomputations
  const memoizedStats = useMemo(() => {
    if (campaigns.length > 0) {
      return calculateStats(campaigns)
    }
    // Use cached calculation if available
    return cachedCampaigns.length > 0 ? calculateStats(cachedCampaigns) : null
  }, [campaigns, cachedCampaigns])

  // Update creator stats when memoized stats change
  useEffect(() => {
    if (memoizedStats) {
      setCreatorStats(memoizedStats)
    }
  }, [memoizedStats])

  // Fetch creator campaigns and stats
  const fetchCreatorData = useCallback(async (showLoading = true) => {
    if (!token || user?.role !== "creator") return

    if (showLoading) setCreatorLoading(true)
    else setIsRefreshing(true)
    setCreatorError("")
    
    try {
      // Parallel fetch - could be extended to fetch multiple endpoints
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
      
      // Handle both response formats
      let campaignsData = data.data || (data.campaigns && data.campaigns.data) || []
      
      if (data.status && Array.isArray(campaignsData)) {
        // Map API response to component format
        const mappedCampaigns = campaignsData.map((c: any) => ({
          id: c.id,
          title: c.title,
          fundedAmount: c.funded_amount || 0,
          fundingGoal: c.funding_goal || 0,
          backers: c.backers_count || 0,
          upvoteGoal: c.upvote_goal || 0,
          upvoteCount: c.upvote_count || 0,
          status: c.status || 'pending'
        }))
        
        setCampaigns(mappedCampaigns)
        setCachedCampaigns(mappedCampaigns) // Update cache
        setLastUpdated(new Date())
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load creator data"
      console.error("Creator data error:", errorMessage)
      setCreatorError(errorMessage)
    } finally {
      setCreatorLoading(false)
      setIsRefreshing(false)
    }
  }, [token, user?.role])

  // Initial fetch on mount
  useEffect(() => {
    if (token && user?.role === "creator") {
      fetchCreatorData(true)
    }
  }, [token, user?.role, fetchCreatorData])

  // Optional: Refresh on window focus (much less aggressive than 30-second interval)
  useEffect(() => {
    let isMounted = true

    const handleFocus = () => {
      if (isMounted && user?.role === "creator") {
        // Only refresh if more than 2 minutes have passed
        if (lastUpdated && Date.now() - lastUpdated.getTime() > 120000) {
          fetchCreatorData(false)
        }
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => {
      isMounted = false
      window.removeEventListener("focus", handleFocus)
    }
  }, [fetchCreatorData, user?.role, lastUpdated])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
        <span className="ml-2 text-neutral-600">Loading dashboard...</span>
      </div>
    )
  }

  // If not a creator, don't render (layout will handle redirect)
  if (!user || user.role !== "creator") {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
        <span className="ml-2 text-neutral-600">Redirecting...</span>
      </div>
    )
  }

  const conversionMetrics = getConversionMetrics()

  // CREATOR VIEW
  return (
      <div className="space-y-8">
        {/* Last Updated */}
        <div>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
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
        {creatorLoading && !cachedCampaigns.length ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
            <span className="ml-2 text-neutral-600">Loading campaigns...</span>
          </div>
        ) : (
          <>
            {/* Progressive Loading Indicator */}
            {isRefreshing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-sm text-blue-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating dashboard...
              </div>
            )}

            {creatorStats && (
              <>
                <DashboardStats
                  totalCampaigns={creatorStats.totalCampaigns}
                  totalEarnings={creatorStats.totalEarnings}
                  conversionRate={conversionMetrics.avgConversionRate}
                  totalBackers={creatorStats.totalBackers}
                />

                <div className="mt-3">
                  <Link
                    href="/dashboard/analytics"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 hover:text-blue-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    View all analytics
                  </Link>
                </div>

                <DashboardRecentCampaigns campaigns={campaigns.length > 0 ? campaigns : cachedCampaigns} />

                {/* Additional Creator Stats - 6 Grid (2 rows × 3 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Active Campaigns</div>
                      <div className="text-3xl font-bold">{creatorStats.activeCampaigns}</div>
                      <p className="text-xs text-neutral-500 mt-2">Currently running</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Active Sales</div>
                      <div className="text-3xl font-bold">${creatorStats.activeSales.toLocaleString()}</div>
                      <p className="text-xs text-neutral-500 mt-2">From active campaigns</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Active Showcases</div>
                      <div className="text-3xl font-bold">{creatorStats.activeShowcases}</div>
                      <p className="text-xs text-neutral-500 mt-2">Featured campaigns</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Recently Closed</div>
                      <div className="text-3xl font-bold">{creatorStats.recentlyClosed}</div>
                      <p className="text-xs text-neutral-500 mt-2">Ended campaigns</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Total Donations</div>
                      <div className="text-3xl font-bold">{creatorStats.totalDonations.toLocaleString()}</div>
                      <p className="text-xs text-neutral-500 mt-2">Across all campaigns</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Outbound Bounces</div>
                      <div className="text-3xl font-bold">{creatorStats.outboundBounces}</div>
                      <p className="text-xs text-neutral-500 mt-2">Failed notifications</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
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
              <Link href="/dashboard/profile">
                <Button className="w-full" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}
