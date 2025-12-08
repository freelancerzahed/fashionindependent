import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CampaignCard from "@/components/campaign-card"
import { Search } from "lucide-react"

const categoryData: Record<string, { title: string; subcategories: string[] }> = {
  womenswear: {
    title: "Womenswear",
    subcategories: [
      "Tops",
      "Bottoms",
      "Sweaters & Cardigans",
      "Dresses",
      "Coats & Jackets",
      "Jumpsuits & Rompers",
      "Lingerie & Underwear",
      "Accessories",
      "Shoes",
      "Swimwear",
    ],
  },
  menswear: {
    title: "Menswear",
    subcategories: ["Shirts", "Bottoms", "Coats & Jackets", "Suits", "Underwear", "Accessories", "Shoes"],
  },
  kidswear: {
    title: "Kidswear",
    subcategories: [
      "Tops",
      "Bottoms",
      "Sweaters & Cardigans",
      "Dresses",
      "Coats & Jackets",
      "Jumpsuits & Rompers",
      "Accessories",
      "Shoes",
      "Swimwear",
    ],
  },
  wearables: {
    title: "Wearables",
    subcategories: ["Smart Jewelry", "Fitness Trackers", "Smart Watches", "Tech Accessories"],
  },
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categoryParam } = await params
  const category = categoryData[categoryParam] || categoryData.womenswear

  // Mock campaign data
  const campaigns = Array.from({ length: 12 }, (_, i) => ({
    id: `${categoryParam}-${i + 1}`,
    title: `${category.title} Design ${i + 1}`,
    designer: `Designer ${i + 1}`,
    image: `/placeholder.svg?height=400&width=400&query=${category.title} fashion design`,
    category: category.title,
    subcategory: category.subcategories[i % category.subcategories.length],
    description: `Beautiful ${category.title.toLowerCase()} piece from independent designer`,
    fundingGoal: 20000,
    fundedAmount: Math.floor(Math.random() * 15000) + 5000,
    backers: Math.floor(Math.random() * 100) + 20,
    daysRemaining: Math.floor(Math.random() * 28) + 2,
    status: "active" as const,
    pledgeOptions: [],
    createdAt: new Date(),
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
          <p className="text-muted-foreground">
            Discover unique {category.title.toLowerCase()} from independent designers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-6 sticky top-4">
              <h2 className="font-semibold mb-4">Subcategories</h2>
              <ul className="space-y-2">
                {category.subcategories.map((sub) => (
                  <li key={sub}>
                    <Link
                      href={`/category/${categoryParam}?sub=${sub.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <h2 className="font-semibold mb-4">Filter by</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <div className="flex gap-2">
                      <Input placeholder="Min" type="number" />
                      <Input placeholder="Max" type="number" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Newest</option>
                      <option>Most Funded</option>
                      <option>Ending Soon</option>
                      <option>Most Backers</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder={`Search ${category.title.toLowerCase()}...`} className="pl-10" />
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">{campaigns.length} campaigns found</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
