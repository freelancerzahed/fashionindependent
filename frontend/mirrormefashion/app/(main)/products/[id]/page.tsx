import Image from "next/image"
import { notFound } from "next/navigation"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/api/database"
import { formatCurrency } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AddToWishlistButton } from "@/components/add-to-wishlist-button"

interface ProductDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const product = await db.products.findUnique(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image Gallery */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 w-full max-w-md">
            {product.images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden border cursor-pointer">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.brand}</p>
            <div className="flex items-center mt-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-current" : "fill-transparent stroke-current"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600 text-sm">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-gray-900">{formatCurrency(product.price, product.currency)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <Separator />

          {/* Product Options (Sizes, Colors) */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Size:</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <Button key={size} variant="outline" className="min-w-[40px] bg-transparent">
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Color:</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    className="min-w-[40px] capitalize bg-transparent"
                    style={{ backgroundColor: color.toLowerCase() }}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Information */}
          <div className="text-sm text-gray-600">
            {product.inStock ? (
              <span className="text-green-600">In Stock ({product.stockQuantity} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <AddToCartButton product={product} disabled={!product.inStock} />
            <AddToWishlistButton product={product} />
          </div>

          <Separator />

          {/* Product Tabs (Description, Reviews, Shipping) */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4 text-gray-700 leading-relaxed">
              <p>{product.description}</p>
              <p className="mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              {/* Placeholder for reviews */}
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-2 text-sm text-gray-600">by Jane Doe on 2023-10-25</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    "Absolutely love this product! It exceeded my expectations in every way. Highly recommend."
                  </p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-transparent stroke-current" />
                    <span className="ml-2 text-sm text-gray-600">by John Smith on 2023-10-20</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    "Good quality for the price. Shipping was a bit slow, but overall satisfied."
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4 text-gray-700 leading-relaxed">
              <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
              <p>
                Standard shipping: 3-5 business days.
                <br />
                Express shipping: 1-2 business days.
                <br />
                Free shipping on orders over $50.
              </p>
              <p className="mt-2">
                Returns are accepted within 30 days of purchase. Please see our full return policy for more details.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
