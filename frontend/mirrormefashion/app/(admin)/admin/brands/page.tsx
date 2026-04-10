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
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Tag,
  TrendingUp,
  Package,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Crown,
  Zap,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const brands = [
  {
    id: "1",
    name: "Fashion Co",
    slug: "fashion-co",
    description: "Premium fashion brand with modern designs",
    productCount: 156,
    status: "active",
    logo: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-15",
    website: "https://fashionco.com",
    tier: "premium",
    revenue: 125000,
  },
  {
    id: "2",
    name: "Basic Wear",
    slug: "basic-wear",
    description: "Affordable everyday clothing essentials",
    productCount: 234,
    status: "active",
    logo: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-14",
    website: "https://basicwear.com",
    tier: "standard",
    revenue: 89000,
  },
  {
    id: "3",
    name: "Denim Co",
    slug: "denim-co",
    description: "Specialized denim and casual wear",
    productCount: 89,
    status: "active",
    logo: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-13",
    website: "https://denimco.com",
    tier: "premium",
    revenue: 156000,
  },
  {
    id: "4",
    name: "Luxury Bags",
    slug: "luxury-bags",
    description: "High-end leather goods and accessories",
    productCount: 45,
    status: "active",
    logo: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-12",
    website: "https://luxurybags.com",
    tier: "luxury",
    revenue: 298000,
  },
  {
    id: "5",
    name: "Street Style",
    slug: "street-style",
    description: "Urban streetwear and trendy fashion",
    productCount: 67,
    status: "inactive",
    logo: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-11",
    website: "https://streetstyle.com",
    tier: "standard",
    revenue: 45000,
  },
]

