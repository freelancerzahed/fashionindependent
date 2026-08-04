"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CampaignCard } from "@/components/campaign-card"
import { MobileTabs } from "@/components/mobile-tabs"
import { BACKEND_URL } from "@/config"

interface Campaign {
  id: string
  title: string
  designer: string
  image: string
  product_images?: Array<{ path?: string; url?: string }>
  fundedAmount: number
  fundingGoal: number
  backers: number
  daysRemaining: number
  upvoteGoal: number
  upvoteCount: number
  category: string
  subcategory: string
  description: string
  status: "active" | "closing-soon" | "funded" | "ended"
  createdAt: Date
  pledgeOptions: Array<{
    id: string
    amount: number
    description: string
    quantity: number
  }>
}

function makeImageUrl(img: unknown): string {
  if (!img) return "/placeholder.svg"

  let path = ""
  if (typeof img === "string") {
    path = img
  } else if (typeof img === "object" && img !== null) {
    path = (img as any).path || (img as any).url || ""
  }

  if (!path) return "/placeholder.svg"
  if (path.startsWith("/api/")) return path
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(path)
    const pathname = url.pathname
    if (pathname.includes("/storage/")) {
      return `/api/storage/${pathname.substring(pathname.indexOf("/storage/") + 9)}`
    }
    return path
  }

  let cleanPath = path.replace(/^\/+/, "")
  if (cleanPath.includes("storage/")) {
    cleanPath = cleanPath.substring(cleanPath.indexOf("storage/") + 8)
  }

  return `/api/storage/${cleanPath}`
}

function transformApiCampaign(campaign: any): Campaign {
  const imageUrl = campaign.image && typeof campaign.image === "string" && campaign.image.trim()
    ? campaign.image
    : campaign.product_images && campaign.product_images.length > 0
      ? makeImageUrl(campaign.product_images[0])
      : "/placeholder.svg"

  return {
    id: String(campaign.id),
    title: campaign.title,
    designer: campaign.creator?.name || "Unknown Designer",
    image: imageUrl,
    fundedAmount: campaign.current_funding || 0,
    fundingGoal: campaign.funding_goal || 0,
    backers: campaign.backer_count || 0,
    daysRemaining: campaign.days_remaining || 0,
    upvoteCount: campaign.upvote_count || 0,
    upvoteGoal: campaign.upvote_goal || 5000,
    category: campaign.product_name || "",
    subcategory: "",
    description: campaign.description || "",
    status: (campaign.is_funded && campaign.days_remaining <= 0) ? "ended" : ((campaign.days_remaining || 0) <= 3 ? "closing-soon" : "active"),
    createdAt: new Date(campaign.created_at || Date.now()),
    pledgeOptions: [],
  }
}

export function FeaturedCampaigns({ initialCampaigns }: { initialCampaigns?: any[] } = {}) {
  const [activeFilter, setActiveFilter] = useState("new")
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    if (!initialCampaigns || initialCampaigns.length === 0) return []
    return initialCampaigns.map(transformApiCampaign)
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchCampaigns = async () => {
      try {
        setError(null)

        const response = await fetch(`${BACKEND_URL}/campaign/active?per_page=6`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch campaigns: ${response.status}`)
        }

        const result = await response.json()
        if (result.status && Array.isArray(result.data)) {
          const transformed = result.data.map(transformApiCampaign)
          if (mounted) setCampaigns(transformed)
        }
      } catch {
        if (mounted) setError("Unable to load campaigns right now.")
      } finally {
        if (mounted) setIsLoaded(true)
      }
    }

    // Only fetch if we don't already have server-provided campaigns
    if (!campaigns || campaigns.length === 0) {
      fetchCampaigns()
    } else {
      setIsLoaded(true)
    }

    return () => { mounted = false }
  }, [])

  if (!isLoaded) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Active Campaigns</h2>
              <p className="text-sm text-neutral-600">Explore New Arrivals</p>
            </div>
            <div className="hidden md:flex gap-2">
              <Button variant={activeFilter === "new" ? "default" : "outline"} onClick={() => setActiveFilter("new")}>New</Button>
              <Button variant={activeFilter === "popular" ? "default" : "outline"} onClick={() => setActiveFilter("popular")}>Popular</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-lg h-[420px]" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 font-semibold mb-2">Unable to load campaigns</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Active Campaigns</h2>
            <p className="text-sm text-neutral-600">Explore New Arrivals</p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant={activeFilter === "new" ? "default" : "outline"} onClick={() => setActiveFilter("new")}>New</Button>
            <Button variant={activeFilter === "popular" ? "default" : "outline"} onClick={() => setActiveFilter("popular")}>Popular</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  )
}
