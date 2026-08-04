"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  ChevronUp,
} from "lucide-react"
import { useEffect, useState } from "react"

interface BlogPost {
  id: string | number
  title: string
  slug: string
  description?: string
  banner?: string
  featured_image?: string
  content?: string
  created_at?: string
  author_name?: string
  status?: string
}

export default function BlogDetailClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingTime, setReadingTime] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("📡 Fetching blog post from internal proxy:", `/api/blog/details/${slug}`)

        const response = await fetch(`/api/blog/details/${slug}`, {
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

        if (result.blog) {
          setPost(result.blog)
        } else if (result.result) {
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

  // Calculate reading time
  useEffect(() => {
    const text = post?.content || post?.description
    if (text) {
      const plainText = text.replace(/<[^>]*>/g, "")
      const words = plainText.split(/\s+/).length
      const minutes = Math.ceil(words / 200)
      setReadingTime(minutes)
    }
  }, [post])

  // Scroll listeners
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleShare = async (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const title = post?.title || "Check out this blog post"

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        )
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        )
        break
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        )
        break
      case "copy":
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-8 hover:bg-slate-100">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50 p-8 text-center">
              <div className="text-red-600 text-lg font-semibold mb-2">Unable to load blog post</div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button asChild className="mt-6">
                <Link href="/blog">Return to Blog</Link>
              </Button>
            </Card>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="hover:bg-slate-100">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Blog</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <article className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Title Section */}
          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6 text-balance">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-slate-600 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{post.author_name || "Author Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{readingTime} min read</span>
                </div>
              )}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mb-10 md:mb-12 p-4 md:p-6 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">Share:</span>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("facebook")}
                className="hover:bg-blue-50"
              >
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                <span className="hidden sm:inline">Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="hover:bg-sky-50"
              >
                <Twitter className="w-4 h-4 mr-2 text-sky-500" />
                <span className="hidden sm:inline">Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className="hover:bg-blue-50"
              >
                <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                <span className="hidden sm:inline">LinkedIn</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("copy")}
                className="hover:bg-slate-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          {(post.featured_image || post.banner) ? (
            <div className="mb-10 md:mb-12">
              <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <Image
                  src={String(post.featured_image || post.banner)}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 900px"
                  onError={() => {
                    console.warn("Failed to load image:", post.featured_image || post.banner)
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* Blog Content */}
          <div className="prose prose-slate max-w-none mb-12">
            <style>{`
              .prose {
                --tw-prose-body: rgb(51 65 85);
                --tw-prose-headings: rgb(15 23 42);
                --tw-prose-bold: rgb(15 23 42);
                --tw-prose-links: rgb(51 65 85);
                --tw-prose-code: rgb(51 65 85);
              }
              .prose h2 {
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              .prose h3 {
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }
              .prose p {
                margin-bottom: 1.25rem;
                line-height: 1.8;
              }
              .prose li {
                margin-bottom: 0.5rem;
              }
              .prose img {
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                margin: 1.5rem 0;
              }
              .prose a {
                color: rgb(51 65 85);
                font-weight: 500;
                border-bottom: 2px solid rgba(51, 65, 85, 0.2);
                transition: border-color 0.3s ease;
              }
              .prose a:hover {
                border-bottom-color: rgb(51 65 85);
              }
              .prose blockquote {
                border-left-color: rgb(226 232 240);
                font-style: italic;
              }
              .prose code {
                background-color: rgb(241 245 249);
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
              }
              .prose pre {
                background-color: rgb(15 23 42);
                color: rgb(226 232 240);
                overflow-x: auto;
              }
            `}</style>
            {(() => {
              const content = post.content || post.description || ""
              return content.includes("<") ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  {content.split("\n\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )
            })()}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 my-12" />

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-8 md:p-10 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Want to read more?</h3>
            <p className="text-slate-200 mb-6">Discover more amazing articles and stories on our blog.</p>
            <Button asChild className="bg-white text-slate-900 hover:bg-slate-100">
              <Link href="/blog">Browse All Articles</Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}
