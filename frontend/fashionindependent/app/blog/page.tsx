import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import BlogPageClient from "@/components/blog-page-client"
import { SITE_URL } from "@/config"

// Revalidate every 5 minutes (300 seconds) for ISR to get latest articles
export const revalidate = 300

interface BlogPost {
  id: string | number
  title: string
  slug: string
  description?: string
  featured_image?: string
  created_at?: string
  status?: string
}

interface BlogResponse {
  result: boolean
  blogs: {
    data: BlogPost[]
  }
}

async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const proxyUrl = SITE_URL
      ? new URL("/api/blog/list?page=1", SITE_URL).toString()
      : "/api/blog/list?page=1"

    console.log("📡 Server: Fetching blogs from internal proxy", proxyUrl)

    const response = await fetch(proxyUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error(`❌ API error: ${response.status}`)
      return []
    }

    const data: BlogResponse = await response.json()
    
    if (data.result && data.blogs?.data && Array.isArray(data.blogs.data)) {
      console.log("✓ Successfully fetched", data.blogs.data.length, "blogs")
      return data.blogs.data.slice(0, 6)
    }

    return []
  } catch (err) {
    console.error("❌ Error fetching blogs:", err)
    return []
  }
}

export default async function BlogPage() {
  const blogs = await fetchBlogs()

  return <BlogPageClient initialBlogs={blogs} />
}
