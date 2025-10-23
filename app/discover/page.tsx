"use client"

import { useState } from "react"
import { CampaignCard } from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { mockCampaigns } from "@/lib/data"
import { MobileTabs } from "@/components/mobile-tabs"

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  let filteredCampaigns = mockCampaigns

  if (selectedCategory) {
    filteredCampaigns = filteredCampaigns.filter((c) => c.category === selectedCategory)
  }

  if (searchQuery) {
    filteredCampaigns = filteredCampaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.designer.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const categories = ["Womenswear", "Menswear", "Kidswear", "Wearables"]

  const categoryTabs = [
    { id: "all", label: "All" },
    ...categories.map((cat) => ({ id: cat.toLowerCase(), label: cat })),
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-center">Creatives in the spotlight</h1>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="border-b bg-white py-4 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            {/* Desktop filters */}
            <div className="hidden md:flex gap-4 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Mobile swiper tabs */}
            <div className="md:hidden">
              <MobileTabs
                tabs={categoryTabs}
                activeTab={selectedCategory === null ? "all" : selectedCategory.toLowerCase()}
                onTabChange={(tabId) => {
                  if (tabId === "all") {
                    setSelectedCategory(null)
                  } else {
                    setSelectedCategory(tabId.charAt(0).toUpperCase() + tabId.slice(1))
                  }
                }}
                children={
                  filteredCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-neutral-600 text-lg">No campaigns found. Try adjusting your filters.</p>
                    </div>
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* Campaigns Grid */}
        <section className="py-12 bg-white hidden md:block">
          <div className="container mx-auto px-4">
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600 text-lg">No campaigns found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
