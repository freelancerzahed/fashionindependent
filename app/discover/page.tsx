"use client"

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useMemo, useState } from "react"
import { CampaignCard } from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { MobileTabs } from "@/components/mobile-tabs"

interface Campaign {
  id: string
  title: string
  description: string
  funding_goal: number
  current_funding: number
  backer_count: number
  upvote_goal: number
  upvote_count: number
  product_name: string
  product_images?: Array<{ path?: string; url?: string } | string>
  creator?: { id?: string; name?: string; image?: string }
  end_date?: string
  days_remaining?: number
  funding_percentage?: number
  is_funded?: boolean
  views?: number
  shares?: number
}

interface DiscoverPageProps {
  initialCampaigns?: Campaign[]
  initialCategories?: string[]
  initialSearch?: string
  initialCategory?: string
}

function resolveCampaignImage(productImages?: Array<{ path?: string; url?: string } | string>) {
  if (!productImages || !Array.isArray(productImages) || productImages.length === 0) {
    return "/placeholder.svg"
  }

  const firstImage = productImages[0]
  const imagePath = typeof firstImage === "string"
    ? firstImage
    : firstImage?.path || firstImage?.url || ""

  if (!imagePath) {
    return "/placeholder.svg"
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    const parsed = new URL(imagePath)
    const pathname = parsed.pathname
    if (pathname.includes("/storage/")) {
      return `/api/storage/${pathname.substring(pathname.indexOf("/storage/") + 9)}`
    }
    return pathname
  }

  const normalizedPath = imagePath.replace(/^\/+/, "")
  if (normalizedPath.includes("storage/")) {
    return `/api/storage/${normalizedPath.substring(normalizedPath.indexOf("storage/") + 8)}`
  }

  return normalizedPath.startsWith("/") ? normalizedPath : `/api/storage/${normalizedPath}`
}

function DiscoverPageContent({ initialCampaigns = [], initialCategories = [], initialSearch = "", initialCategory = "" }: DiscoverPageProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(initialCategories.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const categoryTabs = useMemo(() => [
    { id: "all", label: "All" },
    ...categories.map((cat) => ({ id: cat.toLowerCase(), label: cat })),
  ], [categories])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch("/api/categories/menu", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        })

        if (!response.ok) throw new Error("Failed to load categories")

        const data = await response.json()
        const categoryNames = Array.isArray(data.categories)
          ? data.categories.map((cat: any) => cat.name || cat.title).filter(Boolean)
          : []

        setCategories(categoryNames)
      } catch (err) {
        console.error("[DiscoverPage] Failed to load categories", err)
      } finally {
        setCategoriesLoading(false)
      }
    }

    if (categories.length === 0) {
      void loadCategories()
    }
  }, [categories.length])

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.append("per_page", "12")
        params.append("page", "1")
        if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/campaigns/active?${params.toString()}`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json()
        const nextCampaigns = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []
        setCampaigns(nextCampaigns)
      } catch (err) {
        console.error("[DiscoverPage] Failed to load campaigns", err)
        setError(err instanceof Error ? err.message : "Failed to load campaigns")
      } finally {
        setLoading(false)
      }
    }

    const timer = window.setTimeout(() => {
      void loadCampaigns()
    }, 300)

    return () => window.clearTimeout(timer)
  }, [selectedCategory, searchQuery])

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      if (selectedCategory && selectedCategory !== "all") {
        const categoryMatch =
          campaign.product_name?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          campaign.description?.toLowerCase().includes(selectedCategory.toLowerCase())
        if (!categoryMatch) return false
      }

      if (searchQuery) {
        const searchMatch =
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        if (!searchMatch) return false
      }

      return true
    })
  }, [campaigns, searchQuery, selectedCategory])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-center">Creatives in the spotlight</h1>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="pl-12 h-12 text-base md:text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading && campaigns.length === 0}
              />
            </div>
          </div>
        </section>

        <section className="border-b bg-white py-3 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="hidden md:flex gap-4 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                disabled={(loading && campaigns.length === 0) || categoriesLoading}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  disabled={(loading && campaigns.length === 0) || categoriesLoading}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="md:hidden">
              <MobileTabs
                tabs={categoryTabs}
                activeTab={selectedCategory === null ? "all" : selectedCategory}
                onTabChange={(tabId) => setSelectedCategory(tabId === "all" ? null : tabId)}
              >
                <div className="grid grid-cols-1 gap-4 mt-4" />
              </MobileTabs>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12 bg-white hidden md:block">
          <div className="container mx-auto px-4">
            {renderContent(loading, error, filteredCampaigns)}
          </div>
        </section>

        <section className="py-8 bg-white md:hidden">
          <div className="container mx-auto px-4">
            {renderContent(loading, error, filteredCampaigns)}
          </div>
        </section>
      </main>
    </div>
  )
}

function renderContent(loading: boolean, error: string | null, campaigns: Campaign[]) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        <p className="text-neutral-600">Loading campaigns...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-semibold mb-2">Unable to load campaigns</p>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <p className="text-neutral-600 text-sm">
          Make sure your backend server is running.
          <br />
          Check the browser console (F12) for details.
        </p>
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg">No campaigns available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {campaigns.map((campaign) => {
        const imageUrl = resolveCampaignImage(campaign.product_images)

        return (
          <CampaignCard
            key={campaign.id}
            campaign={{
              id: campaign.id,
              title: campaign.title,
              designer: campaign.creator?.name || "Unknown",
              image: imageUrl,
              category: campaign.product_name || "",
              subcategory: "",
              description: campaign.description,
              fundingGoal: campaign.funding_goal,
              fundedAmount: campaign.current_funding,
              backers: campaign.backer_count,
              daysRemaining: campaign.days_remaining || 0,
              upvoteGoal: campaign.upvote_goal,
              upvoteCount: campaign.upvote_count,
              status:
                campaign.is_funded && (campaign.days_remaining || 0) <= 0
                  ? "ended"
                  : (campaign.days_remaining || 0) <= 3
                    ? "closing-soon"
                    : "active",
              pledgeOptions: [],
              createdAt: new Date(),
            }}
          />
        )
      })}
    </div>
  )
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DiscoverPageSkeleton />}>
      <DiscoverPageContent />
    </Suspense>
  )
}

function DiscoverPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto h-10 w-48 animate-pulse rounded bg-neutral-200" />
            <div className="mx-auto mt-4 h-12 max-w-2xl animate-pulse rounded bg-neutral-200" />
          </div>
        </section>
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-xl bg-neutral-200" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
