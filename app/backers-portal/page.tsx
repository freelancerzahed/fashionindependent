"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Share2, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MobileTabs } from "@/components/mobile-tabs"

export default function BackersPortal() {
  const [activeTab, setActiveTab] = useState("active")

  const activePledges = [
    {
      id: 1,
      productName: "Sustainable Linen Collection",
      creatorName: "Emma Studios",
      pledgeAmount: 150,
      daysRemaining: 7,
      status: "Active",
      image: "/sustainable-linen-fashion-collection.jpg",
    },
    {
      id: 2,
      productName: "Minimalist Mens Fashion",
      creatorName: "Marcus Design",
      pledgeAmount: 200,
      daysRemaining: 14,
      status: "Active",
      image: "/minimalist-mens-fashion-clothing.jpg",
    },
  ]

  const completedPledges = [
    {
      id: 3,
      productName: "Colorful Kids Adventure Wear",
      creatorName: "Joy Creations",
      pledgeAmount: 100,
      deliveryDate: "2025-01-15",
      status: "Delivered",
      image: "/colorful-kids-clothing-adventure.jpg",
    },
  ]

  const tabsList = [
    { id: "active", label: "Active Pledges" },
    { id: "completed", label: "Completed Orders" },
    { id: "saved", label: "Saved Campaigns" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-2">Backers Portal</h1>
          <p className="text-muted-foreground">Manage your pledges and track your orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Pledged</div>
              <div className="text-3xl font-bold">$450</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Active Pledges</div>
              <div className="text-3xl font-bold">2</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Completed Orders</div>
              <div className="text-3xl font-bold">1</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Saved Campaigns</div>
              <div className="text-3xl font-bold">5</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs - Desktop */}
      <div className="border-b hidden md:block">
        <div className="container">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("active")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "active"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Pledges
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "completed"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed Orders
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "saved"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Saved Campaigns
            </button>
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
        {activeTab === "active" && (
          <div className="space-y-6">
            {activePledges.map((pledge) => (
              <Card key={pledge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 bg-muted flex-shrink-0">
                    <img
                      src={pledge.image || "/placeholder.svg"}
                      alt={pledge.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{pledge.productName}</h3>
                      <p className="text-muted-foreground mb-4">by {pledge.creatorName}</p>
                      <div className="flex gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${pledge.pledgeAmount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{pledge.daysRemaining} days remaining</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/campaign/${pledge.id}`}>
                        <Button variant="outline">View Campaign</Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-6">
            {completedPledges.map((pledge) => (
              <Card key={pledge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 bg-muted flex-shrink-0">
                    <img
                      src={pledge.image || "/placeholder.svg"}
                      alt={pledge.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{pledge.productName}</h3>
                      <p className="text-muted-foreground mb-4">by {pledge.creatorName}</p>
                      <div className="flex gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${pledge.pledgeAmount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Delivered {pledge.deliveryDate}</span>
                        </div>
                      </div>
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {pledge.status}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline">Leave Review</Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Saved Campaigns Yet</h3>
            <p className="text-muted-foreground mb-6">Save your favorite campaigns to keep track of them</p>
            <Link href="/discover">
              <Button>Explore Campaigns</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
