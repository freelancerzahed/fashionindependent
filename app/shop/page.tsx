import { Suspense } from "react"
import { ShopPageClient } from "@/components/shop-page-client"

export const revalidate = 3600 // ISR: revalidate every hour

interface ShopPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    sort_by?: string
    sort_order?: string
    page?: string
  }>
}

async function fetchProducts(
  search?: string,
  category?: string,
  sortBy?: string,
  sortOrder?: string,
  page?: string
) {
  try {
    const params = new URLSearchParams()
    
    if (search) params.append('search', search)
    params.append('page', page || '1')
    params.append('per_page', '12')

    // Build the correct endpoint based on category
    let url = `${process.env.NEXT_PUBLIC_API_URL}/products`
    if (category) {
      url += `/category/${category}`
    }
    url += `?${params.toString()}`

    console.log('[ShopPage] Fetching from:', url)

    const response = await fetch(url, {
      next: { 
        revalidate: 3600,
        tags: ['products']
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      // Try to get error details
      const errorText = await response.text()
      console.error('[ShopPage] API error response:', errorText)
      throw new Error(`API error: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const responseText = await response.text()
      console.error('[ShopPage] Non-JSON response:', responseText.substring(0, 200))
      throw new Error(`Expected JSON but got ${contentType}: ${responseText.substring(0, 200)}`)
    }

    const data = await response.json()
    console.log('[ShopPage] API response:', data)
    return data

  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      status: false,
      data: [],
      meta: {
        pagination: {
          page: 1,
          per_page: 12,
          total: 0,
          total_pages: 0,
          has_more: false,
        }
      }
    }
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  
  // Fetch products with current filters
  const productsResponse = await fetchProducts(
    params.search,
    params.category,
    params.sort_by || 'name',
    params.sort_order || 'asc',
    params.page
  )

  // Extract pagination from API response (handles Laravel pagination format)
  let pagination = {
    page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
    has_more: false,
  }

  // Laravel paginate() returns meta with current_page, last_page, total, per_page
  if (productsResponse.meta) {
    const meta = productsResponse.meta
    pagination = {
      page: meta.current_page || 1,
      per_page: meta.per_page || 12,
      total: meta.total || 0,
      total_pages: meta.last_page || 0,
      has_more: (meta.current_page || 1) < (meta.last_page || 0),
    }
  }

  // Transform API response from ProductMiniCollection resource
  const initialProducts = (productsResponse.data || []).map((product: any) => ({
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

  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopPageClient 
        initialProducts={initialProducts}
        pagination={pagination}
        initialSearch={params.search || ''}
        initialCategory={params.category || ''}
        initialSortBy={params.sort_by || 'name'}
        initialSortOrder={params.sort_order || 'asc'}
      />
    </Suspense>
  )
}

function ShopPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            {/* Search Bar Skeleton */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <div className="h-12 bg-neutral-200 rounded-md animate-pulse" />
              </div>
            </div>

            {/* Filters Skeleton */}
            <div className="mb-12 hidden md:flex items-center justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-32 bg-neutral-200 rounded-md animate-pulse" />
              ))}
            </div>

            {/* Campaign Grid Skeleton */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-neutral-200 rounded-lg animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
