"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RulesPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Rules & Guidelines</h1>
            <p className="text-xl text-neutral-700">Understand how The Fashion Independent works</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              {/* Designer Requirements */}
              <div>
                <h2 className="text-3xl font-bold mb-6">For Designers & Creators</h2>
                <div className="space-y-4 text-lg text-neutral-700 leading-relaxed">
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Campaign Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>A real image or 3D rendering of your product (no hand drawings or 2D flats)</li>
                      <li>A factory-ready tech pack</li>
                      <li>Existing inventory available for immediate sale OR a reliable manufacturer for production</li>
                      <li>Commitment to quality and sustainability standards</li>
                      <li>Willingness to fulfill orders within agreed timelines</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-xl mb-2">Campaign Duration</h3>
                    <p>Campaigns run for 7–20 days (recommended: 14 days). Designers can adjust the campaign duration based on their goals and market feedback.</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-xl mb-2">Pricing & Fees</h3>
                    <p>Designers can offer products at reduced prices while featured in our Limited Drops. All transactions are subject to our standard marketplace fees.</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-xl mb-2">Content & Intellectual Property</h3>
                    <p>Designers retain full ownership of their designs. All content must be original and not infringe on any third-party intellectual property rights.</p>
                  </div>
                </div>
              </div>

              {/* Member Rules */}
              <div className="border-t pt-12">
                <h2 className="text-3xl font-bold mb-6">For Members & Shoppers</h2>
                <div className="space-y-4 text-lg text-neutral-700 leading-relaxed">
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Voting & Feedback</h3>
                    <p>Members can vote on showcased designs and provide public feedback. Respectful, constructive comments help designers improve their work.</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-xl mb-2">Purchases & Returns</h3>
                    <p>Products in our store are available for immediate purchase. Returns and refunds follow the designer's stated policy, clearly displayed at checkout.</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-xl mb-2">Community Standards</h3>
                    <p>We maintain a respectful community. Harassment, hate speech, or promotion of illegal activities will result in account suspension or termination.</p>
                  </div>
                </div>
              </div>

              {/* General Rules */}
              <div className="border-t pt-12">
                <h2 className="text-3xl font-bold mb-6">General Platform Rules</h2>
                <div className="space-y-4 text-lg text-neutral-700 leading-relaxed">
                  <ul className="list-disc list-inside space-y-2">
                    <li>All users must be 18 years or older</li>
                    <li>One account per person</li>
                    <li>No spam, phishing, or fraudulent activity</li>
                    <li>No copyrighted material without permission</li>
                    <li>We reserve the right to remove content that violates these rules</li>
                    <li>Disputes are resolved through our customer support team</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t pt-12 mt-12">
              <div className="bg-neutral-50 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
                <p className="text-neutral-700 mb-6">Check our FAQs or contact our support team</p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link href="/faqs">View FAQs</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

