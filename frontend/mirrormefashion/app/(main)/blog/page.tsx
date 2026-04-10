"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Search, TrendingUp, Clock, Eye } from "lucide-react"

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

const blogPosts = [
  {
    id: 1,
    title: "10 Must-Have Tech Gadgets for 2024",
    excerpt:
      "Discover the latest technology trends and gadgets that are revolutionizing how we work and play in the modern digital age.",
    image: "/tech-gadgets-display.png",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Technology",
    readTime: "5 min read",
    views: "2.4k",
    trending: true,
    featured: true,
  },
  {
    id: 2,
    title: "Sustainable Fashion: Making Eco-Friendly Choices",
    excerpt:
      "Learn how to build a sustainable wardrobe without compromising on style or breaking the bank with these expert tips.",
    image: "/sustainable-fashion-collage.png",
    author: "Emily Rodriguez",
    date: "March 12, 2024",
    category: "Fashion",
    readTime: "7 min read",
    views: "1.8k",
    trending: true,
    featured: true,
  },
  {
    id: 3,
    title: "Home Organization Tips That Actually Work",
    excerpt:
      "Transform your living space with these practical organization strategies and storage solutions that make a real difference.",
    image: "/organized-living-space.png",
    author: "Mike Chen",
    date: "March 10, 2024",
    category: "Home & Living",
    readTime: "6 min read",
    views: "3.1k",
    trending: true,
  },
  {
    id: 4,
    title: "The Ultimate Guide to Online Shopping Safety",
    excerpt:
      "Stay safe while shopping online with these essential tips for protecting your personal information and avoiding scams.",
    image: "/online-shopping-safety.png",
    author: "Sarah Johnson",
    date: "March 8, 2024",
    category: "Shopping Tips",
    readTime: "4 min read",
    views: "1.2k",
    featured: true,
  },
  {
    id: 5,
    title: "Fitness Equipment for Small Spaces",
    excerpt:
      "Get fit at home with these space-saving fitness equipment recommendations perfect for apartment living and small homes.",
    image: "/diverse-fitness-equipment.png",
    author: "Emily Rodriguez",
    date: "March 5, 2024",
    category: "Fitness",
    readTime: "8 min read",
    views: "2.7k",
    trending: true,
  },
  {
    id: 6,
    title: "Gift Ideas for Every Occasion",
    excerpt:
      "Never run out of gift ideas again with our comprehensive guide to thoughtful presents for birthdays, holidays, and more.",
    image: "/gift-ideas.png",
    author: "Mike Chen",
    date: "March 3, 2024",
    category: "Gift Guide",
    readTime: "10 min read",
    views: "4.2k",
    featured: true,
  },
  {
    id: 7,
    title: "AI-Powered Fashion Styling Revolution",
    excerpt:
      "Explore how artificial intelligence is transforming personal styling and helping people discover their perfect look effortlessly.",
    image: "/ai-fashion-styling.png",
    author: "Alex Thompson",
    date: "March 18, 2024",
    category: "Technology",
    readTime: "6 min read",
    views: "5.1k",
    trending: true,
    featured: true,
  },
  {
    id: 8,
    title: "Minimalist Wardrobe Essentials for 2024",
    excerpt:
      "Build a capsule wardrobe with these timeless pieces that offer maximum versatility and style for every season.",
    image: "/minimalist-wardrobe.png",
    author: "Jessica Park",
    date: "March 16, 2024",
    category: "Fashion",
    readTime: "9 min read",
    views: "3.8k",
    trending: true,
    featured: true,
  },
  {
    id: 9,
    title: "Smart Home Automation on a Budget",
    excerpt:
      "Transform your home into a smart home without breaking the bank using these affordable automation solutions and DIY tips.",
    image: "/smart-home-automation-budget.png",
    author: "David Kim",
    date: "March 14, 2024",
    category: "Technology",
    readTime: "7 min read",
    views: "2.9k",
    featured: true,
  },
  {
    id: 10,
    title: "Wellness Trends Shaping 2024",
    excerpt:
      "Discover the latest wellness trends from mindful living to innovative fitness routines that are defining health in 2024.",
    image: "/wellness-trends-2024-mindful-living.png",
    author: "Dr. Maria Santos",
    date: "March 11, 2024",
    category: "Fitness",
    readTime: "8 min read",
    views: "4.5k",
    trending: true,
    featured: true,
  },
  {
    id: 11,
    title: "Sustainable Living: Zero Waste Kitchen Tips",
    excerpt:
      "Learn practical strategies to reduce waste in your kitchen while saving money and contributing to environmental conservation.",
    image: "/zero-waste-kitchen.png",
    author: "Emma Green",
    date: "March 9, 2024",
    category: "Home & Living",
    readTime: "5 min read",
    views: "2.1k",
    trending: true,
  },
  {
    id: 12,
    title: "Digital Detox: Reclaiming Your Time",
    excerpt:
      "Break free from digital overwhelm with proven strategies to reduce screen time and improve your mental well-being.",
    image: "/digital-detox-balance.png",
    author: "Ryan Mitchell",
    date: "March 7, 2024",
    category: "Technology",
    readTime: "6 min read",
    views: "3.3k",
    featured: true,
  },
]

