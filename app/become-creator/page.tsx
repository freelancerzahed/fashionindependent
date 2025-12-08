"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function BecomeCreatorPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const benefits = [
    "Reach thousands of fashion enthusiasts worldwide",
    "Get funded for your design concepts",
    "Access our manufacturing facility",
    "Receive support from our expert team",
    "Build your brand with The Fashion Independent",
    "Eco-friendly production practices",
  ]

  const requirements = [
    "A real image or 3D rendering of your product",
    "A factory-ready tech pack",
    "Low inventory on an existing product line",
    "Commitment to quality and sustainability",
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a Creator</h1>
            <p className="text-xl text-neutral-300 mb-8">
              Launch your fashion brand with The Fashion Independent. Get funded, get manufactured, get discovered.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Campaign",
                description:
                  "Upload your product images, tech pack, and campaign details. Our team reviews for quality and authenticity.",
              },
              {
                step: "2",
                title: "Get Funded",
                description:
                  "Backers pledge to support your design. Campaigns need 10 pledges to succeed (90 days for luxury items).",
              },
              {
                step: "3",
                title: "Manufacture & Deliver",
                description:
                  "Use our eco-friendly manufacturing facility or your own. Deliver within 60 days (30 days with our facility).",
              },
            ].map((item) => (
              <Card key={item.step} className="p-6 text-center">
                <div className="text-4xl font-bold text-neutral-900 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-neutral-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Why Join The Fashion Independent?</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-6 h-6 text-neutral-900 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-100 rounded-lg h-96 flex items-center justify-center">
              <p className="text-neutral-500">Creator Success Stories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Creator Requirements</h2>
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-neutral-900 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{req}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> We verify all creators to protect our community from fraudulent activities. All
                  creators agree to our partnership terms and cannot sell products outside our platform.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Brand?</h2>
            <p className="text-neutral-600 mb-8">
              Join hundreds of designers who have successfully launched their collections on The Fashion Independent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup?role=creator">
                <Button size="lg" className="w-full sm:w-auto">
                  Sign Up as Creator
                </Button>
              </Link>
              <Link href="/launch-campaign">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Launch Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
