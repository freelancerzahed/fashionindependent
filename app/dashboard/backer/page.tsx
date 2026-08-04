"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const stats = useMemo(() => {
    const totalPledged = pledges.reduce((sum: number, p: any) => sum + p.pledgeAmount * p.quantity, 0)
    const activePledges = pledges.filter((p: any) => p.daysRemaining > 0).length
    const completedOrders = pledges.filter((p: any) => p.daysRemaining === 0).length

    return {
      totalPledged,
      activePledges,
      completedOrders,
      savedCampaigns: 0,
    }
  }, [pledges])

  const recentPledges = useMemo(() => pledges.slice(0, 3), [pledges])

  const fetchBackerData = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      // Fetch pledges through the local Next.js API proxy
      const pledgesResponse = await fetch("/api/pledge/user", {
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
    <div className="space-y-3 pb-20 sm:space-y-4 sm:pb-0">
      {/* Error Alert */}
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row">
            <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900 sm:text-base">Error loading pledges</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs text-red-600 hover:text-red-700 sm:text-sm"
                onClick={handleRetry}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header - mobile app style */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Backer Dashboard</h1>
          </div>
          <div className="rounded-2xl bg-slate-900 px-3 py-2 text-center text-[11px] font-semibold text-white shadow-sm">
            Native
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Manage your pledges and track your investments</p>
      </div>

      {/* Stats Cards - mobile-first 2-column native app tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
        <Card className="rounded-3xl border-0 bg-white shadow-[0_10px_30px_-16px_rgba(15,23,42,0.35)]">
          <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[11px]">Total Pledged</div>
            <div className="mt-2 text-lg font-bold text-slate-900 sm:text-2xl">${stats.totalPledged.toLocaleString()}</div>
            <p className="mt-2 text-[11px] text-slate-500">Across campaigns</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-blue-50 shadow-[0_10px_30px_-16px_rgba(59,130,246,0.35)]">
          <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-600 sm:text-[11px]">Active Pledges</div>
            <div className="mt-2 text-lg font-bold text-slate-900 sm:text-2xl">{stats.activePledges}</div>
            <p className="mt-2 text-[11px] text-slate-500">Supporting</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-emerald-50 shadow-[0_10px_30px_-16px_rgba(16,185,129,0.35)]">
          <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-600 sm:text-[11px]">Completed</div>
            <div className="mt-2 text-lg font-bold text-slate-900 sm:text-2xl">{stats.completedOrders}</div>
            <p className="mt-2 text-[11px] text-slate-500">Delivered</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-violet-50 shadow-[0_10px_30px_-16px_rgba(139,92,246,0.35)]">
          <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-600 sm:text-[11px]">Saved</div>
            <div className="mt-2 text-lg font-bold text-slate-900 sm:text-2xl">{stats.savedCampaigns}</div>
            <p className="mt-2 text-[11px] text-slate-500">Watchlist</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pledges Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 sm:text-2xl">Recent Pledges</h2>
          <Button variant="outline" size="sm" asChild className="border-slate-200 text-xs hover:bg-slate-50 sm:text-sm">
            <Link href="/dashboard/pledges">View All</Link>
          </Button>
        </div>

        {recentPledges.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {recentPledges.map((pledge) => (
              <Card key={pledge.id} className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0_14px_36px_-20px_rgba(15,23,42,0.45)]">
                <div className="flex flex-col sm:flex-row">
                  {pledge.image && (
                    <div className="h-40 w-full overflow-hidden bg-slate-100 sm:h-auto sm:w-40 sm:flex-shrink-0">
                      <img
                        src={pledge.image}
                        alt={pledge.campaignTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4 sm:p-5">
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">{pledge.campaignTitle}</h3>
                    <p className="mt-1 text-sm text-slate-600">by <span className="font-semibold text-slate-900">{pledge.creatorName}</span></p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-bold text-slate-900">${(pledge.pledgeAmount * pledge.quantity).toLocaleString()}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {pledge.daysRemaining > 0 ? `${pledge.daysRemaining} days remaining` : "Completed"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-3xl border-0 bg-white p-6 text-center shadow-[0_14px_36px_-20px_rgba(15,23,42,0.45)] sm:p-8">
            <p className="text-sm text-slate-600 sm:text-base">No active pledges yet</p>
            <Link href="/discover" className="mt-4 inline-block">
              <Button size="sm" className="bg-slate-900 text-xs hover:bg-slate-800 sm:text-sm">Discover Campaigns</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="rounded-3xl border-0 bg-white shadow-[0_14px_36px_-20px_rgba(15,23,42,0.45)]">
        <CardContent className="px-4 py-4 sm:px-5 sm:py-5">
          <h2 className="text-base font-bold text-slate-900 sm:text-xl">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
            <Link href="/discover">
              <Button className="w-full justify-start text-xs sm:text-sm" variant="outline">
                Discover
              </Button>
            </Link>
            <Link href="/dashboard/backer/cart">
              <Button className="w-full justify-start text-xs sm:text-sm" variant="outline">
                Cart
              </Button>
            </Link>
            <Link href="/dashboard/favorites">
              <Button className="w-full justify-start text-xs sm:text-sm" variant="outline">
                Favorites
              </Button>
            </Link>
            <Link href="/dashboard/pledges">
              <Button className="w-full justify-start text-xs sm:text-sm" variant="outline">
                Pledges
              </Button>
            </Link>
            <Link href="/dashboard/account">
              <Button className="w-full justify-start text-xs sm:text-sm" variant="outline">
                Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
