"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

import { ProductsHistory } from "@/components/products-history"
import { ProductsOverviewStats } from "@/components/products-overview-stats"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Edit2,
  Flame,
  Loader2,
  AlertCircle,
} from "lucide-react"

interface Campaign {
  id: string | number
  title: string
  funded_amount: number
  funding_goal: number
  backers_count: number
  status: string
  created_at: string
  updated_at: string
  product_images?: any[]
}

interface StatsData {
  totalVotes: number
  totalBackers: number
  totalEarnings: number
}

export default function ProductsPage() {
  const { user, token, isLoading: authLoading } = useAuth()

  // State for campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState<StatsData>({
    totalVotes: 0,
    totalBackers: 0,
    totalEarnings: 0,
  })
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Pagination state
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  // Fetch products/campaigns data in parallel
  const fetchProductsData = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError("")

    try {
      // Parallel fetch for campaigns
      const campaignsRes = await fetch(`/api/campaign`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!campaignsRes.ok) {
        throw new Error(`Failed to fetch campaigns: ${campaignsRes.statusText}`)
      }

      const campaignsData = await campaignsRes.json()
      let campaignsList =
        campaignsData.data ||
        (campaignsData.campaigns && campaignsData.campaigns.data) ||
        []

      if (Array.isArray(campaignsList)) {
        setCampaigns(campaignsList)

        // Calculate stats from campaigns
        const calculatedStats = {
          totalVotes: campaignsList.reduce(
            (sum: number, c: any) => sum + (c.upvote_count || 0),
            0
          ),
          totalBackers: campaignsList.reduce(
            (sum: number, c: any) => sum + (c.backers_count || 0),
            0
          ),
          totalEarnings: campaignsList.reduce(
            (sum: number, c: any) => sum + (c.funded_amount || 0),
            0
          ),
        }
        setStats(calculatedStats)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load products data"
      console.error("Products data error:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Initial fetch on mount
  useEffect(() => {
    if (token && !authLoading) {
      fetchProductsData()
    }
  }, [token, authLoading, fetchProductsData])

  // Memoize active campaign
  const activeCampaign = useMemo(
    () =>
      campaigns.find(
        (c) => c.status === "live" || c.status === "active"
      ),
    [campaigns]
  )

  // Memoize paginated products
  const paginatedCampaigns = useMemo(() => {
    const startIdx = (page - 1) * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    return campaigns.slice(startIdx, endIdx)
  }, [campaigns, page])

  const totalPages = Math.ceil(campaigns.length / itemsPerPage)

  const handleEditCampaign = (campaign: any) => {
    console.log("Edit campaign:", campaign)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
        <span className="ml-2 text-neutral-600">Loading...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-20 px-1 sm:space-y-4 sm:pb-0 sm:px-0">
      {/* Stats Section */}
      <section>
        <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
              <span className="ml-2 text-neutral-600">Loading stats...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">
                  Error loading data
                </p>
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-red-600 hover:text-red-700"
                  onClick={() => fetchProductsData()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <ProductsOverviewStats
              totalVotes={stats.totalVotes}
              totalBackers={stats.totalBackers}
              totalEarnings={stats.totalEarnings}
            />
          )}
        </div>
      </section>

      {/* Current Activity Section */}
      <section>
        <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
          {/* Active Campaigns Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Active Campaign</h2>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                Live
              </span>
            </div>

            {isLoading ? (
              <Card className="p-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-600 mr-2" />
                <span>Loading campaign...</span>
              </Card>
            ) : activeCampaign ? (
              <Card className="border-0 bg-neutral-50 p-3 shadow-none sm:p-4">
                <div className="space-y-3">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Goal
                      </p>
                      <p className="mt-1 text-lg font-bold text-blue-900">
                        ${activeCampaign.funding_goal?.toLocaleString() || "0"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-orange-600" />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                          Backers
                        </p>
                      </div>
                      <p className="mt-1 text-lg font-bold text-orange-600">
                        {activeCampaign.backers_count || 0}
                      </p>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-green-50 p-3 sm:col-span-1 col-span-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">
                        Status
                      </p>
                      <p className="mt-1 text-base font-bold capitalize text-green-900">
                        {activeCampaign.status}
                      </p>
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="space-y-2">
                    <h1 className="text-lg font-semibold text-neutral-900">
                      {activeCampaign.title}
                    </h1>

                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setSelectedImageIndex(0)
                          handleEditCampaign(activeCampaign)
                        }}
                        className="w-full"
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Campaign
                      </Button>

                      {(activeCampaign.status === "live" ||
                        activeCampaign.status === "active") && (
                        <Link href={`/campaign/${activeCampaign.id}`}>
                          <Button variant="outline" className="w-full">
                            View Live Campaign
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center border-2 border-dashed border-neutral-300 bg-neutral-50">
                <Flame className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 mb-4 text-lg font-semibold">
                  No active campaigns at the moment
                </p>
                <p className="text-neutral-500 mb-6">
                  Launch your first campaign to get started
                </p>

                <Link href="/launch-campaign">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Flame className="w-4 h-4 mr-2" />
                    Launch Campaign
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h1 className="text-lg font-semibold text-neutral-900">
            Products & Collections
          </h1>
          <span className="text-sm text-neutral-500">{campaigns.length} items</span>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-3 text-base font-semibold text-neutral-900">
            Products ({campaigns.length})
          </h2>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Flame className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <p className="text-neutral-600 font-semibold">
                No campaigns yet
              </p>
            </div>
          ) : (
            <>
              {/* Products Grid with Pagination */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                {paginatedCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="overflow-hidden group border-neutral-200 transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-[4/3] bg-neutral-200 relative overflow-hidden sm:aspect-[3/4]">
                      {campaign.product_images &&
                      campaign.product_images[0]?.path ? (
                        <img
                          src={
                            campaign.product_images[0].path.startsWith(
                              "/api"
                            )
                              ? campaign.product_images[0].path
                              : `/api/storage/${campaign.product_images[0].path}`
                          }
                          alt={campaign.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                          {campaign.title}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <p className="mb-2 line-clamp-2 text-sm font-medium text-neutral-900">
                        {campaign.title}
                      </p>
                      <div className="flex items-center justify-between text-xs text-neutral-600">
                        <span>
                          ${campaign.funded_amount?.toLocaleString() || 0}
                        </span>
                        <span>
                          {campaign.backers_count || 0} backers
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-neutral-200 py-3">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-neutral-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Products History */}
      <ProductsHistory campaigns={campaigns} />
    </div>
  )
}
