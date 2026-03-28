"use client"

import { useEffect, useState } from "react"
import { CarouselSlider } from "@/components/carousel-slider"
import { BlogSlide } from "@/components/blog-slide"

interface BlogArticle {
  id: string | number
  title: string
  slug: string
  description: string
  featured_image: string
  created_at: string
}

interface LatestArticlesProps {
  initialArticles?: BlogArticle[]
}

async function fetchArticles(): Promise<BlogArticle[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return []

    const response = await fetch(`${apiUrl}/blog-list?page=1`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) return []

    const data = await response.json()
    if (data.result && data.blogs?.data && Array.isArray(data.blogs.data)) {
      return data.blogs.data.slice(0, 6).map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
        featured_image: blog.featured_image,
        created_at: blog.created_at,
      }))
    }

    return []
  } catch (err) {
    console.error("❌ Error fetching articles:", err)
    return []
  }
}

export function LatestArticles({ initialArticles = [] }: LatestArticlesProps) {
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles)
  const [loading, setLoading] = useState(!initialArticles.length)

  useEffect(() => {
    // If we have initial articles from server, we're already hydrated
    if (initialArticles.length > 0) {
      setLoading(false)
      return
    }

    // Fallback client-side fetch
    const fetchData = async () => {
      try {
        const data = await fetchArticles()
        setArticles(data.slice(0, 6))
      } catch (err) {
        console.error("Error fetching articles:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialArticles])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!articles.length) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">No articles available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        <CarouselSlider
          items={articles.map((article) => (
            <BlogSlide
              key={article.id}
              id={article.slug}
              title={article.title}
              excerpt={article.description}
              image={article.featured_image}
              date={new Date(article.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          ))}
          autoPlay={true}
          autoPlayInterval={7000}
          showIndicators={true}
          showArrows={true}
        />
      </div>
    </section>
  )
}
