import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CarouselSlider } from "@/components/carousel-slider"
import { HeroSlide } from "@/components/hero-slide"
import { FeaturedCampaigns } from "@/components/featured-campaigns"
import { LatestArticles } from "@/components/latest-articles"

// Revalidate every 1 hour (3600 seconds) for ISR
export const revalidate = 3600

interface BlogArticle {
  id: string | number
  title: string
  slug: string
  description: string
  featured_image: string
  created_at: string
}

interface BlogResponse {
  result: boolean
  blogs: {
    data: BlogArticle[]
  }
}

async function fetchArticles(): Promise<BlogArticle[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL

    if (!apiUrl) {
      console.error("❌ API URL not configured")
      return []
    }

    console.log("📡 Server: Fetching latest articles from", `${apiUrl}/blog-list`)

    const response = await fetch(`${apiUrl}/blog-list?page=1`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error(`❌ API error: ${response.status}`)
      return []
    }

    const data: BlogResponse = await response.json()

    if (data.result && data.blogs?.data && Array.isArray(data.blogs.data)) {
      console.log("✓ Successfully fetched", data.blogs.data.length, "articles for home")
      return data.blogs.data.slice(0, 6)
    }

    return []
  } catch (err) {
    console.error("❌ Error fetching articles:", err)
    return []
  }
}

export default async function HomePage() {
  const articles = await fetchArticles()

  const heroSlides = [
    {
      title: "The Fashion Independent",
      subtitle: "by Mirror Me Fashion",
      description: "Discover rare fashion and support talented designers around the world",
      image: "images/section_2.png",
      ctaText: "Discover Campaigns",
      ctaLink: "/discover",
    },
    {
      title: "Support Independent Designers",
      subtitle: "Creatives in the Spotlight",
      description: "Build the brand of a creative and bring their vision to life",
      image: "images/section_62.png",
      ctaText: "Launch a Campaign",
      ctaLink: "/launch-campaign",
    },
    {
      title: "Sustainable Fashion",
      subtitle: "Eco-Conscious Agenda",
      description: "Discover steps Three Steps Forward is taking to reduce our environmental impact",
      image: "images/banner-boho-chic-mountain.png",
      ctaText: "Learn More",
      ctaLink: "/shop",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Top Image Section */}
        <section className="w-full h-screen relative">
          <img src="images/section_2.png" alt="Section 2" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <p className="text-sm font-medium mb-2 opacity-90">by Mirror Me Fashion</p>
            <h2 className="text-[45px] md:text-[60px] font-bold mb-4 text-balance">The Fashion Independent</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-95">Discover rare fashion and support talented designers around the world</p>
            <Link data-slot="button" href="/discover" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 rounded-md px-6 has-[&>svg]:px-4">
              Discover Campaigns
            </Link>
          </div>
        </section>

        {/* Two Images Side-by-Side */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative w-full h-full min-h-[300px]">
              <img src="images/section_62.png" alt="Section 62" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-3xl md:text-4xl mb-3">Support Independent Designers</h2>
                <p className="text-lg md:text-xl mb-6">Build the brand of a creative</p>
                <Link data-slot="button" href="/discover" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 rounded-md px-6 has-[&>svg]:px-4">
                  Discover Campaigns
                </Link>
              </div>
            </div>
            <div className="relative w-full h-full min-h-[300px]">
              <img src="images/banner-boho-chic-mountain.png" alt="Boho Chic Mountain" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-3xl md:text-4xl mb-3">Sustainable Fashion</h2>
                <p className="text-lg md:text-xl mb-6">Eco Conscious Fashion</p>
                <Link data-slot="button" href="/about" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 rounded-md px-6 has-[&>svg]:px-4">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* Mission Statement */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-neutral-700 leading-relaxed">
                The Fashion Independent was born to give talented designers a single space online to launch their fashion brands. 
                On this platform, designers worldwide can realize their creative visions by connecting with generous backers like 
                you who want stylish, rare fashion.
              </p>
              <p className="text-xl font-semibold mt-6 text-neutral-900">
                Discover the next generation of talent shaping the future of fashion.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Campaigns */}
        <FeaturedCampaigns />

        {/* Latest Articles - Now Dynamic */}
        <LatestArticles initialArticles={articles} />

        {/* CTA Section */}
        <section className="py-20 bg-neutral-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Launch Your Campaign?</h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Join our community of independent fashion designers and bring your creative vision to life.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/launch-campaign">Launch a Campaign</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
