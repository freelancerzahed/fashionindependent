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
                    <p>Campaigns run for 7–30 days. Designers can adjust the campaign duration based on their goals and market feedback.</p>
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
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6 text-center">The Fashion Independent</h2>
          <h2 className="text-3xl font-bold mb-12 text-center">Platform Rules for Creatives</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Use High Resolution Product Images",
                description:
                  "Use a real image or 3D rendering at least 1000 × 1000 px. Campaigns will not launch that do not meet this minimum. Front and back views are required; multiple perspectives are encouraged. ",
              },
              {
                step: "2",
                title: "Demonstrate Readiness",
                description:
                  "Early-stage designers can sell on our site even if products aren’t yet manufactured. You will need a factory-ready tech pack and a manufacturer who can stock items within 14 days. Having existing inventory is encouraged but if you don’t have a manufacturer we can help. ",
              },
              {
                step: "3",
                title: "Timely Order Fulfillment",
                description:
                  "You will be required to indicate how much inventory you have at the start of a new campaign. Process and ship all orders in 1 – 5 days. You have up to 14 days to produce and ship products that need to be manufactured. Your backers will be updated at every stage of the process. ",
              },
              {
                step: "4",
                title: "Product Quality Pledge",
                description:
                  "As an indie designer, your commitment to creating high quality products is paramount. All pieces must resist fading, breaking, or other signs of poor quality. Our customers expect excellence. Products that don’t meet this standard will be removed from the platform. As we grow, we will introduce improved ways to recycle, upcycle, and promote sustainability without limiting creativity or choice. ",
              },
              {
                step: "5",
                title: "Offer a Discount",
                description:
                  "Members of The Fashion Independent provide backing and product feedback to help you grow your brand. In return, we ask all designers participating in the Limited Drop Program to offer their products at a discounted price so that the greatest number of shoppers can access them. Discounting will drive a significant increase in sales.",
              },
              {
                step: "6",
                title: "Verify Your Identity",
                description:
                  "To protect our community and comply with U.S. tax laws, all designers must verify their identity before any funds are released. You’ll be asked to complete a background check and submit valid government-issued identification. We also require accurate tax information so we can properly report earnings to the IRS as a 1099 worker when applicable. This verification helps ensure trust, transparency, and compliance for everyone on the platform. ",
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
              <img
                src="/images/general-clothing-bold-1.jpg"
                alt="Creative Success Stories"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Designer Partner Requirements</h2>
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
                  <strong>Note:</strong> We verify all of our design partners to protect our community from fraudulent activities. All
                  designers agree to our partnership agreement and platform terms and conditions.
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
              Join our growing list of designers who have successfully launched their collections on The Fashion Independent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
