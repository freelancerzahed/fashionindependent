import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HireAProfessionalPage() {
  const professionTypes = [
    { title: "Designers", description: "Hire fashion designers to bring your ideas to life" },
    { title: "Manufacturers", description: "Connect with experienced manufacturers for your production" },
    { title: "Marketers", description: "Get expert marketing help to launch your campaign" },
    { title: "Photographers", description: "Hire professional photographers for stunning product photos" },
    { title: "Quality Assurance", description: "Ensure quality with professional QA services" },
    { title: "Logistics Partners", description: "Connect with logistics professionals for fulfillment" },
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Hire a Professional</h1>
            <p className="text-xl text-neutral-700 mb-8">
              Find talented professionals ready to help you launch and grow your fashion brand
            </p>
            <Link href="/signup">
              <Button size="lg">Launch Your Campaign</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Find the Right Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionTypes.map((type, index) => (
                <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition">
                  <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                  <p className="text-neutral-600 text-sm mb-4">{type.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/launch-campaign">Browse Professionals</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Define Your Needs</h3>
                  <p className="text-neutral-600">Tell us what you're looking for and your project details</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Browse Professionals</h3>
                  <p className="text-neutral-600">Explore portfolios and connect with qualified candidates</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Collaborate & Create</h3>
                  <p className="text-neutral-600">Work together to bring your fashion vision to life</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Launch Your Campaign</h3>
                  <p className="text-neutral-600">Bring your designs to market and measure success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your Dream Team?</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Start collaborating with talented professionals and bring your fashion ideas to life
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
