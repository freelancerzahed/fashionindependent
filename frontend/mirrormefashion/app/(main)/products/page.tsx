"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/components/product-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, Filter, X } from "lucide-react"
import { products as initialProducts } from "@/data/products"
import type { Product } from "@/lib/api/types"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortOrder, setSortOrder] = useState("default")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      let tempProducts = [...initialProducts]

      // Filter by search term
      if (searchTerm) {
        tempProducts = tempProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Filter by category
      if (category !== "all") {
        tempProducts = tempProducts.filter((product) => product.category === category)
      }

      // Filter by price range
      tempProducts = tempProducts.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

      // Sort products
      if (sortOrder === "price-asc") {
        tempProducts.sort((a, b) => a.price - b.price)
      } else if (sortOrder === "price-desc") {
        tempProducts.sort((a, b) => b.price - a.price)
      } else if (sortOrder === "name-asc") {
        tempProducts.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortOrder === "name-desc") {
        tempProducts.sort((a, b) => b.name.localeCompare(a.name))
      }

      setFilteredProducts(tempProducts)
      setLoading(false)
    }, 500) // Simulate network delay
    return () => clearTimeout(timer)
  }, [searchTerm, category, priceRange, sortOrder])

  const handleClearFilters = () => {
    setSearchTerm("")
    setCategory("all")
    setPriceRange([0, 500])
    setSortOrder("default")
  }

  const allCategories = Array.from(new Set(initialProducts.map((p) => p.category)))

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-6">
      <h1 className="text-4xl font-bold text-center mb-8">Explore Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={handleClearFilters}>
              <X className="h-5 w-5" />
              <span className="sr-only">Clear Filters</span>
            </Button>
          </div>

          <div className="mb-6">
            <Label htmlFor="search-products" className="mb-2 block text-lg font-medium">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="search-products"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="category-select" className="mb-2 block text-lg font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label htmlFor="price-range" className="mb-4 block text-lg font-medium">
              Price Range
            </Label>
            <Slider
              id="price-range"
              min={0}
              max={500}
              step={10}
              value={priceRange}
              onValueChange={(val: number[]) => setPriceRange(val)}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="sort-order" className="mb-2 block text-lg font-medium">
              Sort By
            </Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger id="sort-order">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
              <Button onClick={handleClearFilters} className="mt-4 bg-red-600 hover:bg-red-700">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
