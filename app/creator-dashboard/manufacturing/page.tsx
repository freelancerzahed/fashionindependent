"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle } from "lucide-react"

export default function ManufacturingPage() {
  const orders = [
    {
      id: "mfg_001",
      campaignId: "1",
      campaignTitle: "Sustainable Fashion Line",
      serviceType: "premium",
      quantity: 500,
      cost: 5000,
      status: "in-progress",
      createdAt: "2025-10-15",
      estimatedDelivery: "2025-11-15",
    },
    {
      id: "mfg_002",
      campaignId: "2",
      campaignTitle: "Vintage Inspired Denim",
      serviceType: "enterprise",
      quantity: 1000,
      cost: 10000,
      status: "pending",
      createdAt: "2025-10-18",
      estimatedDelivery: "2025-11-18",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-5 w-5" />
      case "in-progress":
        return <Truck className="h-5 w-5" />
      case "completed":
        return <CheckCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Manufacturing Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{order.campaignTitle}</h3>
                  <p className="text-sm text-neutral-600">Order ID: {order.id}</p>
                </div>
                <Badge>{order.status}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-neutral-600">Service Type</p>
                  <p className="font-semibold capitalize">{order.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Quantity</p>
                  <p className="font-semibold">{order.quantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Cost</p>
                  <p className="font-semibold">${order.cost}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Est. Delivery</p>
                  <p className="font-semibold">{order.estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-600">
                {getStatusIcon(order.status)}
                <span>
                  {order.status === "pending" && "Awaiting confirmation"}
                  {order.status === "in-progress" && "Manufacturing in progress"}
                  {order.status === "completed" && "Ready for shipment"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
