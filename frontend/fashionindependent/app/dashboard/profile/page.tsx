"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, MapPin, Globe, Instagram, Facebook, Twitter } from "lucide-react"
import { BACKEND_URL } from "@/config"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function CreatorProfilePage() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (token && user) {
      fetchProfileData()
    }
  }, [token, user])

  const fetchProfileData = async () => {
    setLoading(true)
    setError("")
    try {
      // Fetch creator profile
      const profileRes = await fetch(`${BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData.data)
      }

      // Fetch campaigns
      const campaignsRes = await fetch(`${BACKEND_URL}/campaign`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json()
        setCampaigns(campaignsData.data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load profile"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/dashboard">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-neutral-300 rounded-full flex-shrink-0" />
          
          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{profile?.name || user?.name || "Creator"}</h1>
            <p className="text-lg text-neutral-600 mb-4">{profile?.title || "Independent Designer"}</p>
            
            {/* Description */}
            {profile?.bio && (
              <p className="text-neutral-700 max-w-2xl mb-4">{profile.bio}</p>
            )}

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profile.email}</span>
                </a>
              )}
              {profile?.location && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
              {profile?.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Website</span>
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href="/dashboard/settings">
              <Button variant="outline">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Campaigns</div>
            <div className="text-3xl font-bold mt-2">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Backers</div>
            <div className="text-3xl font-bold mt-2">
              {campaigns.reduce((sum: number, c: any) => sum + (c.backers_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Funded</div>
            <div className="text-3xl font-bold mt-2">
              ${campaigns.reduce((sum: number, c: any) => sum + (c.funded_amount || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Member Since</div>
            <div className="text-3xl font-bold mt-2">
              {profile?.created_at ? new Date(profile.created_at).getFullYear() : "2025"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Successful Campaigns Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Top Campaigns</h2>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.slice(0, 9).map((campaign) => (
              <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-neutral-200" />
                  <CardContent className="pt-4">
                    <h3 className="font-semibold line-clamp-2">{campaign.title}</h3>
                    <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{campaign.description}</p>
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <span className="font-semibold">${campaign.funded_amount?.toLocaleString() || 0}</span>
                      <span className="text-neutral-500">{campaign.backers_count || 0} backers</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-neutral-600">
              No campaigns yet. Start creating!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Featured Drop - most purchased */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Featured Drops</h2>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.slice(0, 9).map((campaign) => (
              <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-neutral-200" />
                  <CardContent className="pt-4">
                    <h3 className="font-semibold line-clamp-2">{campaign.title}</h3>
                    <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{campaign.description}</p>
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <span className="font-semibold">${campaign.funded_amount?.toLocaleString() || 0}</span>
                      <span className="text-neutral-500">{campaign.backers_count || 0} backers</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-neutral-600">
              No campaigns yet. Start creating!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Accordion for additional info */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Collections</h2>
        <div className="">
          <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>Name of Collection (6)</AccordionTrigger>
                <AccordionContent>
                  {/* Carousel of products in collection as large thumbnail */}
                  <div>
                    <Carousel className="w-full px-12">
                      <CarouselContent>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                          <CarouselItem key={item} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <div className="overflow-hidden rounded-lg group cursor-pointer">
                              <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                  Product Image
                                </div>
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex flex-col items-end justify-between p-4">
                                  <div className="text-2xl font-bold text-white">⭐</div>
                                  <div className="text-white w-full">
                                    <p className="text-xs opacity-90 mb-1">Designer Name</p>
                                    <h3 className="font-semibold text-sm">Product Title</h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0 hover:bg-neutral-800 hover:text-white" />
                      <CarouselNext className="right-0 hover:bg-neutral-800 hover:text-white" />
                    </Carousel>
                  </div>

                  <div className="mt-4 space-y-2 pl-8">
                    <p className="text-sm text-neutral-600">Date created/time stamp: Jan 7, 2024</p>
                    <p className="text-sm text-neutral-600">Total products in collection: 6</p>
                    <p className="text-sm text-neutral-600">Total sales: $2,450</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>7@Night (5)</AccordionTrigger>
                <AccordionContent>
                  The Fashion Independent is not a traditional online store. Items featured as Limited Drops are available for purchase. 
                  Products in Active Campaigns are open for voting and feedback only. Be sure to vote for the items you love. Successful 
                  campaigns are the ones that make it into our store as Limited Drops. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Free the People (8)</AccordionTrigger> 
                <AccordionContent>
                  A Limited Drop is a product that successfully met its vote goal and earned its place in our store. These items are 
                  available at a steep discount for a limited time, usually 30 to 60 days, before they’re gone. Check Days Remaining 
                  to see how much time is left before the product is no longer available in our store. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Daughters of God (7)</AccordionTrigger>
                <AccordionContent>
                  Yes! Your support helps designers bring their ideas to life. Just keep in mind that donations are separate from 
                  purchases and do not count toward owning the item. 
                </AccordionContent>
              </AccordionItem>
          </Accordion>
        </div>
      </div>
      {/* Social Links */}
      {(profile?.social_links || profile?.instagram || profile?.facebook || profile?.twitter) && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Follow</h2>
          <div className="flex gap-4">
            {profile?.instagram && (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {profile?.facebook && (
              <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {profile?.twitter && (
              <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
