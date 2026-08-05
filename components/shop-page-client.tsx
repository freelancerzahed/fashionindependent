"use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { MobileTabs } from "@/components/mobile-tabs"
import { useRouter } from "next/navigation"
import { getCampaignPrice } from "@/lib/campaign-pricing"

interface Pagination {
  page: number
  per_page: number
  total: number
  total_pages: number
  has_more: boolean
}

interface Product {
  id: string | number
  slug: string
  name: string
  title: string
  thumbnail_image: string
  image: string
  stroked_price: number
  main_price: number
  price: number
  discount: string
  rating: number
  sales: number
  description: string
  isCampaign?: boolean
  availabilityLabel?: string
  statusLabel?: string
  href?: string
  detailsHref?: string
  ctaLabel?: string
}

interface CategoryOption {
  id: string
  label: string
  value: string
}

interface ShopPageClientProps {
  initialProducts: Product[]
  pagination: Pagination
  initialSearch: string
  initialCategory: string
  initialSortBy: string
  initialSortOrder: string
}

export function ShopPageClient({
  initialProducts,
  pagination,
  initialSearch,
  initialCategory,
  initialSortBy,
  initialSortOrder,
}: ShopPageClientProps) {
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>(initialProducts.filter((product) => product.ctaLabel === 'Buy Now'))
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [priceRange, setPriceRange] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPagination, setCurrentPagination] = useState(pagination || {
    page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
    has_more: false,
  })
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const perPage = 12

  const filterTabs = [
    { id: "created_at", label: "Newest" },
    { id: "funding", label: "Trending" },
    { id: "ending-soon", label: "Closing Soon" },
    { id: "trending", label: "Most Viewed" },
  ]

  const priceFilterOptions = [
    { id: "all", label: "Any price" },
    { id: "under-100", label: "Under $100" },
    { id: "100-250", label: "$100 - $250" },
    { id: "250-plus", label: "$250+" },
  ]

  const [activeFilter, setActiveFilter] = useState(initialSortBy)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories/menu", {
          headers: { Accept: "application/json" },
        })

        if (!response.ok) return

        const data = await response.json()
        const options = (data.categories || []).flatMap((item: any) => {
          const root = item.href ? item.href.split("/category/").pop() : ""
          const rootOption = item.name
            ? { id: `${item.id || item.name}-root`, label: item.name, value: root || "" }
            : null

          const children = (item.subcategories || []).map((sub: any) => ({
            id: `${sub.id || sub.name}-child`,
            label: sub.name,
            value: sub.href ? sub.href.split("/category/").pop() : "",
          }))

          return [rootOption, ...children].filter(Boolean) as CategoryOption[]
        })

        const uniqueOptions = options.filter(
          (option: CategoryOption, index: number, arr: CategoryOption[]) => arr.findIndex((item: CategoryOption) => item.value === option.value) === index
        )

        setCategories([{ id: "all", label: "All", value: "" }, ...uniqueOptions])
      } catch (error) {
        console.error("Error loading categories for shop", error)
      }
    }

    loadCategories()
  }, [])

  const updateUrl = useCallback(
    (search: string, cat: string, sort: string, order: string, page: number, currentPriceRange = priceRange) => {
      const params = new URLSearchParams()

      if (search) params.append('search', search)
      if (cat) params.append('category', cat)
      if (sort && sort !== 'created_at') params.append('sort_by', sort)
      if (order && order !== 'desc') params.append('sort_order', order)
      if (currentPriceRange && currentPriceRange !== 'all') params.append('price_range', currentPriceRange)
      if (page > 1) params.append('page', page.toString())

      router.push(`/shop?${params.toString()}`)
    },
    [priceRange, router]
  )

  const fetchProducts = useCallback(
    async (search: string, cat: string, sort: string, order: string, page: number, append = false) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()

        if (search) params.append('search', search)
        if (cat) params.append('category', cat)
        if (sort && sort !== 'created_at') params.append('sort_by', sort)
        if (order && order !== 'desc') params.append('sort_order', order)
        if (priceRange && priceRange !== 'all') params.append('price_range', priceRange)
        params.append('page', page.toString())
        params.append('per_page', perPage.toString())

        const url = `/api/campaigns/active?${params.toString()}`
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          }
        })

        if (!response.ok) throw new Error('Failed to fetch products')

        const data = await response.json()
        const campaigns = Array.isArray(data.data) ? data.data : []
        const fundedCampaigns = campaigns.filter((campaign: any) => campaign.is_funded)

        const transformed = fundedCampaigns.map((campaign: any) => {
          const campaignPrice = getCampaignPrice(campaign)
          return {
            id: campaign.id,
            slug: String(campaign.id),
            name: campaign.product_name || campaign.title,
            title: campaign.title,
            thumbnail_image: campaign.product_images?.[0]?.path || '/placeholder.svg',
            image: campaign.product_images?.[0]?.path || '/placeholder.svg',
            stroked_price: 0,
            main_price: campaignPrice,
            price: campaignPrice,
            discount: 'Limited Drop',
            rating: Number(campaign.upvote_percentage || 0),
            sales: Number(campaign.backer_count || 0),
            description: campaign.description || '',
            isCampaign: true,
            availabilityLabel: 'Now Available',
            statusLabel: 'This campaign has reached its goal and this limited drop is ready for purchase.',
            href: `/checkout?campaignId=${campaign.id}&pledgeOptionId=buy-now&quantity=1`,
            detailsHref: `/campaign/${campaign.id}`,
            ctaLabel: 'Buy Now',
          }
        })

        const hasMoreFromApi = Boolean(data.pagination?.has_more) || Boolean(data.meta && (data.meta.current_page || page) < (data.meta.last_page || 0))
        const hasMore = hasMoreFromApi && transformed.length >= perPage

        setProducts((prev) => {
          const nextProducts = append ? [...prev, ...transformed] : transformed
          const totalLoaded = nextProducts.length

          let paginationData = { page, per_page: perPage, total: totalLoaded, total_pages: 1, has_more: hasMore }
          if (data.pagination) {
            paginationData = {
              page: data.pagination.page || page,
              per_page: data.pagination.per_page || perPage,
              total: totalLoaded,
              total_pages: data.pagination.total_pages || 1,
              has_more: hasMore,
            }
          } else if (data.meta) {
            paginationData = {
              page: data.meta.current_page || page,
              per_page: data.meta.per_page || perPage,
              total: totalLoaded,
              total_pages: data.meta.last_page || 1,
              has_more: hasMore,
            }
          }

          setCurrentPagination(paginationData)
          setCurrentPage(paginationData.page)
          return nextProducts
        })
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [perPage, priceRange]
  )

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value)
      setCurrentPage(1)
      updateUrl(value, category, sortBy, sortOrder, 1, priceRange)
      fetchProducts(value, category, sortBy, sortOrder, 1, false)
    },
    [category, fetchProducts, priceRange, sortBy, sortOrder, updateUrl]
  )

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId)
    setSortBy(filterId)
    setCurrentPage(1)
    updateUrl(searchTerm, category, filterId, sortOrder, 1, priceRange)
    fetchProducts(searchTerm, category, filterId, sortOrder, 1, false)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setCurrentPage(1)
    updateUrl(searchTerm, value, sortBy, sortOrder, 1, priceRange)
    fetchProducts(searchTerm, value, sortBy, sortOrder, 1, false)
  }

  const handlePriceChange = (value: string) => {
    setPriceRange(value)
    setCurrentPage(1)
    updateUrl(searchTerm, category, sortBy, sortOrder, 1, value)
    fetchProducts(searchTerm, category, sortBy, sortOrder, 1, false)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategory("")
    setSortBy("created_at")
    setSortOrder("desc")
    setPriceRange("all")
    setActiveFilter("created_at")
    setCurrentPage(1)
    router.push("/shop")
    fetchProducts("", "", "created_at", "desc", 1, false)
  }

  const handleClearFilters = () => {
    clearFilters()
    setShowAdvancedFilters(false)
  }

  const removeSearchFilter = () => {
    setSearchTerm("")
    setCurrentPage(1)
    updateUrl("", category, sortBy, sortOrder, 1, priceRange)
    fetchProducts("", category, sortBy, sortOrder, 1, false)
  }

  const removeCategoryFilter = () => {
    setCategory("")
    setCurrentPage(1)
    updateUrl(searchTerm, "", sortBy, sortOrder, 1, priceRange)
    fetchProducts(searchTerm, "", sortBy, sortOrder, 1, false)
  }

  const removePriceFilter = () => {
    setPriceRange("all")
    setCurrentPage(1)
    updateUrl(searchTerm, category, sortBy, sortOrder, 1, "all")
    fetchProducts(searchTerm, category, sortBy, sortOrder, 1, false)
  }

  const removeSortFilter = () => {
    setActiveFilter("created_at")
    setSortBy("created_at")
    setCurrentPage(1)
    updateUrl(searchTerm, category, "created_at", sortOrder, 1, priceRange)
    fetchProducts(searchTerm, category, "created_at", sortOrder, 1, false)
  }

  const handleLoadMore = useCallback(() => {
    if (isLoading || !currentPagination.has_more) return
    const nextPage = currentPage + 1
    fetchProducts(searchTerm, category, sortBy, sortOrder, nextPage, true)
    updateUrl(searchTerm, category, sortBy, sortOrder, nextPage)
  }, [currentPage, currentPagination.has_more, fetchProducts, isLoading, searchTerm, category, sortBy, sortOrder, updateUrl])

  useEffect(() => {
    if (!sentinelRef.current || !currentPagination.has_more || isLoading || products.length < currentPagination.per_page) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [currentPagination.has_more, handleLoadMore, isLoading, products.length, currentPagination.per_page])

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4" />
          <p className="text-neutral-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 pb-20">
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_28%),linear-gradient(135deg,_#0f172a,_#111827_45%,_#1f2937)] py-12 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_25%)]" />
          <div className="container relative mx-auto px-4 text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-neutral-100 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Limited drops • curated for members
            </div>
            <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Shop the pieces that made the cut.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
              Discover successful campaign products available now, filtered by style, price, and release timing.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="container mx-auto px-4">
            <div className="static bg-white rounded-3xl border border-neutral-200 p-4 shadow-sm md:sticky md:top-14 md:z-30 md:bg-white/70 md:backdrop-blur-sm md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full max-w-2xl">
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Search</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="search"
                      placeholder="Search drops, designers, or styles..."
                      className="h-12 rounded-full border-neutral-200 bg-neutral-50 pl-12 text-base shadow-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    className="h-11 rounded-full border-neutral-200 bg-white px-4 text-neutral-700 hover:bg-neutral-100"
                    onClick={() => setShowAdvancedFilters((value) => !value)}
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {showAdvancedFilters ? "Hide filters" : "Filters"}
                  </Button>
                  {(searchTerm || category || priceRange !== "all" || activeFilter !== "created_at") && (
                    <Button
                      variant="ghost"
                      className="h-11 rounded-full px-4 text-neutral-700 hover:bg-neutral-100"
                      onClick={handleClearFilters}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 hidden md:flex flex-wrap items-center gap-2">
                {categories.slice(0, 4).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleCategoryChange(option.value)}
                    className={`rounded-full border px-3 py-2 text-sm ${category === option.value ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}
                  >
                    {option.label}
                  </button>
                ))}
                {priceFilterOptions.slice(1, 3).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handlePriceChange(option.id)}
                    className={`rounded-full border px-3 py-2 text-sm ${priceRange === option.id ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {showAdvancedFilters && (
                <div className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-900">Category</p>
                        <span className="text-xs text-neutral-500">Tap to choose</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleCategoryChange(option.value)}
                            className={`rounded-full px-4 py-2 text-sm ${category === option.value ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-900">Price range</p>
                        <span className="text-xs text-neutral-500">Filter by budget</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {priceFilterOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handlePriceChange(option.id)}
                            className={`rounded-full px-4 py-2 text-sm ${priceRange === option.id ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-neutral-900">Sort by</p>
                      <div className="flex flex-wrap gap-2">
                        {filterTabs.map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleFilterChange(tab.id)}
                            className={`rounded-full px-4 py-2 text-sm ${activeFilter === tab.id ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-neutral-900">Actions</p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 rounded-full border-neutral-200" onClick={handleClearFilters}>
                          Reset
                        </Button>
                        <Button className="flex-1 rounded-full bg-neutral-900 text-white" onClick={() => setShowAdvancedFilters(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(searchTerm || category || priceRange !== "all" || activeFilter !== "created_at") && (
              <div className="mt-6 flex flex-wrap gap-2">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={removeSearchFilter}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
                  >
                    Search: {searchTerm}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {category && (
                  <button
                    type="button"
                    onClick={removeCategoryFilter}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
                  >
                    Category
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {priceRange !== "all" && (
                  <button
                    type="button"
                    onClick={removePriceFilter}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
                  >
                    Price: {priceFilterOptions.find((option) => option.id === priceRange)?.label}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {activeFilter !== "created_at" && (
                  <button
                    type="button"
                    onClick={removeSortFilter}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
                  >
                    Sort: {filterTabs.find((tab) => tab.id === activeFilter)?.label}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="mt-8 md:hidden">
              <MobileTabs tabs={filterTabs} activeTab={activeFilter} onTabChange={handleFilterChange}>
                {isLoading ? (
                  <ProductsLoadingSkeleton />
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-12 text-center text-neutral-600">
                    No products found for these filters.
                  </div>
                )}
              </MobileTabs>
            </div>

            <div className="mt-8 hidden md:grid grid-cols-2 gap-4 lg:grid-cols-4">
              {isLoading ? (
                <ProductsLoadingSkeleton count={8} />
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white py-12 text-center text-neutral-600">
                  No products found for these filters.
                </div>
              )}
            </div>

            <div ref={sentinelRef} className="h-8" />
            {isLoading && products.length > 0 && (
              <div className="mt-8 text-center text-sm text-neutral-600">Loading more products...</div>
            )}

            {products.length > 0 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-1 text-center text-sm text-neutral-600 sm:flex-row">
                <span>{products.length} product{products.length === 1 ? "" : "s"} loaded</span>
                {currentPagination.has_more && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>Scroll to load more</span>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function ProductsLoadingSkeleton({ count = 12 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="aspect-[3/4] bg-neutral-200 rounded-lg animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
        </div>
      ))}
    </>
  )
}
