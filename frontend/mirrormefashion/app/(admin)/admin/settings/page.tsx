"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Truck,
  Save,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  SettingsIcon,
  Users,
  Database,
  Palette,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const tabs = [
  { id: "general", label: "General", icon: Store, count: 12 },
  { id: "payments", label: "Payments", icon: CreditCard, count: 8 },
  { id: "shipping", label: "Shipping", icon: Truck, count: 15 },
  { id: "notifications", label: "Notify", icon: Bell, count: 25 },
  { id: "security", label: "Security", icon: Shield, count: 5 },
  { id: "users", label: "Users", icon: Users, count: 18 },
  { id: "integrations", label: "Integrations", icon: Database, count: 7 },
  { id: "appearance", label: "Theme", icon: Palette, count: 3 },
]

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)

  const statsCards = [
    { title: "Active Settings", value: "12", icon: SettingsIcon, color: "bg-blue-500" },
    { title: "Integrations", value: "8", icon: Globe, color: "bg-green-500" },
    { title: "Notifications", value: "15", icon: Bell, color: "bg-purple-500" },
    { title: "Security Level", value: "High", icon: Shield, color: "bg-orange-500" },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-4">
            {/* Store Information */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Store className="w-4 h-4 md:w-5 md:h-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" defaultValue="Fashion Retailer" className="rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="storeUrl">Store URL</Label>
                    <Input id="storeUrl" defaultValue="https://fashion-store.com" className="rounded-xl" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    defaultValue="Premium fashion retailer offering the latest trends and timeless classics."
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      defaultValue="contact@fashion-store.com"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input id="supportPhone" defaultValue="+1 (555) 123-4567" className="rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Address */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Business Address</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" defaultValue="123 Fashion Street" className="rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="New York" className="rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="NY" className="rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="10001" className="rounded-xl" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select defaultValue="us">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "payments":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-xl">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm">Stripe</h3>
                        <p className="text-xs text-gray-500">Credit cards, digital wallets</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                        Active
                      </Badge>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-xl">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm">PayPal</h3>
                        <p className="text-xs text-gray-500">PayPal payments</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "security":
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Shield className="w-4 h-4 md:w-5 md:h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <Label className="text-sm">Two-Factor Authentication</Label>
                      <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch className="flex-shrink-0" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <Label className="text-sm">Login Notifications</Label>
                      <p className="text-xs text-gray-500">Get notified of new login attempts</p>
                    </div>
                    <Switch defaultChecked className="flex-shrink-0" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="mx-1 md:mx-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">API Keys</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      defaultValue="sk_live_1234567890abcdef"
                      readOnly
                      className="rounded-xl"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="rounded-xl flex-shrink-0"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Keep your API key secure and never share it publicly</p>
                </div>
                <Button variant="outline" className="rounded-xl bg-transparent">
                  Regenerate API Key
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <Card className="mx-1 md:mx-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold truncate">Settings</h1>
            <p className="text-sm md:text-base text-gray-600 truncate">
              Manage your store configuration and preferences
            </p>
          </div>
          <Button size="sm" className="rounded-full flex-shrink-0">
            <Save className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="w-full max-w-[85vw] overflow-hidden md:hidden mx-auto">
          <Swiper modules={[FreeMode]} spaceBetween={6} slidesPerView="auto" freeMode={true} className="px-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <SwiperSlide key={tab.id} className="!w-auto">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium leading-tight">{tab.label}</span>
                    <Badge
                      variant="secondary"
                      className={`absolute -top-1 -right-1 text-xs min-w-5 h-5 px-1 ${
                        activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"
                      }`}
                    >
                      {tab.count > 999 ? "999+" : tab.count}
                    </Badge>
                  </button>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"}`}
                  >
                    {tab.count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Stats Slider */}
        <div className="md:hidden w-full px-4">
          <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {(() => {
                    const IconComponent = statsCards[currentStatsIndex].icon
                    return <IconComponent className="w-6 h-6 flex-shrink-0" />
                  })()}
                  <span className="text-sm font-medium opacity-90 truncate">{statsCards[currentStatsIndex].title}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStats}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextStats}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-3xl font-bold mb-2">{statsCards[currentStatsIndex].value}</div>
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {statsCards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStatsIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Stats Cards */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-8 h-8 ${stat.color} rounded-full flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = stat.icon
                      return <IconComponent className="w-4 h-4 text-white" />
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  )
}
