"use client"

import type React from "react"
import { useState } from "react"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log("Saving user info:", formData)
    alert("Account information updated successfully!")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Account Information</h1>
        <p className="text-sm sm:text-base text-slate-600">Manage your profile and account settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">

                <div className="mb-8 pb-8 border-b">
                  <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                  <ProfilePictureUpload />
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="city">City, State, Zip</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
      </div>
    </div>
  )
}
