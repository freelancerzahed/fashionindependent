"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Grid,
  List,
  ChevronUp,
  X,
  SlidersHorizontal,
  Sparkles,
  Scan,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react"
import { products } from "@/data/products"
import ProductCard from "@/components/product-card"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get actual categories from products data
  const categories = Array.from(new Set(products.map((product) => product.category)))

  // Get actual price range from products
  const actualPriceRange = {
    min: Math.min(...products.map((p) => p.price)),
    max: Math.max(...products.map((p) => p.price)),
  }

  useEffect(() => {
    setPriceRange([actualPriceRange.min, actualPriceRange.max])
  }, [])

  // Get available sizes and colors from products
  const availableSizes = Array.from(new Set(products.flatMap((p) => p.sizes || [])))
  const availableColors = Array.from(new Set(products.flatMap((p) => p.colors || [])))

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const matchesSize = selectedSizes.length === 0 || selectedSizes.some((size) => product.sizes?.includes(size))
    const matchesColor = selectedColors.length === 0 || selectedColors.some((color) => product.colors?.includes(color))
    return matchesSearch && matchesPrice && matchesCategory && matchesSize && matchesColor
  })

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([actualPriceRange.min, actualPriceRange.max])
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    searchQuery ||
    priceRange[0] !== actualPriceRange.min ||
    priceRange[1] !== actualPriceRange.max

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-8 w-8 text-primary-200" />
              <h1 className="text-4xl md:text-5xl font-bold">Mirror Me Fashion</h1>
              <Sparkles className="h-8 w-8 text-primary-200" />
            </div>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Discover your perfect style with AI-powered fashion recommendations tailored to your unique body shape and
              preferences
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Scan className="h-10 w-10 text-primary-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sofia AI Assistant</h3>
                <p className="text-primary-100 text-sm">
                  Our AI analyzes your body shape and style preferences to recommend the perfect fit
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Target className="h-10 w-10 text-primary-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Personalized Styling</h3>
                <p className="text-primary-100 text-sm">
                  Get outfit suggestions that complement your unique features and lifestyle
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <TrendingUp className="h-10 w-10 text-primary-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trend Insights</h3>
                <p className="text-primary-100 text-sm">
                  Stay ahead with curated fashion trends that match your personal style
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-3">
                <Zap className="h-5 w-5 mr-2" />
                Try Sofia AI Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-3 bg-transparent"
              >
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm mb-8">
          <div className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 focus:border-primary-600 focus:ring-primary-600"
                />
              </div>

              <div className="flex gap-2 items-center overflow-x-auto pb-2 md:pb-0">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className={`border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white bg-transparent whitespace-nowrap ${hasActiveFilters ? "bg-primary-50" : ""}`}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters{" "}
                      {hasActiveFilters &&
                        `(${selectedCategories.length + selectedSizes.length + selectedColors.length})`}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="text-primary-600">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        actualPriceRange={actualPriceRange}
                        availableSizes={availableSizes}
                        selectedSizes={selectedSizes}
                        onSizeToggle={handleSizeToggle}
                        availableColors={availableColors}
                        selectedColors={selectedColors}
                        onColorToggle={handleColorToggle}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 focus:border-primary-600 focus:ring-primary-600">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-primary-600 hover:bg-primary-700" : ""}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-primary-600 hover:bg-primary-700" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex gap-2 flex-wrap items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="bg-primary-600 text-white hover:bg-primary-700 cursor-pointer"
                    onClick={() => handleCategoryChange(category, false)}
                  >
                    {category} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {selectedSizes.map((size) => (
                  <Badge
                    key={size}
                    variant="secondary"
                    className="bg-primary-600 text-white hover:bg-primary-700 cursor-pointer"
                    onClick={() => handleSizeToggle(size)}
                  >
                    Size: {size} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {selectedColors.map((color) => (
                  <Badge
                    key={color}
                    variant="secondary"
                    className="bg-primary-600 text-white hover:bg-primary-700 cursor-pointer"
                    onClick={() => handleColorToggle(color)}
                  >
                    {color} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="bg-primary-600 text-white hover:bg-primary-700 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  >
                    Search: "{searchQuery}" <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-primary-600 hover:bg-primary-50 h-6 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                actualPriceRange={actualPriceRange}
                availableSizes={availableSizes}
                selectedSizes={selectedSizes}
                onSizeToggle={handleSizeToggle}
                availableColors={availableColors}
                selectedColors={selectedColors}
                onColorToggle={handleColorToggle}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 font-medium">
                Showing <span className="text-primary-600 font-semibold">{sortedProducts.length}</span> of{" "}
                <span className="font-semibold">{products.length}</span> products
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <Button onClick={clearAllFilters} className="bg-primary-600 hover:bg-primary-700">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 bg-primary-600 hover:bg-primary-700 shadow-lg"
            size="icon"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  actualPriceRange,
  availableSizes,
  selectedSizes,
  onSizeToggle,
  availableColors,
  selectedColors,
  onColorToggle,
}: {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (category: string, checked: boolean) => void
  priceRange: number[]
  onPriceChange: (range: number[]) => void
  actualPriceRange: { min: number; max: number }
  availableSizes: string[]
  selectedSizes: string[]
  onSizeToggle: (size: string) => void
  availableColors: string[]
  selectedColors: string[]
  onColorToggle: (color: string) => void
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-primary-600 text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-900">Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-3">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                  className="border-primary-600 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                />
                <label htmlFor={category} className="text-sm cursor-pointer hover:text-primary-600 transition-colors">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-900">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={onPriceChange}
              max={actualPriceRange.max}
              min={actualPriceRange.min}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>${priceRange[0].toFixed(2)}</span>
              <span>${priceRange[1].toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sizes */}
        {availableSizes.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSizeToggle(size)}
                  className={
                    selectedSizes.includes(size)
                      ? "bg-primary-600 hover:bg-primary-700"
                      : "border-gray-300 hover:border-primary-600 hover:text-primary-600"
                  }
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {availableColors.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColors.includes(color) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onColorToggle(color)}
                  className={
                    selectedColors.includes(color)
                      ? "bg-primary-600 hover:bg-primary-700"
                      : "border-gray-300 hover:border-primary-600 hover:text-primary-600"
                  }
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
