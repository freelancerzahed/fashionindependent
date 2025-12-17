"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle, Package, Truck } from "lucide-react"

type DeliveryStage = {
  id: number
  name: string
  date: string
  completed: boolean
  icon: typeof CheckCircle
  current?: boolean
}

export default function DeliveryTrackingPage({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const [deliveryStatus, setDeliveryStatus] = useState<any>(null)

  useEffect(() => {
    const loadDeliveryStatus = async () => {
      const resolvedParams = await params
      setDeliveryStatus({
        campaignId: resolvedParams.campaignId,
        campaignName: "Sustainable Fashion Collection",
        status: "in-transit",
        stages: [
          {
            id: 1,
            name: "Order Confirmed",
            date: "2025-03-01",
            completed: true,
            icon: CheckCircle,
          },
          {
            id: 2,
            name: "Manufacturing",
            date: "2025-03-15",
            completed: true,
            icon: Package,
          },
          {
            id: 3,
            name: "In Transit",
            date: "2025-03-25",
            completed: false,
            icon: Truck,
            current: true,
          },
          {
            id: 4,
            name: "Delivered",
            date: "Expected 2025-04-05",
            completed: false,
            icon: CheckCircle,
          },
        ],
      })
    }
    loadDeliveryStatus()
  }, [params])

  if (!deliveryStatus) {
    return <div className="min-h-screen bg-neutral-50 py-12">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-2">Delivery Tracking</h1>
        <p className="text-neutral-600 mb-8">{deliveryStatus.campaignName}</p>

        <Card className="p-8">
          <div className="space-y-8">
            {deliveryStatus.stages.map((stage: DeliveryStage, index: number) => {
              const Icon = stage.icon
              return (
                <div key={stage.id} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        stage.completed ? "bg-green-100" : stage.current ? "bg-blue-100" : "bg-neutral-100"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          stage.completed ? "text-green-600" : stage.current ? "text-blue-600" : "text-neutral-400"
                        }`}
                      />
                    </div>
                    {index < deliveryStatus.stages.length - 1 && (
                      <div className={`w-1 h-16 mt-2 ${stage.completed ? "bg-green-200" : "bg-neutral-200"}`} />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-neutral-900">{stage.name}</h3>
                    <p className="text-sm text-neutral-600">{stage.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </main>
  )
}
