"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Star,
  Search,
  Filter,
  Eye,
  MessageSquare,
  ThumbsUp,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const reviews = [
  {
    id: "REV-001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    product: "Summer Floral Dress",
    productId: "1",
    rating: 5,
    title: "Absolutely love this dress!",
    comment:
      "The quality is amazing and the fit is perfect. I've received so many compliments wearing this dress. Highly recommend!",
    status: "approved",
    date: "2024-01-20",
    helpful: 12,
    reported: 0,
  },
  {
    id: "REV-002",
    customer: "Mike Chen",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    product: "Classic White Tee",
    productId: "2",
    rating: 4,
    title: "Good quality, runs small",
    comment: "Nice shirt but I would recommend ordering a size up. The material is soft and comfortable.",
    status: "approved",
    date: "2024-01-19",
    helpful: 8,
    reported: 0,
  },
  {
    id: "REV-003",
    customer: "Emma Davis",
    email: "emma@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    product: "Denim Jacket",
    productId: "3",
    rating: 3,
    title: "Average quality",
    comment: "The jacket is okay but not as described. The color is slightly different from the photos.",
    status: "pending",
    date: "2024-01-18",
    helpful: 3,
    reported: 1,
  },
  {
    id: "REV-004",
    customer: "John Smith",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    product: "Black Skinny Jeans",
    productId: "4",
    rating: 2,
    title: "Poor quality, disappointed",
    comment: "The jeans started fading after just one wash. Very disappointed with the quality for the price.",
    status: "flagged",
    date: "2024-01-17",
    helpful: 1,
    reported: 3,
  },
  {
    id: "REV-005",
    customer: "Lisa Wilson",
    email: "lisa@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    product: "Leather Handbag",
    productId: "5",
    rating: 5,
    title: "Beautiful handbag!",
    comment: "Excellent craftsmanship and beautiful design. Worth every penny!",
    status: "approved",
    date: "2024-01-16",
    helpful: 15,
    reported: 0,
  },
]

const tabs = [
  { id: "all", label: "All", icon: Star, count: reviews.length },
  {
    id: "approved",
    label: "Approved",
    icon: CheckCircle,
    count: reviews.filter((r) => r.status === "approved").length,
  },
  { id: "pending", label: "Pending", icon: Clock, count: reviews.filter((r) => r.status === "pending").length },
  { id: "flagged", label: "Flagged", icon: Flag, count: reviews.filter((r) => r.status === "flagged").length },
  { id: "5-star", label: "5 Star", icon: Star, count: reviews.filter((r) => r.rating === 5).length },
  { id: "4-star", label: "4 Star", icon: Star, count: reviews.filter((r) => r.rating === 4).length },
  { id: "3-star", label: "3 Star", icon: Star, count: reviews.filter((r) => r.rating === 3).length },
  { id: "low-rated", label: "Low Rated", icon: TrendingUp, count: reviews.filter((r) => r.rating <= 2).length },
]

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || review.status === selectedStatus
    const matchesRating = selectedRating === "all" || review.rating.toString() === selectedRating
    const matchesTab =
      activeTab === "all" ||
      review.status === activeTab ||
      (activeTab === "5-star" && review.rating === 5) ||
      (activeTab === "4-star" && review.rating === 4) ||
      (activeTab === "3-star" && review.rating === 3) ||
      (activeTab === "low-rated" && review.rating <= 2)

    return matchesSearch && matchesStatus && matchesRating && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="destructive" className="text-xs">
            <Flag className="w-3 h-3 mr-1" />
            Flagged
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const totalHelpful = reviews.reduce((sum, review) => sum + review.helpful, 0)

  const statsCards = [
    { title: "Total Reviews", value: reviews.length.toString(), icon: Star, color: "bg-primary-500" },
    { title: "Average Rating", value: averageRating.toFixed(1), icon: Award, color: "bg-primary-600" },
    {
      title: "Approved Reviews",
      value: reviews.filter((r) => r.status === "approved").length.toString(),
      icon: CheckCircle,
      color: "bg-primary-700",
    },
    { title: "Helpful Votes", value: totalHelpful.toString(), icon: ThumbsUp, color: "bg-primary-800" },
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
          <h1 className="text-xl font-bold truncate">Reviews</h1>
          <p className="text-sm text-gray-600 truncate">{filteredReviews.length} reviews</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 ml-2 bg-transparent">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Review Management</h1>
          <p className="text-gray-600">Manage customer reviews and feedback</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Moderate Reviews
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
                  placeholder="Search reviews..."
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Display */}
      <Card className="mx-1 md:mx-0">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-base">Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border-b p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={review.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {review.customer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm truncate">{review.customer}</p>
                      <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{review.product}</p>
                    <p className="text-sm font-medium mt-1">{review.title}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review.comment}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(review.status)}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ThumbsUp className="w-3 h-3" />
                      {review.helpful}
                    </div>
                    {review.reported > 0 && (
                      <div className="flex items-center gap-1 text-xs text-red-500">
                        <Flag className="w-3 h-3" />
                        {review.reported}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={review.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {review.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.customer}</p>
                          <p className="text-sm text-gray-500">{review.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{review.product}</p>
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-sm">{review.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                          <ThumbsUp className="w-4 h-4 text-green-600" />
                          {review.helpful}
                        </div>
                        {review.reported > 0 && (
                          <div className="flex items-center gap-1 text-sm text-red-600">
                            <Flag className="w-4 h-4" />
                            {review.reported}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review Details</DialogTitle>
                            </DialogHeader>
                            <ReviewDetails review={review} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
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

function ReviewDetails({ review }: { review: any }) {
  return (
    <div className="space-y-4">
      {/* Customer Info */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={review.avatar || "/placeholder.svg"} />
          <AvatarFallback>
            {review.customer
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{review.customer}</h3>
          <p className="text-gray-600">{review.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({review.rating}/5)</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h4 className="font-semibold mb-2">Product</h4>
        <p className="text-gray-700">{review.product}</p>
      </div>

      {/* Review Content */}
      <div>
        <h4 className="font-semibold mb-2">Review</h4>
        <h5 className="font-medium text-lg mb-2">{review.title}</h5>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-primary-600">
            <ThumbsUp className="w-5 h-5" />
            <span className="text-xl font-bold">{review.helpful}</span>
          </div>
          <p className="text-sm text-gray-500">Helpful votes</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-primary-700">
            <Flag className="w-5 h-5" />
            <span className="text-xl font-bold">{review.reported}</span>
          </div>
          <p className="text-sm text-gray-500">Reports</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-primary-800">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xl font-bold">0</span>
          </div>
          <p className="text-sm text-gray-500">Responses</p>
        </div>
      </div>

      {/* Admin Response */}
      <div>
        <h4 className="font-semibold mb-2">Admin Response</h4>
        <Textarea placeholder="Write a response to this review..." rows={3} className="rounded-xl" />
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-2 pt-4">
        <Button className="rounded-xl">
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button variant="outline" className="rounded-xl bg-transparent">
          <Flag className="w-4 h-4 mr-2" />
          Flag
        </Button>
        <Button variant="outline" className="rounded-xl bg-transparent">
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
        <Button variant="outline" className="rounded-xl bg-transparent">
          <MessageSquare className="w-4 h-4 mr-2" />
          Respond
        </Button>
      </div>
    </div>
  )
}
