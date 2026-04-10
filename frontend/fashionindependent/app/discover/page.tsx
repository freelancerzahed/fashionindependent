"use client"

import { useState, useEffect } from "react"
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
  product_images: string[]
  creator: {
    id: string
    name: string
    image?: string
  }
  end_date: string
  days_remaining: number
  funding_percentage: number
  is_funded: boolean
  views: number
  shares: number
}

export default function DiscoverPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const categoryTabs = [
    { id: "all", label: "All" },
    ...categories.map((cat) => ({ id: cat.toLowerCase(), label: cat })),
  ]

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        
        if (!apiUrl) {
          throw new Error("API URL not configured")
        }

        const response = await fetch(`${apiUrl}/categories/menu`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }

        const data = await response.json()

        if (data.result && data.categories && Array.isArray(data.categories)) {
          const categoryNames = data.categories.map((cat: any) => cat.name || cat.title)
          setCategories(categoryNames)
          console.log("✓ Loaded", categoryNames.length, "categories:", categoryNames)
        } else {
          console.warn("⚠️ Unexpected categories response format:", data)
          setCategories([])
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load categories"
        console.error("❌ Error fetching categories:", message)
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get API URL from environment
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        console.log("📡 API Base URL:", apiUrl)

        if (!apiUrl) {
          throw new Error("API URL not configured. Check NEXT_PUBLIC_API_URL in .env.local")
        }

        // Build the fetch URL
        const fetchUrl = new URL(`${apiUrl}/campaign/active`)
        fetchUrl.searchParams.append("per_page", "12")

        if (selectedCategory && selectedCategory !== "all") {
          fetchUrl.searchParams.append("category", selectedCategory)
        }

        if (searchQuery) {
          fetchUrl.searchParams.append("search", searchQuery)
        }

        console.log("🔗 Fetching from:", fetchUrl.toString())

        const response = await fetch(fetchUrl.toString(), {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        console.log("✓ Response received, status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ HTTP Error:", response.status, errorText)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log("✓ Response parsed:", {
          hasData: !!result.data,
          dataLength: result.data?.length || 0,
          status: result.status,
        })

        if (result.status === true && Array.isArray(result.data)) {
          setCampaigns(result.data)
          console.log(`✓ Loaded ${result.data.length} campaigns`)
        } else {
          console.warn("⚠️ Unexpected response format:", result)
          setError("Invalid response format from server")
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error("❌ Fetch failed:", message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timer = setTimeout(() => {
      fetchCampaigns()
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedCategory, searchQuery])

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (selectedCategory && selectedCategory !== "all") {
      const categoryMatch = campaign.product_name
        ?.toLowerCase()
        .includes(selectedCategory.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(selectedCategory.toLowerCase())
      if (!categoryMatch) return false
    }

    if (searchQuery) {
      const searchMatch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.creator?.name.toLowerCase().includes(searchQuery.toLowerCase())
      if (!searchMatch) return false
    }

    return true
  })

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-center">Creatives in the spotlight</h1>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading && campaigns.length === 0}
              />
            </div>
          </div>
        </section>

        <section className="border-b bg-white py-4 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            {/* Desktop filters */}
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

            {/* Mobile swiper tabs */}
            <div className="md:hidden">
              <MobileTabs
                tabs={categoryTabs}
                activeTab={selectedCategory === null ? "all" : selectedCategory}
                onTabChange={(tabId) => setSelectedCategory(tabId === "all" ? null : tabId)}
              >
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {/* Content will be rendered based on selected category */}
                </div>
              </MobileTabs>
            </div>
          </div>
        </section>

        {/* Campaigns Grid - Desktop */}
        <section className="py-12 bg-white hidden md:block">
          <div className="container mx-auto px-4">
            {renderContent(loading, error, filteredCampaigns)}
          </div>
        </section>

        {/* Campaigns Grid - Mobile */}
        <section className="py-12 bg-white md:hidden">
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
        // Extract and process image URL like in dashboard
        let imageUrl = "/placeholder-campaign.jpg"
        if (campaign.product_images && campaign.product_images.length > 0) {
          const img = campaign.product_images[0] as any
          let imagePath = typeof img === "object" ? (img?.path || img?.url || "") : (img || "")
          
          if (imagePath?.includes("storage/")) {
            imagePath = imagePath.substring(imagePath.indexOf("storage/") + 8)
          }
          
          imageUrl = `/api/storage/${imagePath}`
        }

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
            daysRemaining: campaign.days_remaining,
            status:
              campaign.is_funded && campaign.days_remaining <= 0
                ? "ended"
                : campaign.days_remaining <= 3
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
