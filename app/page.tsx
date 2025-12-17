"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CampaignCard } from "@/components/campaign-card"
import { CarouselSlider } from "@/components/carousel-slider"
import { HeroSlide } from "@/components/hero-slide"
import { BlogSlide } from "@/components/blog-slide"
import { useState } from "react"
import { MobileTabs } from "@/components/mobile-tabs"

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("new")

  const campaigns = Array.from({ length: 6 }, (_, i) => ({
    id: `campaign-${i + 1}`,
    title: `Fashion Design ${i + 1}`,
    designer: `Designer ${i + 1}`,
    image: `/placeholder.svg?height=400&width=400&query=fashion design ${i + 1}`,
    fundedAmount: Math.floor(Math.random() * 15000) + 5000,
    fundingGoal: 20000,
    backers: Math.floor(Math.random() * 100) + 20,
    daysRemaining: Math.floor(Math.random() * 28) + 2,
    category: "Womenswear",
    subcategory: "Dresses",
    description: `Beautiful sustainable fashion design by Designer ${i + 1}. Made with eco-friendly materials and ethical production practices.`,
    status: "active" as const,
    pledgeOptions: [
      { id: `pledge-${i}-1`, amount: 50, description: "Early Bird", quantity: 20 },
      { id: `pledge-${i}-2`, amount: 100, description: "Standard", quantity: 100 },
      { id: `pledge-${i}-3`, amount: 250, description: "Premium", quantity: 10 },
    ],
    createdAt: new Date(),
  }))

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

  const blogArticles = [
    {
      id: "article-1",
      title: "The Future of Sustainable Fashion",
      excerpt:
        "Explore how independent designers are leading the sustainable fashion revolution with eco-friendly materials and ethical production.",
      image: "/sustainable-fashion-future.jpg",
      date: "March 15, 2025",
    },
    {
      id: "article-2",
      title: "Meet Our Top Designers",
      excerpt:
        "Discover the talented designers behind some of our most successful campaigns and learn about their creative journey.",
      image: "/fashion-designers-studio.jpg",
      date: "March 10, 2025",
    },
    {
      id: "article-3",
      title: "How to Start Your Fashion Brand",
      excerpt:
        "A comprehensive guide for aspiring fashion entrepreneurs on how to launch their brand through crowdfunding.",
      image: "/fashion-brand-startup.jpg",
      date: "March 5, 2025",
    },
    {
      id: "article-4",
      title: "Backer Stories: Why We Support Independent Fashion",
      excerpt:
        "Read inspiring stories from our community members about why they choose to support independent fashion designers.",
      image: "/fashion-community-support.jpg",
      date: "February 28, 2025",
    },
  ]

  const filterTabs = [
    { id: "new", label: "New Arrivals" },
    { id: "closing", label: "Closing Soon" },
    { id: "favs", label: "Crowd Favs" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Carousel Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <CarouselSlider
              items={heroSlides.map((slide) => (
                <HeroSlide
                  key={slide.title}
                  title={slide.title}
                  subtitle={slide.subtitle}
                  description={slide.description}
                  image={slide.image}
                  ctaText={slide.ctaText}
                  ctaLink={slide.ctaLink}
                />
              ))}
              autoPlay={true}
              autoPlayInterval={6000}
              showIndicators={true}
              showArrows={true}
            />
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
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <div className="hidden md:flex gap-4">
                <Button variant="outline">Closing Soon</Button>
                <Button variant="outline">Crowd Favs</Button>
              </div>
            </div>

            <div className="md:hidden mb-6">
              <MobileTabs tabs={filterTabs} activeTab={activeFilter} onTabChange={setActiveFilter}>
                <div className="grid grid-cols-1 gap-6">
                  {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              </MobileTabs>
            </div>

            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </section>

        {/* Blog Carousel Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
            <CarouselSlider
              items={blogArticles.map((article) => (
                <BlogSlide
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  image={article.image}
                  date={article.date}
                />
              ))}
              autoPlay={true}
              autoPlayInterval={7000}
              showIndicators={true}
              showArrows={true}
            />
          </div>
        </section>

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
