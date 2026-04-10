"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Upload,
  Star,
  Package,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Archive,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const products = [
  {
    id: "1",
    name: "Summer Floral Dress",
    sku: "SFD-001",
    category: "Dresses",
    brand: "Fashion Co",
    price: 89.99,
    stock: 45,
    status: "active",
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Classic White Tee",
    sku: "CWT-002",
    category: "Tops",
    brand: "Basic Wear",
    price: 24.99,
    stock: 120,
    status: "active",
    rating: 4.5,
    reviews: 89,
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "Denim Jacket",
    sku: "DJ-003",
    category: "Outerwear",
    brand: "Denim Co",
    price: 129.99,
    stock: 0,
    status: "out_of_stock",
    rating: 4.7,
    reviews: 67,
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Black Skinny Jeans",
    sku: "BSJ-004",
    category: "Bottoms",
    brand: "Denim Co",
    price: 79.99,
    stock: 23,
    status: "low_stock",
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "Leather Handbag",
    sku: "LH-005",
    category: "Accessories",
    brand: "Luxury Bags",
    price: 199.99,
    stock: 15,
    status: "active",
    rating: 4.9,
    reviews: 43,
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-11",
  },
]

const tabs = [
  { id: "all", label: "All", icon: Package, count: 1234 },
  { id: "active", label: "Active", icon: Package, count: 1156 },
  { id: "low_stock", label: "Low", icon: AlertTriangle, count: 23 },
  { id: "out_of_stock", label: "Out", icon: AlertTriangle, count: 55 },
  { id: "draft", label: "Draft", icon: Edit, count: 12 },
  { id: "archived", label: "Archive", icon: Archive, count: 8 },
  { id: "featured", label: "Featured", icon: Star, count: 25 },
  { id: "trending", label: "Trending", icon: TrendingUp, count: 18 },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
    const matchesTab = activeTab === "all" || product.status === activeTab

    return matchesSearch && matchesCategory && matchesStatus && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
            Active
          </Badge>
        )
      case "out_of_stock":
        return (
          <Badge variant="destructive" className="text-xs">
            Out of Stock
          </Badge>
        )
      case "low_stock":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
            Low Stock
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  const statsCards = [
    { title: "Total Products", value: "1,234", icon: Package, color: "bg-primary-500" },
    { title: "Active Products", value: "1,156", icon: Package, color: "bg-green-500" },
    { title: "Low Stock", value: "23", icon: AlertTriangle, color: "bg-yellow-500" },
    { title: "Out of Stock", value: "55", icon: AlertTriangle, color: "bg-primary-600" },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold truncate">Products</h1>
            <p className="text-sm md:text-base text-gray-600 truncate">Manage your product catalog</p>
          </div>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full flex-shrink-0 bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProductForm onClose={() => setIsAddProductOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="w-full max-w-[85vw] overflow-hidden md:hidden mx-auto">
          <Swiper modules={[FreeMode]} spaceBetween={6} slidesPerView="auto" freeMode={true} className="px-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <SwiperSlide key={tab.id} className="!w-auto">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium leading-tight">{tab.label}</span>
                    <Badge
                      variant="secondary"
                      className={`absolute -top-1 -right-1 text-xs min-w-5 h-5 px-1 ${
                        activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"
                      }`}
                    >
                      {tab.count > 999 ? "999+" : tab.count}
                    </Badge>
                  </button>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"}`}
                  >
                    {tab.count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Stats Slider */}
        <div className="md:hidden w-full px-4">
          <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {(() => {
                    const IconComponent = statsCards[currentStatsIndex].icon
                    return <IconComponent className="w-6 h-6 flex-shrink-0" />
                  })()}
                  <span className="text-sm font-medium opacity-90 truncate">{statsCards[currentStatsIndex].title}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStats}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextStats}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-3xl font-bold mb-2">{statsCards[currentStatsIndex].value}</div>
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {statsCards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStatsIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Stats Cards */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">{stat.title}</p>
                    <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} rounded-full flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = stat.icon
                      return <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between px-4 md:px-0">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`rounded-lg ${viewMode === "grid" ? "bg-primary-600 hover:bg-primary-700" : ""}`}
            >
              <Grid className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`rounded-lg ${viewMode === "list" ? "bg-primary-600 hover:bg-primary-700" : ""}`}
            >
              <List className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">List</span>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mx-4 md:mx-0">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 md:gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Dresses">Dresses</SelectItem>
                    <SelectItem value="Tops">Tops</SelectItem>
                    <SelectItem value="Bottoms">Bottoms</SelectItem>
                    <SelectItem value="Outerwear">Outerwear</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-48 rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        <Card className="mx-4 md:mx-0">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {/* Mobile Grid View */}
            {viewMode === "grid" && (
              <div className="md:hidden grid grid-cols-2 gap-3 p-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl border p-3 space-y-3">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-32 rounded-xl object-cover"
                      />
                      <div className="absolute top-2 right-2">{getStatusBadge(product.status)}</div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{product.brand}</p>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">${product.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Stock: {product.stock}</span>
                        <span>{product.reviews} reviews</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full rounded-xl bg-transparent">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile List View */}
            {viewMode === "list" && (
              <div className="md:hidden">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border-b p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                        <p className="text-xs font-mono text-gray-500">{product.sku}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="rounded-full flex-shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">${product.price}</span>
                        <span className={`text-sm ${product.stock <= 10 ? "text-red-600 font-medium" : ""}`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(product.status)}
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Desktop View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <span className={product.stock <= 10 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AddProductForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" placeholder="Enter product name" className="rounded-xl" />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" placeholder="Enter SKU" className="rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dresses">Dresses</SelectItem>
              <SelectItem value="tops">Tops</SelectItem>
              <SelectItem value="bottoms">Bottoms</SelectItem>
              <SelectItem value="outerwear">Outerwear</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" placeholder="Enter brand" className="rounded-xl" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter product description" rows={3} className="rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" placeholder="0.00" className="rounded-xl" />
        </div>
        <div>
          <Label htmlFor="comparePrice">Compare Price</Label>
          <Input id="comparePrice" type="number" placeholder="0.00" className="rounded-xl" />
        </div>
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input id="stock" type="number" placeholder="0" className="rounded-xl" />
        </div>
      </div>

      <div>
        <Label>Product Images</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Drop images here or click to upload</p>
          <Button variant="outline" size="sm" className="mt-2 rounded-xl bg-transparent">
            Choose Files
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="active" />
        <Label htmlFor="active">Product is active</Label>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="w-full md:w-auto rounded-xl bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="w-full md:w-auto rounded-xl bg-primary-600 hover:bg-primary-700">
          Add Product
        </Button>
      </div>
    </form>
  )
}
