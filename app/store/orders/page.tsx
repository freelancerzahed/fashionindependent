"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { getUserStoreOrders, getStoreProductById } from "@/lib/data"

export default function StoreOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const orders = getUserStoreOrders(user.id)

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Store Orders</h1>

          {orders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't placed any store orders yet.</p>
              <a href="/store" className="text-primary hover:underline">
                Browse our store
              </a>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const product = getStoreProductById(order.productId)
                return (
                  <Card key={order.id} className="p-6">
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-semibold">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Product</p>
                        <p className="font-semibold">{product?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">${order.totalPrice}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
