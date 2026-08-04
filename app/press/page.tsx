"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

interface PressRelease {
  id: number
  date?: string
  published_date?: string
  title: string
  excerpt: string
  slug: string
}

interface MediaKitItem {
  id: number
  name: string
  file_size: string
  file_format: string
  description?: string
}

export default function PressPage() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([])
  const [mediaKit, setMediaKit] = useState<MediaKitItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPressData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("📡 Fetching news from CMS at:", "/api/blog/list")

        // Fetch news from CMS blogs with type='news'
        const newsResponse = await fetch(`/api/blog/list?page=1&per_page=10&t=${Date.now()}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!newsResponse.ok) {
          throw new Error(`Failed to fetch news: ${newsResponse.status}`)
        }

        const newsData = await newsResponse.json()
        console.log('📥 News API Response:', newsData)

        const blogItems = Array.isArray(newsData?.blogs?.data)
          ? newsData.blogs.data
          : Array.isArray(newsData?.recent_blogs)
            ? newsData.recent_blogs
            : []

        if (blogItems.length > 0) {
          const transformedNews = blogItems.map((item: any) => ({
            id: item.id,
            title: item.title,
            excerpt: item.short_description || item.description || item.excerpt || '',
            slug: item.slug,
            published_date: item.created_at,
          }))

          console.log('🔄 Transformed news:', transformedNews)
          setPressReleases(transformedNews)
          console.log(`✓ Loaded ${transformedNews.length} news items from CMS`)
        } else {
          console.warn('⚠️ Unexpected API response format:', newsData)
          setPressReleases([])
        }

        // Fetch media kit from the backend through a local proxy route if available
        const mediaResponse = await fetch(`/api/press/media-kit?t=${Date.now()}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!mediaResponse.ok) {
          throw new Error(`Failed to fetch media kit: ${mediaResponse.status}`)
        }

        const mediaData = await mediaResponse.json()
        if (mediaData.status && Array.isArray(mediaData.data)) {
          setMediaKit(mediaData.data)
          console.log(`✓ Loaded ${mediaData.data.length} media kit items`)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load press data"
        console.error("❌ Error fetching press data:", message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchPressData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
            <p className="text-neutral-600">Loading press information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 font-semibold mb-2">Unable to load press information</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Press & News</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Latest news, press releases, and media resources for The Fashion Independent
          </p>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Press Releases</h2>
            {pressReleases.length === 0 ? (
              <p className="text-muted-foreground">No press releases available at the moment.</p>
            ) : (
              <div className="space-y-6">
                {pressReleases.map((release) => (
                  <Card key={release.id} className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      {release.published_date || release.date
                        ? new Date(release.published_date || release.date || new Date().toISOString()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Unknown date'}
                    </p>
                    <h3 className="text-xl font-semibold mb-3">{release.title}</h3>
                    <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                    <Button variant="outline" asChild>
                      <Link href={`/press/${release.slug}`}>Read Full Release</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Media Kit</h2>
            <Card className="p-6">
              <p className="text-muted-foreground mb-6">
                Download our media kit for logos, brand guidelines, and press materials.
              </p>
              {mediaKit.length === 0 ? (
                <p className="text-muted-foreground">No media kit items available.</p>
              ) : (
                <div className="space-y-3">
                  {mediaKit.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.file_format} • {item.file_size}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Media Inquiries</h2>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                For press inquiries, interviews, or additional information, please contact our media relations team:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> press@fashionindependent.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
