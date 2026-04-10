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
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Crown,
  Heart,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const customers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2024-01-15",
    lastOrder: "2024-01-20",
    totalOrders: 12,
    totalSpent: 1456.78,
    location: "New York, NY",
    tags: ["VIP", "Frequent Buyer"],
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2024-01-10",
    lastOrder: "2024-01-19",
    totalOrders: 8,
    totalSpent: 892.5,
    location: "Los Angeles, CA",
    tags: ["Regular"],
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "inactive",
    joinDate: "2023-12-20",
    lastOrder: "2023-12-25",
    totalOrders: 3,
    totalSpent: 234.0,
    location: "Chicago, IL",
    tags: ["New Customer"],
  },
  {
    id: "4",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2024-01-05",
    lastOrder: "2024-01-18",
    totalOrders: 15,
    totalSpent: 2134.25,
    location: "Houston, TX",
    tags: ["VIP", "Loyal Customer"],
  },
  {
    id: "5",
    name: "Lisa Wilson",
    email: "lisa@example.com",
    phone: "+1 (555) 567-8901",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "blocked",
    joinDate: "2023-11-30",
    lastOrder: "2024-01-10",
    totalOrders: 2,
    totalSpent: 98.75,
    location: "Phoenix, AZ",
    tags: ["Problematic"],
  },
]

const tabs = [
  { id: "all", label: "All", icon: Users, count: 2847 },
  { id: "active", label: "Active", icon: UserCheck, count: 2456 },
  { id: "inactive", label: "Inactive", icon: UserX, count: 234 },
  { id: "blocked", label: "Blocked", icon: UserX, count: 45 },
  { id: "vip", label: "VIP", icon: Crown, count: 156 },
  { id: "new", label: "New", icon: UserPlus, count: 89 },
  { id: "loyal", label: "Loyal", icon: Heart, count: 234 },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus
    const matchesTag =
      selectedTag === "all" || customer.tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase()))
    const matchesTab =
      activeTab === "all" ||
      customer.status === activeTab ||
      (activeTab === "vip" && customer.tags.some((tag) => tag.toLowerCase().includes("vip"))) ||
      (activeTab === "new" && customer.tags.some((tag) => tag.toLowerCase().includes("new"))) ||
      (activeTab === "loyal" && customer.tags.some((tag) => tag.toLowerCase().includes("loyal")))

    return matchesSearch && matchesStatus && matchesTag && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <UserCheck className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="text-xs">
            <UserX className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="destructive" className="text-xs">
            <UserX className="w-3 h-3 mr-1" />
            Blocked
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

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 2000) return { tier: "VIP", color: "bg-purple-100 text-purple-800" }
    if (totalSpent >= 1000) return { tier: "Gold", color: "bg-yellow-100 text-yellow-800" }
    if (totalSpent >= 500) return { tier: "Silver", color: "bg-gray-100 text-gray-800" }
    return { tier: "Bronze", color: "bg-orange-100 text-orange-800" }
  }

  const statsCards = [
    { title: "Total Customers", value: "2,847", icon: Users, color: "bg-primary-500" },
    { title: "Active Customers", value: "2,456", icon: UserCheck, color: "bg-primary-600" },
    { title: "New This Month", value: "234", icon: UserPlus, color: "bg-primary-700" },
    { title: "Avg. Order Value", value: "$127.50", icon: DollarSign, color: "bg-primary-800" },
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
            <h1 className="text-xl md:text-2xl font-bold truncate">Customers</h1>
            <p className="text-sm md:text-base text-gray-600 truncate">Manage your customer base and relationships</p>
          </div>
          <Button size="sm" className="rounded-full flex-shrink-0">
            <Mail className="w-4 h-4" />
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
        <Card className="mx-4 md:mx-0">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search customers..."
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
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-full md:w-48 rounded-xl">
                    <SelectValue placeholder="Customer Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="frequent">Frequent Buyer</SelectItem>
                    <SelectItem value="new">New Customer</SelectItem>
                    <SelectItem value="loyal">Loyal Customer</SelectItem>
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

        {/* Customers Table */}
        <Card className="mx-4 md:mx-0">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {/* Mobile View */}
            <div className="md:hidden">
              {filteredCustomers.map((customer) => {
                const tier = getCustomerTier(customer.totalSpent)
                return (
                  <div key={customer.id} className="border-b p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{customer.name}</p>
                          <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{customer.location}</span>
                          </div>
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
                            <DialogTitle className="text-base">Customer Details - {customer.name}</DialogTitle>
                          </DialogHeader>
                          <CustomerDetails customer={customer} />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1">
                        {getStatusBadge(customer.status)}
                        <Badge className={`${tier.color} text-xs`}>{tier.tier}</Badge>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm">${customer.totalSpent.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{customer.totalOrders} orders</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const tier = getCustomerTier(customer.totalSpent)
                    return (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {customer.location}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                            {customer.totalOrders}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={tier.color}>{tier.tier}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(customer.lastOrder).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Customer Details - {customer.name}</DialogTitle>
                              </DialogHeader>
                              <CustomerDetails customer={customer} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CustomerDetails({ customer }: { customer: any }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <UserCheck className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary">
            <UserX className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="destructive">
            <UserX className="w-3 h-3 mr-1" />
            Blocked
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Customer Info */}
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16 flex-shrink-0">
          <AvatarImage src={customer.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-lg">
            {customer.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold truncate">{customer.name}</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{customer.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {getStatusBadge(customer.status)}
            {customer.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">{customer.totalOrders}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-700">${customer.totalSpent.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Total Spent</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-800">
            ${(customer.totalSpent / customer.totalOrders).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Avg. Order Value</p>
        </div>
      </div>

      <Separator />

      {/* Timeline */}
      <div>
        <h4 className="font-semibold mb-3 text-sm md:text-base">Customer Timeline</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600">Joined on {new Date(customer.joinDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-primary-700 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600">Last order on {new Date(customer.lastOrder).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-2 pt-4">
        <Button size="sm" className="rounded-xl">
          Send Email
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
          View Orders
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
          Edit Customer
        </Button>
      </div>
    </div>
  )
}
