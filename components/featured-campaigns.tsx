"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CampaignCard } from "@/components/campaign-card"
import { MobileTabs } from "@/components/mobile-tabs"

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

export function FeaturedCampaigns() {
  const [activeFilter, setActiveFilter] = useState("new")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setError(null)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          throw new Error("API URL not configured")
        }

        console.log("📡 Fetching campaigns for home page from:", `${apiUrl}/campaign/active?per_page=6`)

        const response = await fetch(`${apiUrl}/campaign/active?per_page=6`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch campaigns: ${response.status}`)
        }

        const result = await response.json()

        if (result.status && Array.isArray(result.data)) {
          console.log(`✓ Loaded ${result.data.length} campaigns for home page`)

          const transformedCampaigns = result.data.map((campaign: any) => {
            // Extract and process image URL from DB product_images or fallback to apiUrls
            const makeImageUrl = (img: unknown): string => {
              if (!img) return "/placeholder.svg"
              let path = ""

              if (typeof img === "string") {
                path = img
              } else if (typeof img === "object" && img !== null) {
                path = (img as any).path || (img as any).url || ""
              }

              if (!path) return "/placeholder.svg"
              if (path.startsWith("/api/")) return path
              if (path.startsWith("http://") || path.startsWith("https://")) return path

              let cleanPath = path
              if (cleanPath.includes("storage/")) {
                cleanPath = cleanPath.substring(cleanPath.indexOf("storage/") + 8)
              }

              return `/api/storage/${cleanPath}`
            }

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
              category: campaign.product_name || "Fashion",
              subcategory: "",
              description: campaign.description,
              status: (campaign.is_funded && campaign.days_remaining <= 0 ? "ended" : "active") as "active" | "closing-soon" | "funded" | "ended",
              createdAt: new Date(campaign.created_at),
              pledgeOptions: [
                {
                  id: "bronze",
                  amount: Math.round(campaign.funding_goal * 0.1),
                  description: "Early Bird",
                  quantity: 20,
                },
                {
                  id: "silver",
                  amount: Math.round(campaign.funding_goal * 0.25),
                  description: "Standard",
                  quantity: 100,
                },
                {
                  id: "gold",
                  amount: Math.round(campaign.funding_goal * 0.5),
                  description: "Premium",
                  quantity: 10,
                },
              ],
            }
          })

          setCampaigns(transformedCampaigns)
        } else {
          console.warn("⚠️ Unexpected API response:", result)
          setError("Unable to load campaigns")
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load campaigns"
        console.error("❌ Campaign fetch error:", message)
        setError(message)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchCampaigns()
  }, [])

  const filterTabs = [
    { id: "new", label: "New Arrivals" },
    { id: "closing", label: "Closing Soon" },
    { id: "favs", label: "Crowd Favs" },
  ]

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <div className="hidden md:flex gap-4">
            <Button variant="outline">Closing Soon</Button>
            <Button variant="outline">Crowd Favs</Button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 font-semibold mb-2">Unable to load campaigns</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : !isLoaded ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">No campaigns available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="md:hidden mb-6">
              <MobileTabs tabs={filterTabs} activeTab={activeFilter} onTabChange={setActiveFilter}>
                <div className="grid grid-cols-1 gap-6">
                  {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              </MobileTabs>
            </div>

            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
