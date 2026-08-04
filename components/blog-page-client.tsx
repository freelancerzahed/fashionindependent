"use client"

import { useEffect, useRef, useState } from "react"
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

const PAGE_SIZE = 6

export default function BlogPageClient({ initialBlogs = [] }: { initialBlogs?: BlogPost[] }) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs)
  const [initialLoading, setInitialLoading] = useState(initialBlogs.length === 0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const fetchBlogPage = async (pageNumber: number) => {
    if (pageNumber === 1) {
      setInitialLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const response = await fetch(`/api/blog/list?page=${pageNumber}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error(`Failed to fetch blogs: ${response.status}`)

      const data: BlogResponse = await response.json()
      const fetchedBlogs = data.result && data.blogs?.data && Array.isArray(data.blogs.data)
        ? data.blogs.data
        : []

      if (pageNumber === 1) {
        setBlogs(fetchedBlogs)
      } else {
        setBlogs((prev) => [...prev, ...fetchedBlogs])
      }

      setHasMore(fetchedBlogs.length === PAGE_SIZE)
    } catch (err) {
      console.error("❌ Error fetching blogs:", err)
      setHasMore(false)
    } finally {
      setInitialLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (initialBlogs.length === 0) {
      void fetchBlogPage(1)
    } else {
      setInitialLoading(false)
    }
  }, [initialBlogs.length])

  useEffect(() => {
    if (page === 1) return
    void fetchBlogPage(page)
  }, [page])

  useEffect(() => {
    if (!sentinelRef.current || loadingMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage((current) => current + 1)
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadingMore, hasMore])

  const mainBlog = blogs[0]
  const otherBlogs = blogs.slice(1)

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  if (!blogs.length && !initialLoading) {
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
      <main className="flex-1 overflow-x-hidden">
        {/* Hero Article */}
        {mainBlog ? (
          <section className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-4 md:grid-cols-2 md:gap-8">
                <div className="overflow-hidden rounded-2xl bg-neutral-200 aspect-[4/3]">
                  <img
                    src={mainBlog.featured_image || "/abstract-fashion-editorial.png"}
                    alt={mainBlog.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="mb-3 text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                    {mainBlog.title}
                  </h1>
                  <p className="mb-4 text-sm leading-relaxed text-neutral-700 sm:text-base line-clamp-3">
                    {mainBlog.description}
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/blog/${mainBlog.slug}`}>Read more</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Blog Articles Grid */}
        {otherBlogs.length ? (
          <div>
            <section className="bg-white py-6 sm:py-8 lg:py-10">
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-4 text-2xl font-bold text-neutral-900 sm:text-3xl">Latest Articles</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {otherBlogs.map((blog) => (
                    <Card key={blog.id} className="overflow-hidden border-neutral-200 transition-shadow hover:shadow-md">
                      <div className="aspect-[4/3] bg-neutral-200">
                        <img
                          src={blog.featured_image || "/fashion-blog-.jpg"}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 sm:p-5">
                        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-neutral-900">{blog.title}</h3>
                        <p className="mb-3 text-sm leading-relaxed text-neutral-700 line-clamp-2">
                          {blog.description}
                        </p>
                        {blog.created_at && (
                          <p className="mb-3 text-xs text-neutral-500">
                            {new Date(blog.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                        <Button variant="outline" asChild className="w-full sm:w-auto">
                          <Link href={`/blog/${blog.slug}`}>Read more</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
            <div ref={sentinelRef} className="h-8" />
            {loadingMore && (
              <div className="mt-8 text-center text-neutral-600">Loading more blog posts...</div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  )
}
