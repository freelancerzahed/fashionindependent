"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useAnalytics } from "@/lib/analytics-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardRecentCampaigns } from "@/components/dashboard-recent-campaigns"
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { BACKEND_URL } from "@/config"

export const dynamic = "force-dynamic"

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
  const [creatorStats, setCreatorStats] = useState({ 
    totalCampaigns: 0, 
    totalEarnings: 0, 
    totalBackers: 0,
    activeCampaigns: 0,
    activeSales: 0,
    activeShowcases: 0,
    recentlyClosed: 0,
    totalDonations: 0,
    outboundBounces: 0
  })
  const [creatorLoading, setCreatorLoading] = useState(true)
  const [creatorError, setCreatorError] = useState("")
  
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
        
        // Active campaigns
        const activeCampaigns = data.data.filter((c: any) => c.days_remaining > 0 || c.status === 'active').length
        
        // Active sales
        const activeSales = data.data
          .filter((c: any) => c.days_remaining > 0 || c.status === 'active')
          .reduce((sum: number, c: any) => sum + (c.funded_amount || 0), 0)
        
        const activeShowcases = data.data.filter((c: any) => c.status === 'showcase' || c.is_featured).length
        const recentlyClosed = data.data.filter((c: any) => (c.days_remaining === 0 || c.status === 'closed') && c.updated_at).length
        const totalDonations = data.data.reduce((sum: number, c: any) => sum + (c.pledges_count || 0), 0)
        const outboundBounces = data.data.reduce((sum: number, c: any) => sum + (c.bounced_notifications || 0), 0)
        
        setCreatorStats({
          totalCampaigns: data.data.length,
          totalEarnings,
          totalBackers,
          activeCampaigns,
          activeSales,
          activeShowcases,
          recentlyClosed,
          totalDonations,
          outboundBounces,
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

  // Initial fetch on mount
  useEffect(() => {
    if (token && user?.role === "creator") {
      fetchCreatorData(true)
    }
  }, [token, user?.role, fetchCreatorData])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    let isMounted = true
    let refreshTimer: NodeJS.Timeout

    const autoRefresh = () => {
      if (isMounted && user?.role === "creator") {
        fetchCreatorData(false)
      }
    }

    refreshTimer = setInterval(autoRefresh, 30000) // 30 seconds

    return () => {
      isMounted = false
      clearInterval(refreshTimer)
    }
  }, [fetchCreatorData, user?.role])

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
              <Link href="/dashboard/profile">
                <Button className="w-full" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button className="w-full" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}
