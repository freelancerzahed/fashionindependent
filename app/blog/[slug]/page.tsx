import BlogDetailClient from "@/components/blog-detail-client"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <>
      <BlogDetailClient slug={slug} />
    </>
  )
}