const categories = ["All Posts", "Fashion", "Technology", "Home & Living", "Shopping Tips", "Fitness", "Gift Guide"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter((post) => post.featured || post.trending)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Reduced Animated Header */}
      <div
        className={`relative overflow-hidden transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16 text-center text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              Our Blog
            </h1>
            <div className="w-24 md:w-32 h-1 bg-white mx-auto mb-4 md:mb-6 rounded-full"></div>
            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed px-4">
              Discover insights, trends, and expert advice to enhance your lifestyle
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-16 md:w-20 h-16 md:h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-20 md:top-32 right-10 md:right-20 w-12 md:w-16 h-12 md:h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-10 left-1/4 w-10 md:w-12 h-10 md:h-12 bg-white/10 rounded-full animate-float"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 md:-mt-10 relative z-10">
        {/* Search and Categories */}
        <div
          className={`mb-8 md:mb-12 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Card className="p-4 md:p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center">
              {/* Search Bar */}
              <div className="relative w-full lg:w-96">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 border-2 border-primary-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white/90 text-sm md:text-base"
                />
                <Search className="absolute left-3 md:left-4 top-2.5 md:top-3.5 h-4 md:h-5 w-4 md:w-5 text-primary-400" />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-end flex-1">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full transition-all duration-300 hover:scale-105 text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 ${
                      selectedCategory === category
                        ? "bg-primary-600 text-white shadow-lg"
                        : "bg-white text-primary-700 border-primary-200 hover:bg-primary-50 hover:border-primary-300"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Featured Posts Slider */}
        <div
          className={`mb-12 md:mb-16 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <TrendingUp className="h-5 md:h-6 w-5 md:w-6 text-primary-600" />
            <h2 className="text-xl md:text-2xl font-bold text-primary-900">Featured & Trending</h2>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 25 },
              1024: { slidesPerView: 2.5, spaceBetween: 30 },
            }}
            className="featured-swiper"
          >
            {featuredPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-primary-50">
                  <div className="relative h-48 md:h-64">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 md:top-4 left-3 md:left-4 flex gap-2">
                      {post.featured && <Badge className="bg-yellow-500 text-white border-0 text-xs">Featured</Badge>}
                      {post.trending && <Badge className="bg-primary-600 text-white border-0 text-xs">Trending</Badge>}
                    </div>
                    <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white">
                      <Badge className="bg-white/20 text-white border-0 mb-2 text-xs">{post.category}</Badge>
                      <h3 className="font-bold text-sm md:text-lg leading-tight">{post.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4 md:p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-3 md:h-4 w-3 md:w-4 text-primary-500" />
                          <span className="hidden sm:inline">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 md:h-4 w-3 md:w-4 text-primary-500" />
                          {post.readTime}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 md:h-4 w-3 md:w-4 text-primary-500" />
                        {post.views}
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium group text-sm md:text-base"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-3 md:h-4 w-3 md:w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* All Posts Grid */}
        <div
          className={`mb-12 md:mb-16 transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-primary-900">All Articles</h2>
            <span className="text-gray-500 text-sm md:text-base">{filteredPosts.length} articles found</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map((post, index) => (
              <Card
                key={post.id}
                className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 bg-white group animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary-600 hover:bg-primary-700 transition-colors duration-300 text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  {post.trending && (
                    <div className="absolute top-3 right-3">
                      <TrendingUp className="h-4 md:h-5 w-4 md:w-5 text-yellow-400" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2 p-4 md:p-6 md:pb-2">
                  <h3 className="font-bold text-base md:text-lg leading-tight text-primary-900 group-hover:text-primary-700 transition-colors duration-300">
                    {post.title}
                  </h3>
                </CardHeader>

                <CardContent className="p-4 md:p-6 pt-0">
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 md:h-4 w-3 md:w-4 text-primary-500" />
                        <span className="hidden sm:inline">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 md:h-4 w-3 md:w-4 text-primary-500" />
                        <span className="hidden md:inline">{post.date}</span>
                        <span className="md:hidden">{post.date.split(" ")[1]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 md:h-4 w-3 md:w-4 text-primary-500" />
                      {post.views}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 md:h-4 w-3 md:w-4" />
                      {post.readTime}
                    </span>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium group/link text-sm md:text-base"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-3 md:h-4 w-3 md:w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div
          className={`mb-12 md:mb-16 transition-all duration-700 delay-900 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900"></div>
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
            <CardContent className="relative p-6 md:p-12 text-center text-white">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay in the Loop</h3>
                <p className="mb-6 md:mb-8 opacity-90 text-base md:text-lg">
                  Get the latest articles, trends, and exclusive content delivered straight to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 text-sm md:text-base"
                  />
                  <Button className="bg-white text-primary-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs md:text-sm mt-4 md:mt-6 opacity-75">
                  Join 10,000+ subscribers. No spam, unsubscribe anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Load More Button */}
        <div className="text-center mb-12 md:mb-16">
          <Button
            variant="outline"
            size="lg"
            className="px-6 md:px-8 py-2 md:py-3 rounded-full border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 hover:scale-105 bg-transparent text-sm md:text-base"
          >
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  )
}
