import { FeaturedCampaigns } from "@/components/featured-campaigns"

export default function MarketplaceHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Marketplace Home</h1>
      </div>

      <section className="border-t pt-6">
        <h2 className="text-2xl font-bold mb-2">Top Indie Designer</h2>
        <h4 className="text-sm text-neutral-600 mb-4">Vote up the designers you like</h4>
        <FeaturedCampaigns />
      </section>

      <section className="border-t pt-6">
        <h2 className="text-2xl font-bold">Local Events</h2>
      </section>
    </div>
  )
}
