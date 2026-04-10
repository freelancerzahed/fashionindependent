"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/components/product-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Shirt, ShoppingBag, Heart, RefreshCw, TrendingUp, Star } from "lucide-react"
import { products as initialProducts } from "@/data/products"
import type { Product } from "@/lib/api/types"

export default function RecommendationsPage() {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"outfits" | "products" | "styles">("outfits")

  const fetchRecommendations = async () => {
    setLoading(true)
    // Simulate API call for recommendations
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simple mock logic for recommendations based on tab
    let recommendations: Product[] = []
    if (activeTab === "outfits") {
      // Return a mix of products that could form an outfit
      recommendations = initialProducts
        .filter((p) => ["dress", "shoes", "accessories"].includes(p.category))
        .slice(0, 6)
    } else if (activeTab === "products") {
      // Return a general selection of products
      recommendations = initialProducts.slice(0, 9)
    } else if (activeTab === "styles") {
      // Return products based on a "style" (e.g., minimalist, casual)
      recommendations = initialProducts
        .filter((p) => p.name.includes("Minimal") || p.name.includes("Casual"))
        .slice(0, 6)
    }
    setRecommendedProducts(recommendations)
    setLoading(false)
  }

  useEffect(() => {
    fetchRecommendations()
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <main className="max-w-6xl mx-auto space-y-6 py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary-200" />
                <span className="text-primary-200 text-sm font-medium">AI POWERED</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Personalized Recommendations</h1>
              <p className="text-primary-100 text-sm md:text-base">
                Discover products and outfits tailored to your style and body shape
              </p>
            </div>
            <Button
              onClick={fetchRecommendations}
              variant="outline"
              className="text-primary-600 border-white bg-white hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary-100 bg-gradient-to-br from-white to-primary-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-2xl font-bold text-primary-700">94%</span>
              </div>
              <p className="text-sm text-primary-600">Match Accuracy</p>
            </CardContent>
          </Card>
          <Card className="border-primary-100 bg-gradient-to-br from-white to-primary-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-2xl font-bold text-primary-700">4.8</span>
              </div>
              <p className="text-sm text-primary-600">User Rating</p>
            </CardContent>
          </Card>
          <Card className="border-primary-100 bg-gradient-to-br from-white to-primary-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-2xl font-bold text-primary-700">1.2k</span>
              </div>
              <p className="text-sm text-primary-600">Items Loved</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="outfits" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-primary-100">
            <TabsTrigger
              value="outfits"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              <Shirt className="h-4 w-4 mr-2" /> Outfits
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              <ShoppingBag className="h-4 w-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger
              value="styles"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              <Sparkles className="h-4 w-4 mr-2" /> Styles
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-6">
            <Card className="border-primary-200 bg-gradient-to-br from-white to-primary-50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary-200" />
                  Recommended {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse border border-primary-100"
                      >
                        <div className="w-full h-48 bg-primary-100"></div>
                        <div className="p-4">
                          <div className="h-4 bg-primary-100 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-primary-100 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recommendedProducts.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-primary-600 text-sm">
                        Showing {recommendedProducts.length} personalized recommendations
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-primary-400 fill-current" />
                        ))}
                        <span className="text-sm text-primary-600 ml-1">Highly Recommended</span>
                      </div>
                    </div>
                    <ProductGrid products={recommendedProducts} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-primary-600">
                    <Heart className="mx-auto h-16 w-16 mb-4 text-primary-400" />
                    <p className="text-xl font-semibold mb-2">No recommendations available</p>
                    <p className="text-sm text-primary-500 mb-4">
                      Please ensure your profile and body measurements are up-to-date for better suggestions.
                    </p>
                    <Button onClick={fetchRecommendations} className="bg-primary-600 hover:bg-primary-700 text-white">
                      <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Info Section */}
        <Card className="border-primary-200 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary-200" />
              <h3 className="text-lg font-semibold mb-2">How Our AI Works</h3>
              <p className="text-primary-100 text-sm max-w-2xl mx-auto">
                Our advanced AI analyzes your style preferences, body measurements, purchase history, and current trends
                to provide personalized recommendations that match your unique taste and lifestyle.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
