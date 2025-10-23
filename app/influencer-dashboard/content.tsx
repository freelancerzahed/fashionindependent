"use client"

import { useAuth } from "@/lib/auth-context"
import { useAffiliate } from "@/lib/affiliate-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle } from "lucide-react"

export function InfluencerDashboardContent() {
  const { user } = useAuth()
  const { affiliates, getAffiliateStats } = useAffiliate()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login")
    }
  }, [user, router, mounted])

  if (!mounted || !user) {
    return <div className="p-8">Loading...</div>
  }

  const userAffiliate = affiliates.find((a) => a.userId === user.id)
  const stats = userAffiliate ? getAffiliateStats(userAffiliate.id) : null

  const copyToClipboard = () => {
    if (userAffiliate?.trackingCode) {
      const trackingLink = `https://thefashionindependent.com?ref=${userAffiliate.trackingCode}`
      navigator.clipboard.writeText(trackingLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Influencer Dashboard</h1>
        <p className="text-gray-600">Manage your affiliate campaigns and track earnings</p>
      </div>

      {userAffiliate ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Affiliate Link</CardTitle>
              <CardDescription>Share this link to earn $1 per pledge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={
                    userAffiliate.trackingCode
                      ? `https://thefashionindependent.com?ref=${userAffiliate.trackingCode}`
                      : ""
                  }
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                />
                <Button onClick={copyToClipboard} variant="outline">
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Join Our Affiliate Program</CardTitle>
            <CardDescription>Start earning $1 per pledge today</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/affiliate")}>Apply Now</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
