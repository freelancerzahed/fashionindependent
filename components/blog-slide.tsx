import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BlogSlideProps {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
}

export function BlogSlide({ id, title, excerpt, image, date }: BlogSlideProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="p-6">
        <p className="text-sm text-neutral-500 mb-2">{date}</p>
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{title}</h3>
        <p className="text-neutral-600 mb-4 line-clamp-3">{excerpt}</p>
        <Button variant="outline" asChild>
          <Link href={`/blog/${id}`}>Read More</Link>
        </Button>
      </div>
    </div>
  )
}
