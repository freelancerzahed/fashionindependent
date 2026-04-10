import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MarketplacePage() {
  const features = [
    {
      icon: "🛍️",
      title: "Discover Independent Designers",
      description: "Browse exclusive collections from emerging fashion talents worldwide",
    },
    {
      icon: "✨",
      title: "Invest in Unique Style",
      description: "Support independent creators and get access to limited-edition pieces",
    },
    {
      icon: "🌍",
      title: "Sustainable Fashion",
      description: "Shop ethically-made collections that prioritize quality and the environment",
    },
    {
      icon: "💳",
      title: "Flexible Funding",
      description: "Support campaigns and receive your items when production is complete",
    },
    {
      icon: "👥",
      title: "Join a Community",
      description: "Connect with fashion enthusiasts and independent designers",
    },
    {
      icon: "🎁",
      title: "Exclusive Rewards",
      description: "Backers often receive special perks and exclusive variants",
    },
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Marketplace</h1>
            <p className="text-xl text-neutral-700 mb-8">
              Discover unique fashion collections from independent designers and support creative vision
            </p>
            <Link href="/shop">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Shop on Mirror Me Fashion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-black text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Browse Campaigns</h3>
                  <p className="text-neutral-600">
                    Explore active campaigns from independent designers. Each campaign showcases unique designs with detailed information about the collection, timeline, and pricing.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-black text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Back Your Favorite</h3>
                  <p className="text-neutral-600">
                    Select the designs and sizes you love, then pre-order to support the designer. You're helping bring their creative vision to life.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-black text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Production Begins</h3>
                  <p className="text-neutral-600">
                    Once the funding goal is reached, manufacturing begins. Track progress through our dashboard as your items are designed, produced, and prepared for shipment.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-black text-white font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Receive & Enjoy</h3>
                  <p className="text-neutral-600">
                    Get your unique items delivered straight to your door. Enjoy knowing you directly supported an independent designer in bringing their vision to reality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Teaser */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Collections</h2>
            <p className="text-neutral-600 mb-8">
              Explore the latest campaigns from talented independent designers
            </p>
            <Link href="/shop">
              <Button size="lg">View All Collections</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Discover Your Next Favorite?</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of supporters backing independent fashion designers
          </p>
          <Link href="/shop">
            <Button size="lg" variant="secondary">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
