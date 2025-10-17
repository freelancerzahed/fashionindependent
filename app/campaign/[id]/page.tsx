"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Heart } from "lucide-react"
import Image from "next/image"
import { getCampaignById } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = getCampaignById(params.id)
  const [selectedPledgeOption, setSelectedPledgeOption] = useState(campaign?.pledgeOptions[0]?.id || "")
  const [quantity, setQuantity] = useState(1)
  const [isSaved, setIsSaved] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Campaign not found</h1>
            <Button onClick={() => router.push("/discover")}>Back to Discover</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const fundingPercentage = (campaign.fundedAmount / campaign.fundingGoal) * 100
  const selectedOption = campaign.pledgeOptions.find((p) => p.id === selectedPledgeOption)

  const handleBackCampaign = () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (selectedOption) {
      addToCart({
        campaignId: campaign.id,
        pledgeOptionId: selectedOption.id,
        amount: selectedOption.amount,
        quantity,
        campaignTitle: campaign.title,
      })
      router.push("/dashboard/donations")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Campaign Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{campaign.title}</h1>
                  <p className="text-neutral-600">by {campaign.designer}</p>
                </div>

                {/* Funding Progress */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${campaign.fundedAmount.toLocaleString()}</span>
                    <span className="text-neutral-600">pledged of ${campaign.fundingGoal.toLocaleString()} goal</span>
                  </div>
                  <Progress value={fundingPercentage} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{campaign.backers} backers</span>
                    <span className="font-semibold">{campaign.daysRemaining} days remaining</span>
                  </div>
                </div>

                {/* Pledge Section */}
                <div className="border rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Support this campaign</h3>

                  <div className="space-y-2">
                    <Label htmlFor="pledge-option">Select Pledge Option</Label>
                    <select
                      id="pledge-option"
                      value={selectedPledgeOption}
                      onChange={(e) => setSelectedPledgeOption(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {campaign.pledgeOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          ${option.amount} - {option.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    />
                  </div>

                  {selectedOption && (
                    <div className="bg-neutral-50 p-3 rounded text-sm">
                      <p className="text-neutral-600">
                        Total:{" "}
                        <span className="font-bold text-neutral-900">
                          ${(selectedOption.amount * quantity).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  )}

                  <Button className="w-full" size="lg" onClick={handleBackCampaign}>
                    Back This Campaign
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsSaved(!isSaved)}>
                      <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        navigator.share?.({
                          title: campaign.title,
                          text: campaign.description,
                          url: window.location.href,
                        })
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Campaign Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold">{campaign.backers}</p>
                    <p className="text-sm text-neutral-600">Backers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round(fundingPercentage)}%</p>
                    <p className="text-sm text-neutral-600">Funded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{campaign.daysRemaining}</p>
                    <p className="text-sm text-neutral-600">Days Left</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Details Tabs */}
            <div className="mt-16">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="designer">About Designer</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6 space-y-4">
                  <h2 className="text-2xl font-bold">About This Campaign</h2>
                  <p className="text-neutral-700 leading-relaxed">{campaign.description}</p>
                </TabsContent>
                <TabsContent value="updates" className="mt-6">
                  <p className="text-neutral-600">No updates yet. Check back soon!</p>
                </TabsContent>
                <TabsContent value="designer" className="mt-6 space-y-4">
                  <h2 className="text-2xl font-bold">About the Designer</h2>
                  <p className="text-neutral-700 leading-relaxed">
                    {campaign.designer} is an independent fashion designer committed to creating high-quality,
                    sustainable pieces.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
