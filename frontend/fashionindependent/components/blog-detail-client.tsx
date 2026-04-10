"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { useEffect, useState } from "react"

interface BlogPost {
  id: string | number
  title: string
  slug: string
  content: string
  description?: string
  featured_image?: string
  created_at?: string
  author_name?: string
  status?: string
}

export default function BlogDetailClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          throw new Error("API URL not configured")
        }

        console.log("📡 Fetching blog post from:", `${apiUrl}/blog-details/${slug}`)

        const response = await fetch(`${apiUrl}/blog-details/${slug}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch blog post: ${response.status}`)
        }

        const result = await response.json()
        console.log("✓ Blog post response:", result)

        if (result.result) {
          setPost(result.result)
        } else if (result.data) {
          setPost(result.data)
        } else {
          throw new Error("Invalid API response format")
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load blog post"
        console.error("❌ Error:", message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        <div className="max-w-3xl mx-auto text-center py-12 bg-red-50 rounded-lg border border-red-200 p-6">
          <p className="text-red-600 font-semibold mb-2">Unable to load blog post</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date"

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </Button>

      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-balance">{post.title}</h1>
          <div className="flex items-center gap-6 text-muted-foreground flex-wrap">
            {post.author_name && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {post.featured_image && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-12">
          {post.content && post.content.includes("<") ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="text-neutral-700 whitespace-pre-wrap">{post.content}</p>
          )}
        </div>

        <div className="border-t pt-8">
          <Button asChild>
            <Link href="/blog">Back to All Articles</Link>
          </Button>
        </div>
      </article>
    </div>
  )
}
