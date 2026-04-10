"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Edit,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plane,
  Ship,
  Zap,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const shippingMethods = [
  {
    id: "standard",
    name: "Standard Shipping",
    provider: "USPS",
    deliveryTime: "5-7 business days",
    cost: 5.99,
    enabled: true,
    icon: Truck,
  },
  {
    id: "express",
    name: "Express Shipping",
    provider: "FedEx",
    deliveryTime: "2-3 business days",
    cost: 12.99,
    enabled: true,
    icon: Zap,
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    provider: "UPS",
    deliveryTime: "1 business day",
    cost: 24.99,
    enabled: true,
    icon: Plane,
  },
  {
    id: "international",
    name: "International Shipping",
    provider: "DHL",
    deliveryTime: "7-14 business days",
    cost: 19.99,
    enabled: false,
    icon: Ship,
  },
]

const recentShipments = [
  {
    id: "SH001",
    orderId: "#12345",
    customer: "Sarah Johnson",
    destination: "New York, NY",
    method: "Express Shipping",
    status: "delivered",
    trackingNumber: "1Z999AA1234567890",
    shippedDate: "2024-01-18",
    deliveredDate: "2024-01-20",
  },
  {
    id: "SH002",
    orderId: "#12346",
    customer: "Mike Chen",
    destination: "Los Angeles, CA",
    method: "Standard Shipping",
    status: "in_transit",
    trackingNumber: "1Z999AA1234567891",
    shippedDate: "2024-01-19",
    deliveredDate: null,
  },
  {
    id: "SH003",
    orderId: "#12347",
    customer: "Emma Davis",
    destination: "Chicago, IL",
    method: "Overnight Shipping",
    status: "processing",
    trackingNumber: "1Z999AA1234567892",
    shippedDate: "2024-01-20",
    deliveredDate: null,
  },
]

const tabs = [
  { id: "methods", label: "Methods", icon: Truck, count: shippingMethods.length },
  { id: "shipments", label: "Shipments", icon: Package, count: recentShipments.length },
  { id: "zones", label: "Zones", icon: MapPin, count: 8 },
  { id: "rates", label: "Rates", icon: Settings, count: 12 },
  { id: "tracking", label: "Tracking", icon: Search, count: 45 },
  { id: "labels", label: "Labels", icon: Package, count: 23 },
  { id: "returns", label: "Returns", icon: Package, count: 7 },
]

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState("methods")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredShipments = recentShipments.filter(
    (shipment) =>
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        )
      case "in_transit":
        return (
          <Badge className="bg-primary-100 text-primary-800 text-xs">
            <Truck className="w-3 h-3 mr-1" />
            In Transit
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        )
      case "delayed":
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Delayed
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
    { title: "Active Shipments", value: "45", icon: Package, color: "bg-primary-500" },
    { title: "Delivered Today", value: "12", icon: CheckCircle, color: "bg-green-500" },
    { title: "In Transit", value: "23", icon: Truck, color: "bg-primary-600" },
    { title: "Avg Delivery Time", value: "3.2 days", icon: Clock, color: "bg-primary-700" },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "methods":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Shipping Methods</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-3">
                  {shippingMethods.map((method) => {
                    const IconComponent = method.icon
                    return (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-xl">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm md:text-base truncate">{method.name}</h3>
                            <p className="text-xs md:text-sm text-gray-500">
                              {method.provider} • {method.deliveryTime}
                            </p>
                            <p className="text-sm font-semibold text-green-600">${method.cost}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Switch checked={method.enabled} />
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "shipments":
        return (
          <div className="space-y-4">
            {/* Search */}
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-3 md:p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search shipments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipments List */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Recent Shipments ({filteredShipments.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {/* Mobile View */}
                <div className="md:hidden">
                  {filteredShipments.map((shipment) => (
                    <div key={shipment.id} className="border-b p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{shipment.orderId}</p>
                          <p className="text-xs text-gray-500 truncate">{shipment.customer}</p>
                          <p className="text-xs text-gray-500 truncate">{shipment.destination}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full flex-shrink-0">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(shipment.status)}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{shipment.method}</p>
                          <p className="text-xs font-mono text-gray-500">{shipment.trackingNumber}</p>
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
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tracking</TableHead>
                        <TableHead>Shipped Date</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">{shipment.orderId}</TableCell>
                          <TableCell>{shipment.customer}</TableCell>
                          <TableCell>{shipment.destination}</TableCell>
                          <TableCell>{shipment.method}</TableCell>
                          <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                          <TableCell className="font-mono text-sm">{shipment.trackingNumber}</TableCell>
                          <TableCell>{new Date(shipment.shippedDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Search className="w-4 h-4" />
                            </Button>
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

      default:
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-gray-600">This section is under development.</p>
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
          <h1 className="text-xl font-bold truncate">Shipping</h1>
          <p className="text-sm text-gray-600 truncate">Manage shipping & delivery</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 ml-2 bg-transparent">
          <Package className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Shipping & Delivery</h1>
          <p className="text-gray-600">Manage shipping methods, rates, and tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Create Label
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700">
            <Truck className="w-4 h-4 mr-2" />
            New Shipment
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

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}
