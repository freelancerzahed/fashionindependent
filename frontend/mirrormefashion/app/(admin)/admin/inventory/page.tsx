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
import {
  Search,
  Filter,
  Edit,
  AlertTriangle,
  Package,
  TrendingDown,
  RefreshCw,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Archive,
  Truck,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const inventoryItems = [
  {
    id: "1",
    sku: "SFD-001",
    name: "Summer Floral Dress",
    category: "Dresses",
    currentStock: 45,
    reservedStock: 8,
    availableStock: 37,
    reorderLevel: 20,
    maxStock: 100,
    unitCost: 35.0,
    totalValue: 1575.0,
    supplier: "Fashion Supplier Co",
    lastRestocked: "2024-01-15",
    status: "in_stock",
  },
  {
    id: "2",
    sku: "CWT-002",
    name: "Classic White Tee",
    category: "Tops",
    currentStock: 120,
    reservedStock: 15,
    availableStock: 105,
    reorderLevel: 50,
    maxStock: 200,
    unitCost: 12.0,
    totalValue: 1440.0,
    supplier: "Basic Wear Ltd",
    lastRestocked: "2024-01-18",
    status: "in_stock",
  },
  {
    id: "3",
    sku: "DJ-003",
    name: "Denim Jacket",
    category: "Outerwear",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    reorderLevel: 15,
    maxStock: 50,
    unitCost: 65.0,
    totalValue: 0.0,
    supplier: "Denim Co",
    lastRestocked: "2023-12-20",
    status: "out_of_stock",
  },
  {
    id: "4",
    sku: "BSJ-004",
    name: "Black Skinny Jeans",
    category: "Bottoms",
    currentStock: 12,
    reservedStock: 5,
    availableStock: 7,
    reorderLevel: 25,
    maxStock: 75,
    unitCost: 28.0,
    totalValue: 336.0,
    supplier: "Denim Co",
    lastRestocked: "2024-01-10",
    status: "low_stock",
  },
  {
    id: "5",
    sku: "LH-005",
    name: "Leather Handbag",
    category: "Accessories",
    currentStock: 15,
    reservedStock: 2,
    availableStock: 13,
    reorderLevel: 10,
    maxStock: 30,
    unitCost: 85.0,
    totalValue: 1275.0,
    supplier: "Luxury Bags Inc",
    lastRestocked: "2024-01-12",
    status: "in_stock",
  },
]

const tabs = [
  { id: "all", label: "All", icon: Package, count: inventoryItems.length },
  {
    id: "in_stock",
    label: "In Stock",
    icon: Package,
    count: inventoryItems.filter((i) => i.status === "in_stock").length,
  },
  {
    id: "low_stock",
    label: "Low",
    icon: TrendingDown,
    count: inventoryItems.filter((i) => i.status === "low_stock").length,
  },
  {
    id: "out_of_stock",
    label: "Out",
    icon: AlertTriangle,
    count: inventoryItems.filter((i) => i.status === "out_of_stock").length,
  },
  { id: "reorder", label: "Reorder", icon: RefreshCw, count: 8 },
  { id: "suppliers", label: "Suppliers", icon: Truck, count: 12 },
  { id: "reports", label: "Reports", icon: BarChart3, count: 3 },
  { id: "archive", label: "Archive", icon: Archive, count: 5 },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    const matchesTab = activeTab === "all" || item.status === activeTab

    return matchesSearch && matchesCategory && matchesStatus && matchesTab
  })

  const getStatusBadge = (status: string, currentStock: number, reorderLevel: number) => {
    if (status === "out_of_stock" || currentStock === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 text-xs">
          <AlertTriangle className="w-3 h-3" />
          Out of Stock
        </Badge>
      )
    }
    if (status === "low_stock" || currentStock <= reorderLevel) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 flex items-center gap-1 text-xs">
          <TrendingDown className="w-3 h-3" />
          Low Stock
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1 text-xs">
        <Package className="w-3 h-3" />
        In Stock
      </Badge>
    )
  }

  const getStockLevel = (current: number, max: number) => {
    return (current / max) * 100
  }

  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventoryItems.filter(
    (item) => item.currentStock <= item.reorderLevel && item.currentStock > 0,
  ).length
  const outOfStockItems = inventoryItems.filter((item) => item.currentStock === 0).length

  const statsCards = [
    {
      title: "Total Inventory Value",
      value: `$${totalInventoryValue.toLocaleString()}`,
      icon: Package,
      color: "bg-primary-500",
    },
    { title: "Total Products", value: inventoryItems.length.toString(), icon: Package, color: "bg-green-500" },
    { title: "Low Stock Items", value: lowStockItems.toString(), icon: TrendingDown, color: "bg-yellow-500" },
    { title: "Out of Stock", value: outOfStockItems.toString(), icon: AlertTriangle, color: "bg-red-500" },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "suppliers":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Truck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Supplier Management</h3>
                  <p className="text-gray-600">Manage your suppliers and vendor relationships</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "reports":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Inventory Reports</h3>
                  <p className="text-gray-600">Generate detailed inventory and stock reports</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            {/* Inventory Table */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Inventory Items ({filteredItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {/* Mobile View */}
                <div className="md:hidden">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="border-b p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-gray-500">{item.category}</p>
                          <p className="text-xs font-mono text-gray-500">{item.sku}</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                              className="rounded-full flex-shrink-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2">
                            <DialogHeader>
                              <DialogTitle className="text-base">Adjust Stock - {item.name}</DialogTitle>
                            </DialogHeader>
                            <StockAdjustmentForm item={item} />
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Stock: {item.currentStock}</span>
                          <span className="text-sm">Available: {item.availableStock}</span>
                        </div>
                        <Progress value={getStockLevel(item.currentStock, item.maxStock)} className="h-2" />
                        <div className="flex items-center justify-between">
                          {getStatusBadge(item.status, item.currentStock, item.reorderLevel)}
                          <span className="font-semibold text-sm">${item.totalValue.toFixed(2)}</span>
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
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Stock Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Last Restocked</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>
                            <div className="text-center">
                              <p className="font-medium">{item.currentStock}</p>
                              {item.reservedStock > 0 && (
                                <p className="text-xs text-gray-500">({item.reservedStock} reserved)</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.availableStock}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Progress value={getStockLevel(item.currentStock, item.maxStock)} className="h-2" />
                              <p className="text-xs text-gray-500">
                                {item.currentStock}/{item.maxStock}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status, item.currentStock, item.reorderLevel)}</TableCell>
                          <TableCell className="font-medium">${item.totalValue.toFixed(2)}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(item.lastRestocked).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Adjust Stock - {item.name}</DialogTitle>
                                </DialogHeader>
                                <StockAdjustmentForm item={item} />
                              </DialogContent>
                            </Dialog>
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
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Inventory</h1>
          <p className="text-sm text-gray-600 truncate">{filteredItems.length} items</p>
        </div>
        <div className="flex gap-1 flex-shrink-0 ml-2">
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Inventory
          </Button>
        </div>
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
      <div className="md:hidden px-1">
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

      {/* Filters */}
      <Card className="mx-1 md:mx-0">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search inventory..."
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
              <Button variant="outline" className="rounded-xl bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}

function StockAdjustmentForm({ item }: { item: any }) {
  const [adjustmentType, setAdjustmentType] = useState("add")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")

  return (
    <div className="space-y-4">
      {/* Current Stock Info */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Current Stock</p>
            <p className="font-semibold text-lg">{item.currentStock}</p>
          </div>
          <div>
            <p className="text-gray-600">Reserved</p>
            <p className="font-semibold text-lg">{item.reservedStock}</p>
          </div>
          <div>
            <p className="text-gray-600">Available</p>
            <p className="font-semibold text-lg">{item.availableStock}</p>
          </div>
        </div>
      </div>

      <form className="space-y-4">
        <div>
          <Label htmlFor="adjustmentType">Adjustment Type</Label>
          <Select value={adjustmentType} onValueChange={setAdjustmentType}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add Stock</SelectItem>
              <SelectItem value="remove">Remove Stock</SelectItem>
              <SelectItem value="set">Set Stock Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="reason">Reason</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restock">Restock</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="damage">Damage</SelectItem>
              <SelectItem value="return">Return</SelectItem>
              <SelectItem value="correction">Inventory Correction</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preview */}
        {quantity && (
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Preview:</strong> Stock will{" "}
              {adjustmentType === "add" ? "increase" : adjustmentType === "remove" ? "decrease" : "be set"}
              {adjustmentType === "set" ? ` to ${quantity}` : ` by ${quantity}`}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              New stock level:{" "}
              {adjustmentType === "add"
                ? item.currentStock + Number.parseInt(quantity || "0")
                : adjustmentType === "remove"
                  ? Math.max(0, item.currentStock - Number.parseInt(quantity || "0"))
                  : Number.parseInt(quantity || "0")}
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
          <Button variant="outline" className="w-full md:w-auto rounded-xl bg-transparent">
            Cancel
          </Button>
          <Button type="submit" className="w-full md:w-auto rounded-xl bg-primary-600 hover:bg-primary-700">
            Update Stock
          </Button>
        </div>
      </form>
    </div>
  )
}
