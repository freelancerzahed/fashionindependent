"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error("API URL not configured")
    }

    const response = await fetch(`${apiUrl}/blog-list?page=1`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      // Cache for 1 hour (3600 seconds)
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`)
    }

    const data: BlogResponse = await response.json()
    
    if (data.result && data.blogs?.data && Array.isArray(data.blogs.data)) {
      return data.blogs.data.slice(0, 6)
    }

    return []
  } catch (err) {
    console.error("❌ Error fetching blogs:", err)
    return []
  }
}

export default function BlogPageClient({ initialBlogs = [] }: { initialBlogs?: BlogPost[] }) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs)
  const [loading, setLoading] = useState(!initialBlogs.length)

  useEffect(() => {
    // If we have initial blogs from server, we're already hydrated
    if (initialBlogs.length > 0) {
      setLoading(false)
      return
    }

    // Fallback client-side fetch for client-side rendering
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) throw new Error("API URL not configured")

        const response = await fetch(`${apiUrl}/blog-list?page=1`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)

        const data: BlogResponse = await response.json()
        if (data.result && data.blogs?.data) {
          setBlogs(data.blogs.data.slice(0, 6))
        }
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialBlogs])

  const mainBlog = blogs[0]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  if (!blogs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">No blog posts available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Article */}
        {mainBlog ? (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                <div className="aspect-[4/3] bg-neutral-200 rounded-lg overflow-hidden">
                  <img
                    src={mainBlog.featured_image || "/abstract-fashion-editorial.png"}
                    alt={mainBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-4">{mainBlog.title}</h1>
                  <p className="text-neutral-700 leading-relaxed mb-6 line-clamp-3">
                    {mainBlog.description}
                  </p>
                  <Button asChild>
                    <Link href={`/blog/${mainBlog.slug}`}>Read more</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Blog Articles Grid */}
        {blogs.length > 1 ? (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {blogs.slice(1).map((blog) => (
                  <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] bg-neutral-200">
                      <img
                        src={blog.featured_image || "/fashion-blog-.jpg"}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{blog.title}</h3>
                      <p className="text-neutral-700 leading-relaxed mb-4 line-clamp-2">
                        {blog.description}
                      </p>
                      {blog.created_at && (
                        <p className="text-xs text-neutral-500 mb-4">
                          {new Date(blog.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      <Button variant="outline" asChild>
                        <Link href={`/blog/${blog.slug}`}>Read more</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
