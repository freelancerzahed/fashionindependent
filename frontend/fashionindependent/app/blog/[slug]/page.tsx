import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, User } from "lucide-react"
import BlogDetailClient from "@/components/blog-detail-client"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-background">
      <BlogDetailClient slug={slug} />
    </div>
  )
}
