import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function SiteMapPage() {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "Discover", href: "/discover" },
        { name: "Shop", href: "/shop" },
        { name: "Blog", href: "/blog" },
        { name: "About", href: "/about" },
      ],
    },
    {
      title: "Categories",
      links: [
        { name: "Womenswear", href: "/category/womenswear" },
        { name: "Menswear", href: "/category/menswear" },
        { name: "Kidswear", href: "/category/kidswear" },
        { name: "Wearables", href: "/category/wearables" },
      ],
    },
    {
      title: "User Account",
      links: [
        { name: "Login", href: "/login" },
        { name: "Sign Up", href: "/signup" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Active Donations", href: "/dashboard/donations" },
        { name: "Donation History", href: "/dashboard/history" },
        { name: "Settings", href: "/dashboard/settings" },
        { name: "Body Model", href: "/dashboard/body-model" },
      ],
    },
    {
      title: "Creators",
      links: [
        { name: "Launch a Campaign", href: "/launch-campaign" },
        { name: "Creator Portal", href: "/creator-portal" },
      ],
    },
    {
      title: "Support & Legal",
      links: [
        { name: "FAQs", href: "/faqs" },
        { name: "Press & News", href: "/press" },
        { name: "Affiliate Program", href: "/affiliate" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Site Map</h1>
          <p className="text-muted-foreground mb-12">Navigate through all pages of The Fashion Independent</p>

          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((section) => (
              <Card key={section.title} className="p-6">
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
