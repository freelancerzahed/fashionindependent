"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockTechPacks } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { Check } from "lucide-react"
import Link from "next/link"

export default function TechPacksPage() {
  const { user } = useAuth()
  const [selectedPack, setSelectedPack] = useState<string | null>(null)

  const handlePurchase = (packId: string) => {
    if (!user) {
      alert("Please log in to purchase a tech pack")
      return
    }
    setSelectedPack(packId)
    // Redirect to checkout with tech pack
    window.location.href = `/checkout?type=techpack&id=${packId}`
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Tech Pack Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional technical specifications to help you launch your fashion campaign with confidence. Our tech
              packs include everything you need to communicate your design vision to manufacturers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {mockTechPacks.map((pack) => (
              <Card key={pack.id} className="p-6 flex flex-col hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pack.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${pack.price}</span>
                    <span className="text-muted-foreground ml-2">for {pack.quantity} pack(s)</span>
                  </div>
                </div>

                <div className="flex-1 mb-6">
                  <h4 className="font-semibold mb-3">Includes:</h4>
                  <ul className="space-y-2">
                    {pack.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={() => handlePurchase(pack.id)} className="w-full">
                  Purchase Now
                </Button>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-muted">
            <h2 className="text-2xl font-bold mb-4">What's Included in Every Tech Pack?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Technical Specifications</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed drawings, measurements, and construction details for your designs
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Measurement Charts</h3>
                <p className="text-sm text-muted-foreground">
                  Size grading and fit specifications for different body types
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Material Sourcing</h3>
                <p className="text-sm text-muted-foreground">Guidance on finding quality materials and suppliers</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Production Timeline</h3>
                <p className="text-sm text-muted-foreground">Realistic timelines and milestones for manufacturing</p>
              </div>
            </div>
          </Card>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Launch Your Campaign?</h2>
            <p className="text-muted-foreground mb-6">
              Get a tech pack today and start your journey as an independent fashion designer
            </p>
            <Link href="/launch-campaign">
              <Button size="lg">Launch Your Campaign</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
