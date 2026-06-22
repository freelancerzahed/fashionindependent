"use client"

import { useMemo, memo } from "react"
import { Button } from "@/components/ui/button"
import { CampaignCard } from "@/components/campaign-card"

interface Campaign {
  id: string | number
  title: string
  creator?: { name: string }
  image?: string
  product_images?: Array<{ path?: string; url?: string }>
  current_funding?: number
  funding_goal: number
  backer_count?: number
  days_remaining?: number
  upvote_count?: number
  upvote_goal?: number
  product_name?: string
  description?: string
  is_funded?: boolean
  created_at: string
}

interface TransformedCampaign {
  id: string
  title: string
  designer: string
  image: string
  fundedAmount: number
  fundingGoal: number
  backers: number
  daysRemaining: number
  upvoteGoal: number
  upvoteCount: number
  category: string
  description: string
  status: "active" | "closing-soon" | "funded" | "ended"
  createdAt: Date
}

interface FeaturedCampaignsProps {
  initialCampaigns?: Campaign[]
}

const makeImageUrl = (img: unknown): string => {
  if (!img) return "/placeholder.svg"
  let path = ""

  if (typeof img === "string") {
    path = img
  } else if (typeof img === "object" && img !== null) {
    path = (img as any).path || (img as any).url || ""
  }

  if (!path) return "/placeholder.svg"
  if (path.startsWith("/api/") || path.startsWith("http://") || path.startsWith("https://")) return path

  let cleanPath = path
  if (cleanPath.includes("storage/")) {
    cleanPath = cleanPath.substring(cleanPath.indexOf("storage/") + 8)
  }

  return `/api/storage/${cleanPath}`
}

export const FeaturedCampaigns = memo(function FeaturedCampaigns({ initialCampaigns = [] }: FeaturedCampaignsProps) {
  const transformedCampaigns = useMemo(() => {
    return initialCampaigns.map((campaign: Campaign) => {
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
        fundingGoal: campaign.funding_goal,
        backers: campaign.backer_count || 0,
        daysRemaining: campaign.days_remaining || 0,
        upvoteCount: campaign.upvote_count || 0,
        upvoteGoal: campaign.upvote_goal || 5000,
        category: campaign.product_name || "Fashion",
        description: campaign.description || "",
        status: (campaign.is_funded && campaign.days_remaining! <= 0 ? "ended" : "active") as "active" | "closing-soon" | "funded" | "ended",
        createdAt: new Date(campaign.created_at),
      } as TransformedCampaign
    })
  }, [initialCampaigns])

  if (!transformedCampaigns.length) {
    return (
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold">Active Campaigns</h2>
          <p className="text-neutral-600 mt-8">No campaigns available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Active Campaigns</h2>
          <h4 className="text-xl font-bold mt-0">Explore New Arrivals</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  )
})
