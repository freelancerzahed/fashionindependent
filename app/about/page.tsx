import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm font-medium text-neutral-600 mb-4">by Mirror Me Fashion</p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">The Fashion Independent</h1>
              <p className="text-2xl text-neutral-700 mb-8">We Deserve the Best</p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              
              <h2 className="text-3xl font-bold mb-8 text-center">About the Fashion Independent</h2>

              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>Clothing stores are saturated with cheap, low-quality fashion that looks appealing at first, but rarely delivers 
                  in color, quality and durability; fading, losing shape, and falling apart after just a few washes, fueling our 
                  contribution to global pollution. At the very same time, we, the wearers, have lost our connection to the artists 
                  who make one-of-a-kind pieces that we can feel proud to wear–fashion that doesn’t give you an icky feeling.   
                </p>
                <p>
                  We need stylish, thoughtfully crafted fashion. The Fashion Independent was created to connect those who love 
                  fashion with passionate designers laboring to create it.  
                </p>

                <p className="text-2xl font-semibold text-neutral-900 text-center py-8">
                  Fashion is art. Fashion is expression. Fashion is necessary.
                </p>
                <p>
                  The Fashion Independent is a collective of designers and fashion enthusiasts. Our members help grow a fashion brand 
                  through our browse, vote, donate, and buy system. Items in our store are available for immediate purchase, while items 
                  showcased in an active campaign become available for sale once the campaign ends. 
                </p>
              
         
                <p><strong>Crowdsourcing.</strong> Emerging designers share the designs and collections they want to showcase by launching a campaign. 
                  For 7–30 days, members vote on and provide feedback on Showcased⭐ products. Donations are optional. We typically showcase 5–20 designs at a 
                  time. 
                </p>

                <p><strong>Limited Drops.</strong> Successful campaigns move from the <em>Showcasing Phase</em> to our store for a short window, 
                typically 30-60 days. After this period, any product we continue to feature in our store will link directly to the 
                designer’s website for purchase. 
                </p>
                <p><strong>Marked-Down Prices.</strong> Because our members shop our store en mass, our partner designers can offer 
                high-quality, well-made products at significant discounts. Each limited drop is available at a reduced price while 
                featured in our store. 
                </p>

                <img src="images/section_9.png" alt="About The Fashion Independent" className="w-full h-auto rounded-lg mb-12" />
                <p className="text-center text-xl">
                  Need additional help?
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">📞</div>
                    <h3 className="font-semibold text-lg">Support</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">ℹ️</div>
                    <h3 className="font-semibold text-lg">FAQs</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/faqs">FAQs</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">🔍</div>
                    <h3 className="font-semibold text-lg">How This Works</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/how-this-works">Info</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
