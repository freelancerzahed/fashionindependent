"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Share2, Heart, MessageCircle, Mail } from "lucide-react"
import Image from "next/image"
import { useEffect, useState as useStateHook } from "react"
import Link from "next/link"

interface Campaign {
  id: string
  title: string
  designer: string
  image: string
  daysRemaining: number
  upvoteCount: number
  upvoteGoal: number
  status: string
}

export default function VoteSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("campaignId")
  const voteType = searchParams.get("voteType") // "up" or "no"

  const [campaign, setCampaign] = useStateHook<Campaign | null>(null)
  const [closingCampaigns, setClosingCampaigns] = useStateHook<Campaign[]>([])
  const [loading, setLoading] = useStateHook(true)
  const [error, setError] = useStateHook<string | null>(null)

  // Fetch campaign data
  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) {
        setError("No campaign specified")
        setLoading(false)
        return
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        // Fetch current campaign details
        const campaignRes = await fetch(`${apiUrl}/campaign/${campaignId}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (campaignRes.ok) {
          const campaignData = await campaignRes.json()
          if (campaignData.status && campaignData.campaign) {
            const apiCampaign = campaignData.campaign
            let mainImage = "/placeholder.svg"
            
            if (apiCampaign.product_images && Array.isArray(apiCampaign.product_images) && apiCampaign.product_images.length > 0) {
              let imagePath = typeof apiCampaign.product_images[0] === "object" 
                ? (apiCampaign.product_images[0].path || apiCampaign.product_images[0].url) 
                : apiCampaign.product_images[0]
              if (imagePath?.includes("storage/")) {
                imagePath = imagePath.substring(imagePath.indexOf("storage/") + 8)
              }
              mainImage = `/api/storage/${imagePath}`
            }

            setCampaign({
              id: apiCampaign.id,
              title: apiCampaign.title,
              designer: apiCampaign.creator?.name || "Unknown Designer",
              image: mainImage,
              daysRemaining: apiCampaign.days_remaining || 0,
              upvoteCount: apiCampaign.upvote_count || 0,
              upvoteGoal: apiCampaign.upvote_goal || 0,
              status: apiCampaign.status || "active",
            })
          }
        }

        // Fetch recently closing campaigns (top 3-4 active campaigns with lowest days remaining)
        const campaignsRes = await fetch(`${apiUrl}/active`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json()
          if (campaignsData.status && campaignsData.data) {
            const transformedCampaigns = campaignsData.data
              .filter((c: any) => c.id !== campaignId) // Exclude current campaign
              .sort((a: any, b: any) => {
                // Sort by days remaining (lowest first - closing soon)
                const daysA = a.days_remaining || 0
                const daysB = b.days_remaining || 0
                return daysA - daysB
              })
              .slice(0, 4)
              .map((c: any) => {
                let imagePath = c.product_images?.[0]
                if (typeof imagePath === "object") {
                  imagePath = imagePath.path || imagePath.url
                }
                if (imagePath?.includes("storage/")) {
                  imagePath = imagePath.substring(imagePath.indexOf("storage/") + 8)
                }
                return {
                  id: c.id,
                  title: c.title,
                  designer: c.creator?.brand_name || "Unknown Designer",
                  image: imagePath ? `/api/storage/${imagePath}` : "/placeholder.svg",
                  daysRemaining: c.days_remaining || 0,
                  upvoteCount: c.upvote_count || 0,
                  upvoteGoal: c.upvote_goal || 0,
                  status: c.status || "active",
                }
              })
            setClosingCampaigns(transformedCampaigns)
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load data"
        console.error("Error loading vote success page:", message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [campaignId])

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: campaign?.title,
          text: `I just voted on "${campaign?.title}" on The Fashion Independent!`,
          url: `${window.location.origin}/campaign/${campaignId}`,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/campaign/${campaignId}`)
        alert("Link copied to clipboard!")
      }
    } catch (err) {
      console.error("Share error:", err)
    }
  }

  const handleSocialShare = (platform: string) => {
    const url = `${window.location.origin}/campaign/${campaignId}`
    const text = `I just voted on "${campaign?.title}" on The Fashion Independent!`
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent("Check out this Fashion Campaign!")}&body=${encodeURIComponent(text + "\n\n" + url)}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400")
    }
  }

  if (loading) {
    return (
      <main className="flex-1 min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-neutral-900"></div>
          </div>
          <p className="text-lg text-neutral-600 font-medium">Processing your vote...</p>
        </div>
      </main>
    )
  }

  if (error || !campaign) {
    return (
      <main className="flex-1 min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Something went wrong</h1>
          <p className="text-neutral-600 mb-6">{error || "Campaign not found"}</p>
          <Button
            onClick={() => router.push("/discover")}
            className="bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            Back to Discover
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
      <section className="w-full py-12 md:py-16 lg:py-20 border-b border-neutral-100">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl">
          {/* Thank You Message */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4">
              Thank You for Voting!
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 font-medium">
              {campaign.daysRemaining} days remain in this campaign
            </p>
          </div>

          {/* Campaign Info Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-8 mb-10 md:mb-12 border border-neutral-200">
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-6">
              This product will be available for purchase if the campaign reaches its vote goal. If it successfully reaches its upvote goal, you can <span className="font-semibold">help this designer reach their goal by sharing this campaign</span> with your friends. In the meantime, you can check out other campaigns and vote for your favorite designs!
            </p>
          </div>

          {/* Share Section - Highlighted in Red Box */}
          <div className="border-4 border-red-500 rounded-2xl md:rounded-3xl p-8 md:p-10 bg-red-50 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6 text-center">
              Share & Help This Campaign
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* Share Button */}
              <Button
                onClick={handleShare}
                className="flex flex-col items-center justify-center py-6 md:py-8 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm md:text-base transition-all duration-200"
              >
                <Share2 className="h-6 w-6 md:h-8 md:w-8 mb-2" />
                <span className="hidden md:inline">Share</span>
                <span className="md:hidden">Share</span>
              </Button>

              {/* Facebook */}
              <Button
                onClick={() => handleSocialShare("facebook")}
                className="flex flex-col items-center justify-center py-6 md:py-8 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm md:text-base transition-all duration-200"
              >
                <svg className="h-6 w-6 md:h-8 md:w-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs md:text-sm">Facebook</span>
              </Button>

              {/* Twitter */}
              <Button
                onClick={() => handleSocialShare("twitter")}
                className="flex flex-col items-center justify-center py-6 md:py-8 rounded-xl md:rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm md:text-base transition-all duration-200"
              >
                <svg className="h-6 w-6 md:h-8 md:w-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 002.856-3.915 9.964 9.964 0 01-2.866.836 4.958 4.958 0 0021.624-4.53c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="text-xs md:text-sm">Twitter</span>
              </Button>

              {/* Email */}
              <Button
                onClick={() => handleSocialShare("email")}
                className="flex flex-col items-center justify-center py-6 md:py-8 rounded-xl md:rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm md:text-base transition-all duration-200"
              >
                <Mail className="h-6 w-6 md:h-8 md:w-8 mb-2" />
                <span className="text-xs md:text-sm">Email</span>
              </Button>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div className="text-center mb-12 md:mb-16">
            <Button
              onClick={() => router.push("/discover")}
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 md:px-12 py-3 md:py-4 text-base md:text-lg rounded-xl md:rounded-2xl font-bold"
            >
              Discover More Campaigns
            </Button>
          </div>
        </div>
      </section>

      {/* Closing Soon Section */}
      {closingCampaigns.length > 0 && (
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-8 md:mb-12">
              Closing Soon
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {closingCampaigns.map((c) => (
                <Link key={c.id} href={`/campaign/${c.id}`}>
                  <div className="group cursor-pointer h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
                      <Image
                        src={c.image}
                        alt={c.title}
                        width={250}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        quality={75}
                      />
                      {/* Active Badge */}
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                        ✓ Active
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-5 flex flex-col gap-3">
                      <h3 className="font-bold text-neutral-900 line-clamp-2 group-hover:text-neutral-700 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">by {c.designer}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs md:text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="font-semibold text-neutral-900">{c.upvoteCount.toLocaleString()}</span>
                          <span className="text-neutral-600">upvotes</span>
                        </div>
                      </div>

                      {/* Time Remaining */}
                      <div className="text-xs md:text-sm text-neutral-600 font-medium pt-2 border-t border-neutral-200">
                        {c.daysRemaining} days remaining
                      </div>

                      {/* View Product Button */}
                      <Button
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base mt-2"
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(`/campaign/${c.id}`)
                        }}
                      >
                        View Product
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
