import { Suspense } from "react"
import { ShopPageClient } from "@/components/shop-page-client"
import { getCampaignPrice } from "@/lib/campaign-pricing"
import { BACKEND_URL } from "@/config"

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

function resolveCampaignImage(productImages: any) {
  if (!productImages || !Array.isArray(productImages) || productImages.length === 0) {
    return '/placeholder.svg'
  }

  const firstImage = productImages[0]
  const imagePath = typeof firstImage === 'string'
    ? firstImage
    : firstImage?.path || firstImage?.url || ''

  if (!imagePath) {
    return '/placeholder.svg'
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    const parsed = new URL(imagePath)
    const pathname = parsed.pathname
    if (pathname.includes('/storage/')) {
      return `/api/storage/${pathname.substring(pathname.indexOf('/storage/') + 9)}`
    }
    return pathname
  }

  const normalizedPath = imagePath.replace(/^\/+/, '')
  if (normalizedPath.includes('storage/')) {
    return `/api/storage/${normalizedPath.substring(normalizedPath.indexOf('storage/') + 8)}`
  }

  return normalizedPath.startsWith('/') ? normalizedPath : `/api/storage/${normalizedPath}`
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
    if (category) params.append('category', category)
    params.append('page', page || '1')
    params.append('per_page', '12')

    const url = `${BACKEND_URL}/campaign/active?${params.toString()}`

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
      const errorText = await response.text()
      console.error('[ShopPage] API error response:', errorText)
      throw new Error(`API error: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const responseText = await response.text()
      console.error('[ShopPage] Non-JSON response:', responseText.substring(0, 200))

      if (responseText.includes('<b>Warning</b>') || responseText.includes('Fatal error')) {
        console.error('[ShopPage] Backend PHP Error detected')
        throw new Error('Backend server error: Please check the server logs. Run: composer dump-autoload')
      }

      throw new Error(`Expected JSON but got ${contentType}`)
    }

    const data = await response.json()
    const campaigns = Array.isArray(data.data) ? data.data : []

    return {
      status: true,
      data: campaigns,
      pagination: data.pagination || {
        page: 1,
        per_page: 12,
        total: campaigns.length,
        total_pages: 1,
        has_more: false,
      }
    }

  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      status: false,
      data: [],
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

  let pagination = {
    page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
    has_more: false,
  }

  if (productsResponse.pagination) {
    const paginated = productsResponse.pagination
    pagination = {
      page: paginated.page || 1,
      per_page: paginated.per_page || 12,
      total: paginated.total || 0,
      total_pages: paginated.total_pages || 0,
      has_more: paginated.has_more || false,
    }
  }

  const initialProducts = (productsResponse.data || [])
    .filter((campaign: any) => campaign.is_funded)
    .map((campaign: any) => {
      const campaignPrice = getCampaignPrice(campaign)
      return {
        id: campaign.id,
        slug: String(campaign.id),
        name: campaign.product_name || campaign.title,
        title: campaign.title,
        thumbnail_image: resolveCampaignImage(campaign.product_images),
        image: resolveCampaignImage(campaign.product_images),
        stroked_price: 0,
        main_price: campaignPrice,
        price: campaignPrice,
        discount: 'Limited Drop',
        rating: Number(campaign.upvote_percentage || 0),
        sales: Number(campaign.backer_count || 0),
        description: campaign.description || '',
        isCampaign: true,
        availabilityLabel: 'Now Available',
        statusLabel: 'This campaign has reached its goal and this product is now available for sale.',
        href: `/checkout?campaignId=${campaign.id}&pledgeOptionId=buy-now&quantity=1`,
        detailsHref: `/campaign/${campaign.id}`,
        ctaLabel: 'Buy Now',
      }
    })

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
        {/* Hero */}
        <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-center">Limited Drop</h1>

            <div className="max-w-2xl mx-auto relative">
              <p>What is the Limited Drop?</p>
            </div>
          </div>
        </section>
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
