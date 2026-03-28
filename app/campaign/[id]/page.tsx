"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileTabs } from "@/components/mobile-tabs"
import { Heart, Share2, TrendingUp, Users, Clock, Check, Eye, RefreshCw, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState as useStateHook, useCallback } from "react"
import type { PledgeOption } from "@/lib/data"

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [campaign, setCampaign] = useStateHook<any>(null)
  const [loading, setLoading] = useStateHook(true)
  const [error, setError] = useStateHook<string | null>(null)
  const [selectedPledgeOption, setSelectedPledgeOption] = useStateHook("")
  const [quantity, setQuantity] = useStateHook(1)
  const [isSaved, setIsSaved] = useStateHook(false)
  const [isLoading, setIsLoading] = useStateHook(false)
  const [activeTab, setActiveTab] = useStateHook("description")
  const [selectedImageIndex, setSelectedImageIndex] = useStateHook(0)
  const [isRefreshing, setIsRefreshing] = useStateHook(false)
  const [lastUpdated, setLastUpdated] = useStateHook<Date | null>(null)
  const [shareCount, setShareCount] = useStateHook(0)
  const [campaignId, setCampaignId] = useStateHook<string | null>(null)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  // Fetch campaign data from API
  const fetchCampaignData = useCallback(async (id: string, skipLoading = false) => {
    try {
      if (!skipLoading) setLoading(true)
      setError(null)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error("API URL not configured")
      }

      const response = await fetch(`${apiUrl}/campaign/${id}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to load campaign: ${response.status}`)
      }

      const result = await response.json()

      if (result.status && result.campaign) {
        const apiCampaign = result.campaign
        
        // Extract and process all product images
        let galleryImages: string[] = []
        let mainImage = "/placeholder.svg"
        
        if (apiCampaign.product_images && Array.isArray(apiCampaign.product_images) && apiCampaign.product_images.length > 0) {
          galleryImages = apiCampaign.product_images.map((img: any) => {
            let imagePath = typeof img === "object" ? (img.path || img.url) : img
            if (imagePath?.includes("storage/")) {
              imagePath = imagePath.substring(imagePath.indexOf("storage/") + 8)
            }
            return `/api/storage/${imagePath}`
          })
          mainImage = galleryImages[0]
        }

        // Transform API data to component format
        const transformedCampaign = {
          id: apiCampaign.id,
          title: apiCampaign.title,
          description: apiCampaign.description,
          fundingGoal: apiCampaign.funding_goal,
          fundedAmount: apiCampaign.current_funding || 0,
          backers: apiCampaign.backer_count || 0,
          upvoteGoal: apiCampaign.upvote_goal,
          upvoteCount: apiCampaign.upvote_count || 0,
          designer: apiCampaign.creator?.name || "Unknown Designer",
          designerId: apiCampaign.creator?.id,
          image: mainImage,
          galleryImages: galleryImages,
          daysRemaining: apiCampaign.days_remaining || 0,
          status: apiCampaign.status || "active",
          createdAt: apiCampaign.created_at,
          updatedAt: apiCampaign.updated_at,
          // Generate pledge options from funding goal
          pledgeOptions: [
            {
              id: "bronze",
              amount: Math.round(apiCampaign.funding_goal * 0.1),
              description: "Early Bird Special"
            },
            {
              id: "silver",
              amount: Math.round(apiCampaign.funding_goal * 0.25),
              description: "Popular Pledge"
            },
            {
              id: "gold",
              amount: Math.round(apiCampaign.funding_goal * 0.5),
              description: "Premium Backer"
            },
          ]
        }

        setCampaign(transformedCampaign)
        setLastUpdated(new Date())
        setShareCount(apiCampaign.share_count || 0)
        
        // Set default pledge option
        if (transformedCampaign.pledgeOptions[0]) {
          setSelectedPledgeOption(transformedCampaign.pledgeOptions[0].id)
        }

        // Check if already saved
        const savedCampaigns = JSON.parse(localStorage.getItem("savedCampaigns") || "[]")
        setIsSaved(savedCampaigns.includes(id))
      } else {
        throw new Error("Invalid API response")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load campaign"
      console.error("Campaign load error:", message)
      setError(message)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initialize campaign data on mount
  useEffect(() => {
    const initializeCampaign = async () => {
      const resolvedParams = await params
      setCampaignId(resolvedParams.id)
      fetchCampaignData(resolvedParams.id)
    }

    initializeCampaign()
  }, [params, fetchCampaignData])

  // Real-time polling - refresh campaign data every 30 seconds
  useEffect(() => {
    if (!campaignId) return

    const pollInterval = setInterval(() => {
      fetchCampaignData(campaignId, true) // skipLoading = true
    }, 30000) // 30 seconds

    return () => clearInterval(pollInterval)
  }, [campaignId, fetchCampaignData])

  // Manual refresh function
  const handleRefresh = async () => {
    if (!campaignId) return
    setIsRefreshing(true)
    await fetchCampaignData(campaignId, false)
  }

  // Save/Unsave campaign to localStorage
  const handleSaveCampaign = () => {
    if (!campaignId) return
    
    const savedCampaigns = JSON.parse(localStorage.getItem("savedCampaigns") || "[]")
    
    if (isSaved) {
      // Remove from saved
      const filtered = savedCampaigns.filter((id: string) => id !== campaignId)
      localStorage.setItem("savedCampaigns", JSON.stringify(filtered))
    } else {
      // Add to saved
      if (!savedCampaigns.includes(campaignId)) {
        savedCampaigns.push(campaignId)
        localStorage.setItem("savedCampaigns", JSON.stringify(savedCampaigns))
      }
    }
    
    setIsSaved(!isSaved)
  }

  // Share campaign and track share count
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: campaign?.title,
          text: campaign?.description,
          url: window.location.href,
        })
        // Update share count
        setShareCount(prev => prev + 1)
      }
    } catch (err) {
      console.error("Share error:", err)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-neutral-900"></div>
          </div>
          <p className="text-lg text-neutral-600 font-medium">Loading campaign details...</p>
          <p className="text-sm text-neutral-500 mt-2">Please wait while we fetch the latest information</p>
        </div>
      </main>
    )
  }

  if (error || !campaign) {
    return (
      <main className="flex-1 min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center mb-4 p-4 bg-red-50 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-neutral-900">Campaign Not Found</h1>
          {error && <p className="text-red-600 mb-6 font-medium">{error}</p>}
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRefresh} variant="outline" className="border-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => router.push("/discover")} className="bg-neutral-900 hover:bg-neutral-800">
              Back to Discover
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const fundingPercentage = (campaign.fundedAmount / campaign.fundingGoal) * 100
  const upvotePercentage = campaign.upvoteGoal ? (campaign.upvoteCount / campaign.upvoteGoal) * 100 : 0
  const selectedOption = campaign.pledgeOptions.find((p: PledgeOption) => p.id === selectedPledgeOption)

  const handleMakePledge = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (selectedOption) {
      setIsLoading(true)
      setTimeout(() => {
        router.push(`/checkout?campaignId=${campaign.id}&pledgeOptionId=${selectedOption.id}&quantity=${quantity}`)
      }, 300)
    }
  }

  const tabsList = [
    { id: "description", label: "Description" },
    { id: "gallery", label: "Gallery" },
    { id: "updates", label: "Updates" },
    { id: "designer", label: "About Designer" },
  ]

  return (
    <main className="flex-1 min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
      {/* Status Bar - Shows last update time and refresh button */}
      {lastUpdated && (
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-200 py-2 sm:py-3">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-neutral-600">
                Last updated: <span className="font-semibold text-neutral-900">{lastUpdated.toLocaleTimeString()}</span>
              </p>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="ghost"
                size="sm"
                className="gap-2 text-xs sm:text-sm"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full py-6 md:py-16 lg:py-20 border-b border-neutral-100">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {/* Product Image */}
            <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 md:gap-5 w-full">
              {/* Main Image Container */}
              <div className="relative w-full">
                <div className="aspect-[4/5] sm:aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl hover:shadow-2xl md:hover:shadow-3xl transition-all duration-300 w-full">
                  <Image
                    src={
                      campaign.galleryImages && campaign.galleryImages.length > 0 && campaign.galleryImages[selectedImageIndex]
                        ? campaign.galleryImages[selectedImageIndex]
                        : campaign.image && typeof campaign.image === 'string' && campaign.image.trim()
                        ? campaign.image
                        : "/placeholder.svg"
                    }
                    alt={campaign.title}
                    width={450}
                    height={562}
                    className="w-full h-full object-cover"
                    priority
                    quality={80}
                    onError={() => {}}
                  />
                </div>

                {/* Image Counter Badge */}
                {campaign.galleryImages && campaign.galleryImages.length > 1 && (
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/70 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium backdrop-blur-sm">
                    {selectedImageIndex + 1} / {campaign.galleryImages.length}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {campaign.galleryImages && campaign.galleryImages.length > 1 && (
                <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 w-full scrollbar-hide">
                  {campaign.galleryImages.map((imageUrl: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 sm:w-20 md:w-24 lg:w-28 h-16 sm:h-20 md:h-24 lg:h-28 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-3 transition-all duration-300 group relative ${
                        selectedImageIndex === index
                          ? "border-neutral-900 shadow-xl scale-105"
                          : "border-neutral-300 hover:border-neutral-500 hover:shadow-lg"
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${campaign.title} - Image ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        quality={75}
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Check className="h-6 w-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-5 md:gap-7 lg:gap-8 sticky top-16 sm:top-20 md:top-24 lg:top-20 h-fit z-10">
              {/* Campaign Header */}
              <div className="space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">{campaign.title}</h1>
                <p className="text-sm sm:text-base md:text-lg text-neutral-600 font-medium">by <span className="text-neutral-900 font-semibold">{campaign.designer}</span></p>
              </div>

              {/* Funding Progress Card */}
              <div className="bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 md:space-y-7 shadow-lg md:shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <div className="flex items-baseline justify-between gap-2 sm:gap-3">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-neutral-600 mb-1 sm:mb-2 font-medium">Total Upvotes</p>
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 block break-words">
                        {campaign.upvoteCount.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm md:text-base text-neutral-600 whitespace-nowrap font-medium flex-shrink-0">of {(campaign.upvoteGoal || 0).toLocaleString()}</span>
                  </div>
                  <Progress value={upvotePercentage} className="h-3 rounded-full shadow-sm" />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 pt-2">
                    <p className="text-xs sm:text-sm md:text-base font-bold text-neutral-900">{Math.round(upvotePercentage)}% backed</p>
                    <p className="text-xs sm:text-sm text-neutral-500 font-medium">{campaign.daysRemaining} days remaining</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6 border-t border-neutral-200">
                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 text-center hover:bg-gradient-to-br hover:from-neutral-100 hover:to-neutral-150 transition-all duration-200 shadow-sm">
                    <div className="flex items-center justify-center mb-1 sm:mb-2 md:mb-3">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-neutral-700" />
                    </div>
                    <p className="text-base sm:text-lg md:text-2xl font-bold text-neutral-900">{campaign.backers.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1 md:mt-2 font-medium">Donors</p>
                  </div>
                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 text-center hover:bg-gradient-to-br hover:from-neutral-100 hover:to-neutral-150 transition-all duration-200 shadow-sm">
                    <div className="flex items-center justify-center mb-1 sm:mb-2 md:mb-3">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-neutral-700" />
                    </div>
                    <p className="text-base sm:text-lg md:text-2xl font-bold text-neutral-900">{Math.round(upvotePercentage)}%</p>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1 md:mt-2 font-medium">Backed</p>
                  </div>
                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 text-center hover:bg-gradient-to-br hover:from-neutral-100 hover:to-neutral-150 transition-all duration-200 shadow-sm">
                    <div className="flex items-center justify-center mb-1 sm:mb-2 md:mb-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-neutral-700" />
                    </div>
                    <p className="text-base sm:text-lg md:text-2xl font-bold text-neutral-900">{campaign.daysRemaining}</p>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1 md:mt-2 font-medium">Days</p>
                  </div>
                </div>
              </div>

              {/* Pledge Selection Card */}
              <div className="bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 md:space-y-8 shadow-lg md:shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-neutral-900">Make a Pledge</h3>

                {/* Pledge Options */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <Label className="text-sm md:text-base font-bold text-neutral-900 block">Select Pledge Level</Label>
                  <div className="space-y-2 sm:space-y-3">
                    {campaign.pledgeOptions.map((option: PledgeOption) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedPledgeOption(option.id)}
                        className={`w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all duration-200 text-left ${
                          selectedPledgeOption === option.id
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                            : "border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-lg active:scale-95"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold text-base sm:text-lg md:text-xl ${selectedPledgeOption === option.id ? 'text-white' : 'text-neutral-900'}`}>
                              ${option.amount.toLocaleString()}
                            </p>
                            <p className={`text-xs sm:text-sm md:text-base mt-1 ${selectedPledgeOption === option.id ? 'text-neutral-200' : 'text-neutral-600'}`}>
                              {option.description}
                            </p>
                          </div>
                          {selectedPledgeOption === option.id && (
                            <Check className="h-5 w-5 md:h-6 md:w-6 text-white flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <Label htmlFor="quantity" className="text-sm md:text-base font-bold text-neutral-900">
                    Quantity
                  </Label>
                  <div className="flex items-center gap-2 sm:gap-3 bg-neutral-100 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-9 sm:h-10 md:h-12 w-9 sm:w-10 md:w-12 p-0 text-lg sm:text-xl md:text-2xl text-neutral-900 hover:bg-neutral-200 transition-colors flex-shrink-0 active:scale-90"
                    >
                      −
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="flex-1 text-center px-2 sm:px-3 py-2 sm:py-3 md:py-4 bg-white border-0 text-neutral-900 font-bold text-base sm:text-lg md:text-2xl focus:ring-2 focus:ring-neutral-900 rounded-md"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-9 sm:h-10 md:h-12 w-9 sm:w-10 md:w-12 p-0 text-lg sm:text-xl md:text-2xl text-neutral-900 hover:bg-neutral-200 transition-colors flex-shrink-0 active:scale-90"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                {selectedOption && (
                  <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs sm:text-sm md:text-base font-medium text-neutral-300">Total Pledge:</span>
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold break-all">${(selectedOption.amount * quantity).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Primary CTA Button */}
                <Button
                  onClick={handleMakePledge}
                  disabled={isLoading}
                  className="w-full py-5 sm:py-6 md:py-7 lg:py-8 text-base sm:text-lg md:text-lg font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl touch-manipulation"
                  size="lg"
                >
                  {isLoading ? "Processing..." : "Make a Pledge"}
                </Button>

                {/* Secondary Actions */}
                <div className="flex gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2 md:pt-4 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 py-4 sm:py-5 md:py-6 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-neutral-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 active:scale-95 bg-white font-bold text-xs sm:text-sm md:text-base touch-manipulation"
                    onClick={handleSaveCampaign}
                  >
                    <Heart className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1 sm:mr-2 flex-shrink-0 transition-all ${isSaved ? "fill-red-500 text-red-500 scale-110" : "text-neutral-600"}`} />
                    <span className={`hidden sm:inline transition-colors ${isSaved ? "text-red-600" : "text-neutral-700"}`}>{isSaved ? "Saved" : "Save"}</span>
                    <span className={`sm:hidden transition-colors ${isSaved ? "text-red-600" : "text-neutral-700"}`}>{isSaved ? "🔖" : "💔"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 py-4 sm:py-5 md:py-6 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-neutral-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 active:scale-95 bg-white font-bold text-xs sm:text-sm md:text-base touch-manipulation"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1 sm:mr-2 text-neutral-600 flex-shrink-0" />
                    <span className="hidden sm:inline text-neutral-700">Share {shareCount > 0 && `(${shareCount})`}</span>
                    <span className="sm:hidden text-neutral-700">📤</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Details Tabs */}
      <section className="w-full py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="hidden md:block">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b-2 rounded-none bg-transparent p-0 h-auto border-neutral-200 overflow-x-auto">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-3 border-transparent px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold text-neutral-600 hover:text-neutral-900 data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 data-[state=active]:bg-transparent transition-colors whitespace-nowrap"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="rounded-none border-b-3 border-transparent px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold text-neutral-600 hover:text-neutral-900 data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 data-[state=active]:bg-transparent transition-colors whitespace-nowrap"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="rounded-none border-b-3 border-transparent px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold text-neutral-600 hover:text-neutral-900 data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 data-[state=active]:bg-transparent transition-colors whitespace-nowrap"
                >
                  Updates
                </TabsTrigger>
                <TabsTrigger
                  value="designer"
                  className="rounded-none border-b-3 border-transparent px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold text-neutral-600 hover:text-neutral-900 data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 data-[state=active]:bg-transparent transition-colors whitespace-nowrap"
                >
                  About Designer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 space-y-4 sm:space-y-6 md:space-y-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">About This Campaign</h2>
                <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed max-w-4xl whitespace-pre-wrap">{campaign.description}</p>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                {campaign.galleryImages && campaign.galleryImages.length > 0 ? (
                  <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">Gallery</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-10">
                      {campaign.galleryImages.map((imageUrl: string, index: number) => (
                        <div
                          key={index}
                          className="group relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-95"
                          onClick={() => {
                            setSelectedImageIndex(index)
                            setActiveTab('description')
                          }}
                        >
                          <Image
                            src={imageUrl}
                            alt={`${campaign.title} - Image ${index + 1}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            quality={80}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="text-white text-xs sm:text-base md:text-lg font-bold bg-black/50 px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl backdrop-blur-sm">View Full</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-600 text-center py-8 sm:py-12">No gallery images available.</p>
                )}
              </TabsContent>

              <TabsContent value="updates" className="mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                <p className="text-base sm:text-lg text-neutral-600">No updates yet. Check back soon!</p>
              </TabsContent>

              <TabsContent value="designer" className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 space-y-6 md:space-y-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">About the Designer</h2>
                <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed max-w-4xl">
                  {campaign.designer} is an independent fashion designer committed to creating high-quality, sustainable
                  pieces.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:hidden">
            <MobileTabs tabs={tabsList} activeTab={activeTab} onTabChange={setActiveTab}>
              {activeTab === "description" && (
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900">About This Campaign</h2>
                  <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
                </div>
              )}
              {activeTab === "gallery" && (
                <div className="space-y-6 sm:space-y-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900">Gallery</h2>
                  {campaign.galleryImages && campaign.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                      {campaign.galleryImages.map((imageUrl: string, index: number) => (
                        <div
                          key={index}
                          className="group relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <Image
                            src={imageUrl}
                            alt={`${campaign.title} - Image ${index + 1}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            quality={75}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-600 text-center py-6 sm:py-8">No gallery images available.</p>
                  )}
                </div>
              )}
              {activeTab === "updates" && <p className="text-base sm:text-lg text-neutral-600">No updates yet. Check back soon!</p>}
              {activeTab === "designer" && (
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900">About the Designer</h2>
                  <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed">
                    {campaign.designer} is an independent fashion designer committed to creating high-quality,
                    sustainable pieces.
                  </p>
                </div>
              )}
            </MobileTabs>
          </div>
        </div>
      </section>
    </main>
  )
}
