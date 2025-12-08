"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCampaign } from "@/lib/campaign-context"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ManufacturingServicesPage() {
  const { user } = useAuth()
  const { manufacturingServices, addManufacturingService } = useCampaign()
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const services = [
    {
      id: "basic",
      name: "Basic Manufacturing",
      price: 2500,
      timeline: 30,
      description: "Standard production with quality control",
      features: ["Production planning", "Material sourcing", "Quality control", "Packaging", "Shipping coordination"],
    },
    {
      id: "premium",
      name: "Premium Manufacturing",
      price: 5000,
      timeline: 45,
      description: "Enhanced production with custom options",
      features: [
        "All Basic features",
        "Custom packaging design",
        "Sample approval process",
        "Dedicated project manager",
        "Rush production available",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise Manufacturing",
      price: 10000,
      timeline: 60,
      description: "Full-service production with white-glove support",
      features: [
        "All Premium features",
        "Custom branding",
        "International shipping",
        "Inventory management",
        "24/7 support",
      ],
    },
  ]

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleAddService = (serviceId: string) => {
    if (!user) {
      alert("Please log in to add manufacturing services")
      return
    }

    const service = services.find((s) => s.id === serviceId)
    if (service) {
      addManufacturingService({
        campaignId: "current-campaign", // In real app, this would be the actual campaign ID
        serviceType: serviceId as "basic" | "premium" | "enterprise",
        estimatedCost: service.price,
        productionTimeline: service.timeline,
        status: "pending",
      })
      alert(`${service.name} added to your campaign!`)
    }
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Manufacturing Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We handle the production so you can focus on design. Choose a service level that fits your campaign needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`p-6 flex flex-col transition-all ${
                  selectedService === service.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${service.price.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">per campaign</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.timeline} days production</span>
                  </div>
                </div>

                <div className="flex-1 mb-6">
                  <h4 className="font-semibold mb-3">Includes:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleAddService(service.id)}
                  className="w-full"
                  variant={selectedService === service.id ? "default" : "outline"}
                >
                  Select Service
                </Button>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-blue-50 border-blue-200 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li>1. Select a manufacturing service tier</li>
                  <li>2. Add it to your campaign during launch</li>
                  <li>3. Once your campaign reaches its goal, we begin production</li>
                  <li>4. We handle all manufacturing and shipping to your backers</li>
                  <li>5. You receive your net payout after production costs</li>
                </ol>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Quality Assurance</h3>
              <p className="text-sm text-muted-foreground">
                Every product goes through rigorous quality control to ensure your backers receive exactly what they
                pledged for. We inspect samples and final production runs.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Transparent Pricing</h3>
              <p className="text-sm text-muted-foreground">
                No hidden fees. The price you see is what you pay. Manufacturing costs are deducted from your campaign
                donations before you receive your payout.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Launch?</h2>
            <p className="text-muted-foreground mb-6">
              Add manufacturing services to your campaign to ensure smooth production and delivery
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
