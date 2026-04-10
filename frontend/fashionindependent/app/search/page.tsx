"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CampaignCard } from "@/components/campaign-card"
import { Search } from "lucide-react"
import Link from "next/link"
import { searchCampaigns } from "@/lib/data"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const campaigns = query ? searchCampaigns(query) : []

  const popularSearches = [
    "Sustainable dresses",
    "Vintage jackets",
    "Handmade accessories",
    "Eco-friendly swimwear",
    "Designer shoes",
  ]

  return (
    <main className="flex-1">
      <div className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Search Campaigns</h1>
            <form action="/search" method="get" className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search for campaigns, designers, or categories..."
                className="pl-12 pr-4 py-6 text-lg"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {query ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                Results for "{query}"<span className="text-neutral-600 ml-2">({campaigns.length})</span>
              </h2>
            </div>

            {campaigns.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {campaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                    <CampaignCard campaign={campaign} />
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-lg text-neutral-600 mb-4">No results found for "{query}"</p>
                <p className="text-neutral-600 mb-6">Try adjusting your search or browse our categories</p>
                <Button asChild>
                  <Link href="/discover">Browse All Campaigns</Link>
                </Button>
              </Card>
            )}
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Popular Searches</h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {popularSearches.map((search) => (
                <Button key={search} variant="outline" asChild>
                  <Link href={`/search?q=${encodeURIComponent(search)}`}>{search}</Link>
                </Button>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {["Womenswear", "Menswear", "Kidswear", "Wearables"].map((category) => (
                <Card key={category} className="p-6 hover:shadow-lg transition-shadow">
                  <Link href={`/category/${category.toLowerCase()}`} className="block">
                    <h3 className="text-xl font-semibold">{category}</h3>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
