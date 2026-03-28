import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import BlogPageClient from "@/components/blog-page-client"

// Revalidate every 1 hour (3600 seconds) for ISR
export const revalidate = 3600

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
    
    if (!apiUrl) {
      console.error("❌ API URL not configured")
      return []
    }

    console.log("📡 Server: Fetching blogs from", `${apiUrl}/blog-list`)

    const response = await fetch(`${apiUrl}/blog-list?page=1`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      // Cache for 1 hour
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
