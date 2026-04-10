"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  LinkIcon,
  ChevronUp,
  Tag,
  ArrowRight,
} from "lucide-react"

// Mock blog post data
const blogPost = {
  id: 1,
  title: "10 Must-Have Tech Gadgets for 2024: Revolutionary Devices Changing Our Lives",
  slug: "tech-gadgets-2024",
  excerpt:
    "Discover the latest technology trends and gadgets that are revolutionizing how we work, play, and live in the modern digital age.",
  content: `
    <p>The technology landscape in 2024 is more exciting than ever before. From AI-powered devices to sustainable tech solutions, this year has brought us innovations that seemed like science fiction just a few years ago. In this comprehensive guide, we'll explore the ten most revolutionary gadgets that are reshaping our daily lives.</p>

    <h2>1. AI-Powered Smart Glasses</h2>
    <p>The latest generation of smart glasses has finally achieved the perfect balance between functionality and style. These devices offer real-time translation, navigation assistance, and seamless integration with your smartphone, all while looking like regular eyewear.</p>

    <h2>2. Foldable Smartphones with Improved Durability</h2>
    <p>2024's foldable phones have addressed the durability concerns of earlier models. With enhanced hinge mechanisms and stronger flexible displays, these devices offer the convenience of a tablet in your pocket without the fragility issues.</p>

    <h2>3. Wireless Charging Furniture</h2>
    <p>Imagine never having to search for a charging cable again. The new generation of furniture with built-in wireless charging capabilities is making this dream a reality. From coffee tables to nightstands, your furniture is now part of your tech ecosystem.</p>

    <h2>4. Advanced Health Monitoring Wearables</h2>
    <p>Health monitoring has reached new heights with devices that can track everything from blood glucose levels to stress indicators. These wearables provide real-time health insights and can even predict potential health issues before they become serious.</p>

    <h2>5. Sustainable Solar-Powered Devices</h2>
    <p>Environmental consciousness meets cutting-edge technology in 2024's solar-powered gadgets. From laptops that never need plugging in to smartphones with integrated solar panels, sustainable tech is no longer a compromise on performance.</p>

    <h2>The Future is Here</h2>
    <p>These gadgets represent more than just technological advancement; they represent a shift in how we interact with the world around us. As we continue to integrate these devices into our daily lives, we're not just adopting new technology – we're embracing a new way of living.</p>

    <p>The key to making the most of these innovations is understanding how they fit into your lifestyle. Whether you're a tech enthusiast or someone who simply wants to make life easier, there's something in this list that can enhance your daily experience.</p>
  `,
  image: "/tech-gadgets-display.png",
  author: {
    name: "Sarah Johnson",
    avatar: "/professional-woman-tech-writer.png",
    bio: "Sarah is a technology journalist with over 8 years of experience covering consumer electronics and emerging tech trends. She holds a degree in Computer Science and has worked with leading tech publications.",
    social: {
      twitter: "@sarahjtech",
      linkedin: "sarah-johnson-tech",
    },
  },
  publishedAt: "March 15, 2024",
  readTime: "8 min read",
  views: "2.4k",
  likes: 156,
  category: "Technology",
  tags: ["Technology", "Gadgets", "Innovation", "2024 Trends", "Consumer Electronics"],
}

// Related posts
const relatedPosts = [
  {
    id: 2,
    title: "Sustainable Fashion: Making Eco-Friendly Choices",
    excerpt: "Learn how to build a sustainable wardrobe without compromising on style.",
    image: "/sustainable-fashion-collage.png",
    category: "Fashion",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Home Organization Tips That Actually Work",
    excerpt: "Transform your living space with practical organization strategies.",
    image: "/organized-living-space.png",
    category: "Home & Living",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "The Ultimate Guide to Online Shopping Safety",
    excerpt: "Stay safe while shopping online with essential security tips.",
    image: "/online-shopping-safety.png",
    category: "Shopping Tips",
    readTime: "4 min read",
  },
]

export default function BlogPostPage() {
  const params = useParams()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(blogPost.likes)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(progress)
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = blogPost.title
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "The article link has been copied to your clipboard.",
        })
        return
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-primary-100 z-50">
        <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-primary-100 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-base font-medium">Back to Blog</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-1 md:gap-2 ${isLiked ? "text-red-500" : "text-gray-600"}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs md:text-sm">{likeCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-1 md:gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Article Header */}
        <header className="mb-6 md:mb-8">
          <div className="mb-4 md:mb-6">
            <Badge className="bg-primary-600 text-white mb-3 md:mb-4 text-xs md:text-sm">{blogPost.category}</Badge>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-900 leading-tight mb-4 md:mb-6">
              {blogPost.title}
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">{blogPost.excerpt}</p>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-gray-500 mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src={blogPost.author.avatar || "/placeholder.svg"} alt={blogPost.author.name} />
                <AvatarFallback>
                  {blogPost.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-700">{blogPost.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary-500" />
              {blogPost.publishedAt}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary-500" />
              {blogPost.readTime}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-primary-500" />
              {blogPost.views} views
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl mb-6 md:mb-8">
            <Image src={blogPost.image || "/placeholder.svg"} alt={blogPost.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-sm md:prose-lg max-w-none mb-8 md:mb-12">
          <div
            className="text-gray-700 leading-relaxed [&>h2]:text-xl md:[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-primary-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>p]:mb-4 md:[&>p]:mb-6 [&>p]:text-base md:[&>p]:text-lg [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </div>

        {/* Tags */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
            <span className="font-medium text-primary-900 text-sm md:text-base">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blogPost.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-primary-200 text-primary-700 hover:bg-primary-50 text-xs md:text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="mb-8 md:mb-12" />

        {/* Social Share */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-lg md:text-xl font-bold text-primary-900 mb-4 md:mb-6">Share this article</h3>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Button
              onClick={() => handleShare("facebook")}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-sm md:text-base"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              onClick={() => handleShare("twitter")}
              className="bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-2 text-sm md:text-base"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              onClick={() => handleShare("linkedin")}
              className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2 text-sm md:text-base"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              onClick={() => handleShare("copy")}
              variant="outline"
              className="border-primary-200 text-primary-700 hover:bg-primary-50 flex items-center gap-2 text-sm md:text-base"
            >
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>

        <Separator className="mb-8 md:mb-12" />

        {/* Author Bio */}
        <div className="mb-12 md:mb-16">
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 mx-auto md:mx-0">
                <AvatarImage src={blogPost.author.avatar || "/placeholder.svg"} alt={blogPost.author.name} />
                <AvatarFallback className="text-lg md:text-xl">
                  {blogPost.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg md:text-xl font-bold text-primary-900 mb-2">{blogPost.author.name}</h4>
                <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">{blogPost.author.bio}</p>
                <div className="flex justify-center md:justify-start gap-4">
                  <span className="text-sm text-primary-600">@{blogPost.author.social.twitter}</span>
                  <span className="text-sm text-primary-600">LinkedIn: {blogPost.author.social.linkedin}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Related Articles */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-6 md:mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedPosts.map((post, index) => (
              <Card
                key={post.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 bg-white group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary-600 text-white text-xs">{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4 md:p-6">
                  <h4 className="font-bold text-base md:text-lg leading-tight text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 mb-4 text-sm md:text-base line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-500">{post.readTime}</span>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium text-sm md:text-base group/link"
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
      </article>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg z-40 animate-bounce"
        >
          <ChevronUp className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      )}
    </div>
  )
}
