"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { MobileTabs } from "@/components/mobile-tabs"
import Link from "next/link"

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

interface DiscoverPageClientProps {
  initialCampaigns: Campaign[]
  initialCategories: string[]
  initialSearch: string
  initialCategory: string
  initialPage: number
  initialHasMore: boolean
}

const perPage = 12

function getInternalApiUrl(path: string) {
  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://127.0.0.1:3000")

  return new URL(path, `${baseUrl.replace(/\/$/, "")}/`).toString()
}

function resolveCampaignImage(productImages: any) {
  if (!productImages || !Array.isArray(productImages) || productImages.length === 0) {
    return "/placeholder.jpg"
  }

  const firstImage = productImages[0]
  const imagePath = typeof firstImage === "string"
    ? firstImage
    : firstImage?.path || firstImage?.url || ""

  if (!imagePath) {
    return "/placeholder.jpg"
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

export function DiscoverPageClient({
  initialCampaigns,
  initialCategories,
  initialSearch,
  initialCategory,
  initialPage,
  initialHasMore,
}: DiscoverPageClientProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [isAppending, setIsAppending] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(initialCategories.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [page, setPage] = useState(initialPage || 1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const categoryTabs = useMemo(
    () => [
      { id: "all", label: "All" },
      ...categories.map((cat) => ({ id: cat.toLowerCase(), label: cat })),
    ],
    [categories],
  )

  useEffect(() => {
    if (categories.length > 0) return

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch("/api/categories/menu", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }

        const data = await response.json()
        const categoryNames = Array.isArray(data.categories)
          ? data.categories.map((cat: any) => cat.name || cat.title).filter(Boolean)
          : []

        setCategories(categoryNames)
      } catch (err) {
        console.error("[DiscoverPageClient] Failed to load categories", err)
      } finally {
        setCategoriesLoading(false)
      }
    }

    void loadCategories()
  }, [categories.length])

  const fetchCampaigns = async (targetPage: number, reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setIsAppending(true)
      }
      setError(null)

      const proxyUrl = new URL(getInternalApiUrl("/api/campaigns/active"))
      proxyUrl.searchParams.append("per_page", perPage.toString())
      proxyUrl.searchParams.append("page", targetPage.toString())
      if (selectedCategory && selectedCategory !== "all") {
        proxyUrl.searchParams.append("category", selectedCategory)
      }
      if (deferredSearchQuery) {
        proxyUrl.searchParams.append("search", deferredSearchQuery)
      }

      const response = await fetch(proxyUrl.toString(), {
        method: "GET",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      const pageCampaigns = Array.isArray(result.data) ? result.data : []

      setCampaigns((prev) => (targetPage === 1 ? pageCampaigns : [...prev, ...pageCampaigns]))
      setHasMore(pageCampaigns.length === perPage)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error("[DiscoverPageClient] Campaign fetch failed", message)
      setError(message)
      setHasMore(false)
    } finally {
      setLoading(false)
      setIsAppending(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1)
      void fetchCampaigns(1, true)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [selectedCategory, deferredSearchQuery])

  useEffect(() => {
    if (page === 1) return
    void fetchCampaigns(page, false)
  }, [page])

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading || isAppending) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && !isAppending) {
          setPage((prevPage) => prevPage + 1)
        }
      },
      { rootMargin: "250px" },
    )

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, isAppending])

  const renderContent = () => {
    if (loading && campaigns.length === 0) {
      return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="aspect-[3/4] animate-pulse bg-neutral-200" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                <div className="h-5 w-full animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          ))}
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaigns.map((campaign) => {
            let imageUrl = "/placeholder.jpg"
            if (campaign.product_images && campaign.product_images.length > 0) {
              imageUrl = resolveCampaignImage(campaign.product_images)
            }

            return (
              <div key={campaign.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={campaign.title || "Campaign image"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.src = "/placeholder.jpg"
                    }}
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-neutral-600 mb-1">by {campaign.creator?.name || "Unknown designer"}</p>
                  <h3 className="mb-2 text-lg font-semibold">{campaign.title || "Untitled campaign"}</h3>
                  <p className="text-sm text-neutral-600 line-clamp-3">{campaign.description || "No description available."}</p>
                  <div className="mt-4">
                    <Link href={`/campaign/${campaign.id}`} className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors w-full">
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {isAppending && (
          <div className="text-center text-sm text-neutral-600">Loading more campaigns...</div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-center">Designers in the Spotlight</h1>

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
            <div className="hidden md:flex gap-4 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(null)
                  setPage(1)
                }}
                disabled={(loading && campaigns.length === 0) || categoriesLoading}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setPage(1)
                  }}
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
                onTabChange={(tabId) => {
                  setSelectedCategory(tabId === "all" ? null : tabId)
                  setPage(1)
                }}
              >
                <div className="grid grid-cols-1 gap-4 mt-4" />
              </MobileTabs>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            {renderContent()}
            <div ref={observerRef} className="h-8" />
          </div>
        </section>
      </main>
    </div>
  )
}
