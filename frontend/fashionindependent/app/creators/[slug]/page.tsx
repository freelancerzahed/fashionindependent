"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Loader, 
  AlertCircle, 
  Globe, 
  Mail, 
  MapPin, 
  Instagram, 
  Twitter, 
  Smartphone,
  Star,
  Award,
  Users,
  Zap,
  Heart,
  Share2,
  Trophy
} from "lucide-react"

interface Campaign {
  id: string
  title: string
  slug: string
  cover_image?: string
  description: string
  status: string
  created_at: string
  backers_count?: number
  current_funding?: number
}

interface Creator {
  id: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  slug: string
  brand_name: string
  bio?: string
  profile_image?: string
  cover_image?: string
  website?: string
  instagram?: string
  tiktok?: string
  twitter?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  campaigns?: Campaign[]
  created_at?: string
  updated_at?: string
}

export default function CreatorPublicProfilePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setError("Creator slug not found")
      setLoading(false)
      return
    }

    const fetchCreatorProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = `/api/creators/${slug}`
        console.log("Fetching creator profile from:", apiUrl)

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log("Creator profile response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.log("Error response:", errorData)
          
          if (response.status === 404) {
            setError("Creator profile not found")
          } else {
            setError(errorData.error || `Failed to load creator profile (${response.status})`)
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        console.log("Creator profile data:", data)

        if (data.creator) {
          setCreator(data.creator)
        } else {
          setError("Invalid creator profile data")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        console.error("Error fetching creator profile:", err)
        setError(`Failed to load creator profile: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    fetchCreatorProfile()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-neutral-700" />
          <p className="text-neutral-600">Loading creator profile...</p>
        </div>
      </div>
    )
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md w-full mx-4 p-8 border border-neutral-200">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-center text-neutral-900 font-semibold">
              {error || "Creator not found"}
            </p>
            <Button onClick={() => window.location.href = "/"} variant="outline" className="w-full">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const campaignCount = creator.campaigns?.length || 0
  const totalBackers = creator.campaigns?.reduce((sum, campaign) => sum + (campaign.backers_count || 0), 0) || 0
  const activeCampaigns = creator.campaigns?.filter((campaign) => campaign.status === "active" || campaign.status === "live").length || 0
  const fundedAmount = creator.campaigns?.reduce((sum, campaign) => sum + (campaign.current_funding || 0), 0) || 0
  const successRate = campaignCount > 0 ? Math.min(100, Math.round((activeCampaigns / campaignCount) * 100)) : 0
  const memberSince = creator.created_at ? new Date(creator.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently joined"
  const completionRate = campaignCount > 0 ? Math.min(100, 90 + Math.min(10, campaignCount)) : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Section */}
      <div className="h-48 md:h-56 bg-neutral-100 border-b border-neutral-200 overflow-hidden">
        {creator.cover_image ? (
          <img
            src={creator.cover_image}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200" />
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Profile Header Card */}
        <div className="relative -mt-20 mb-8 px-4 md:px-0">
          <Card className="overflow-hidden border border-neutral-200 shadow-sm">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {creator.profile_image ? (
                    <img
                      src={creator.profile_image}
                      alt={creator.user.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover border border-neutral-200"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-neutral-100 flex items-center justify-center border border-neutral-200">
                      <span className="text-neutral-400 text-sm">No image</span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                      {creator.user.name}
                    </h1>
                    {creator.brand_name && (
                      <p className="text-lg text-neutral-700 font-medium mb-3">{creator.brand_name}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded">
                        Verified Creator
                      </span>
                    </div>
                  </div>

                  {creator.bio && (
                    <p className="text-neutral-600 mb-6 leading-relaxed max-w-2xl text-sm md:text-base">
                      {creator.bio}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <Button className="bg-black hover:bg-neutral-900 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" className="border-neutral-300 text-neutral-900 hover:bg-neutral-50">
                      <Heart className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                    <Button variant="outline" className="border-neutral-300 text-neutral-900 hover:bg-neutral-50">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="w-full md:w-auto flex gap-6 md:flex-col md:gap-4 md:border-l md:border-neutral-200 md:pl-6">
                  <div className="text-center flex-1 md:flex-none">
                    <div className="text-2xl md:text-3xl font-bold text-neutral-900 mb-1">
                      {campaignCount}
                    </div>
                    <p className="text-xs md:text-sm text-neutral-600">Active Campaigns</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact & Social Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {creator.user.email && (
            <Card className="p-4 border border-neutral-200 hover:border-neutral-300 transition-colors">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neutral-900 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-neutral-600 font-medium">Email</p>
                  <p className="text-neutral-900 text-sm break-all">{creator.user.email}</p>
                </div>
              </div>
            </Card>
          )}

          {creator.website && (
            <Card className="p-4 border border-neutral-200 hover:border-neutral-300 transition-colors">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-neutral-900 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-neutral-600 font-medium">Website</p>
                  <a
                    href={creator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:underline break-all text-sm font-medium"
                  >
                    Visit Website →
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Social Links */}
          <Card className="p-4 border border-neutral-200">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-neutral-900 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-neutral-600 font-medium mb-2">Follow</p>
                <div className="flex gap-2">
                  {creator.instagram && (
                    <a
                      href={`https://instagram.com/${creator.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-neutral-100 text-neutral-900 rounded hover:bg-neutral-200 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {creator.twitter && (
                    <a
                      href={`https://twitter.com/${creator.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-neutral-100 text-neutral-900 rounded hover:bg-neutral-200 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {creator.tiktok && (
                    <a
                      href={`https://tiktok.com/@${creator.tiktok}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
                      title="TikTok"
                    >
                      <Smartphone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Trust & Stats Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <Award className="w-6 h-6" />
            Creator Credibility
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 md:p-6 border border-neutral-200 text-center hover:border-neutral-400 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">${fundedAmount.toLocaleString()}</div>
              <p className="text-sm text-neutral-600 font-medium">Total Funds Raised</p>
            </Card>
            <Card className="p-4 md:p-6 border border-neutral-200 text-center hover:border-neutral-400 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">{totalBackers.toLocaleString()}</div>
              <p className="text-sm text-neutral-600 font-medium">Total Backers</p>
            </Card>
            <Card className="p-4 md:p-6 border border-neutral-200 text-center hover:border-neutral-400 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">{successRate}%</div>
              <p className="text-sm text-neutral-600 font-medium">Success Rate</p>
            </Card>
            <Card className="p-4 md:p-6 border border-neutral-200 text-center hover:border-neutral-400 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">{activeCampaigns}</div>
              <p className="text-sm text-neutral-600 font-medium">Active Campaigns</p>
            </Card>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="p-4 border border-neutral-200 text-center hover:border-neutral-400 transition-colors">
              <p className="text-xs text-neutral-600 font-medium mb-1">Member Since</p>
              <p className="font-bold text-neutral-900">{memberSince}</p>
            </Card>
            <Card className="p-4 border border-neutral-200 text-center hover:border-neutral-400 transition-colors">
              <p className="text-xs text-neutral-600 font-medium mb-1">Completion Rate</p>
              <p className="font-bold text-neutral-900">{completionRate}%</p>
            </Card>
            <Card className="p-4 border border-neutral-200 text-center hover:border-neutral-400 transition-colors">
              <p className="text-xs text-neutral-600 font-medium mb-1">Verified</p>
              <p className="font-bold text-neutral-900 text-green-700">✓ Yes</p>
            </Card>
          </div>
        </div>

        {/* About Section */}
        {creator.bio && (
          <Card className="mb-8 p-6 md:p-8 border border-neutral-200 border-l-4 border-l-neutral-900">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-neutral-900 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-neutral-900">About Creator</h2>
            </div>
            <p className="text-neutral-700 leading-relaxed text-sm md:text-base">
              {creator.bio}
            </p>
          </Card>
        )}

        {/* Campaigns Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-neutral-900" />
            <h2 className="text-2xl font-bold text-neutral-900">Active Campaigns</h2>
            {campaignCount > 0 && (
              <span className="ml-auto bg-neutral-100 text-neutral-900 text-sm font-semibold px-3 py-1 rounded border border-neutral-200">
                {campaignCount} Campaign{campaignCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {creator.campaigns && creator.campaigns.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creator.campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="overflow-hidden border border-neutral-200 hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Campaign Image */}
                  {campaign.cover_image ? (
                    <div className="h-40 overflow-hidden bg-neutral-200">
                      <img
                        src={campaign.cover_image}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-neutral-100 flex items-center justify-center border-b border-neutral-200">
                      <Zap className="w-10 h-10 text-neutral-300" />
                    </div>
                  )}

                  {/* Campaign Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-neutral-900 line-clamp-2 flex-1 text-sm md:text-base">
                        {campaign.title}
                      </h3>
                      <span className="ml-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                        Live
                      </span>
                    </div>

                    <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
                      {campaign.description}
                    </p>

                    {/* Campaign Stats */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-neutral-600 mb-1">
                        <span>Funding Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-neutral-900" />
                      </div>
                    </div>

                    <Button className="w-full bg-black hover:bg-neutral-900 text-white text-sm">
                      View Campaign →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 bg-neutral-50 border border-neutral-200 border-dashed">
              <div className="text-center">
                <Zap className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-700 text-lg font-medium mb-2">
                  No Active Campaigns
                </p>
                <p className="text-neutral-500 text-sm">
                  Check back soon for new campaign launches
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
