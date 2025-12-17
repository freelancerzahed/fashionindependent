"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [preferences, setPreferences] = useState({
    budget: "100-200",
    size: "M",
    language: "English",
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("Passwords don't match")
      return
    }
    alert("Password updated successfully!")
    setPasswordData({ current: "", new: "", confirm: "" })
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <main className="flex-1 bg-neutral-50">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DashboardNav />

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Account Settings</h2>

                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input id="display-name" defaultValue={user.name} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordData.current}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, current: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, new: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirm: e.target.value }))}
                      />
                    </div>

                    <Button onClick={handlePasswordChange}>Update Password</Button>
                  </div>

                  <div className="border-t pt-8 space-y-4">
                    <h2 className="text-lg font-semibold">Preferences</h2>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Preferences</Label>
                      <select
                        id="budget"
                        value={preferences.budget}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, budget: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="under-50">Under $50</option>
                        <option value="50-100">$50 - $100</option>
                        <option value="100-200">$100 - $200</option>
                        <option value="200+">$200+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">Size Preference</Label>
                      <select
                        id="size"
                        value={preferences.size}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, size: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option>XS</option>
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language Preference</Label>
                      <select
                        id="language"
                        value={preferences.language}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, language: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>

                    <Button onClick={() => alert("Preferences saved!")}>Save Preferences</Button>
                  </div>

                  <div className="border-t pt-8 space-y-4">
                    <h2 className="text-lg font-semibold">Account Actions</h2>
                    <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
                      Sign Out
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Deactivate Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
