"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, MapPin, Globe, Instagram, Facebook, Twitter } from "lucide-react"
import { BACKEND_URL } from "@/config"

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

      {/* Campaigns Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Featured Campaigns</h2>
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
