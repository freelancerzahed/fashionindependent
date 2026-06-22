'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useParams } from 'next/navigation'

interface PressRelease {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  published_date: string
  is_active: boolean
}

export default function PressDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [release, setRelease] = useState<PressRelease | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/mirrormefashion/api/v2'

  useEffect(() => {
    if (!slug) return

    const fetchRelease = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${apiUrl}/blog-details/${slug}`, {
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`)
        }

        const data = await response.json()

        if (data.result && data.blog) {
          const blog = data.blog
          // Transform blog data to match PressRelease interface
          setRelease({
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.short_description || '',
            content: blog.content || blog.description || '',
            published_date: blog.created_at,
            is_active: blog.status === 1,
          })
        } else {
          setError('News item not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news item')
      } finally {
        setLoading(false)
      }
    }

    fetchRelease()
  }, [slug, apiUrl])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading news item...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/press">Back to Press</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (!release) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Not Found</h1>
          <p className="text-muted-foreground mb-6">This news item could not be found.</p>
          <Button asChild>
            <Link href="/press">Back to Press</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0">
            <Link href="/press">← Back to Press</Link>
          </Button>
        </div>

        {/* Article */}
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-3">
              {new Date(release.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h1 className="text-4xl font-bold mb-4">{release.title}</h1>
            <p className="text-lg text-muted-foreground">{release.excerpt}</p>
          </div>

          {/* Content */}
          <Card className="p-8 mb-8">
            <div
              className="prose prose-sm max-w-none dark:prose-invert
                prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
                prose-p:mb-4 prose-p:leading-7
                prose-strong:font-semibold
                prose-em:italic
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                prose-li:mb-2
                prose-a:text-primary prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground prose-blockquote:pl-4 prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: release.content }}
            />
          </Card>

          {/* Meta info */}
          <div className="border-t pt-8">
            <p className="text-sm text-muted-foreground">
              Published: {new Date(release.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}
