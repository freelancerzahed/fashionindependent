import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Article */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              <div className="aspect-[4/3] bg-neutral-200 rounded-lg overflow-hidden">
                <img src="/abstract-fashion-editorial.png" alt="Main article" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-4">Main Article Title</h1>
                <p className="text-neutral-700 leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Button asChild>
                  <Link href="/blog/main-article">Read more</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Last Chance Section */}
        <section className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Last Chance. Campaigns Ending Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-neutral-200">
                    <img
                      src={`/diverse-fashion-display.png?height=400&width=400&query=fashion product ${i + 1}`}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Name of Product</h3>
                    <p className="text-sm text-neutral-600 mb-3">Time remaining: 01d : 07h</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/campaign/1">View Product</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Articles Grid */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-neutral-200">
                    <img
                      src={`/fashion-blog-.jpg?height=400&width=600&query=fashion blog ${i + 1}`}
                      alt="Blog post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <p className="text-neutral-700 leading-relaxed mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <p className="text-neutral-700 leading-relaxed mb-4">
                      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href={`/blog/article-${i + 1}`}>Read more</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
