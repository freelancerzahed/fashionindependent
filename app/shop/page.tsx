import { CampaignCard } from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ShopPage() {
  const campaigns = Array.from({ length: 12 }, (_, i) => ({
    id: `shop-${i + 1}`,
    title: `Fashion Design ${i + 1}`,
    designer: `Designer ${i + 1}`,
    image: `/placeholder.svg?height=400&width=400&query=fashion design ${i + 1}`,
    fundedAmount: Math.floor(Math.random() * 15000) + 5000,
    fundingGoal: 20000,
    backers: Math.floor(Math.random() * 100) + 20,
    daysRemaining: Math.floor(Math.random() * 28) + 2,
    category: "womenswear",
    subcategory: "dresses",
    description: `Beautiful fashion design by ${`Designer ${i + 1}`}`,
    status: "active" as const,
    pledgeOptions: [
      { amount: 50, description: "Early Bird" },
      { amount: 100, description: "Standard" },
      { amount: 250, description: "Premium" },
    ],
    createdAt: new Date().toISOString(),
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input type="search" placeholder="Search campaigns..." className="pl-12 h-12 text-lg" />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <Button variant="default">New Arrivals</Button>
              <Button variant="outline">Closing Soon</Button>
              <Button variant="outline">Crowd Favs</Button>
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Campaigns
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
