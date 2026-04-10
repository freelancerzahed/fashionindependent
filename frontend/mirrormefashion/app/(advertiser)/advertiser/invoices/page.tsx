"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Eye, FileText, Calendar, DollarSign } from "lucide-react"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const invoices = [
    {
      id: "INV-2024-001",
      date: "Aug 10, 2024",
      dueDate: "Aug 25, 2024",
      amount: "$1,247.50",
      status: "paid",
      description: "Monthly advertising spend - July 2024",
      campaigns: ["Summer Fashion", "Back to School"],
      paymentMethod: "Visa •••• 4242",
    },
    {
      id: "INV-2024-002",
      date: "Aug 5, 2024",
      dueDate: "Aug 20, 2024",
      amount: "$856.30",
      status: "pending",
      description: "Campaign charges - Week 1 August",
      campaigns: ["Weekend Sale", "Flash Promotion"],
      paymentMethod: "Mastercard •••• 8888",
    },
    {
      id: "INV-2024-003",
      date: "Jul 28, 2024",
      dueDate: "Aug 12, 2024",
      amount: "$2,134.80",
      status: "overdue",
      description: "Monthly advertising spend - June 2024",
      campaigns: ["Summer Collection", "Holiday Prep"],
      paymentMethod: "Visa •••• 4242",
    },
    {
      id: "INV-2024-004",
      date: "Jul 20, 2024",
      dueDate: "Aug 4, 2024",
      amount: "$678.90",
      status: "paid",
      description: "Campaign charges - Week 3 July",
      campaigns: ["Mid-Summer Sale"],
      paymentMethod: "American Express •••• 1005",
    },
    {
      id: "INV-2024-005",
      date: "Jul 15, 2024",
      dueDate: "Jul 30, 2024",
      amount: "$1,456.20",
      status: "paid",
      description: "Monthly advertising spend - May 2024",
      campaigns: ["Spring Collection", "Mother's Day"],
      paymentMethod: "Visa •••• 4242",
    },
  ]

  const invoiceStats = [
    {
      title: "Total Outstanding",
      value: "$2,990.80",
      change: "+$856.30",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Paid This Month",
      value: "$3,382.50",
      change: "+12.5%",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Invoices",
      value: "2",
      change: "+1",
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">View and manage your billing invoices</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {invoiceStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gray-50">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{invoice.id}</h3>
                      <p className="text-sm text-gray-600">{invoice.description}</p>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 ml-12">
                    <div>
                      <p className="text-gray-500">Invoice Date</p>
                      <p className="font-medium">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{invoice.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium">{invoice.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Method</p>
                      <p className="font-medium">{invoice.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="mt-2 ml-12">
                    <p className="text-xs text-gray-500">Campaigns: {invoice.campaigns.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
