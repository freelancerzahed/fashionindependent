"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardRecentCampaigns } from "@/components/dashboard-recent-campaigns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useAnalytics } from "@/lib/analytics-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, ArrowRight, Upload, CheckCircle, Trash2, Edit2, Plus, X } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { getConversionMetrics } = useAnalytics()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [editingSettings, setEditingSettings] = useState(false)
  
  // Active Campaign State
  const [selectedColor, setSelectedColor] = useState("Red")
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [campaignProducts, setCampaignProducts] = useState<Array<{id: string; color: string; size: string; quantity: number}>>([])
  const [saveSuccess, setSaveSuccess] = useState(false)
  
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
    fullName: user?.name || "John Designer",
    businessName: "Arturo's Brick & Masonry LLC",
    email: user?.email || "john@example.com",
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

  // Mock data
  const mockCampaigns = [
    {
      id: "campaign-1",
      title: "Sustainable Fashion Collection",
      fundedAmount: 15000,
      fundingGoal: 20000,
      backers: 145,
      status: "active",
    },
    {
      id: "campaign-2",
      title: "Eco-Friendly Accessories",
      fundedAmount: 8500,
      fundingGoal: 10000,
      backers: 89,
      status: "active",
    },
    {
      id: "campaign-3",
      title: "Vintage Inspired Dresses",
      fundedAmount: 22000,
      fundingGoal: 20000,
      backers: 234,
      status: "completed",
    },
  ]

  const activeCampaign = {
    id: 1,
    name: "Sustainable Linen Collection",
    status: "Active",
    funded: 45000,
    goal: 50000,
    backers: 320,
    daysLeft: 7,
    image: "/product-fashion-model.svg",
    price: 99,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Green", "Black"],
    materials: ["100% Organic Linen"],
    startDate: "2025-01-01",
    endDate: "2025-02-15",
  }

  const conversionMetrics = getConversionMetrics()

  const dashboardStats = {
    totalCampaigns: mockCampaigns.length,
    totalEarnings: mockCampaigns.reduce((sum, c) => sum + c.fundedAmount, 0),
    conversionRate: conversionMetrics.avgConversionRate,
    totalBackers: mockCampaigns.reduce((sum, c) => sum + c.backers, 0),
  }

  // Helper functions
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

  // Active Campaign Handlers
  const handleAddProduct = () => {
    const newProduct = {
      id: `product-${Date.now()}`,
      color: selectedColor,
      size: selectedSize,
      quantity: selectedQuantity,
    }
    setCampaignProducts([...campaignProducts, newProduct])
    setSelectedQuantity(1)
    // Show a toast-like message
    console.log("Product added:", newProduct)
  }

  const handleSaveCampaignChanges = () => {
    setSaveSuccess(true)
    console.log("Campaign changes saved. Products:", campaignProducts)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleCancelCampaign = () => {
    setCampaignProducts([])
    setSelectedColor("Red")
    setSelectedSize("M")
    setSelectedQuantity(1)
    console.log("Campaign changes cancelled")
  }

  // Loading and auth checks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  // Main render
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DashboardNav />

            <div className="lg:col-span-3 space-y-8">
              {/* Welcome Section */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Designer"}!</h1>
                <p className="text-neutral-600">Here's an overview of your campaign performance and activity.</p>
              </div>

              {/* Tabs Navigation */}
              <div className="bg-white rounded-lg shadow-sm border-b">
                <div className="flex gap-8 p-4 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-2 px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                      activeTab === "overview"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("active-campaign")}
                    className={`py-2 px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                      activeTab === "active-campaign"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Active Campaign
                  </button>
                  <button
                    onClick={() => setActiveTab("account-settings")}
                    className={`py-2 px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                      activeTab === "account-settings"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`py-2 px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                      activeTab === "documents"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Documents
                  </button>
                </div>
              </div>

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <DashboardStats {...dashboardStats} />

                  {/* Recent Campaigns */}
                  <DashboardRecentCampaigns campaigns={mockCampaigns} />

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/launch-campaign">
                          <Button className="w-full bg-transparent" variant="outline">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Launch New Campaign
                          </Button>
                        </Link>
                        <Link href="/dashboard/body-model">
                          <Button className="w-full bg-transparent" variant="outline">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Update Body Model
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                          <span className="text-sm font-medium">Average Conversion Rate</span>
                          <span className="text-lg font-bold">{conversionMetrics.avgConversionRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                          <span className="text-sm font-medium">Total Conversions</span>
                          <span className="text-lg font-bold">{conversionMetrics.totalConversions}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                          <span className="text-sm font-medium">Pledges Initiated</span>
                          <span className="text-lg font-bold">{conversionMetrics.totalInitiated}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Active Campaign Tab */}
              {activeTab === "active-campaign" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold">Active Campaign</h2>
                  {activeCampaign ? (
                    <div className="space-y-8">
                      {/* Main Product Section */}
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Product Thumbnails */}
                        <div className="flex flex-col gap-3">
                          {[1, 2, 3, 4, 5, 6].map((index) => (
                            <div
                              key={index}
                              className="w-20 h-20 border border-neutral-300 rounded cursor-pointer hover:border-neutral-600 transition-colors overflow-hidden"
                            >
                              <img
                                src={activeCampaign.image || "/placeholder.svg"}
                                alt={`Product ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Center: Main Product Image */}
                        <div className="flex-1">
                          <div className="w-full h-[600px] border border-neutral-300 rounded-lg overflow-hidden bg-neutral-100">
                            <img
                              src={activeCampaign.image || "/placeholder.svg"}
                              alt={activeCampaign.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {saveSuccess && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm font-semibold">
                              ✓ Changes saved successfully!
                            </div>
                          )}
                          <div className="flex gap-4 mt-6">
                            <Button 
                              onClick={handleCancelCampaign}
                              variant="outline" 
                              className="flex-1 h-10"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSaveCampaignChanges}
                              className="flex-1 h-10 bg-neutral-900 text-white hover:bg-neutral-800 font-semibold"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>

                        {/* Right: Product Details */}
                        <div className="flex-1 space-y-6">
                          {/* Duration Timer */}
                          <div>
                            <p className="text-sm text-neutral-600 mb-2">Duration</p>
                            <p className="text-lg font-bold text-neutral-900">
                              {String(activeCampaign.daysLeft).padStart(2, '0')}d : 03h : 44m
                            </p>
                          </div>

                          {/* Product Name */}
                          <div>
                            <p className="text-lg text-neutral-600 mb-1">{"{Product Name}"}</p>
                            <h3 className="text-2xl font-bold text-neutral-900">{activeCampaign.name}</h3>
                          </div>

                          {/* Price */}
                          <div>
                            <p className="text-3xl font-bold text-red-600">${activeCampaign.price}</p>
                          </div>

                          {/* Description */}
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 mb-2">Product description</p>
                            <p className="text-sm text-neutral-700 leading-relaxed">{activeCampaign.description}</p>
                          </div>

                          {/* Color Selection */}
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 mb-3">Color: {selectedColor}</p>
                            <div className="flex gap-3">
                              {[
                                { name: "Red", hex: "#DC2626" },
                                { name: "Green", hex: "#059669" },
                                { name: "Black", hex: "#000000" },
                              ].map((color) => (
                                <button
                                  key={color.name}
                                  onClick={() => setSelectedColor(color.name)}
                                  className={`w-8 h-8 rounded-full border-3 transition-all ${
                                    selectedColor === color.name
                                      ? "border-neutral-900 ring-2 ring-neutral-400"
                                      : "border-neutral-300 hover:border-neutral-600"
                                  }`}
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Size Selection */}
                          <div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-neutral-900 mb-2">Size: {selectedSize}</p>
                                <select 
                                  value={selectedSize}
                                  onChange={(e) => setSelectedSize(e.target.value)}
                                  className="w-full px-3 py-2 border border-neutral-300 rounded bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                >
                                  {activeCampaign.sizes.map((size) => (
                                    <option key={size} value={size}>
                                      {size}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Quantity Selection */}
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 mb-2">Quantity</p>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                className="px-3 py-2 border border-neutral-300 rounded hover:bg-neutral-50"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-semibold">{selectedQuantity}</span>
                              <button 
                                onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                                className="px-3 py-2 border border-neutral-300 rounded hover:bg-neutral-50"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Size Guide */}
                          <div>
                            <p className="text-xs text-neutral-600">
                              <span className="font-semibold">Size guide</span>
                              <br />
                              Bust: 43.3, Sleeve Length: 19.1, Length: 26, Hem Width: 37 (inch)
                            </p>
                          </div>

                          {/* Add Product Button */}
                          <Button 
                            onClick={handleAddProduct}
                            className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-11 font-semibold"
                          >
                            Add Product
                          </Button>

                          {/* Products List */}
                          {campaignProducts.length > 0 && (
                            <div className="pt-4 border-t border-neutral-200">
                              <p className="text-sm font-semibold text-neutral-900 mb-3">Added Products ({campaignProducts.length})</p>
                              <div className="space-y-2">
                                {campaignProducts.map((product) => (
                                  <div key={product.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded text-sm">
                                    <span>{product.color} - Size {product.size} x {product.quantity}</span>
                                    <button 
                                      onClick={() => setCampaignProducts(campaignProducts.filter(p => p.id !== product.id))}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Campaign Stats Section */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-neutral-200">
                        <Card className="p-6">
                          <p className="text-sm text-neutral-600 mb-2">Total Funded</p>
                          <p className="text-3xl font-bold mb-2">${activeCampaign.funded.toLocaleString()}</p>
                          <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(activeCampaign.funded / activeCampaign.goal) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-neutral-600">
                            Goal: ${activeCampaign.goal.toLocaleString()}
                          </p>
                        </Card>
                        <Card className="p-6">
                          <p className="text-sm text-neutral-600 mb-2">Total Backers</p>
                          <p className="text-3xl font-bold">{activeCampaign.backers}</p>
                        </Card>
                        <Card className="p-6">
                          <p className="text-sm text-neutral-600 mb-2">Time Remaining</p>
                          <p className="text-3xl font-bold">{activeCampaign.daysLeft}</p>
                          <p className="text-xs text-neutral-600">days</p>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <p className="text-neutral-600 mb-4">No active campaigns at the moment</p>
                      <Link href="/launch-campaign">
                        <Button>Launch New Campaign</Button>
                      </Link>
                    </Card>
                  )}
                </div>
              )}

              {/* Account Settings Tab */}
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
                    </div>
                  )}
                </div>
              )}

              {/* Documents Tab */}
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
                      <Link href="#" className="text-blue-600 hover:underline">[View acceptable forms of ID]</Link>
                    </p>
                  </div>

                  {/* Document Upload Success Message - Only show when uploaded */}
                  {uploadedDocuments.techPack && (
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="font-semibold text-green-900">Document successfully uploaded</p>
                      </div>
                    </div>
                  )}

                  {/* Tech Pack Upload Section */}
                  <Card className="p-8 border border-neutral-200">
                    <h3 className="text-xl font-bold mb-2">Tech Pack Upload</h3>
                    <p className="text-sm text-neutral-600 mb-6">Upload your tech pack file to complete your profile</p>
                    
                    <div className="space-y-6">
                      {/* Upload Area */}
                      {!uploadedDocuments.techPack ? (
                        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                          <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                          <p className="text-lg font-medium text-neutral-900 mb-1">Upload Tech Pack</p>
                          <p className="text-sm text-neutral-600 mb-4">Drag and drop or click to upload (PDF, JPG, PNG)</p>
                          <input
                            type="file"
                            id="techPack"
                            onChange={(e) => handleFileUpload(e, "techPack")}
                            className="hidden"
                            accept=".pdf,image/*"
                          />
                          <label htmlFor="techPack">
                            <Button as="span" className="bg-neutral-900 text-white hover:bg-neutral-800">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-green-900">{documentMessages.techPack}</p>
                              <p className="text-sm text-green-700">{uploadedDocuments.techPack?.name}</p>
                            </div>
                          </div>
                          <Button onClick={() => handleDeleteDocument("techPack")} variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove File
                          </Button>
                        </div>
                      )}

                      {/* Pricing Options */}
                      <div className="pt-6 border-t border-neutral-200">
                        <h4 className="font-semibold mb-4 text-neutral-900">Tech Pack Pricing</h4>
                        <div className="space-y-3">
                          <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                            <input type="radio" name="techPackOption" value="one" defaultChecked className="w-5 h-5" />
                            <span className="font-medium text-neutral-900 ml-3">One (1) Tech Pack - $68.00</span>
                          </label>
                          <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                            <input type="radio" name="techPackOption" value="three" className="w-5 h-5" />
                            <span className="font-medium text-neutral-900 ml-3">Three (3) Tech Packs - $188.00</span>
                          </label>
                          <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                            <input type="radio" name="techPackOption" value="five" className="w-5 h-5" />
                            <span className="font-medium text-neutral-900 ml-3">Five (5) Tech Packs - $324.00</span>
                          </label>
                        </div>
                      </div>

                      {/* Purchase Button */}
                      <Button className="w-full bg-red-600 text-white hover:bg-red-700 h-12 font-bold text-base">
                        Purchase Tech Pack
                      </Button>
                    </div>
                  </Card>

                  {/* ID Verification Section */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">ID Verification</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* ID Front */}
                      <Card className="p-6 border border-neutral-200">
                        <h4 className="font-semibold mb-1 text-neutral-900">ID - Front Side</h4>
                        <p className="text-sm text-neutral-600 mb-4">Upload a clear photo of the front of your ID</p>

                        {!uploadedDocuments.idFront ? (
                          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                            <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                            <p className="text-sm text-neutral-600 mb-3">Drag and drop or click to upload</p>
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
                        <p className="text-sm text-neutral-600 mb-4">Upload a clear photo of the back of your ID</p>

                        {!uploadedDocuments.idBack ? (
                          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                            <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                            <p className="text-sm text-neutral-600 mb-3">Drag and drop or click to upload</p>
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
        </div>
      </section>
    </main>
  )
}
