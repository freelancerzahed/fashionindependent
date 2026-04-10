"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Search,
  Book,
  Video,
  Clock,
  Users,
  Sparkles,
  Headphones,
  LifeBuoy,
  ThumbsUp,
  ThumbsDown,
  X,
  Settings,
  ShoppingBag,
  TrendingUp,
  Send,
  ExternalLink,
  Play,
  MessageSquare,
} from "lucide-react"

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    color: "from-blue-500 to-blue-600",
    count: 8,
    faqs: [
      {
        id: "create-account",
        question: "How do I create an account?",
        answer:
          "Click the 'Sign Up' button in the top right corner, fill in your details, and verify your email address. You can also sign up using your Google or Facebook account for faster registration.",
        helpful: 45,
        notHelpful: 3,
        tags: ["account", "registration", "signup"],
      },
      {
        id: "complete-profile",
        question: "How do I complete my profile?",
        answer:
          "Navigate to your profile settings and fill out all the required fields including your bio, profile picture, style preferences, and body measurements. A complete profile helps our AI provide better recommendations.",
        helpful: 38,
        notHelpful: 2,
        tags: ["profile", "setup", "preferences"],
      },
      {
        id: "first-post",
        question: "How do I create my first post?",
        answer:
          "Go to your dashboard and click 'Create Post'. You can add text, images, tag products, and choose your audience. Use our AI assistant for content ideas and styling tips.",
        helpful: 52,
        notHelpful: 1,
        tags: ["posting", "content", "social"],
      },
      {
        id: "style-quiz",
        question: "What is the style quiz and why should I take it?",
        answer:
          "The style quiz helps our AI understand your fashion preferences, body type, and lifestyle. This enables personalized recommendations for outfits, products, and styling tips tailored specifically to you.",
        helpful: 41,
        notHelpful: 4,
        tags: ["quiz", "personalization", "ai"],
      },
      {
        id: "mobile-app",
        question: "Is there a mobile app available?",
        answer:
          "Yes! Download our mobile app from the App Store or Google Play. The app includes all web features plus exclusive mobile-only features like AR try-on and instant outfit capture.",
        helpful: 67,
        notHelpful: 2,
        tags: ["mobile", "app", "download"],
      },
      {
        id: "navigation",
        question: "How do I navigate the platform?",
        answer:
          "Use the main navigation bar to access Shop, Community, Blog, and your profile. The sidebar provides quick access to your dashboard, messages, notifications, and settings.",
        helpful: 29,
        notHelpful: 1,
        tags: ["navigation", "interface", "basics"],
      },
      {
        id: "follow-users",
        question: "How do I follow other users?",
        answer:
          "Visit any user's profile and click the 'Follow' button. You can discover new users through the 'Discover' section, style challenges, or by browsing posts in your feed.",
        helpful: 33,
        notHelpful: 0,
        tags: ["following", "social", "discovery"],
      },
      {
        id: "first-steps",
        question: "What should I do after signing up?",
        answer:
          "1. Complete your profile, 2. Take the style quiz, 3. Upload a few outfit photos, 4. Follow users with similar style, 5. Create your first post, 6. Explore the shop and save items you like.",
        helpful: 58,
        notHelpful: 3,
        tags: ["onboarding", "checklist", "setup"],
      },
    ],
  },
  {
    id: "ai-features",
    title: "AI & Personalization",
    icon: Sparkles,
    color: "from-purple-500 to-purple-600",
    count: 6,
    faqs: [
      {
        id: "ai-recommendations",
        question: "How does the AI recommendation system work?",
        answer:
          "Our AI analyzes your body measurements, style preferences, past purchases, browsing behavior, and social interactions to suggest outfits and products. It continuously learns from your feedback to improve recommendations.",
        helpful: 73,
        notHelpful: 5,
        tags: ["ai", "recommendations", "personalization"],
      },
      {
        id: "improve-recommendations",
        question: "How can I improve my recommendations?",
        answer:
          "Interact with content by liking, saving, and purchasing recommended items. Complete your style profile, upload outfit photos, and provide feedback on suggestions. The more you engage, the better the AI becomes.",
        helpful: 61,
        notHelpful: 2,
        tags: ["ai", "improvement", "feedback"],
      },
      {
        id: "body-measurements",
        question: "Why do I need to provide body measurements?",
        answer:
          "Body measurements help our AI recommend properly fitting clothes and suggest flattering styles for your body type. All measurements are encrypted and used only for personalization.",
        helpful: 49,
        notHelpful: 8,
        tags: ["measurements", "fitting", "privacy"],
      },
      {
        id: "style-assistant",
        question: "What is Sofia AI Assistant?",
        answer:
          "Sofia is your personal AI styling assistant. She can help with outfit ideas, answer fashion questions, suggest products, and provide styling tips based on your preferences and current trends.",
        helpful: 82,
        notHelpful: 1,
        tags: ["sofia", "assistant", "styling"],
      },
      {
        id: "ar-features",
        question: "How do AR try-on features work?",
        answer:
          "Use your device's camera to virtually try on clothes, accessories, and makeup. Our AR technology maps items to your body for a realistic preview before purchasing.",
        helpful: 56,
        notHelpful: 7,
        tags: ["ar", "try-on", "virtual"],
      },
      {
        id: "trend-predictions",
        question: "How does trend prediction work?",
        answer:
          "Our AI analyzes global fashion data, social media trends, runway shows, and user behavior to predict upcoming trends and suggest relevant items for your wardrobe.",
        helpful: 44,
        notHelpful: 3,
        tags: ["trends", "prediction", "fashion"],
      },
    ],
  },
  {
    id: "shopping",
    title: "Shopping & Orders",
    icon: ShoppingBag,
    color: "from-green-500 to-green-600",
    count: 10,
    faqs: [
      {
        id: "place-order",
        question: "How do I place an order?",
        answer:
          "Add items to your cart, review your order, enter shipping information, select payment method, and confirm your purchase. You'll receive an order confirmation email immediately.",
        helpful: 89,
        notHelpful: 2,
        tags: ["ordering", "checkout", "purchase"],
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Buy Now Pay Later options like Klarna and Afterpay.",
        helpful: 76,
        notHelpful: 1,
        tags: ["payment", "methods", "billing"],
      },
      {
        id: "shipping-info",
        question: "What are your shipping options and costs?",
        answer:
          "We offer standard (5-7 days, $5.99), express (2-3 days, $12.99), and overnight ($24.99) shipping. Free standard shipping on orders over $75. International shipping available.",
        helpful: 68,
        notHelpful: 4,
        tags: ["shipping", "delivery", "costs"],
      },
      {
        id: "track-order",
        question: "How do I track my order?",
        answer:
          "Check your email for tracking information or log into your account and go to 'My Orders'. You'll receive updates at each stage of delivery.",
        helpful: 71,
        notHelpful: 1,
        tags: ["tracking", "orders", "delivery"],
      },
      {
        id: "returns-exchanges",
        question: "What is your return and exchange policy?",
        answer:
          "Returns accepted within 30 days of delivery. Items must be unworn with tags attached. Free returns for defective items. Exchange for different size/color available.",
        helpful: 63,
        notHelpful: 6,
        tags: ["returns", "exchanges", "policy"],
      },
      {
        id: "size-guide",
        question: "How do I find the right size?",
        answer:
          "Use our size guide on each product page, check the AI size recommendations based on your measurements, or use the virtual fitting feature in our mobile app.",
        helpful: 55,
        notHelpful: 8,
        tags: ["sizing", "fit", "measurements"],
      },
      {
        id: "wishlist",
        question: "How do I save items for later?",
        answer:
          "Click the heart icon on any product to add it to your wishlist. Access your saved items from your profile or the wishlist icon in the navigation.",
        helpful: 42,
        notHelpful: 1,
        tags: ["wishlist", "save", "favorites"],
      },
      {
        id: "discounts-coupons",
        question: "How do I use discount codes and coupons?",
        answer:
          "Enter your discount code at checkout in the 'Promo Code' field. Codes are case-sensitive and have expiration dates. Some codes may have minimum purchase requirements.",
        helpful: 59,
        notHelpful: 3,
        tags: ["discounts", "coupons", "promo"],
      },
      {
        id: "gift-cards",
        question: "Do you offer gift cards?",
        answer:
          "Yes! Purchase digital gift cards in amounts from $25-$500. Gift cards never expire and can be used for any purchase on our platform.",
        helpful: 37,
        notHelpful: 2,
        tags: ["gift-cards", "gifts", "purchase"],
      },
      {
        id: "order-changes",
        question: "Can I modify or cancel my order?",
        answer:
          "Orders can be modified or cancelled within 1 hour of placement. After that, contact customer service immediately. Once shipped, orders cannot be changed.",
        helpful: 48,
        notHelpful: 5,
        tags: ["modify", "cancel", "changes"],
      },
    ],
  },
  {
    id: "social-community",
    title: "Social & Community",
    icon: Users,
    color: "from-pink-500 to-pink-600",
    count: 7,
    faqs: [
      {
        id: "create-posts",
        question: "How do I create engaging posts?",
        answer:
          "Share high-quality photos, write descriptive captions, use relevant hashtags, tag products, and engage with your audience. Our AI can suggest content ideas and optimal posting times.",
        helpful: 64,
        notHelpful: 3,
        tags: ["posting", "engagement", "content"],
      },
      {
        id: "style-challenges",
        question: "What are style challenges?",
        answer:
          "Community events where users create outfits based on specific themes. Participate to showcase creativity, win prizes, and discover new styles. New challenges launch weekly.",
        helpful: 51,
        notHelpful: 2,
        tags: ["challenges", "community", "contests"],
      },
      {
        id: "follow-unfollow",
        question: "How do I manage my following list?",
        answer:
          "Go to your profile > Following to see all users you follow. Click 'Unfollow' to remove users. You can also organize follows into lists for better content curation.",
        helpful: 39,
        notHelpful: 1,
        tags: ["following", "management", "lists"],
      },
      {
        id: "privacy-settings",
        question: "How do I control who sees my content?",
        answer:
          "In Settings > Privacy, choose between public, friends-only, or private profile. Control who can message you, tag you, and see your activity. Customize visibility for each post.",
        helpful: 72,
        notHelpful: 4,
        tags: ["privacy", "visibility", "settings"],
      },
      {
        id: "report-content",
        question: "How do I report inappropriate content?",
        answer:
          "Click the three dots on any post or profile and select 'Report'. Choose the reason and provide details. Our moderation team reviews all reports within 24 hours.",
        helpful: 46,
        notHelpful: 1,
        tags: ["reporting", "moderation", "safety"],
      },
      {
        id: "messaging",
        question: "How does the messaging system work?",
        answer:
          "Send direct messages to users you follow or who follow you. Share outfits, ask for styling advice, or discuss fashion trends. Group chats available for close friends.",
        helpful: 58,
        notHelpful: 2,
        tags: ["messaging", "chat", "communication"],
      },
      {
        id: "community-guidelines",
        question: "What are the community guidelines?",
        answer:
          "Be respectful, share authentic content, respect intellectual property, no spam or harassment, and maintain a positive environment. Full guidelines available in our Terms of Service.",
        helpful: 41,
        notHelpful: 3,
        tags: ["guidelines", "rules", "community"],
      },
    ],
  },
  {
    id: "account-settings",
    title: "Account & Settings",
    icon: Settings,
    color: "from-orange-500 to-orange-600",
    count: 8,
    faqs: [
      {
        id: "change-password",
        question: "How do I change my password?",
        answer:
          "Go to Settings > Security > Change Password. Enter your current password and new password twice. We recommend using a strong, unique password with at least 8 characters.",
        helpful: 67,
        notHelpful: 1,
        tags: ["password", "security", "account"],
      },
      {
        id: "two-factor-auth",
        question: "How do I enable two-factor authentication?",
        answer:
          "In Settings > Security, enable 2FA using your phone number or authenticator app. This adds an extra layer of security to your account and is highly recommended.",
        helpful: 54,
        notHelpful: 2,
        tags: ["2fa", "security", "authentication"],
      },
      {
        id: "notification-settings",
        question: "How do I manage my notifications?",
        answer:
          "Go to Settings > Notifications to customize email, push, and in-app notifications. Choose what updates you want to receive and how often.",
        helpful: 61,
        notHelpful: 3,
        tags: ["notifications", "settings", "preferences"],
      },
      {
        id: "delete-account",
        question: "How do I delete my account?",
        answer:
          "In Settings > Account > Delete Account. This action is permanent and cannot be undone. All your data, posts, and connections will be permanently removed.",
        helpful: 43,
        notHelpful: 7,
        tags: ["delete", "account", "permanent"],
      },
      {
        id: "data-export",
        question: "Can I export my data?",
        answer:
          "Yes, go to Settings > Privacy > Export Data. You'll receive a download link via email within 48 hours containing all your account data in JSON format.",
        helpful: 38,
        notHelpful: 2,
        tags: ["export", "data", "download"],
      },
      {
        id: "email-preferences",
        question: "How do I update my email preferences?",
        answer:
          "In Settings > Communications, choose which emails you want to receive: order updates, style tips, promotions, and community notifications. Unsubscribe links are in every email.",
        helpful: 52,
        notHelpful: 1,
        tags: ["email", "preferences", "communications"],
      },
      {
        id: "profile-visibility",
        question: "How do I control my profile visibility?",
        answer:
          "Settings > Privacy lets you make your profile public, friends-only, or completely private. You can also hide specific information like your following count or activity status.",
        helpful: 49,
        notHelpful: 4,
        tags: ["visibility", "privacy", "profile"],
      },
      {
        id: "linked-accounts",
        question: "How do I manage linked social accounts?",
        answer:
          "In Settings > Connected Accounts, view and manage connections to Facebook, Instagram, Google, and other platforms. You can disconnect accounts anytime.",
        helpful: 35,
        notHelpful: 2,
        tags: ["linked", "social", "connections"],
      },
    ],
  },
  {
    id: "creator-selling",
    title: "Creator & Selling",
    icon: TrendingUp,
    color: "from-indigo-500 to-indigo-600",
    count: 9,
    faqs: [
      {
        id: "become-creator",
        question: "How do I become a creator?",
        answer:
          "Apply through Settings > Creator Mode. You'll need to meet minimum follower requirements, have high-quality content, and agree to creator guidelines. Approval typically takes 3-5 business days.",
        helpful: 78,
        notHelpful: 4,
        tags: ["creator", "application", "requirements"],
      },
      {
        id: "sell-products",
        question: "How do I start selling products?",
        answer:
          "Once approved as a creator, go to Creator Dashboard > Add Products. Upload high-quality photos, write detailed descriptions, set prices, and manage inventory. We handle payment processing.",
        helpful: 69,
        notHelpful: 3,
        tags: ["selling", "products", "creator"],
      },
      {
        id: "commission-rates",
        question: "What are the commission rates?",
        answer:
          "We charge 8% commission on sales plus payment processing fees (2.9% + $0.30). Creators with high sales volume may qualify for reduced rates. No listing fees or monthly charges.",
        helpful: 85,
        notHelpful: 6,
        tags: ["commission", "fees", "rates"],
      },
      {
        id: "payout-schedule",
        question: "When do I get paid?",
        answer:
          "Payouts are processed weekly on Fridays for sales from the previous week. Funds are held for 7 days after delivery confirmation to allow for returns. Minimum payout is $25.",
        helpful: 72,
        notHelpful: 2,
        tags: ["payouts", "payments", "schedule"],
      },
      {
        id: "product-guidelines",
        question: "What are the product listing guidelines?",
        answer:
          "Products must be authentic, accurately described, and comply with our quality standards. Prohibited items include replicas, used items (unless vintage), and restricted categories.",
        helpful: 56,
        notHelpful: 5,
        tags: ["guidelines", "products", "quality"],
      },
      {
        id: "analytics-insights",
        question: "How do I track my performance?",
        answer:
          "Creator Dashboard provides detailed analytics: sales, views, engagement, top products, and audience insights. Use this data to optimize your content and product strategy.",
        helpful: 63,
        notHelpful: 1,
        tags: ["analytics", "performance", "insights"],
      },
      {
        id: "brand-partnerships",
        question: "Can I partner with brands?",
        answer:
          "Yes! Our Brand Partnership program connects creators with fashion brands for sponsored content and collaborations. Apply through Creator Dashboard once you meet eligibility requirements.",
        helpful: 81,
        notHelpful: 3,
        tags: ["partnerships", "brands", "collaborations"],
      },
      {
        id: "content-monetization",
        question: "How can I monetize my content?",
        answer:
          "Earn through product sales, brand partnerships, affiliate commissions, and our Creator Fund. High-performing content creators can also offer styling consultations and exclusive content.",
        helpful: 74,
        notHelpful: 2,
        tags: ["monetization", "earnings", "content"],
      },
      {
        id: "creator-support",
        question: "What support is available for creators?",
        answer:
          "Dedicated creator support team, educational resources, monthly webinars, creator community forum, and priority customer service. We're here to help you succeed!",
        helpful: 67,
        notHelpful: 1,
        tags: ["support", "resources", "community"],
      },
    ],
  },
]

const supportOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    color: "from-red-500 to-red-600",
    available: true,
    responseTime: "< 2 min",
    action: "Start Chat",
    type: "chat",
  },
  {
    title: "Email Support",
    description: "Send us detailed questions via email",
    icon: Mail,
    color: "from-blue-500 to-blue-600",
    available: true,
    responseTime: "< 24 hrs",
    action: "Send Email",
    type: "email",
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step video guides",
    icon: Video,
    color: "from-green-500 to-green-600",
    available: true,
    responseTime: "Self-paced",
    action: "Watch Videos",
    type: "video",
  },
  {
    title: "Community Forum",
    description: "Get help from other users",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    available: true,
    responseTime: "Varies",
    action: "Visit Forum",
    type: "forum",
  },
]

const videoTutorials = [
  {
    id: "getting-started-video",
    title: "Getting Started with MirrorMe Fashion",
    duration: "5:32",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Getting+Started+Tutorial",
    description: "Learn the basics of creating your account and setting up your profile",
  },
  {
    id: "ai-features-video",
    title: "Using AI Recommendations",
    duration: "7:45",
    thumbnail: "/placeholder.svg?height=200&width=300&text=AI+Features+Tutorial",
    description: "Discover how our AI helps you find the perfect outfits",
  },
  {
    id: "shopping-guide-video",
    title: "Shopping and Orders Guide",
    duration: "6:18",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Shopping+Guide+Tutorial",
    description: "Complete guide to shopping, checkout, and order tracking",
  },
  {
    id: "creator-mode-video",
    title: "Creator Mode Tutorial",
    duration: "9:22",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Creator+Mode+Tutorial",
    description: "Learn how to become a creator and start selling your products",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("getting-started")
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, "helpful" | "not-helpful" | null>>({})
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<(typeof videoTutorials)[0] | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: "bot", message: "Hi! I'm here to help. What can I assist you with today?" },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories

    const query = searchQuery.toLowerCase()
    return faqCategories
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query) ||
            faq.tags.some((tag) => tag.toLowerCase().includes(query)),
        ),
      }))
      .filter((category) => category.faqs.length > 0)
  }, [searchQuery])

  const handleVote = (faqId: string, vote: "helpful" | "not-helpful") => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [faqId]: prev[faqId] === vote ? null : vote,
    }))

    toast({
      title: "Thank you for your feedback!",
      description: "Your vote helps us improve our help content.",
    })
  }

  const handleSupportAction = (type: string) => {
    switch (type) {
      case "chat":
        setIsChatDialogOpen(true)
        break
      case "email":
        setIsContactDialogOpen(true)
        break
      case "video":
        setIsVideoDialogOpen(true)
        break
      case "forum":
        window.open("https://community.mirrormefashion.com", "_blank")
        break
      default:
        break
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      })

      setContactForm({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      })
      setIsContactDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or use live chat for immediate assistance.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = { id: Date.now(), type: "user", message: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        message:
          "I understand you need help with that. Let me connect you with a human agent who can provide more detailed assistance. Please hold on for a moment.",
      }
      setChatMessages((prev) => [...prev, botResponse])
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: "bot",
        message: "I'm sorry, I'm having trouble connecting right now. Please try our email support for assistance.",
      }
      setChatMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVideoPlay = (video: (typeof videoTutorials)[0]) => {
    setSelectedVideo(video)
    // In a real app, this would open a video player
    toast({
      title: `Playing: ${video.title}`,
      description: `Duration: ${video.duration}`,
    })
  }

  const totalFaqs = faqCategories.reduce((sum, category) => sum + category.faqs.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20">
      {/* Non-sticky Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <LifeBuoy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
                  <p className="text-sm text-gray-600">{totalFaqs} articles • Updated daily</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:w-96">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button
                onClick={() => setIsContactDialogOpen(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 h-10"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Support Options */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportOptions.map((option, index) => (
              <Card
                key={option.title}
                className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleSupportAction(option.type)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110`}
                    >
                      <option.icon className="h-6 w-6 text-white" />
                    </div>
                    {option.available && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      {option.responseTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find quick answers to common questions</p>
          </div>

          {searchQuery ? (
            // Search Results
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found {filteredFaqs.reduce((sum, cat) => sum + cat.faqs.length, 0)} results for "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Clear search
                </Button>
              </div>

              <div className="space-y-6">
                {filteredFaqs.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
                      >
                        <category.icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                      <Badge variant="secondary">{category.faqs.length} results</Badge>
                    </div>

                    <Accordion type="single" collapsible className="space-y-2">
                      {category.faqs.map((faq) => (
                        <AccordionItem
                          key={faq.id}
                          value={faq.id}
                          className="border border-gray-200 rounded-lg px-4 hover:shadow-sm transition-shadow"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-4">
                            <div className="flex items-start gap-3 w-full">
                              <HelpCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-8 pb-4">
                              <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600">Was this helpful?</span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant={helpfulVotes[faq.id] === "helpful" ? "default" : "outline"}
                                      onClick={() => handleVote(faq.id, "helpful")}
                                      className="h-8 px-3"
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      {faq.helpful}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={helpfulVotes[faq.id] === "not-helpful" ? "default" : "outline"}
                                      onClick={() => handleVote(faq.id, "not-helpful")}
                                      className="h-8 px-3"
                                    >
                                      <ThumbsDown className="h-3 w-3 mr-1" />
                                      {faq.notHelpful}
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {faq.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Category Tabs
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1 bg-gray-100">
                  {faqCategories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
                      >
                        <category.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm">{category.title}</div>
                        <div className="text-xs text-gray-500">{category.count} articles</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {faqCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-gray-600">{category.count} frequently asked questions</p>
                  </div>

                  <Accordion type="single" collapsible className="space-y-3">
                    {category.faqs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-gray-200 rounded-xl px-6 hover:shadow-md transition-all duration-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-6">
                          <div className="flex items-start gap-4 w-full">
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 mt-1`}
                            >
                              <HelpCircle className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-lg pr-4">{faq.question}</h4>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-14 pb-6">
                            <p className="text-gray-700 leading-relaxed mb-6 text-base">{faq.answer}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 font-medium">Was this helpful?</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant={helpfulVotes[faq.id] === "helpful" ? "default" : "outline"}
                                    onClick={() => handleVote(faq.id, "helpful")}
                                    className="h-8 px-3 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {faq.helpful}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={helpfulVotes[faq.id] === "not-helpful" ? "default" : "outline"}
                                    onClick={() => handleVote(faq.id, "not-helpful")}
                                    className="h-8 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                  >
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    {faq.notHelpful}
                                  </Button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {faq.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </section>

        {/* Contact CTA */}
        <section className="mt-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-red-500 to-red-600 text-white overflow-hidden">
            <CardContent className="p-8 text-center relative">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Headphones className="h-8 w-8 text-white" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Still need help?</h3>
                  <p className="text-red-100 text-lg">
                    Can't find what you're looking for? Our support team is here to help you 24/7.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    onClick={() => setIsChatDialogOpen(true)}
                    className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button
                    onClick={() => setIsContactDialogOpen(true)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Contact Support Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-600" />
              Contact Support
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={contactForm.category}
                onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="orders">Orders & Shipping</SelectItem>
                  <SelectItem value="payments">Payments & Billing</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="creator">Creator Support</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Please describe your issue in detail..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Live Chat Dialog */}
      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-600" />
              Live Chat Support
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user" ? "bg-red-600 text-white" : "bg-white text-gray-900 border"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 border p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      Typing...
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="flex gap-2 mt-4">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !chatInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Tutorials Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-green-600" />
              Video Tutorials
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoTutorials.map((video) => (
              <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-3">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 hover:bg-black/70"
                      onClick={() => handleVideoPlay(video)}
                    >
                      <Play className="h-5 w-5 text-white" />
                    </Button>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">{video.duration}</Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{video.title}</h4>
                  <p className="text-xs text-gray-600">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => window.open("https://tutorials.mirrormefashion.com", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Tutorials
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
