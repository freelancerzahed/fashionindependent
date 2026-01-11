"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { DashboardNav } from "@/components/dashboard-nav"
import { CheckCircle, AlertCircle, Edit2, Plus, X } from "lucide-react"

export default function AccountSettingsPage() {
  const [settingsData, setSettingsData] = useState({
    // Personal Information
    fullName: "John Designer",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    mailingAddress: "123 Fashion St, New York, NY 10001",
    // Business Information
    businessName: "Arturo's Brick & Masonry LLC",
    einNumber: "12-3456789",
    businessRegistrationNumber: "",
    brandName: "Designer Creations",
    website: "www.designercreations.com",
    jobTitle: "fashion-designer",
    // Banking Information
    bankRoutingNumber: "",
    bankAccountNumber: "",
    // Company Checks
    companyChecks: {
      noRegisteredCompany: false,
      registeredCompanyOutsideUS: false,
      useCompanyName: true,
      useBrandName: false,
      useLegalName: false,
    },
  })

  const [socialLinks, setSocialLinks] = useState<string[]>(["https://instagram.com/yourprofile"])
  const [editingSettings, setEditingSettings] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSettingsChange = (field: string, value: string) => {
    setSettingsData((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
    setError("")
  }

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setSettingsData((prev) => ({
      ...prev,
      companyChecks: {
        ...prev.companyChecks,
        [field]: checked,
      },
    }))
    setSaved(false)
    setError("")
  }

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks]
    newLinks[index] = value
    setSocialLinks(newLinks)
    setSaved(false)
    setError("")
  }

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, ""])
  }

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/settings/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settingsData, socialLinks }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      setSaved(true)
      setEditingSettings(false)
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

            <div className="lg:col-span-3">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Account Settings</h2>
                  {!editingSettings && (
                    <Button onClick={() => setEditingSettings(true)} variant="outline">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Settings
                    </Button>
                  )}
                </div>

                {editingSettings ? (
                  <Card className="p-8">
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Personal Information *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-semibold mb-2 block">Full Name *</Label>
                            <Input
                              value={settingsData.fullName}
                              onChange={(e) => handleSettingsChange("fullName", e.target.value)}
                              placeholder="John Designer"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">Email Address *</Label>
                            <Input
                              type="email"
                              value={settingsData.email}
                              onChange={(e) => handleSettingsChange("email", e.target.value)}
                              placeholder="john@example.com"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">Phone Number *</Label>
                            <Input
                              value={settingsData.phone}
                              onChange={(e) => handleSettingsChange("phone", e.target.value)}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">Mailing Address *</Label>
                            <Input
                              value={settingsData.mailingAddress}
                              onChange={(e) => handleSettingsChange("mailingAddress", e.target.value)}
                              placeholder="123 Fashion St, New York, NY 10001"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Business Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Business Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-semibold mb-2 block">Business Name</Label>
                            <Input
                              value={settingsData.businessName}
                              onChange={(e) => handleSettingsChange("businessName", e.target.value)}
                              placeholder="Arturo's Brick & Masonry LLC"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">EIN Number</Label>
                            <Input
                              value={settingsData.einNumber}
                              onChange={(e) => handleSettingsChange("einNumber", e.target.value)}
                              placeholder="12-3456789"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">Business Registration Number</Label>
                            <Input
                              value={settingsData.businessRegistrationNumber}
                              onChange={(e) => handleSettingsChange("businessRegistrationNumber", e.target.value)}
                              placeholder="For non-U.S. based companies"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">Brand Name</Label>
                            <Input
                              value={settingsData.brandName}
                              onChange={(e) => handleSettingsChange("brandName", e.target.value)}
                              placeholder="Designer Creations"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">Website</Label>
                            <Input
                              value={settingsData.website}
                              onChange={(e) => handleSettingsChange("website", e.target.value)}
                              placeholder="www.designercreations.com"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">Job Title *</Label>
                            <select
                              value={settingsData.jobTitle}
                              onChange={(e) => handleSettingsChange("jobTitle", e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
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
                              <Input
                                value={link}
                                onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                                placeholder="https://instagram.com/yourprofile"
                              />
                              {socialLinks.length > 1 && (
                                <Button
                                  onClick={() => handleRemoveSocialLink(index)}
                                  variant="outline"
                                  className="text-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {socialLinks.length < 5 && (
                            <Button onClick={handleAddSocialLink} variant="outline" className="w-full">
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
                          <p className="text-sm text-yellow-800">
                            🔒 Your banking information will be encrypted and securely stored.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-semibold mb-2 block">Bank Routing Number *</Label>
                            <Input
                              type="password"
                              value={settingsData.bankRoutingNumber}
                              onChange={(e) => handleSettingsChange("bankRoutingNumber", e.target.value)}
                              placeholder="Enter your bank routing number"
                            />
                          </div>
                          <div>
                            <Label className="font-semibold mb-2 block">Bank Account Number *</Label>
                            <Input
                              type="password"
                              value={settingsData.bankAccountNumber}
                              onChange={(e) => handleSettingsChange("bankAccountNumber", e.target.value)}
                              placeholder="Enter your bank account number"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Business Structure</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="noRegisteredCompany"
                              checked={settingsData.companyChecks.noRegisteredCompany}
                              onChange={(e) => handleCheckboxChange("noRegisteredCompany", e.target.checked)}
                              className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="noRegisteredCompany" className="ml-3 text-sm cursor-pointer">
                              I do not have a registered company
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="registeredCompanyOutsideUS"
                              checked={settingsData.companyChecks.registeredCompanyOutsideUS}
                              onChange={(e) => handleCheckboxChange("registeredCompanyOutsideUS", e.target.checked)}
                              className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="registeredCompanyOutsideUS" className="ml-3 text-sm cursor-pointer">
                              I have a registered company outside of the U.S.
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Preferred Address */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">How should we address you? *</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="useCompanyName"
                              name="address"
                              checked={settingsData.companyChecks.useCompanyName}
                              onChange={() =>
                                setSettingsData((prev) => ({
                                  ...prev,
                                  companyChecks: {
                                    ...prev.companyChecks,
                                    useCompanyName: true,
                                    useBrandName: false,
                                    useLegalName: false,
                                  },
                                }))
                              }
                              className="w-4 h-4 text-blue-600 border-neutral-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="useCompanyName" className="ml-3 text-sm cursor-pointer">
                              Use my company name to address me
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="useBrandName"
                              name="address"
                              checked={settingsData.companyChecks.useBrandName}
                              onChange={() =>
                                setSettingsData((prev) => ({
                                  ...prev,
                                  companyChecks: {
                                    ...prev.companyChecks,
                                    useCompanyName: false,
                                    useBrandName: true,
                                    useLegalName: false,
                                  },
                                }))
                              }
                              className="w-4 h-4 text-blue-600 border-neutral-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="useBrandName" className="ml-3 text-sm cursor-pointer">
                              Use my brand name to address me
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="useLegalName"
                              name="address"
                              checked={settingsData.companyChecks.useLegalName}
                              onChange={() =>
                                setSettingsData((prev) => ({
                                  ...prev,
                                  companyChecks: {
                                    ...prev.companyChecks,
                                    useCompanyName: false,
                                    useBrandName: false,
                                    useLegalName: true,
                                  },
                                }))
                              }
                              className="w-4 h-4 text-blue-600 border-neutral-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="useLegalName" className="ml-3 text-sm cursor-pointer">
                              Use my legal name to address me
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Status Messages */}
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

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-6 border-t">
                        <Button onClick={handleSaveSettings} disabled={loading} className="flex-1">
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button onClick={() => setEditingSettings(false)} variant="outline" className="flex-1">
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
                          <p className="font-semibold capitalize">{settingsData.jobTitle.replace("-", " ")}</p>
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
                        {socialLinks.length > 0 ? (
                          socialLinks.map((link, index) => (
                            link && (
                              <div key={index}>
                                <p className="text-neutral-600">Link {index + 1}</p>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                                  {link}
                                </a>
                              </div>
                            )
                          ))
                        ) : (
                          <p className="text-neutral-600">No social links added</p>
                        )}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Preferences</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-neutral-600">Business Registration</p>
                          <p className="font-semibold">
                            {settingsData.companyChecks.noRegisteredCompany
                              ? "No registered company"
                              : settingsData.companyChecks.registeredCompanyOutsideUS
                                ? "Registered outside U.S."
                                : "Registered in U.S."}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-600">How to address you</p>
                          <p className="font-semibold capitalize">
                            {settingsData.companyChecks.useCompanyName
                              ? "Company name"
                              : settingsData.companyChecks.useBrandName
                                ? "Brand name"
                                : "Legal name"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
