"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Reply,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const supportTickets = [
  {
    id: "TK-001",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    subject: "Order delivery issue",
    status: "open",
    priority: "high",
    category: "shipping",
    created: "2024-01-15",
    lastReply: "2 hours ago",
    messages: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "TK-002",
    customer: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1 (555) 234-5678",
    subject: "Product return request",
    status: "pending",
    priority: "medium",
    category: "returns",
    created: "2024-01-14",
    lastReply: "1 day ago",
    messages: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "TK-003",
    customer: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "+1 (555) 345-6789",
    subject: "Payment processing error",
    status: "resolved",
    priority: "high",
    category: "payment",
    created: "2024-01-13",
    lastReply: "3 days ago",
    messages: 8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "TK-004",
    customer: "David Brown",
    email: "david.b@email.com",
    phone: "+1 (555) 456-7890",
    subject: "Size exchange inquiry",
    status: "open",
    priority: "low",
    category: "product",
    created: "2024-01-12",
    lastReply: "5 hours ago",
    messages: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const stats = [
  { label: "Open Tickets", value: "23", change: "+12%", icon: MessageSquare, color: "text-primary-600" },
  { label: "Pending", value: "8", change: "-5%", icon: Clock, color: "text-primary-700" },
  { label: "Resolved Today", value: "15", change: "+8%", icon: CheckCircle, color: "text-primary-800" },
  { label: "Avg Response", value: "2.4h", change: "-15%", icon: AlertCircle, color: "text-primary-900" },
]

const tabs = [
  { id: "all", label: "All Tickets", icon: MessageSquare, count: 39 },
  { id: "open", label: "Open", icon: AlertCircle, count: 23 },
  { id: "pending", label: "Pending", icon: Clock, count: 8 },
  { id: "resolved", label: "Resolved", icon: CheckCircle, count: 8 },
]

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState("")

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % stats.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + stats.length) % stats.length)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-orange-100 text-orange-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesTab = activeTab === "all" || ticket.status === activeTab
    const matchesSearch =
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Support Center</h1>
          <p className="text-sm text-gray-600 truncate">Manage customer support tickets</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 ml-2 bg-transparent">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Customer Email</label>
                <Input placeholder="customer@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Ticket subject" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="returns">Returns</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Ticket description..." rows={3} />
              </div>
              <Button className="w-full">Create Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Support Center</h1>
          <p className="text-gray-600">Manage customer support tickets and inquiries</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="returns">Returns</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Customer Email</label>
                    <Input placeholder="customer@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Brief description of the issue" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                        <SelectItem value="returns">Returns & Exchanges</SelectItem>
                        <SelectItem value="payment">Payment Issues</SelectItem>
                        <SelectItem value="product">Product Questions</SelectItem>
                        <SelectItem value="account">Account Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Detailed description of the issue..." rows={4} />
                </div>
                <Button className="w-full">Create Ticket</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  {tab.count > 0 && (
                    <Badge
                      variant="secondary"
                      className={`absolute -top-1 -right-1 text-xs min-w-5 h-5 px-1 ${
                        activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"
                      }`}
                    >
                      {tab.count > 999 ? "999+" : tab.count}
                    </Badge>
                  )}
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
                {tab.count > 0 && (
                  <Badge
                    variant="secondary"
                    className={`text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"}`}
                  >
                    {tab.count}
                  </Badge>
                )}
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
                  const IconComponent = stats[currentStatsIndex].icon
                  return <IconComponent className="w-6 h-6 flex-shrink-0" />
                })()}
                <span className="text-sm font-medium opacity-90 truncate">{stats[currentStatsIndex].label}</span>
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

            <div className="text-3xl font-bold mb-2">{stats[currentStatsIndex].value}</div>

            <div className="flex items-center text-sm">
              <span>{stats[currentStatsIndex].change} from last week</span>
            </div>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            {stats.map((_, index) => (
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
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {(() => {
                const IconComponent = stat.icon
                return <IconComponent className="h-4 w-4 text-muted-foreground" />
              })()}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-500">
                <span>{stat.change} from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mx-1 md:mx-0">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 md:gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="mx-1 md:mx-0 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Ticket Header */}
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={ticket.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {ticket.customer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">{ticket.customer}</h3>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {ticket.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{ticket.subject}</p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Badge className={getStatusColor(ticket.status)} variant="secondary">
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{ticket.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{ticket.messages}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="whitespace-nowrap">{ticket.lastReply}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                              <Reply className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Reply</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="truncate">
                                Ticket {ticket.id} - {ticket.subject}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Customer Info */}
                              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Avatar className="w-12 h-12 flex-shrink-0">
                                  <AvatarImage src={ticket.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {ticket.customer
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold truncate">{ticket.customer}</h3>
                                  <p className="text-sm text-gray-600 truncate">{ticket.email}</p>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge className={getStatusColor(ticket.status)} variant="secondary">
                                      {ticket.status}
                                    </Badge>
                                    <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                                      {ticket.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Conversation */}
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-medium text-sm truncate">{ticket.customer}</span>
                                    <span className="text-xs text-gray-500 flex-shrink-0">{ticket.created}</span>
                                  </div>
                                  <p className="text-sm">
                                    Hi, I'm having an issue with my recent order. The delivery was supposed to arrive
                                    yesterday but I haven't received it yet. Can you please help me track it?
                                  </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-medium text-sm">Support Agent</span>
                                    <span className="text-xs text-gray-500 flex-shrink-0">2 hours ago</span>
                                  </div>
                                  <p className="text-sm">
                                    Thank you for contacting us. I've looked up your order and can see it's currently in
                                    transit. Let me get you the latest tracking information.
                                  </p>
                                </div>
                              </div>

                              {/* Reply Form */}
                              <div className="space-y-3">
                                <label className="text-sm font-medium">Reply to customer</label>
                                <Textarea
                                  placeholder="Type your reply..."
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                  rows={4}
                                />
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button className="flex-1">Send Reply</Button>
                                  <Select>
                                    <SelectTrigger className="sm:w-32">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">Open</SelectItem>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && (
        <Card className="mx-1 md:mx-0">
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-4 text-center">
              {searchQuery ? "Try adjusting your search terms" : "No support tickets match the current filter"}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
