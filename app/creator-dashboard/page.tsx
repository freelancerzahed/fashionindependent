"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, TrendingUp, Upload, CheckCircle, Trash2, Edit2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MobileTabs } from "@/components/mobile-tabs"

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [editingSettings, setEditingSettings] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    techPack: null as File | null,
  })
  const [documentMessages, setDocumentMessages] = useState({
    idFront: "",
    idBack: "",
    techPack: "",
  })
  const [socialLinks, setSocialLinks] = useState(["", "", "", "", ""])
  const [settingsData, setSettingsData] = useState({
    fullName: "John Designer",
    businessName: "Arturo's Brick & Masonry LLC",
    email: "john@example.com",
    mailingAddress: "123 Fashion St, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    einNumber: "12-3456789",
    businessRegistrationNumber: "",
    brandName: "Designer Creations",
    website: "www.designercreations.com",
    jobTitle: "fashion-designer",
    bankRoutingNumber: "***-***-***",
    bankAccountNumber: "****-****-****",
    companyChecks: {
      noRegisteredCompany: false,
      registeredCompanyOutsideUS: false,
      useCompanyName: true,
      useBrandName: false,
      useLegalName: false,
    },
  })

  const campaigns = [
    {
      id: 1,
      name: "Sustainable Linen Collection",
      status: "Active",
      funded: 45000,
      goal: 50000,
      backers: 320,
      daysLeft: 7,
      image: "/sustainable-linen-fashion-collection.jpg",
    },
    {
      id: 2,
      name: "Eco-Friendly Accessories",
      status: "Completed",
      funded: 75000,
      goal: 30000,
      backers: 450,
      daysLeft: 0,
      image: "/sustainable-fashion-eco-friendly.jpg",
    },
  ]

  const tabsList = [
    { id: "overview", label: "Overview" },
    { id: "campaigns", label: "My Campaigns" },
    { id: "backers", label: "Backers" },
    { id: "active-campaign", label: "Active Campaign" },
    { id: "account-settings", label: "Settings" },
    { id: "documents", label: "Documents" },
  ]

  const activeCampaign = {
    id: 1,
    name: "Sustainable Linen Collection",
    status: "Active",
    funded: 45000,
    goal: 50000,
    backers: 320,
    daysLeft: 7,
    image: "/sustainable-linen-fashion-collection.jpg",
    price: 149.99,
    description: "A beautiful collection of sustainable linen apparel made from eco-friendly materials.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Natural", "Black", "Navy Blue", "Sage Green"],
    materials: ["100% Organic Linen"],
    startDate: "2025-01-01",
    endDate: "2025-02-15",
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: "idFront" | "idBack" | "techPack") => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedDocuments((prev) => ({
        ...prev,
        [docType]: file,
      }))
      setDocumentMessages((prev) => ({
        ...prev,
        [docType]: "Document successfully uploaded",
      }))
    }
  }

  const handleDeleteDocument = (docType: "idFront" | "idBack" | "techPack") => {
    setUploadedDocuments((prev) => ({
      ...prev,
      [docType]: null,
    }))
    setDocumentMessages((prev) => ({
      ...prev,
      [docType]: "",
    }))
  }

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, ""])
  }

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks]
    newLinks[index] = value
    setSocialLinks(newLinks)
  }

  const handleSettingsChange = (field: string, value: any) => {
    setSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCheckboxChange = (checkboxType: string, checked: boolean) => {
    setSettingsData((prev) => ({
      ...prev,
      companyChecks: {
        ...prev.companyChecks,
        [checkboxType]: checked,
      },
    }))
  }

  const handleSaveSettings = () => {
    console.log("Settings saved:", settingsData)
    setEditingSettings(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground">Manage your campaigns and track performance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Funded</div>
              <div className="text-3xl font-bold">$120K</div>
              <p className="text-xs text-green-600 mt-2">+15% this month</p>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Active Campaigns</div>
              <div className="text-3xl font-bold">1</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Backers</div>
              <div className="text-3xl font-bold">770</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Completion Rate</div>
              <div className="text-3xl font-bold">100%</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs - Desktop */}
      <div className="border-b hidden md:block">
        <div className="container">
          <div className="flex gap-8 overflow-x-auto">
            {tabsList.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden border-b">
        <div className="container px-4">
          <MobileTabs tabs={tabsList} activeTab={activeTab} onTabChange={setActiveTab}>
            <div />
          </MobileTabs>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Funding Trend
                </h3>
                <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
                  Chart placeholder
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Campaign Performance
                </h3>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="pb-4 border-b last:border-0">
                      <p className="font-semibold mb-2">{campaign.name}</p>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div
                          className="bg-foreground h-2 rounded-full"
                          style={{ width: `${(campaign.funded / campaign.goal) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ${campaign.funded.toLocaleString()} of ${campaign.goal.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Campaigns</h2>
              <Link href="/launch-campaign">
                <Button>Launch New Campaign</Button>
              </Link>
            </div>
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 bg-muted flex-shrink-0">
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{campaign.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            campaign.status === "Active" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Funded</p>
                          <p className="font-bold">${campaign.funded.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Backers</p>
                          <p className="font-bold">{campaign.backers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Days Left</p>
                          <p className="font-bold">{campaign.daysLeft}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/campaign/${campaign.id}`}>
                        <Button variant="outline">View Campaign</Button>
                      </Link>
                      <Button variant="outline">Edit</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "backers" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Campaign Backers</h2>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Backer Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Campaign</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Pledge Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Sarah Johnson",
                        campaign: "Sustainable Linen",
                        amount: 150,
                        date: "2025-01-10",
                        status: "Confirmed",
                      },
                      {
                        name: "Michael Chen",
                        campaign: "Sustainable Linen",
                        amount: 200,
                        date: "2025-01-09",
                        status: "Confirmed",
                      },
                      {
                        name: "Emma Davis",
                        campaign: "Eco-Friendly Accessories",
                        amount: 100,
                        date: "2025-01-08",
                        status: "Delivered",
                      },
                    ].map((backer, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="px-6 py-4">{backer.name}</td>
                        <td className="px-6 py-4">{backer.campaign}</td>
                        <td className="px-6 py-4 font-semibold">${backer.amount}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{backer.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              backer.status === "Confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {backer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "active-campaign" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Active Campaign</h2>
            {activeCampaign ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Campaign Image */}
                <div className="lg:col-span-3">
                  <Card className="overflow-hidden">
                    <img
                      src={activeCampaign.image || "/placeholder.svg"}
                      alt={activeCampaign.name}
                      className="w-full h-96 object-cover"
                    />
                  </Card>
                </div>

                {/* Campaign Details */}
                <div className="lg:col-span-2">
                  <Card className="p-8">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-3xl font-bold">{activeCampaign.name}</h1>
                        <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {activeCampaign.status}
                        </span>
                      </div>
                      <p className="text-lg text-muted-foreground">${activeCampaign.price}</p>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-semibold text-lg mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">{activeCampaign.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="font-semibold mb-3">Available Sizes</h4>
                        <div className="flex flex-wrap gap-2">
                          {activeCampaign.sizes.map((size) => (
                            <span key={size} className="px-3 py-1 bg-slate-100 rounded text-sm">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Available Colors</h4>
                        <div className="space-y-2">
                          {activeCampaign.colors.map((color) => (
                            <p key={color} className="text-sm">
                              {color}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-semibold mb-3">Materials</h4>
                      <p className="text-sm text-muted-foreground">{activeCampaign.materials.join(", ")}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Campaign Start</p>
                        <p className="font-semibold">{activeCampaign.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Campaign End</p>
                        <p className="font-semibold">{activeCampaign.endDate}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Campaign Stats */}
                <div className="space-y-4">
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Funded</p>
                    <p className="text-3xl font-bold mb-2">${activeCampaign.funded.toLocaleString()}</p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(activeCampaign.funded / activeCampaign.goal) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Goal: ${activeCampaign.goal.toLocaleString()}
                    </p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Backers</p>
                    <p className="text-3xl font-bold">{activeCampaign.backers}</p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Time Remaining</p>
                    <p className="text-3xl font-bold">{activeCampaign.daysLeft}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No active campaigns at the moment</p>
                <Link href="/launch-campaign">
                  <Button>Launch New Campaign</Button>
                </Link>
              </Card>
            )}
          </div>
        )}

        {activeTab === "account-settings" && (
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
                  {/* Required Fields Section */}
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
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
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
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
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
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
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
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
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
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="useLegalName" className="ml-3 text-sm cursor-pointer">
                          Use my legal name to address me
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button onClick={handleSaveSettings} className="flex-1">
                      Save Changes
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
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-semibold">{settingsData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email Address</p>
                      <p className="font-semibold">{settingsData.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone Number</p>
                      <p className="font-semibold">{settingsData.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mailing Address</p>
                      <p className="font-semibold">{settingsData.mailingAddress}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Business Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Business Name</p>
                      <p className="font-semibold">{settingsData.businessName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Brand Name</p>
                      <p className="font-semibold">{settingsData.brandName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Job Title</p>
                      <p className="font-semibold capitalize">{settingsData.jobTitle.replace("-", " ")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Website</p>
                      <p className="font-semibold">{settingsData.website || "—"}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Documents</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                To expedite the verification process, upload clear picture identification and .pdf file of your tech pack. Creators who submit all required documentation before the campaign ends complete the verification process faster. Business owners providing a Business Name and EIN (or equivalent business registration number for non-U.S. based entities) do not need to upload personal identification.
              </p>
              <p className="text-neutral-700 leading-relaxed mb-4">
                If you don't have a tech pack, you can purchase one now at a 10% discount; otherwise, the cost will be deducted from your campaign earnings at the end of the campaign.
              </p>
              <p className="text-neutral-700">
                <Link href="#" className="text-neutral-800 hover:underline">[View acceptable forms of ID]</Link>
              </p>
            </div>

            {/* Document Upload Success Message */}
            <div className="border-4 border-neutral-800 rounded p-6 bg-white">
              <p className="text-base font-semibold text-neutral-900">Document successfully uploaded</p>
            </div>

            {/* Tech Pack and Pricing Section */}
            <div className="space-y-6">
              {/* Top Row: Tech Pack Box and Choose Photo Button */}
              <div className="flex gap-6 items-center">
                {/* Tech Pack Box */}
                <div className="flex-1 border-4 border-neutral-800 rounded p-12 bg-white">
                  <p className="text-3xl font-semibold text-neutral-900 text-center">{"{tech pack}"}</p>
                </div>
                
                {/* Choose Photo Button */}
                <input
                  type="file"
                  id="techPack"
                  onChange={(e) => handleFileUpload(e, "techPack")}
                  className="hidden"
                  accept=".pdf,image/*"
                />
                <label htmlFor="techPack">
                  <Button as="span" className="bg-white text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-50 h-11 whitespace-nowrap">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                </label>
              </div>

              {/* Second Choose Photo Button */}
              <div className="flex justify-end">
                <label htmlFor="techPack">
                  <Button as="span" className="bg-white text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-50 h-11 whitespace-nowrap">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                </label>
              </div>

              {/* Horizontal Divider */}
              <div className="border-t-2 border-neutral-900 my-6"></div>

              {/* Pricing Options and Buy Button Container */}
              <div className="space-y-6">
                {/* Pricing Options */}
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="techPackOption" value="one" defaultChecked className="w-6 h-6 accent-neutral-900" />
                    <span className="text-base font-medium text-neutral-900 ml-4">One (1) Tech Pack - $68.00</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="techPackOption" value="three" className="w-6 h-6 accent-neutral-900" />
                    <span className="text-base font-medium text-neutral-900 ml-4">Three (3) - $ 188.00</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="techPackOption" value="five" className="w-6 h-6 accent-neutral-900" />
                    <span className="text-base font-medium text-neutral-900 ml-4">Five (5) - $324.00</span>
                  </label>
                </div>

                {/* Buy Now Button */}
                <div>
                  <Button className="bg-red-600 text-white hover:bg-red-700 h-11 font-bold text-base px-8 rounded">
                    buy now
                  </Button>
                </div>
              </div>
            </div>

            {/* ID Verification Section */}
            <div className="mt-12 pt-8 border-t border-neutral-300">
              <h3 className="text-2xl font-bold mb-6">ID Verification</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ID Front */}
                <Card className="p-6">
                  <h4 className="font-semibold mb-1">ID - Front Side</h4>
                  <p className="text-sm text-muted-foreground mb-4">Upload a clear photo of the front of your ID</p>


                  {!uploadedDocuments.idFront ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">Drag and drop or click to upload</p>
                      <input
                        type="file"
                        id="idFront"
                        onChange={(e) => handleFileUpload(e, "idFront")}
                        className="hidden"
                        accept="image/*"
                      />
                      <label htmlFor="idFront">
                        <Button as="span" variant="outline">
                          Choose File
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900">{documentMessages.idFront}</p>
                          <p className="text-sm text-green-700">{uploadedDocuments.idFront?.name}</p>
                        </div>
                      </div>
                      <Button onClick={() => handleDeleteDocument("idFront")} variant="outline" className="w-full text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
                </Card>

                {/* ID Back */}
                <Card className="p-6">
                  <h4 className="font-semibold mb-1">ID - Back Side</h4>
                  <p className="text-sm text-muted-foreground mb-4">Upload a clear photo of the back of your ID</p>

                  {!uploadedDocuments.idBack ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">Drag and drop or click to upload</p>
                      <input
                        type="file"
                        id="idBack"
                        onChange={(e) => handleFileUpload(e, "idBack")}
                        className="hidden"
                        accept="image/*"
                      />
                      <label htmlFor="idBack">
                        <Button as="span" variant="outline">
                          Choose File
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900">{documentMessages.idBack}</p>
                          <p className="text-sm text-green-700">{uploadedDocuments.idBack?.name}</p>
                        </div>
                      </div>
                      <Button onClick={() => handleDeleteDocument("idBack")} variant="outline" className="w-full text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
