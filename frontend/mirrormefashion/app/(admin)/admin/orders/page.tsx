"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Eye,
  Download,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const orders = [
  {
    id: "#12345",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2024-01-20",
    status: "completed",
    paymentStatus: "paid",
    total: 156.0,
    items: 3,
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "#12346",
    customer: {
      name: "Mike Chen",
      email: "mike@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2024-01-20",
    status: "processing",
    paymentStatus: "paid",
    total: 89.5,
    items: 2,
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
  },
  {
    id: "#12347",
    customer: {
      name: "Emma Davis",
      email: "emma@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2024-01-19",
    status: "shipped",
    paymentStatus: "paid",
    total: 234.0,
    items: 5,
    shippingAddress: "789 Pine St, Chicago, IL 60601",
  },
  {
    id: "#12348",
    customer: {
      name: "John Smith",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2024-01-19",
    status: "pending",
    paymentStatus: "pending",
    total: 67.25,
    items: 1,
    shippingAddress: "321 Elm St, Houston, TX 77001",
  },
  {
    id: "#12349",
    customer: {
      name: "Lisa Wilson",
      email: "lisa@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2024-01-18",
    status: "cancelled",
    paymentStatus: "refunded",
    total: 198.75,
    items: 4,
    shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
  },
]

const tabs = [
  { id: "all", label: "All", icon: Package, count: 2350 },
  { id: "pending", label: "Pending", icon: Clock, count: 45 },
  { id: "processing", label: "Processing", icon: RefreshCw, count: 123 },
  { id: "shipped", label: "Shipped", icon: Truck, count: 89 },
  { id: "completed", label: "Completed", icon: CheckCircle, count: 2093 },
  { id: "cancelled", label: "Cancelled", icon: XCircle, count: 12 },
  { id: "refunded", label: "Refunded", icon: RefreshCw, count: 8 },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "all" || order.paymentStatus === selectedPaymentStatus
    const matchesTab = activeTab === "all" || order.status === activeTab

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-primary-100 text-primary-800 text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge className="bg-purple-100 text-purple-800 text-xs">
            <Truck className="w-3 h-3 mr-1" />
            Shipped
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive" className="text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
            Pending
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 text-xs">
            Refunded
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="text-xs">
            Failed
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
    { title: "Total Orders", value: "2,350", icon: Package, color: "bg-primary-500" },
    { title: "Pending", value: "45", icon: Clock, color: "bg-yellow-500" },
    { title: "Processing", value: "123", icon: RefreshCw, color: "bg-primary-600" },
    { title: "Shipped", value: "89", icon: Truck, color: "bg-purple-500" },
    { title: "Completed", value: "2,093", icon: CheckCircle, color: "bg-green-500" },
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
            <h1 className="text-xl md:text-2xl font-bold truncate">Orders</h1>
            <p className="text-sm md:text-base text-gray-600 truncate">Manage customer orders and fulfillment</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 bg-transparent">
            <Download className="w-4 h-4" />
          </Button>
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
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
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
        <div className="hidden md:grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
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

        {/* Search and Filters */}
        <Card className="mx-4 md:mx-0">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 md:gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-48 rounded-xl">
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                  <SelectTrigger className="w-full md:w-48 rounded-xl">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full md:w-auto rounded-xl bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Display */}
        <Card className="mx-4 md:mx-0">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {/* Mobile View */}
            <div className="md:hidden">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border-b p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={order.customer.avatar || "/placeholder.svg"}
                        alt={order.customer.name}
                        className="w-12 h-12 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{order.id}</p>
                        <p className="text-xs text-gray-500 truncate">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{order.items} items</p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="rounded-full flex-shrink-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2">
                        <DialogHeader>
                          <DialogTitle className="text-base">Order Details - {order.id}</DialogTitle>
                        </DialogHeader>
                        <OrderDetails order={order} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1">
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-sm">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.items} items</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={order.customer.avatar || "/placeholder.svg"}
                            alt={order.customer.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-gray-500">{order.customer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                            </DialogHeader>
                            <OrderDetails order={order} />
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
    </div>
  )
}

function OrderDetails({ order }: { order: any }) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2 text-sm md:text-base">Order Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span>{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment:</span>
              <span>{order.paymentStatus}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm md:text-base">Customer Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{order.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="truncate ml-2">{order.customer.email}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Shipping Address */}
      <div>
        <h3 className="font-semibold mb-2 text-sm md:text-base">Shipping Address</h3>
        <p className="text-sm text-gray-600">{order.shippingAddress}</p>
      </div>

      <Separator />

      {/* Order Summary */}
      <div>
        <h3 className="font-semibold mb-2 text-sm md:text-base">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Items ({order.items}):</span>
            <span>${(order.total * 0.9).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping:</span>
            <span>${(order.total * 0.05).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span>${(order.total * 0.05).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-2 pt-4">
        <Button size="sm" className="w-full md:w-auto rounded-xl bg-primary-600 hover:bg-primary-700">
          Update Status
        </Button>
        <Button variant="outline" size="sm" className="w-full md:w-auto rounded-xl bg-transparent">
          Send Email
        </Button>
        <Button variant="outline" size="sm" className="w-full md:w-auto rounded-xl bg-transparent">
          Print Invoice
        </Button>
      </div>
    </div>
  )
}
