import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ThreeStepsForward() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Three Steps Forward</h1>
              <p className="text-2xl text-neutral-700 mb-8">Sustainability | Reform | Growth</p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">

              <img src="images/3SF-red-stilettos.png" alt="About The Fashion Independent" className="w-full h-auto rounded-lg mb-12" />
              <h2 className="text-3xl font-bold mb-8 text-center">About Three Steps Forward</h2>

              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>
                 Three Steps Forward is a newly formed not-for-profit organization who understands that fashion is inextricably tied 
                 to people and the planet.                 
                </p>
                <p>
                  Fashion is Art. Fashion is self-expression. Fashion is indispensable- it’s both mandatory and a practical part 
                  of everyday life. Most importantly, fashion is necessary for maintaining  a progressive society of free, independent thinkers. 
                  Its positive impacts cannot be eclipsed by the shortsighted choices of a handful of players.
                </p>
                <p>
                  Three Steps Forward was founded with a clear mission: to confront the sustainability challenges facing fashion without 
                  compromising the industry’s standards of excellence. We strive to merge technological innovation with global governmental leadership 
                  to drive meaningful change — building green factories, keeping textiles out of landfills, protecting workers 
                  from unsafe and unfair conditions, transforming plastics into synthetic fibers, reducing carbon emissions, and embracing 
                  more natural fibers and dyes to produce sustainable yet chic textiles.  
                </p>
                
                

                <p className="text-2xl font-semibold text-neutral-900 text-center py-8">
                  We envision a world where our industry is no longer the planet’s second-largest polluter
                </p>                
                <p>
                 Our objectives can be accomplished without substituting the artist vision and economic reality of designers and fashion houses.
                </p>
              </div>
              <div className="space-y-2 mt-6 text-lg text-neutral-700 leading-relaxed">
                <ul>
                  <Link href="/article-1" className="text-lg text-neutral-700 hover:text-yellow"> 
                    China's Responsibility
                  </Link>
                </ul>
                <ul>
                  <Link href="/article-2" className="text-lg text-neutral-700 hover:text-yellow">
                    Global Leadership and Fashion Policy in 2025
                  </Link>
                </ul>
                <ul>
                  <Link href="/article-3" className="text-lg text-neutral-700 hover:text-yellow">
                    Individual Leadership - Your Part in this Fight
                  </Link>
                </ul>
                <ul>
                  <Link href="/article-4" className="text-lg text-neutral-700 hover:text-yellow">
                    Policy Positions to Reshape the Industry 'for Good'
                  </Link>
                </ul>    
              </div>
              
              <div className="space-y-2 mt-12 text-lg text-neutral-700 leading-relaxed">
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/discover">Donate Now</Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/discover">Stay In Touch</Link>
                </Button>
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
