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
              <p className="text-2xl text-neutral-700 mb-8">Fashion Crowdfunding Platform</p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              
              <h2 className="text-3xl font-bold mb-8 text-center">About the Fashion Independent</h2>

              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>
                  The Fashion Independent was born out of a desire to help talented indie designers bring their vision
                  to life. On this platform, supporting emerging designers globally allows you to get your hands on
                  stylish, obscure, thoughtfully crafted fashion before it becomes mainstream.
                </p>

                <p className="text-2xl font-semibold text-neutral-900 text-center py-8">
                  Fashion is art. Fashion is expression. Fashion is necessary.
                </p>
                <img src="images/section_9.png" alt="About The Fashion Independent" className="w-full h-auto rounded-lg mb-12" />
                <p>
                  This site keeps in mind individuals like you who understand those elements of fashion and appreciate
                  the skill of an artisan looking to bring their creative ideas to reality.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">🔍</div>
                    <h3 className="font-semibold text-lg">Discover Fashion</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/shop">Explore</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">👗</div>
                    <h3 className="font-semibold text-lg">Make Pledge</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/discover">Support</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">💝</div>
                    <h3 className="font-semibold text-lg">Sustainable Future</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/three-steps-forward">Shop</Link>
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
