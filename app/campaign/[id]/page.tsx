"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileTabs } from "@/components/mobile-tabs"
import { Heart, Share2, TrendingUp, Users, Clock, Check } from "lucide-react"
import Image from "next/image"
import { getCampaignById } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState as useStateHook } from "react"
import type { PledgeOption } from "@/lib/data"

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [campaign, setCampaign] = useStateHook<any>(null)
  const [selectedPledgeOption, setSelectedPledgeOption] = useStateHook("")
  const [quantity, setQuantity] = useStateHook(1)
  const [isSaved, setIsSaved] = useStateHook(false)
  const [isLoading, setIsLoading] = useStateHook(false)
  const [activeTab, setActiveTab] = useStateHook("description")
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const loadCampaign = async () => {
      const resolvedParams = await params
      const campaignData = getCampaignById(resolvedParams.id)
      setCampaign(campaignData)
      if (campaignData?.pledgeOptions[0]) {
        setSelectedPledgeOption(campaignData.pledgeOptions[0].id)
      }
    }
    loadCampaign()
  }, [params])

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Campaign not found</h1>
        <Button onClick={() => router.push("/discover")}>Back to Discover</Button>
      </div>
    )
  }

  const fundingPercentage = (campaign.fundedAmount / campaign.fundingGoal) * 100
  const selectedOption = campaign.pledgeOptions.find((p: PledgeOption) => p.id === selectedPledgeOption)

  const handleMakePledge = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (selectedOption) {
      setIsLoading(true)
      setTimeout(() => {
        router.push(`/checkout?campaignId=${campaign.id}&pledgeOptionId=${selectedOption.id}&quantity=${quantity}`)
      }, 300)
    }
  }

  const tabsList = [
    { id: "description", label: "Description" },
    { id: "updates", label: "Updates" },
    { id: "designer", label: "About Designer" },
  ]

  return (
    <main className="flex-1 bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="py-8 md:py-12 border-b">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="lg:col-span-2">
              <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={campaign.image || "/placeholder.svg"}
                  alt={campaign.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Campaign Header */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{campaign.title}</h1>
                <p className="text-lg text-neutral-600">by {campaign.designer}</p>
              </div>

              {/* Funding Progress Card */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-neutral-900">
                      ${campaign.fundedAmount.toLocaleString()}
                    </span>
                    <span className="text-sm text-neutral-600">of ${campaign.fundingGoal.toLocaleString()}</span>
                  </div>
                  <Progress value={fundingPercentage} className="h-3" />
                  <p className="text-sm font-semibold text-neutral-700">{Math.round(fundingPercentage)}% funded</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-neutral-600" />
                    </div>
                    <p className="text-lg font-bold text-neutral-900">{campaign.backers}</p>
                    <p className="text-xs text-neutral-600">Supporters</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-neutral-600" />
                    </div>
                    <p className="text-lg font-bold text-neutral-900">{Math.round(fundingPercentage)}%</p>
                    <p className="text-xs text-neutral-600">Funded</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-neutral-600" />
                    </div>
                    <p className="text-lg font-bold text-neutral-900">{campaign.daysRemaining}</p>
                    <p className="text-xs text-neutral-600">Days Left</p>
                  </div>
                </div>
              </div>

              {/* Pledge Selection Card */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-bold text-neutral-900">Make a Pledge</h3>

                {/* Pledge Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-neutral-700">Choose Your Pledge Amount</Label>
                  <div className="space-y-2">
                    {campaign.pledgeOptions.map((option: PledgeOption) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedPledgeOption(option.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedPledgeOption === option.id
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-neutral-900">${option.amount}</p>
                            <p className="text-sm text-neutral-600">{option.description}</p>
                          </div>
                          {selectedPledgeOption === option.id && (
                            <Check className="h-5 w-5 text-neutral-900 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-3">
                  <Label htmlFor="quantity" className="text-sm font-semibold text-neutral-700">
                    How Many?
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 p-0 rounded-lg border border-neutral-300 hover:bg-neutral-100"
                    >
                      −
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="flex-1 text-center px-4 py-2 rounded-lg border border-neutral-300 text-neutral-900 font-bold"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 p-0 rounded-lg border border-neutral-300 hover:bg-neutral-100"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                {selectedOption && (
                  <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Pledge:</span>
                      <span className="text-3xl font-bold">${(selectedOption.amount * quantity).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Primary CTA Button */}
                <Button
                  onClick={handleMakePledge}
                  disabled={isLoading}
                  className="w-full py-6 text-lg font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-70"
                  size="lg"
                >
                  {isLoading ? "Processing..." : "Make a Pledge"}
                </Button>

                {/* Secondary Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition bg-transparent"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current text-red-500" : "text-neutral-600"}`} />
                    <span className="text-neutral-700 font-medium">{isSaved ? "Saved" : "Save"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition bg-transparent"
                    onClick={() => {
                      navigator.share?.({
                        title: campaign.title,
                        text: campaign.description,
                        url: window.location.href,
                      })
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2 text-neutral-600" />
                    <span className="text-neutral-700 font-medium">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Details Tabs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="hidden md:block">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-neutral-600 hover:text-neutral-900 data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 data-[state=active]:bg-transparent"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-neutral-600 hover:text-neutral-900 data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 data-[state=active]:bg-transparent"
                >
                  Updates
                </TabsTrigger>
                <TabsTrigger
                  value="designer"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-neutral-600 hover:text-neutral-900 data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 data-[state=active]:bg-transparent"
                >
                  About Designer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-8 space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">About This Campaign</h2>
                <p className="text-lg text-neutral-700 leading-relaxed">{campaign.description}</p>
              </TabsContent>

              <TabsContent value="updates" className="mt-8">
                <p className="text-neutral-600">No updates yet. Check back soon!</p>
              </TabsContent>

              <TabsContent value="designer" className="mt-8 space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">About the Designer</h2>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  {campaign.designer} is an independent fashion designer committed to creating high-quality, sustainable
                  pieces.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:hidden">
            <MobileTabs tabs={tabsList} activeTab={activeTab} onTabChange={setActiveTab}>
              {activeTab === "description" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-neutral-900">About This Campaign</h2>
                  <p className="text-lg text-neutral-700 leading-relaxed">{campaign.description}</p>
                </div>
              )}
              {activeTab === "updates" && <p className="text-neutral-600">No updates yet. Check back soon!</p>}
              {activeTab === "designer" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-neutral-900">About the Designer</h2>
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {campaign.designer} is an independent fashion designer committed to creating high-quality,
                    sustainable pieces.
                  </p>
                </div>
              )}
            </MobileTabs>
          </div>
        </div>
      </section>
    </main>
  )
}
