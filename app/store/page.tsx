"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockStoreProducts } from "@/lib/data"
import { useState } from "react"
import { Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([])

  const categories = ["all", "Womenswear", "Menswear", "Kidswear", "Wearables"]

  const filteredProducts = mockStoreProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (productId: string) => {
    const existing = cart.find((item) => item.productId === productId)
    if (existing) {
      setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { productId, quantity: 1 }])
    }
  }

  const cartTotal = cart.reduce((sum, item) => {
    const product = mockStoreProducts.find((p) => p.id === item.productId)
    return sum + (product?.price || 0) * item.quantity
  }, 0)

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Fashion Store</h1>
            <p className="text-lg text-muted-foreground">
              Shop products from successful campaigns. All items are from verified independent designers.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card className="p-6 sticky top-20">
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Inventory Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>In Stock</span>
                      <span className="font-semibold text-green-600">
                        {mockStoreProducts.filter((p) => p.status === "in-stock").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low Stock</span>
                      <span className="font-semibold text-yellow-600">
                        {mockStoreProducts.filter((p) => p.status === "low-stock").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Out of Stock</span>
                      <span className="font-semibold text-red-600">
                        {mockStoreProducts.filter((p) => p.status === "out-of-stock").length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-12 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            product.status === "in-stock"
                              ? "bg-green-100 text-green-800"
                              : product.status === "low-stock"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === "in-stock"
                            ? "In Stock"
                            : product.status === "low-stock"
                              ? "Low Stock"
                              : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold">${product.price}</span>
                        <span className="text-xs text-muted-foreground">{product.sold} sold</span>
                      </div>

                      <Button
                        onClick={() => addToCart(product.id)}
                        disabled={product.status === "out-of-stock"}
                        className="w-full"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <Card className="fixed bottom-20 right-4 p-4 w-80 shadow-lg">
              <h3 className="font-semibold mb-3">Shopping Cart ({cart.length})</h3>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {cart.map((item) => {
                  const product = mockStoreProducts.find((p) => p.id === item.productId)
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>{product?.name}</span>
                      <span>${((product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="border-t pt-3 mb-3">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout?type=store">
                <Button className="w-full">Checkout</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
