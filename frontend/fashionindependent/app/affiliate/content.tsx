"use client"

import type React from "react"
import { useAffiliate } from "@/lib/affiliate-context"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AffiliateContent() {
  const { user } = useAuth()
  const { affiliates, createAffiliate, getAffiliateStats } = useAffiliate()
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    socialMedia: "",
    audienceSize: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="p-8">Loading...</div>
  }

  const userAffiliate = affiliates.find((a) => a.userId === user?.id)
  const stats = userAffiliate ? getAffiliateStats(userAffiliate.id) : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      createAffiliate({
        userId: user.id,
        name: formData.name,
        email: formData.email,
        website: formData.website,
        socialMedia: formData.socialMedia,
        audienceSize: Number.parseInt(formData.audienceSize),
        status: "pending",
        commissionRate: 1,
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Affiliate Program</h1>
        <p className="text-gray-600">Earn $1 for every pledge through your unique link</p>
      </div>

      {!userAffiliate ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Apply for Our Affiliate Program</CardTitle>
            <CardDescription>Join our community of influencers and content creators</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="website">Website/Blog</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="socialMedia">Social Media Handles</Label>
                <Textarea
                  id="socialMedia"
                  value={formData.socialMedia}
                  onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                  placeholder="Instagram, TikTok, YouTube, etc."
                />
              </div>
              <div>
                <Label htmlFor="audienceSize">Audience Size</Label>
                <Input
                  id="audienceSize"
                  type="number"
                  value={formData.audienceSize}
                  onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
                  placeholder="e.g., 50000"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Apply Now
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Status: <span className="font-bold capitalize">{userAffiliate.status}</span>
              </p>
            </CardContent>
          </Card>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.clicks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.conversions}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${stats.earnings.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
