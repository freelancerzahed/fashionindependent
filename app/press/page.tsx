import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PressPage() {
  const pressReleases = [
    {
      date: "March 15, 2025",
      title: "The Fashion Independent Reaches $100K in Designer Funding",
      excerpt:
        "Platform celebrates milestone achievement as 100 independent designers receive backing from global community of fashion enthusiasts.",
      link: "#",
    },
    {
      date: "February 28, 2025",
      title: "Introducing ShapeMe Body Modeler: Revolutionary Sizing Technology",
      excerpt:
        "New 3D body modeling feature helps backers find perfect fit while supporting sustainable fashion practices.",
      link: "#",
    },
    {
      date: "January 10, 2025",
      title: "The Fashion Independent Launches Eco-Friendly Manufacturing Facility",
      excerpt:
        "State-of-the-art facility promises 7-21 day turnaround times while minimizing waste and utilizing sustainable materials.",
      link: "#",
    },
  ]

  const mediaKit = [
    { name: "Brand Guidelines", size: "2.4 MB", format: "PDF" },
    { name: "Logo Pack", size: "5.1 MB", format: "ZIP" },
    { name: "Press Photos", size: "12.8 MB", format: "ZIP" },
    { name: "Fact Sheet", size: "890 KB", format: "PDF" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Press & News</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Latest news, press releases, and media resources for The Fashion Independent
          </p>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Press Releases</h2>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <Card key={index} className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">{release.date}</p>
                  <h3 className="text-xl font-semibold mb-3">{release.title}</h3>
                  <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                  <Button variant="outline" asChild>
                    <Link href={release.link}>Read Full Release</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Media Kit</h2>
            <Card className="p-6">
              <p className="text-muted-foreground mb-6">
                Download our media kit for logos, brand guidelines, and press materials.
              </p>
              <div className="space-y-3">
                {mediaKit.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.format} • {item.size}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Media Inquiries</h2>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                For press inquiries, interviews, or additional information, please contact our media relations team:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> press@fashionindependent.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
