import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FindAJobPage() {
  const jobCategories = [
    { title: "Design & Pattern Making", description: "Find talented designers and pattern makers" },
    { title: "Manufacturing & Production", description: "Connect with manufacturers and production specialists" },
    { title: "Marketing & Social Media", description: "Hire marketing professionals to grow your brand" },
    { title: "Photography & Styling", description: "Find photographers and stylists for product shoots" },
    { title: "Quality Assurance", description: "Connect with QA specialists and auditors" },
    { title: "Logistics & Fulfillment", description: "Find logistics partners for order fulfillment" },
  ]

  return (
        <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Find a Job</h1>
            <p className="text-xl text-neutral-700 mb-8">
              Browse opportunities to work with emerging fashion designers and grow your portfolio
            </p>
            <Link href="/signup">
              <Button size="lg">Find a Fashion Job</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto">
            <div className="flex gap-6">
              <div className="w-1/5 pr-6">
                {/* Left Column: How It Works */}
                <div>
                  <h2 className="text-3xl font-bold mb-12">Browse Job Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {jobCategories.map((category, index) => (
                      <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition">
                        <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                        <p className="text-neutral-600 text-sm mb-4">{category.description}</p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/signup">Browse Jobs</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-4/5 space-y-6">
                {/* Right Column: Our Process */}
                <div>
                  <h2 className="text-3xl font-bold mb-12">Our Job Offerings</h2>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Next Project?</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Sign up today to browse jobs and build your professional network
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Create Your Profile</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
