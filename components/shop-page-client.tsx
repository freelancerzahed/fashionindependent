"use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useCallback, useMemo } from "react"
import { MobileTabs } from "@/components/mobile-tabs"
// Product type definition moved to component
import { useRouter, useSearchParams } from "next/navigation"

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
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPagination, setCurrentPagination] = useState(pagination || {
    page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
    has_more: false,
  })

  const filterTabs = [
    { id: "name", label: "Name (A-Z)" },
    { id: "total_sold", label: "Most Popular" },
    { id: "price", label: "Price" },
  ]

  const [activeFilter, setActiveFilter] = useState(initialSortBy)

  // Handle search with debounce
  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value)
      setCurrentPage(1)
      updateUrl(value, category, sortBy, sortOrder, 1)
    },
    [category, sortBy, sortOrder]
  )

  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId)
    setSortBy(filterId)
    setCurrentPage(1)
    updateUrl(searchTerm, category, filterId, sortOrder, 1)
  }

  // Update URL with current filters
  const updateUrl = useCallback(
    (search: string, cat: string, sort: string, order: string, page: number) => {
      const params = new URLSearchParams()
      
      if (search) params.append('search', search)
      if (cat) params.append('category', cat)
      if (sort && sort !== 'created_at') params.append('sort_by', sort)
      if (order && order !== 'desc') params.append('sort_order', order)
      if (page > 1) params.append('page', page.toString())

      router.push(`/shop?${params.toString()}`)
    },
    [router]
  )

  // Fetch products when filters change
  const fetchProducts = useCallback(
    async (search: string, cat: string, sort: string, order: string, page: number) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        
        if (search) params.append('search', search)
        params.append('page', page.toString())
        params.append('per_page', '12')

        let url = `${process.env.NEXT_PUBLIC_API_URL}/products`
        if (cat) {
          url += `/category/${cat}`
        }
        url += `?${params.toString()}`

        console.log('[ShopPageClient] Fetching from:', url)

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          }
        })

        if (!response.ok) throw new Error('Failed to fetch products')

        const data = await response.json()
        console.log('[ShopPageClient] Response received:', data)

        // Transform API response from ProductMiniCollection
        const transformed = (data.data || []).map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          title: product.name,
          thumbnail_image: product.thumbnail_image || '/placeholder.svg',
          image: product.thumbnail_image || '/placeholder.svg',
          stroked_price: parseFloat(product.stroked_price || 0),
          main_price: parseFloat(product.main_price || 0),
          price: parseFloat(product.main_price || 0),
          discount: product.discount || '0%',
          rating: product.rating || 0,
          sales: product.sales || 0,
          description: product.description || '',
        }))

        setProducts(transformed)
        
        // Handle Laravel pagination meta
        let paginationData = { page, per_page: 12, total: 0, total_pages: 0, has_more: false }
        if (data.meta) {
          paginationData = {
            page: data.meta.current_page || page,
            per_page: data.meta.per_page || 12,
            total: data.meta.total || 0,
            total_pages: data.meta.last_page || 0,
            has_more: (data.meta.current_page || page) < (data.meta.last_page || 0),
          }
        }
        
        setCurrentPagination(paginationData)
        setCurrentPage(paginationData.page)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Handle pagination
  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchProducts(searchTerm, category, sortBy, sortOrder, newPage)
      updateUrl(searchTerm, category, sortBy, sortOrder, newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [fetchProducts, updateUrl, searchTerm, category, sortBy, sortOrder]
  )

  // Pagination buttons
  const paginationPages = useMemo(() => {
    const pages = []
    const totalPages = currentPagination.total_pages
    const currentPageNum = currentPagination.page
    
    // Always show first page
    pages.push(1)
    
    // Show context around current page
    if (currentPageNum > 3) pages.push('...')
    
    for (let i = Math.max(2, currentPageNum - 1); i <= Math.min(totalPages - 1, currentPageNum + 1); i++) {
      if (i > 1) pages.push(i)
    }
    
    // Always show last page
    if (totalPages > 1) pages.push(totalPages)
    
    return pages
  }, [currentPagination])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="search"
                  placeholder="Search campaigns..."
                  className="pl-12 h-12 text-lg"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="mb-12 hidden md:flex items-center justify-center gap-4">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeFilter === tab.id ? "default" : "outline"}
                  onClick={() => handleFilterChange(tab.id)}
                  disabled={isLoading}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Mobile Filters */}
            <div className="mb-12 md:hidden">
              <MobileTabs
                tabs={filterTabs}
                activeTab={activeFilter}
                onTabChange={handleFilterChange}
              >
                {isLoading ? (
                  <ProductsLoadingSkeleton />
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-600">No products found</p>
                  </div>
                )}
              </MobileTabs>
            </div>

            {/* Product Grid */}
            <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {isLoading ? (
                <ProductsLoadingSkeleton count={12} />
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-neutral-600">No products found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {currentPagination.total_pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPagination.page - 1)}
                  disabled={currentPagination.page === 1 || isLoading}
                >
                  Previous
                </Button>

                {paginationPages.map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-neutral-600">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={page === currentPagination.page ? "default" : "outline"}
                      onClick={() => handlePageChange(page as number)}
                      disabled={isLoading}
                      size="sm"
                    >
                      {page}
                    </Button>
                  )
                ))}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPagination.page + 1)}
                  disabled={!currentPagination.has_more || isLoading}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Results Info */}
            {products.length > 0 && (
              <div className="mt-8 text-center text-sm text-neutral-600">
                Showing {products.length} of {currentPagination.total} products (Page {currentPagination.page} of {currentPagination.total_pages})
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
