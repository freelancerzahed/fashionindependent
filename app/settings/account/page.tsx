"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { DashboardNav } from "@/components/dashboard-nav"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Fashion enthusiast and independent designer",
  })

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
    setError("")
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/settings/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save settings"
      setError(errorMessage)
      console.error("[v0] Failed to save settings:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 bg-neutral-50">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DashboardNav />

            <div className="lg:col-span-3 space-y-6">
              {/* Account Information */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Account Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      rows={4}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {saved && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-600">Settings saved successfully</p>
                    </div>
                  )}

                  <Button onClick={handleSave} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </Card>

              {/* Payment Methods */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <p className="font-semibold">Visa ending in 4242</p>
                      <p className="text-sm text-neutral-600">Expires 12/25</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Add Payment Method
                  </Button>
                </div>
              </Card>

              {/* Notification Preferences */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">Campaign Updates</p>
                      <p className="text-sm text-neutral-600">Get notified about your campaign progress</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">New Campaigns</p>
                      <p className="text-sm text-neutral-600">Get notified about new campaigns in your interests</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <input type="checkbox" className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">Marketing Emails</p>
                      <p className="text-sm text-neutral-600">Receive promotional offers and news</p>
                    </div>
                  </label>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
