import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, User } from "lucide-react"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Mock blog post data
  const post = {
    title: "The Rise of Sustainable Fashion: How Independent Designers Are Leading the Change",
    author: "Sarah Johnson",
    date: "March 20, 2025",
    readTime: "5 min read",
    image: "/sustainable-fashion.png",
    content: `
      <p>The fashion industry is undergoing a remarkable transformation, and independent designers are at the forefront of this change. As consumers become increasingly conscious of their environmental impact, sustainable fashion has moved from a niche market to a mainstream movement.</p>

      <h2>The Problem with Fast Fashion</h2>
      <p>Fast fashion has dominated the industry for decades, producing cheap, trendy clothing at an unprecedented scale. However, this model comes with significant environmental and social costs. The industry is responsible for 10% of global carbon emissions and is the second-largest consumer of water worldwide.</p>

      <h2>Independent Designers Making a Difference</h2>
      <p>Independent designers are challenging this status quo by prioritizing quality over quantity, using sustainable materials, and implementing ethical production practices. Through platforms like The Fashion Independent, these designers can bring their visions to life without compromising their values.</p>

      <h2>The Role of Crowdfunding</h2>
      <p>Crowdfunding has emerged as a powerful tool for sustainable fashion. It allows designers to gauge interest before production, reducing waste and overstock. Backers become part of the creative process, supporting pieces they truly want rather than mass-produced items.</p>

      <h2>Looking Forward</h2>
      <p>The future of fashion is sustainable, ethical, and independent. By supporting emerging designers who prioritize these values, consumers can help shape an industry that respects both people and the planet.</p>
    `,
  }

  const relatedPosts = [
    {
      title: "How to Support Independent Designers",
      image: "/fashion-designer-sketching.png",
      slug: "support-independent-designers",
    },
    {
      title: "The Future of Fashion Crowdfunding",
      image: "/crowdfunding-concept.png",
      slug: "future-fashion-crowdfunding",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
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
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>

          <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.slug} className="overflow-hidden">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative w-full h-48">
                      <Image
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold hover:text-primary transition-colors">{relatedPost.title}</h3>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