const tabs = [
  { id: "all", label: "All", icon: Tag, count: brands.length },
  { id: "active", label: "Active", icon: Tag, count: brands.filter((b) => b.status === "active").length },
  { id: "inactive", label: "Inactive", icon: Tag, count: brands.filter((b) => b.status === "inactive").length },
  { id: "luxury", label: "Luxury", icon: Crown, count: brands.filter((b) => b.tier === "luxury").length },
  { id: "premium", label: "Premium", icon: Award, count: brands.filter((b) => b.tier === "premium").length },
  { id: "standard", label: "Standard", icon: Star, count: brands.filter((b) => b.tier === "standard").length },
  { id: "trending", label: "Trending", icon: TrendingUp, count: 8 },
  { id: "featured", label: "Featured", icon: Zap, count: 12 },
]

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTier, setSelectedTier] = useState("all")
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false)
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || brand.status === selectedStatus
    const matchesTier = selectedTier === "all" || brand.tier === selectedTier
    const matchesTab =
      activeTab === "all" ||
      brand.status === activeTab ||
      brand.tier === activeTab ||
      (activeTab === "trending" && brand.revenue > 100000) ||
      (activeTab === "featured" && brand.productCount > 100)

    return matchesSearch && matchesStatus && matchesTier && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
      case "inactive":
        return (
          <Badge variant="secondary" className="text-xs">
            Inactive
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

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "luxury":
        return (
          <Badge className="bg-primary-100 text-primary-800 text-xs">
            <Crown className="w-3 h-3 mr-1" />
            Luxury
          </Badge>
        )
      case "premium":
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            <Award className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )
      case "standard":
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">
            <Star className="w-3 h-3 mr-1" />
            Standard
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {tier}
          </Badge>
        )
    }
  }

  const totalRevenue = brands.reduce((sum, brand) => sum + brand.revenue, 0)
  const totalProducts = brands.reduce((sum, brand) => sum + brand.productCount, 0)

  const statsCards = [
    { title: "Total Brands", value: brands.length.toString(), icon: Tag, color: "bg-blue-500" },
    {
      title: "Active Brands",
      value: brands.filter((b) => b.status === "active").length.toString(),
      icon: Tag,
      color: "bg-green-500",
    },
    { title: "Total Products", value: totalProducts.toString(), icon: Package, color: "bg-primary-500" },
    {
      title: "Total Revenue",
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-2 pr-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl font-bold truncate">Brands</h1>
          <p className="text-sm text-gray-600 truncate">{filteredBrands.length} brands</p>
        </div>
        <Dialog open={isAddBrandOpen} onOpenChange={setIsAddBrandOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full flex-shrink-0 ml-2 h-8 w-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2">
            <DialogHeader>
              <DialogTitle className="text-base">Add New Brand</DialogTitle>
            </DialogHeader>
            <AddBrandForm onClose={() => setIsAddBrandOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Brand Management</h1>
          <p className="text-gray-600">Manage your brand partners and suppliers</p>
        </div>
        <Dialog open={isAddBrandOpen} onOpenChange={setIsAddBrandOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
            </DialogHeader>
            <AddBrandForm onClose={() => setIsAddBrandOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="w-full max-w-[85vw] overflow-hidden md:hidden mx-auto">
        <Swiper modules={[FreeMode]} spaceBetween={8} slidesPerView="auto" freeMode={true} className="px-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <SwiperSlide key={tab.id} className="!w-auto">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mb-1" />
                  <span className="text-xs font-medium leading-tight truncate max-w-full px-1">{tab.label}</span>
                  <Badge
                    variant="secondary"
                    className={`absolute -top-1 -right-1 text-xs min-w-4 h-4 px-1 ${
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"
                    }`}
                  >
                    {tab.count > 99 ? "99+" : tab.count}
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
      <div className="md:hidden px-2">
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-4 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {(() => {
                  const IconComponent = statsCards[currentStatsIndex].icon
                  return <IconComponent className="w-5 h-5 flex-shrink-0" />
                })()}
                <span className="text-sm font-medium opacity-90 truncate">{statsCards[currentStatsIndex].title}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStats}
                  className="text-white hover:bg-white/20 p-1 h-7 w-7"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextStats}
                  className="text-white hover:bg-white/20 p-1 h-7 w-7"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-2xl md:text-3xl font-bold mb-2">{statsCards[currentStatsIndex].value}</div>
          </div>

          <div className="flex justify-center mt-3 gap-1">
            {statsCards.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentStatsIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Stats Cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 ${stat.color} rounded-full flex items-center justify-center`}>
                  {(() => {
                    const IconComponent = stat.icon
                    return <IconComponent className="w-4 h-4 text-white" />
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mx-2 md:mx-0">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-2 md:gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brands Display */}
      <Card className="mx-2 md:mx-0">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-sm md:text-base">Brands ({filteredBrands.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {filteredBrands.map((brand) => (
              <div key={brand.id} className="border-b p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={brand.logo || "/placeholder.svg"}
                    alt={brand.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate">{brand.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{brand.description}</p>
                    <p className="text-xs font-mono text-gray-500 mt-1 truncate">{brand.slug}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-full flex-shrink-0 h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Products
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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {getStatusBadge(brand.status)}
                    {getTierBadge(brand.tier)}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm">${brand.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{brand.productCount} products</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={brand.logo || "/placeholder.svg"}
                          alt={brand.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{brand.name}</p>
                          <p className="text-sm text-gray-500">{brand.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{brand.slug}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        {brand.productCount}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${brand.revenue.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(brand.status)}</TableCell>
                    <TableCell>{getTierBadge(brand.tier)}</TableCell>
                    <TableCell>{new Date(brand.createdAt).toLocaleDateString()}</TableCell>
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
                            View Products
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
  )
}

function AddBrandForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brandName">Brand Name</Label>
          <Input id="brandName" placeholder="Enter brand name" className="rounded-xl" />
        </div>
        <div>
          <Label htmlFor="brandSlug">Slug</Label>
          <Input id="brandSlug" placeholder="brand-slug" className="rounded-xl" />
        </div>
      </div>

      <div>
        <Label htmlFor="brandDescription">Description</Label>
        <Textarea id="brandDescription" placeholder="Enter brand description" rows={3} className="rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" placeholder="https://brand.com" className="rounded-xl" />
        </div>
        <div>
          <Label htmlFor="tier">Brand Tier</Label>
          <Select>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Brand Logo</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Tag className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Drop logo here or click to upload</p>
          <Button variant="outline" size="sm" className="mt-2 rounded-xl bg-transparent">
            Choose File
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="active" defaultChecked />
        <Label htmlFor="active">Brand is active</Label>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="w-full md:w-auto rounded-xl bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="w-full md:w-auto rounded-xl">
          Add Brand
        </Button>
      </div>
    </form>
  )
}
