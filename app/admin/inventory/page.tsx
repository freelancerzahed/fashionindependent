"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { mockStoreProducts } from "@/lib/data"
import { Edit2, Save, X, AlertCircle } from "lucide-react"

export default function InventoryManagementPage() {
  const [products, setProducts] = useState(mockStoreProducts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ quantity: number; status: string }>({
    quantity: 0,
    status: "in-stock",
  })
  const [error, setError] = useState("")

  const handleEdit = (product: (typeof mockStoreProducts)[0]) => {
    setEditingId(product.id)
    setEditData({
      quantity: 50,
      status: product.status,
    })
    setError("")
  }

  const handleSave = async (productId: string) => {
    try {
      const response = await fetch(`/api/inventory/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })

      if (!response.ok) {
        throw new Error("Failed to update inventory")
      }

      setProducts(products.map((p) => (p.id === productId ? { ...p, status: editData.status as any } : p)))
      setEditingId(null)
      setError("")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update inventory"
      setError(errorMessage)
      console.error("[v0] Error updating inventory:", err)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setError("")
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Inventory Management</h1>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-neutral-600">{product.category}</p>
                </div>

                {editingId === product.id ? (
                  <div className="flex items-center gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`status-${product.id}`}>Status</Label>
                      <select
                        id={`status-${product.id}`}
                        value={editData.status}
                        onChange={(e) => setEditData((prev) => ({ ...prev, status: e.target.value }))}
                        className="px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="in-stock">In Stock</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(product.id)} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${product.price}</p>
                      <p
                        className={`text-sm ${
                          product.status === "in-stock"
                            ? "text-green-600"
                            : product.status === "low-stock"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {product.status === "in-stock"
                          ? "In Stock"
                          : product.status === "low-stock"
                            ? "Low Stock"
                            : "Out of Stock"}
                      </p>
                    </div>

                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
