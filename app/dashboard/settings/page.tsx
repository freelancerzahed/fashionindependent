"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Plus, X, Loader } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [editingSettings, setEditingSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [socialLinks, setSocialLinks] = useState(["", "", "", "", ""])
  const [settingsData, setSettingsData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    mailingAddress: "",
    businessName: "",
    einNumber: "",
    businessRegistrationNumber: "",
    brandName: "",
    website: "",
    jobTitle: "",
    bankRoutingNumber: "",
    bankAccountNumber: "",
  })

  // Fetch creator profile data on mount
  useEffect(() => {
    const fetchCreatorProfile = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("auth_token")
        
        if (!token) {
          setError("Authentication token not found. Please login again.")
          setLoading(false)
          return
        }

        console.log("Fetching creator profile with token:", token?.substring(0, 20) + "...")
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creator/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Creator profile response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("API Error:", errorData)
          throw new Error(errorData.message || `API Error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Creator profile data:", data)
        
        if (data.status && data.creator) {
          const creator = data.creator
          setSettingsData({
            fullName: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            mailingAddress: user?.address || "",
            businessName: creator.brand_name || "",
            einNumber: "",
            businessRegistrationNumber: "",
            brandName: creator.brand_name || "",
            website: creator.website || "",
            jobTitle: creator.job_title || "",
            bankRoutingNumber: creator.routing_number || "",
            bankAccountNumber: creator.bank_account || "",
          })
        } else {
          throw new Error(data.message || "Failed to load creator profile")
        }
      } catch (err) {
        console.error("Error fetching creator profile:", err)
        setError(err instanceof Error ? err.message : "Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    fetchCreatorProfile()
  }, [user])

  const handleSettingsChange = (field: string, value: any) => {
    setSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      setError("")
      setSuccess("")

      const token = localStorage.getItem("auth_token")
      
      if (!token) {
        setError("Authentication token not found. Please login again.")
        setSaving(false)
        return
      }

      const updatePayload = {
        name: settingsData.fullName,
        email: settingsData.email,
        phone: settingsData.phone,
        address: settingsData.mailingAddress,
        brand_name: settingsData.brandName,
        bio: settingsData.businessName,
        bank_account: settingsData.bankAccountNumber,
        routing_number: settingsData.bankRoutingNumber,
        account_holder: settingsData.fullName,
      }

      console.log("Saving settings with payload:", updatePayload)
      console.log("API URL:", `${process.env.NEXT_PUBLIC_API_URL}/creator/profile`)
      console.log("Token:", token?.substring(0, 20) + "...")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creator/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      })

      console.log("Save response status:", response.status)
      console.log("Save response statusText:", response.statusText)
      
      // Get response text first to debug
      const responseText = await response.text()
      console.log("Save response text:", responseText)

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText)
          console.error("Save API Error (parsed):", errorData)
          throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
        } catch (parseErr) {
          console.error("Save API Error (could not parse):", responseText)
          throw new Error(`API Error: ${response.status} ${response.statusText} - ${responseText}`)
        }
      }

      const data = JSON.parse(responseText)
      console.log("Save response data:", data)
      
      if (data.status) {
        setSuccess("Settings saved successfully!")
        setEditingSettings(false)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.message || "Failed to save settings")
      }
    } catch (err) {
      console.error("Error saving settings:", err)
      setError(err instanceof Error ? err.message : "Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        {!editingSettings && !loading && (
          <Button onClick={() => setEditingSettings(true)} variant="outline">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Settings
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <p className="text-red-800 text-sm">{error}</p>
        </Card>
      )}

      {/* Success Alert */}
      {success && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <p className="text-green-800 text-sm">{success}</p>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <Card className="p-12 text-center">
          <Loader className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-neutral-600">Loading settings...</p>
          <p className="text-xs text-neutral-500 mt-2">If this takes longer than 5 seconds, there might be a connection issue.</p>
        </Card>
      ) : editingSettings ? (
        <Card className="p-8">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Personal Information *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold mb-2 block">Full Name *</Label>
                  <Input value={settingsData.fullName} onChange={(e) => handleSettingsChange("fullName", e.target.value)} placeholder="John Designer" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Email Address *</Label>
                  <Input type="email" value={settingsData.email} onChange={(e) => handleSettingsChange("email", e.target.value)} placeholder="john@example.com" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Phone Number *</Label>
                  <Input value={settingsData.phone} onChange={(e) => handleSettingsChange("phone", e.target.value)} placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Mailing Address *</Label>
                  <Input value={settingsData.mailingAddress} onChange={(e) => handleSettingsChange("mailingAddress", e.target.value)} placeholder="123 Fashion St, New York, NY 10001" />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold mb-2 block">Business Name</Label>
                  <Input value={settingsData.businessName} onChange={(e) => handleSettingsChange("businessName", e.target.value)} placeholder="Arturo's Brick & Masonry LLC" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">EIN Number</Label>
                  <Input value={settingsData.einNumber || ""} onChange={(e) => handleSettingsChange("einNumber", e.target.value)} placeholder="12-3456789" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Business Registration Number</Label>
                  <Input value={settingsData.businessRegistrationNumber || ""} onChange={(e) => handleSettingsChange("businessRegistrationNumber", e.target.value)} placeholder="For non-U.S. based companies" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Brand Name</Label>
                  <Input value={settingsData.brandName || ""} onChange={(e) => handleSettingsChange("brandName", e.target.value)} placeholder="Designer Creations" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Website</Label>
                  <Input value={settingsData.website || ""} onChange={(e) => handleSettingsChange("website", e.target.value)} placeholder="www.designercreations.com" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Job Title *</Label>
                  <select value={settingsData.jobTitle || ""} onChange={(e) => handleSettingsChange("jobTitle", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a job title</option>
                    <option value="ceo">CEO</option>
                    <option value="coo">COO</option>
                    <option value="cto">CTO</option>
                    <option value="business-owner">Business Owner</option>
                    <option value="president">President</option>
                    <option value="senior-management">Senior Management</option>
                    <option value="fashion-designer">Fashion Designer</option>
                    <option value="graphic-designer">Graphic Designer</option>
                    <option value="photographer">Photographer</option>
                    <option value="seamstress">Seamstress</option>
                    <option value="pattern-maker">Pattern Maker</option>
                    <option value="technical-designer">Technical Designer</option>
                    <option value="cad-designer">CAD Designer</option>
                    <option value="model">Model</option>
                    <option value="screen-printer">Screen Printer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Social Links (Optional)</h3>
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={link} onChange={(e) => {
                        const newLinks = [...socialLinks]
                        newLinks[index] = e.target.value
                        setSocialLinks(newLinks)
                      }} placeholder="https://instagram.com/yourprofile" />
                    {socialLinks.filter((l) => l).length > 1 && (
                      <Button
                        onClick={() => {
                          setSocialLinks(socialLinks.filter((_, i) => i !== index))
                        }}
                        variant="outline"
                        className="text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {socialLinks.length < 5 && (
                  <Button onClick={() => setSocialLinks([...socialLinks, ""])} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Social Link
                  </Button>
                )}
              </div>
            </div>

            {/* Banking Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Banking Information (Encrypted) *</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">🔒 Your banking information will be encrypted and securely stored.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold mb-2 block">Bank Routing Number *</Label>
                  <Input type="password" value={settingsData.bankRoutingNumber || ""} onChange={(e) => handleSettingsChange("bankRoutingNumber", e.target.value)} placeholder="Enter your bank routing number" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Bank Account Number *</Label>
                  <Input type="password" value={settingsData.bankAccountNumber || ""} onChange={(e) => handleSettingsChange("bankAccountNumber", e.target.value)} placeholder="Enter your bank account number" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <Button onClick={handleSaveSettings} className="flex-1" disabled={saving}>
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button onClick={() => setEditingSettings(false)} variant="outline" className="flex-1" disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-600">Full Name</p>
                <p className="font-semibold">{settingsData.fullName}</p>
              </div>
              <div>
                <p className="text-neutral-600">Email Address</p>
                <p className="font-semibold">{settingsData.email}</p>
              </div>
              <div>
                <p className="text-neutral-600">Phone Number</p>
                <p className="font-semibold">{settingsData.phone}</p>
              </div>
              <div>
                <p className="text-neutral-600">Mailing Address</p>
                <p className="font-semibold">{settingsData.mailingAddress}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Business Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-600">Business Name</p>
                <p className="font-semibold">{settingsData.businessName || "—"}</p>
              </div>
              <div>
                <p className="text-neutral-600">Brand Name</p>
                <p className="font-semibold">{settingsData.brandName || "—"}</p>
              </div>
              <div>
                <p className="text-neutral-600">Job Title</p>
                <p className="font-semibold capitalize">{(settingsData.jobTitle || "").replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-neutral-600">Website</p>
                <p className="font-semibold">{settingsData.website || "—"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Social Links</h3>
            <div className="space-y-2 text-sm">
              {socialLinks.filter((l) => l).length > 0 ? (
                socialLinks.map((link, index) =>
                  link ? (
                    <div key={index}>
                      <p className="text-neutral-600">Link {index + 1}</p>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                        {link}
                      </a>
                    </div>
                  ) : null
                )
              ) : (
                <p className="text-neutral-600">No social links added</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Business Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-600">EIN Number</p>
                <p className="font-semibold">{settingsData.einNumber || "—"}</p>
              </div>
              <div>
                <p className="text-neutral-600">Business Registration Number</p>
                <p className="font-semibold">{settingsData.businessRegistrationNumber || "—"}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
