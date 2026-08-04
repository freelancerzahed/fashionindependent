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
import { MobileTabs } from "@/components/mobile-tabs"

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

const normalizeCampaignList = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload

  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.campaigns)) return payload.campaigns
  if (Array.isArray(payload?.campaigns?.data)) return payload.campaigns.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data

  return []
}

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const { getConversionMetrics } = useAnalytics()

  const hasCreatorRole = user?.role === "creator" || user?.roles?.includes("creator")
  const hasBackerRole = user?.role === "backer" || user?.roles?.includes("backer")

  // Redirect backers to their dashboard only when they do not have creator access
  useEffect(() => {
    if (!isLoading && user && !hasCreatorRole && hasBackerRole) {
      router.replace("/dashboard/backer")
    }
  }, [user, isLoading, router, hasCreatorRole, hasBackerRole])

  // Creator state
  const [campaigns, setCampaigns] = useState<any[]>([])
  const initialCreatorStats: ReturnType<typeof calculateStats> = {
    totalCampaigns: 0,
    totalEarnings: 0,
    totalBackers: 0,
    activeCampaigns: 0,
    activeSales: 0,
    activeShowcases: 0,
    recentlyClosed: 0,
    totalDonations: 0,
    outboundBounces: 0,
  }
  const [creatorStats, setCreatorStats] = useState<ReturnType<typeof calculateStats>>(initialCreatorStats)
  const [creatorLoading, setCreatorLoading] = useState(true)
  const [creatorError, setCreatorError] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [activeView, setActiveView] = useState("overview")

  const dashboardTabs = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "growth", label: "Growth" },
      { id: "campaigns", label: "Campaigns" },
    ],
    []
  )

  // Cache for campaigns to enable progressive loading
  const [cachedCampaigns, setCachedCampaigns] = useState<any[]>([])

  // Memoize stats calculation to prevent unnecessary recomputations
  const memoizedStats = useMemo(() => {
    if (campaigns.length > 0) {
      return calculateStats(campaigns)
    }
    if (cachedCampaigns.length > 0) {
      return calculateStats(cachedCampaigns)
    }
    return initialCreatorStats
  }, [campaigns, cachedCampaigns])

  // Update creator stats when memoized stats change
  useEffect(() => {
    setCreatorStats(memoizedStats)
  }, [memoizedStats])

  // Fetch creator campaigns and stats
  const fetchCreatorData = useCallback(async (showLoading = true) => {
    if (!token || !hasCreatorRole) return

    if (showLoading) setCreatorLoading(true)
    else setIsRefreshing(true)
    setCreatorError("")

    try {
      const response = await fetch(`/api/campaign`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.statusText || response.status}`)
      }

      const data = await response.json()
      const campaignsData = normalizeCampaignList(data)

      const mappedCampaigns = campaignsData.map((c: any) => ({
        id: c.id,
        title: c.title,
        fundedAmount: c.funded_amount || c.fundedAmount || 0,
        fundingGoal: c.funding_goal || c.fundingGoal || 0,
        backers: c.backers_count || c.backers || 0,
        upvoteGoal: c.upvote_goal || c.upvoteGoal || 0,
        upvoteCount: c.upvote_count || c.upvoteCount || 0,
        status: c.status || 'pending',
        days_remaining: c.days_remaining ?? c.daysRemaining ?? null,
        updated_at: c.updated_at || c.updatedAt || null,
      }))

      setCampaigns(mappedCampaigns)
      setCachedCampaigns(mappedCampaigns)
      setLastUpdated(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load creator data"
      console.error("Creator data error:", errorMessage)
      setCreatorError(errorMessage)
    } finally {
      setCreatorLoading(false)
      setIsRefreshing(false)
    }
  }, [token, hasCreatorRole])

  // Initial fetch on mount
  useEffect(() => {
    if (token && hasCreatorRole) {
      fetchCreatorData(true)
    }
  }, [token, hasCreatorRole, fetchCreatorData])

  // Optional: Refresh on window focus (much less aggressive than 30-second interval)
  useEffect(() => {
    let isMounted = true

    const handleFocus = () => {
      if (isMounted && hasCreatorRole) {
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
  }, [fetchCreatorData, hasCreatorRole, lastUpdated])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
        <span className="ml-2 text-neutral-600">Loading dashboard...</span>
      </div>
    )
  }

  // If the user doesn't have creator access, don't render this page
  if (!user || !hasCreatorRole) {
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
    <div className="space-y-3 pb-20 px-2 sm:space-y-4 sm:pb-0 sm:px-0">
      {/* Error Alert */}
      {creatorError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error loading campaigns</p>
              <p className="text-sm text-red-700">{creatorError}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs text-red-600 hover:text-red-700 sm:text-sm"
                onClick={() => fetchCreatorData(true)}
              >
                Try Again
              </Button>
            </div>
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
          <MobileTabs tabs={dashboardTabs} activeTab={activeView} onTabChange={setActiveView}>
            {activeView === "overview" && (
              <div className="space-y-3">
                <DashboardStats
                  totalCampaigns={creatorStats.totalCampaigns}
                  totalEarnings={creatorStats.totalEarnings}
                  conversionRate={conversionMetrics.avgConversionRate}
                  totalBackers={creatorStats.totalBackers}
                />

                <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                  <Link
                    href="/dashboard/analytics"
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 hover:text-blue-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    View all analytics
                  </Link>
                </div>
              </div>
            )}

            {activeView === "growth" && (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">
                <Card className="rounded-3xl border-0 bg-white shadow-[0_14px_36px_-20px_rgba(15,23,42,0.45)]">
                  <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[11px]">Active Campaigns</div>
                    <div className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{creatorStats.activeCampaigns}</div>
                    <p className="mt-2 text-[11px] text-slate-500">Currently running</p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 bg-emerald-50 shadow-[0_14px_36px_-20px_rgba(16,185,129,0.35)]">
                  <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-600 sm:text-[11px]">Active Sales</div>
                    <div className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">${creatorStats.activeSales.toLocaleString()}</div>
                    <p className="mt-2 text-[11px] text-slate-500">From active campaigns</p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 bg-violet-50 shadow-[0_14px_36px_-20px_rgba(139,92,246,0.35)]">
                  <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-600 sm:text-[11px]">Active Showcases</div>
                    <div className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{creatorStats.activeShowcases}</div>
                    <p className="mt-2 text-[11px] text-slate-500">Featured campaigns</p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 bg-amber-50 shadow-[0_14px_36px_-20px_rgba(245,158,11,0.35)]">
                  <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600 sm:text-[11px]">Recently Closed</div>
                    <div className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{creatorStats.recentlyClosed}</div>
                    <p className="mt-2 text-[11px] text-slate-500">Ended campaigns</p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 bg-sky-50 shadow-[0_14px_36px_-20px_rgba(14,165,233,0.35)]">
                  <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600 sm:text-[11px]">Total Donations</div>
                    <div className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{creatorStats.totalDonations.toLocaleString()}</div>
                    <p className="mt-2 text-[11px] text-slate-500">Across all campaigns</p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 bg-rose-50 shadow-[0_14px_36px_-20px_rgba(244,63,94,0.35)]">
                  <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-600 sm:text-[11px]">Outbound Bounces</div>
                    <div className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{creatorStats.outboundBounces}</div>
                    <p className="mt-2 text-[11px] text-slate-500">Failed notifications</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeView === "campaigns" && (
              <div className="space-y-3">
                <DashboardRecentCampaigns campaigns={campaigns.length > 0 ? campaigns : cachedCampaigns} />
              </div>
            )}
          </MobileTabs>
        </>
      )}

      <Card className="rounded-3xl border-0 bg-white shadow-[0_14px_36px_-20px_rgba(15,23,42,0.45)]">
        <CardContent className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Link href="/launch-campaign">
              <Button className="w-full justify-start text-xs sm:text-sm" variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" />
                Launch New Campaign
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button className="w-full justify-start text-xs sm:text-sm" variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
