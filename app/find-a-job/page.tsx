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

  const jobOfferings = [
    {
      title: "Junior Fashion Designer",
      type: "Remote • Full-time",
      description: "Support seasonal collections and create technical sketches for emerging brands.",
    },
    {
      title: "Production Coordinator",
      type: "On-site • Contract",
      description: "Coordinate sourcing, sampling, and vendor communication for small-batch launches.",
    },
    {
      title: "Social Media Content Creator",
      type: "Hybrid • Part-time",
      description: "Create short-form content and campaign assets for fashion storytelling.",
    },
    {
      title: "Quality Assurance Specialist",
      type: "Remote • Project-based",
      description: "Review apparel quality standards and support product compliance audits.",
    },
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">Find a Job</h1>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-700 sm:mb-8 sm:text-xl">
              Browse opportunities to work with emerging fashion designers and grow your portfolio.
            </p>
            <Link href="/signup" className="inline-flex">
              <Button size="lg" className="w-full sm:w-auto">
                Find a Fashion Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex flex-col gap-8 lg:flex-row lg:gap-8">
            <div className="w-full lg:w-[32%] xl:w-[28%]">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Browse Job Categories</h2>
                <div className="grid grid-cols-1 gap-4">
                  {jobCategories.map((category, index) => (
                    <div key={index} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                      <h3 className="mb-2 text-base font-semibold sm:text-lg">{category.title}</h3>
                      <p className="mb-4 text-sm text-neutral-600">{category.description}</p>
                      <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                        <Link href="/signup">Browse Jobs</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[68%] xl:w-[72%]">
              <div className="rounded-2xl border border-neutral-200 p-6 sm:p-8">
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Our Job Offerings</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {jobOfferings.map((job, index) => (
                    <div key={index} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                      <p className="mb-2 text-sm font-medium text-neutral-500">{job.type}</p>
                      <h3 className="mb-2 text-lg font-semibold">{job.title}</h3>
                      <p className="text-sm leading-6 text-neutral-600">{job.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-16 text-white sm:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Start Your Next Project?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-300">
            Sign up today to browse jobs and build your professional network.
          </p>
          <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
            <Link href="/signup">Create Your Profile</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
