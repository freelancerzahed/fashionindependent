"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Smartphone,
  Globe,
  MoreVertical,
  Settings,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const paymentMethods = [
  {
    id: "stripe",
    name: "Stripe",
    type: "Credit Cards",
    description: "Accept all major credit and debit cards",
    enabled: true,
    fees: "2.9% + 30¢",
    icon: CreditCard,
    color: "bg-primary-500",
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "Digital Wallet",
    description: "PayPal and PayPal Credit payments",
    enabled: true,
    fees: "3.49% + fixed fee",
    icon: Wallet,
    color: "bg-primary-600",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    type: "Mobile Payment",
    description: "Quick payments with Touch ID or Face ID",
    enabled: true,
    fees: "2.9% + 30¢",
    icon: Smartphone,
    color: "bg-gray-800",
  },
  {
    id: "google-pay",
    name: "Google Pay",
    type: "Mobile Payment",
    description: "Fast checkout with Google accounts",
    enabled: false,
    fees: "2.9% + 30¢",
    icon: Smartphone,
    color: "bg-green-500",
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    type: "Direct Transfer",
    description: "Direct bank account transfers",
    enabled: false,
    fees: "1.5% + $5",
    icon: Globe,
    color: "bg-primary-700",
  },
]

const recentTransactions = [
  {
    id: "TXN001",
    orderId: "#12345",
    customer: "Sarah Johnson",
    amount: 156.0,
    method: "Stripe",
    status: "completed",
    date: "2024-01-20",
    fee: 4.82,
  },
  {
    id: "TXN002",
    orderId: "#12346",
    customer: "Mike Chen",
    amount: 89.5,
    method: "PayPal",
    status: "pending",
    date: "2024-01-20",
    fee: 3.12,
  },
  {
    id: "TXN003",
    orderId: "#12347",
    customer: "Emma Davis",
    amount: 234.0,
    method: "Apple Pay",
    status: "completed",
    date: "2024-01-19",
    fee: 7.09,
  },
  {
    id: "TXN004",
    orderId: "#12348",
    customer: "John Smith",
    amount: 67.25,
    method: "Stripe",
    status: "failed",
    date: "2024-01-19",
    fee: 0,
  },
  {
    id: "TXN005",
    orderId: "#12349",
    customer: "Lisa Wilson",
    amount: 198.75,
    method: "PayPal",
    status: "refunded",
    date: "2024-01-18",
    fee: -6.95,
  },
]

const tabs = [
  { id: "methods", label: "Methods", icon: CreditCard, count: paymentMethods.length },
  { id: "transactions", label: "Transactions", icon: DollarSign, count: recentTransactions.length },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle,
    count: recentTransactions.filter((t) => t.status === "completed").length,
  },
  {
    id: "pending",
    label: "Pending",
    icon: Clock,
    count: recentTransactions.filter((t) => t.status === "pending").length,
  },
  {
    id: "failed",
    label: "Failed",
    icon: XCircle,
    count: recentTransactions.filter((t) => t.status === "failed").length,
  },
  {
    id: "refunded",
    label: "Refunded",
    icon: RefreshCw,
    count: recentTransactions.filter((t) => t.status === "refunded").length,
  },
  { id: "disputes", label: "Disputes", icon: AlertTriangle, count: 3 },
  { id: "reports", label: "Reports", icon: Download, count: 8 },
]

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("methods")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredTransactions = recentTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus
    const matchesTab = activeTab === "transactions" || activeTab === "methods" || transaction.status === activeTab

    return matchesSearch && matchesStatus && matchesTab
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
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="secondary" className="text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refunded
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

  const totalRevenue = recentTransactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)
  const totalFees = recentTransactions.reduce((sum, t) => sum + Math.abs(t.fee), 0)

  const statsCards = [
    { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-500" },
    {
      title: "Total Transactions",
      value: recentTransactions.length.toString(),
      icon: CreditCard,
      color: "bg-primary-500",
    },
    { title: "Processing Fees", value: `$${totalFees.toFixed(2)}`, icon: AlertTriangle, color: "bg-primary-600" },
    { title: "Success Rate", value: "94.2%", icon: CheckCircle, color: "bg-primary-700" },
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
            <Card className="mx-4 md:mx-0 overflow-hidden">
              <CardHeader className="p-4 md:p-6 border-b bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg md:text-xl font-semibold">Payment Methods</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Configure your payment processing options</p>
                  </div>
                  <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {paymentMethods.map((method, index) => {
                    const IconComponent = method.icon
                    return (
                      <div key={method.id} className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors">
                        {/* Mobile Layout */}
                        <div className="md:hidden space-y-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-sm truncate pr-2">{method.name}</h3>
                                <Switch checked={method.enabled} className="flex-shrink-0" />
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{method.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs px-2 py-1">
                                    {method.type}
                                  </Badge>
                                  <Badge
                                    variant={method.enabled ? "default" : "secondary"}
                                    className={`text-xs px-2 py-1 ${
                                      method.enabled ? "bg-green-100 text-green-800 border-green-200" : ""
                                    }`}
                                  >
                                    {method.enabled ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm" className="p-1 h-auto">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500">Processing fee: {method.fees}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div
                              className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                            >
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-base">{method.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {method.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Processing fee: {method.fees}</span>
                                <span>•</span>
                                <span>Setup: Free</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <Badge
                              variant={method.enabled ? "default" : "secondary"}
                              className={`text-xs px-3 py-1 ${
                                method.enabled ? "bg-green-100 text-green-800 border-green-200" : ""
                              }`}
                            >
                              {method.enabled ? "Active" : "Inactive"}
                            </Badge>
                            <Switch checked={method.enabled} />
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Add New Method Button */}
                <div className="p-4 md:p-6 border-t bg-gray-50/30">
                  <Button variant="outline" className="w-full md:w-auto bg-transparent">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "transactions":
      case "completed":
      case "pending":
      case "failed":
      case "refunded":
        return (
          <div className="space-y-4">
            {/* Search and Filters */}
            <Card className="mx-4 md:mx-0">
              <CardContent className="p-4 md:p-4">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search transactions..."
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
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
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

            {/* Transactions List */}
            <Card className="mx-4 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">
                  {activeTab === "transactions"
                    ? "All Transactions"
                    : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Transactions`}{" "}
                  ({filteredTransactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {/* Mobile View */}
                <div className="md:hidden -mx-3">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="border-b p-4 mx-3 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{transaction.orderId}</p>
                          <p className="text-xs text-gray-500 truncate">{transaction.customer}</p>
                          <p className="text-xs text-gray-500">{transaction.method}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-sm">${transaction.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Fee: ${Math.abs(transaction.fee).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(transaction.status)}
                        <span className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.id}</p>
                              <p className="text-sm text-gray-500">{transaction.orderId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.customer}</TableCell>
                          <TableCell className="font-medium">${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell>{transaction.method}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell className={transaction.fee < 0 ? "text-red-600" : ""}>
                            ${Math.abs(transaction.fee).toFixed(2)}
                          </TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
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
            <Card className="mx-4 md:mx-0">
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
      <div className="flex items-center justify-between md:hidden px-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Payments</h1>
          <p className="text-sm text-gray-600 truncate">Payment processing</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 ml-2 bg-transparent">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <p className="text-gray-600">Manage payment methods and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700">
            <CreditCard className="w-4 h-4 mr-2" />
            Add Method
          </Button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="w-full max-w-[85vw] overflow-hidden md:hidden">
        <Swiper modules={[FreeMode]} spaceBetween={8} slidesPerView="auto" freeMode={true} className="!px-4">
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
      <div className="md:hidden px-4">
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
