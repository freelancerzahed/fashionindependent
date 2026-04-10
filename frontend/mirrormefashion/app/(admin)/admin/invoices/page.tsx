"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const invoices = [
  {
    id: "INV-001",
    orderId: "#12345",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    amount: 156.0,
    tax: 12.48,
    total: 168.48,
    status: "paid",
    dueDate: "2024-01-25",
    issueDate: "2024-01-20",
    paidDate: "2024-01-22",
  },
  {
    id: "INV-002",
    orderId: "#12346",
    customer: "Mike Chen",
    email: "mike@example.com",
    amount: 89.5,
    tax: 7.16,
    total: 96.66,
    status: "pending",
    dueDate: "2024-01-30",
    issueDate: "2024-01-20",
    paidDate: null,
  },
  {
    id: "INV-003",
    orderId: "#12347",
    customer: "Emma Davis",
    email: "emma@example.com",
    amount: 234.0,
    tax: 18.72,
    total: 252.72,
    status: "paid",
    dueDate: "2024-01-28",
    issueDate: "2024-01-19",
    paidDate: "2024-01-21",
  },
  {
    id: "INV-004",
    orderId: "#12348",
    customer: "John Smith",
    email: "john@example.com",
    amount: 67.25,
    tax: 5.38,
    total: 72.63,
    status: "overdue",
    dueDate: "2024-01-15",
    issueDate: "2024-01-10",
    paidDate: null,
  },
  {
    id: "INV-005",
    orderId: "#12349",
    customer: "Lisa Wilson",
    email: "lisa@example.com",
    amount: 198.75,
    tax: 15.9,
    total: 214.65,
    status: "draft",
    dueDate: "2024-02-01",
    issueDate: "2024-01-18",
    paidDate: null,
  },
]

const tabs = [
  { id: "all", label: "All", icon: FileText, count: invoices.length },
  { id: "paid", label: "Paid", icon: CheckCircle, count: invoices.filter((i) => i.status === "paid").length },
  { id: "pending", label: "Pending", icon: Clock, count: invoices.filter((i) => i.status === "pending").length },
  {
    id: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
    count: invoices.filter((i) => i.status === "overdue").length,
  },
  { id: "draft", label: "Draft", icon: FileText, count: invoices.filter((i) => i.status === "draft").length },
  { id: "sent", label: "Sent", icon: Send, count: 12 },
  { id: "cancelled", label: "Cancelled", icon: XCircle, count: 3 },
  { id: "templates", label: "Templates", icon: FileText, count: 5 },
]

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus
    const matchesTab = activeTab === "all" || invoice.status === activeTab

    return matchesSearch && matchesStatus && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary" className="text-xs">
            <FileText className="w-3 h-3 mr-1" />
            Draft
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

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const paidAmount = invoices.filter((i) => i.status === "paid").reduce((sum, invoice) => sum + invoice.total, 0)
  const pendingAmount = invoices.filter((i) => i.status === "pending").reduce((sum, invoice) => sum + invoice.total, 0)

  const statsCards = [
    { title: "Total Invoices", value: invoices.length.toString(), icon: FileText, color: "bg-primary-500" },
    { title: "Total Amount", value: `$${totalAmount.toLocaleString()}`, icon: DollarSign, color: "bg-primary-600" },
    { title: "Paid Amount", value: `$${paidAmount.toLocaleString()}`, icon: CheckCircle, color: "bg-primary-700" },
    { title: "Pending Amount", value: `$${pendingAmount.toLocaleString()}`, icon: Clock, color: "bg-primary-800" },
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
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Invoices</h1>
          <p className="text-sm text-gray-600 truncate">{filteredInvoices.length} invoices</p>
        </div>
        <Button size="sm" className="rounded-full flex-shrink-0 ml-2">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Invoice Management</h1>
          <p className="text-gray-600">Create and manage customer invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
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

      {/* Search and Filters */}
      <Card className="mx-1 md:mx-0">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
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

      {/* Invoices Display */}
      <Card className="mx-1 md:mx-0">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-base">Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border-b p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{invoice.id}</p>
                    <p className="text-xs text-gray-500 truncate">{invoice.customer}</p>
                    <p className="text-xs text-gray-500">{invoice.orderId}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(invoice.status)}
                  <div className="text-right">
                    <p className="font-semibold text-sm">${invoice.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
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
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-gray-500">{invoice.orderId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.customer}</p>
                        <p className="text-sm text-gray-500">{invoice.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">${invoice.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Tax: ${invoice.tax.toFixed(2)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className={invoice.status === "overdue" ? "text-red-600" : ""}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
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
