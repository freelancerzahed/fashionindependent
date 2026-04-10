"use client"

import type React from "react"

import { useState } from "react"
import { User, Building, CreditCard, Bell, Shield, Camera, Save, X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdvertiserProfile {
  companyName: string
  contactName: string
  email: string
  phone: string
  website: string
  industry: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  profileImage: string | null
}

interface BillingInfo {
  paymentMethod: string
  cardNumber: string
  expiryDate: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingZip: string
  billingCountry: string
  taxId: string
}

interface NotificationSettings {
  campaignAlerts: boolean
  budgetAlerts: boolean
  performanceReports: boolean
  billingNotifications: boolean
  marketingUpdates: boolean
  emailFrequency: string
}

export default function AdvertiserSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const [profile, setProfile] = useState<AdvertiserProfile>({
    companyName: "Fashion Forward Inc.",
    contactName: "Sarah Johnson",
    email: "advertiser@fashion.com",
    phone: "+1 (555) 123-4567",
    website: "https://fashionforward.com",
    industry: "Fashion & Apparel",
    description: "Leading fashion retailer specializing in trendy and affordable clothing for young adults.",
    address: "123 Fashion Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    profileImage: null,
  })

  const [billing, setBilling] = useState<BillingInfo>({
    paymentMethod: "credit-card",
    cardNumber: "**** **** **** 1234",
    expiryDate: "12/25",
    billingAddress: "123 Fashion Street",
    billingCity: "New York",
    billingState: "NY",
    billingZip: "10001",
    billingCountry: "United States",
    taxId: "12-3456789",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    campaignAlerts: true,
    budgetAlerts: true,
    performanceReports: true,
    billingNotifications: true,
    marketingUpdates: false,
    emailFrequency: "daily",
  })

  const handleProfileChange = (field: keyof AdvertiserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleBillingChange = (field: keyof BillingInfo, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean | string) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImage(result)
        setProfile((prev) => ({ ...prev, profileImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfileImage = () => {
    setProfileImage(null)
    setProfile((prev) => ({ ...prev, profileImage: null }))
  }

  const handleSaveProfile = () => {
    // Handle profile save logic
    console.log("Saving profile:", profile)
  }

  const handleSaveBilling = () => {
    // Handle billing save logic
    console.log("Saving billing:", billing)
  }

  const handleSaveNotifications = () => {
    // Handle notifications save logic
    console.log("Saving notifications:", notifications)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Advertiser Settings</h1>
        <p className="text-gray-600">Manage your advertiser account and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileImage || profile.profileImage || ""} />
                  <AvatarFallback className="text-lg">
                    {profile.companyName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <Label htmlFor="profile-image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    </Label>
                    {(profileImage || profile.profileImage) && (
                      <Button type="button" variant="outline" size="sm" onClick={removeProfileImage}>
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={profile.companyName}
                    onChange={(e) => handleProfileChange("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-name">Contact Name *</Label>
                  <Input
                    id="contact-name"
                    value={profile.contactName}
                    onChange={(e) => handleProfileChange("contactName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => handleProfileChange("website", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={profile.industry} onValueChange={(value) => handleProfileChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => handleProfileChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Business Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => handleProfileChange("address", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => handleProfileChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={profile.state}
                      onChange={(e) => handleProfileChange("state", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP/Postal Code</Label>
                    <Input
                      id="zip"
                      value={profile.zipCode}
                      onChange={(e) => handleProfileChange("zipCode", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={profile.country} onValueChange={(value) => handleProfileChange("country", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="bg-primary-600 hover:bg-primary-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-8 bg-primary-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div className="flex-1">
                  <p className="font-medium">Credit Card ending in 1234</p>
                  <p className="text-sm text-gray-600">Expires 12/25</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" value={billing.cardNumber} readOnly />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" value={billing.expiryDate} readOnly />
                </div>
              </div>

              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="billing-address">Street Address</Label>
                  <Input
                    id="billing-address"
                    value={billing.billingAddress}
                    onChange={(e) => handleBillingChange("billingAddress", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="billing-city">City</Label>
                  <Input
                    id="billing-city"
                    value={billing.billingCity}
                    onChange={(e) => handleBillingChange("billingCity", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="billing-state">State/Province</Label>
                  <Input
                    id="billing-state"
                    value={billing.billingState}
                    onChange={(e) => handleBillingChange("billingState", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="billing-zip">ZIP/Postal Code</Label>
                  <Input
                    id="billing-zip"
                    value={billing.billingZip}
                    onChange={(e) => handleBillingChange("billingZip", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="billing-country">Country</Label>
                  <Select
                    value={billing.billingCountry}
                    onValueChange={(value) => handleBillingChange("billingCountry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tax-id">Tax ID</Label>
                  <Input
                    id="tax-id"
                    value={billing.taxId}
                    onChange={(e) => handleBillingChange("taxId", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveBilling} className="bg-primary-600 hover:bg-primary-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Billing Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Campaign Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified about campaign status changes</p>
                  </div>
                  <Switch
                    checked={notifications.campaignAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("campaignAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Budget Alerts</h4>
                    <p className="text-sm text-gray-600">Receive alerts when budgets are running low</p>
                  </div>
                  <Switch
                    checked={notifications.budgetAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("budgetAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Performance Reports</h4>
                    <p className="text-sm text-gray-600">Weekly performance summaries</p>
                  </div>
                  <Switch
                    checked={notifications.performanceReports}
                    onCheckedChange={(checked) => handleNotificationChange("performanceReports", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Billing Notifications</h4>
                    <p className="text-sm text-gray-600">Payment confirmations and billing updates</p>
                  </div>
                  <Switch
                    checked={notifications.billingNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("billingNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing Updates</h4>
                    <p className="text-sm text-gray-600">Product updates and marketing tips</p>
                  </div>
                  <Switch
                    checked={notifications.marketingUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("marketingUpdates", checked)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email-frequency">Email Frequency</Label>
                <Select
                  value={notifications.emailFrequency}
                  onValueChange={(value) => handleNotificationChange("emailFrequency", value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="bg-primary-600 hover:bg-primary-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Enable 2FA</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
