import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, ShoppingCart, ChevronLeft } from "lucide-react"

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string
  }>
}

async function fetchProductDetails(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/1`,
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[ProductDetails] API response:", data)
    return data.data?.[0] || null
  } catch (error) {
    console.error("[ProductDetails] Error fetching product:", error)
    return null
  }
}

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const { slug } = await params
  const product = await fetchProductDetails(slug)

  return {
    title: product?.name || "Product",
    description: product?.description?.substring(0, 160),
  }
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params
  const product = await fetchProductDetails(slug)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/shop" className="text-blue-600 hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const imageUrl = product.thumbnail_image || "/placeholder.svg"
  const price = parseFloat(String(product.main_price || product.unit_price || 0))
  const originalPrice = parseFloat(String(product.stroked_price || 0))
  const discount = product.discount || 0
  const rating = parseFloat(String(product.rating || 0))
  const sales = product.num_of_sale || 0

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden relative">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="inline-flex items-center gap-2 w-fit">
                <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  Save {discount}%
                </span>
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.round(rating) ? "text-yellow-400 text-lg" : "text-neutral-300 text-lg"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-neutral-600">
                  {rating.toFixed(1)} ({sales} sales)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">${price.toFixed(2)}</span>
                {originalPrice > price && (
                  <span className="text-lg text-neutral-500 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.current_stock > 0 ? (
                <p className="text-green-600 mt-2">In Stock ({product.current_stock} available)</p>
              ) : (
                <p className="text-red-600 mt-2">Out of Stock</p>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="w-20 px-4 py-3 border rounded-lg text-center"
              />
              <Button
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-6 text-lg"
                disabled={product.current_stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-neutral-600 text-sm">Category</p>
                    <p className="font-semibold">{product.category?.name || "General"}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Stock</p>
                    <p className="font-semibold">{product.current_stock} units</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Rating</p>
                    <p className="font-semibold">{rating.toFixed(1)} / 5</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Sold</p>
                    <p className="font-semibold">{sales} items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{product.description || "No description available"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Specifications</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-neutral-600">Product ID:</dt>
                        <dd className="font-mono">{product.id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-600">Category:</dt>
                        <dd>{product.category?.name || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-600">Unit Price:</dt>
                        <dd>${product.unit_price?.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-600">Discount:</dt>
                        <dd>{product.discount || 0}%</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Availability</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-neutral-600">In Stock:</dt>
                        <dd className={product.current_stock > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {product.current_stock > 0 ? "Yes" : "No"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-600">Quantity Available:</dt>
                        <dd>{product.current_stock}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-600">Sales:</dt>
                        <dd>{product.num_of_sale || 0}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products Section */}
        <div className="mt-16 py-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-neutral-200" />
                <CardContent className="p-3">
                  <p className="text-sm font-semibold line-clamp-2">Related Product {i}</p>
                  <p className="text-lg font-bold mt-2">$29.99</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
