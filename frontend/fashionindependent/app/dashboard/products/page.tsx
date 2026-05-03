"use client"

import { useState } from "react"
import Link from "next/link"

import { ProductsHistory } from "@/components/products-history"
import { ProductsOverviewStats } from "@/components/products-overview-stats"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Clock,
  CheckCircle,
  Edit2,
  Flame,
} from "lucide-react"

export default function ProductsPage() {
  // Temporary state placeholders — replace with real data/hooks
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const activeCampaignData: any = null
  const saveSuccess = false

  // Temporary placeholder function — replace with your real edit handler
  const handleEditCampaign = (campaign: any) => {
    console.log("Edit campaign:", campaign)
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <ProductsOverviewStats
            totalVotes={1240}
            totalBackers={325}
            totalEarnings={45870}
          />
          <div className="pt-20">
            {/* Populate stats here */}
          </div>
        </div>
      </section>

      <section>
        <h1 className="ml-[2%] text-2xl font-bold mb-4">Current Activity</h1>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          
          {/* Active Campaigns Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Active Campaign</h2>              
            </div>
            <p>(This Active Campaigns section is complete. It copies all of the script from the campaigns tab to this section.)</p>
            {activeCampaignData ? (
              <Card className="p-8">
                <div className="space-y-8">
                  {/* Health Score Badge and Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 font-semibold mb-1">
                        Funding Goal
                      </p>
                      <p className="text-2xl font-bold text-blue-900 mb-2">
                        $
                        {activeCampaignData.funding_goal?.toLocaleString() ||
                          "0"}
                      </p>
                      <p className="text-xs text-blue-600">Campaign target</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <p className="text-sm text-orange-700 font-semibold">
                          Time Limit
                        </p>
                      </div>
                      <p className="text-3xl font-bold text-orange-600">
                        {activeCampaignData.days_active || 90}
                      </p>
                      <p className="text-xs text-orange-600">days active</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-semibold mb-1">
                        Status
                      </p>
                      <p className="text-2xl font-bold text-green-900 mb-2 capitalize">
                        {activeCampaignData.status}
                      </p>
                      <p className="text-xs text-green-600">
                        {new Date(
                          activeCampaignData.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Main Campaign Gallery & Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Campaign Images Section */}
                    <div className="lg:col-span-2">
                      {activeCampaignData.product_images &&
                      Array.isArray(activeCampaignData.product_images) &&
                      activeCampaignData.product_images.length > 0 ? (
                        <div className="space-y-4">
                          {/* Main Image */}
                          <div className="bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                            <div className="relative aspect-square w-full flex items-center justify-center">
                              <img
                                src={
                                  activeCampaignData.product_images[
                                    selectedImageIndex
                                  ]?.path
                                    ? activeCampaignData.product_images[
                                        selectedImageIndex
                                      ].path.startsWith("/api")
                                      ? activeCampaignData.product_images[
                                          selectedImageIndex
                                        ].path
                                      : `/api/storage/${
                                          activeCampaignData.product_images[
                                            selectedImageIndex
                                          ].path
                                        }`
                                    : "/placeholder.svg"
                                }
                                alt={`Campaign ${
                                  activeCampaignData.product_images[
                                    selectedImageIndex
                                  ]?.type || "image"
                                }`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          </div>

                          {/* Thumbnails */}
                          {activeCampaignData.product_images.length > 1 && (
                            <div className="flex gap-3">
                              {activeCampaignData.product_images.map(
                                (img: any, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      setSelectedImageIndex(idx)
                                    }
                                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                      selectedImageIndex === idx
                                        ? "border-blue-600 ring-2 ring-blue-500"
                                        : "border-neutral-300 hover:border-neutral-400"
                                    }`}
                                  >
                                    <div className="w-20 h-20 bg-neutral-100 flex items-center justify-center">
                                      <img
                                        src={
                                          img.path
                                            ? img.path.startsWith("/api")
                                              ? img.path
                                              : `/api/storage/${img.path}`
                                            : "/placeholder.svg"
                                        }
                                        alt={`Thumbnail ${idx}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "/placeholder.svg"
                                        }}
                                      />
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 h-96 flex flex-col items-center justify-center text-center">
                          <p className="text-neutral-600 font-semibold mb-1">
                            No Campaign Images
                          </p>
                          <p className="text-neutral-500 text-sm">
                            Upload images when editing your campaign
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Campaign Details */}
                    <div className="lg:col-span-1">
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                            {activeCampaignData.title}
                          </h1>
                          <p className="text-neutral-600 text-sm">
                            {activeCampaignData.description}
                          </p>
                        </div>

                        {saveSuccess && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-semibold flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Changes saved successfully
                          </div>
                        )}

                        <div className="space-y-2">
                          <Button
                            onClick={() => {
                              setSelectedImageIndex(0)
                              handleEditCampaign(activeCampaignData)
                            }}
                            className="w-full"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Campaign
                          </Button>

                          {activeCampaignData.status === "live" && (
                            <Link href={`/campaign/${activeCampaignData.id}`}>
                              <Button
                                variant="outline"
                                className="w-full"
                              >
                                👁️ View Live Campaign
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center border-2 border-dashed border-neutral-300 bg-neutral-50">
                <Flame className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 mb-4 text-lg font-semibold">
                  No active campaigns at the moment
                </p>
                <p className="text-neutral-500 mb-6">
                  Launch your first campaign to get started and reach your
                  audience
                </p>

                <Link href="/launch-campaign">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Flame className="w-4 h-4 mr-2" />
                    Launch Campaign
                  </Button>
                </Link>
              </Card>
            )}
          </div>
          
          {/* Active Limited Drops Section */}
          <div className="space-y-6">
            <h3 className="pt-20 text-3xl font-bold">Active Drops</h3>
            <p>(This Active Drops section is incomplete. Create a component for active limited drops and place it here.)</p>
          </div>
        </div>
      </section>

      <section>
        <h1 className="ml-[2%] text-2xl font-bold mb-4">Products & Collections</h1>
        
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          {/* Products & Collections*/}
          <div>
            <h1 className="text-2xl font-bold py-2 mb-4">Products</h1>
            <Carousel className="w-full">
              <CarouselContent>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden group">
                      <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          Product Image
                        </div>
                      </div>
                      <div className="text-md my-0 pr-1 font-bold text-right">⭐</div>
                      <CardContent className="p-4">
                        <p className="text-xs text-neutral-600 mb-1">Designer Name</p>
                        <h3 className="font-semibold text-lg mb-2">Product Title</h3>
                        <div className="mb-3">
                          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-900 w-1/2" />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-neutral-600">50% backed</p>
                            <p className="text-xs text-neutral-600">100 supporters</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold">
                          500 <span className="text-neutral-600 font-normal">/ 1000 upvotes</span>
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors w-full">
                          View Product
                        </button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          <div className="text-2xl font-bold pt-4"><h1>Collections</h1></div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            <div className="lg:col-span-1">
              <p className="pt-4">Jan 7, 2024</p>
              <p className="pt-12">Mar 17, 2025</p>
              <p className="pt-12">Apr 3, 2026</p>
              <p className="pt-12">Apr 22, 2026</p>
            </div>
            
            {/* Right Column - 80% */}
            <div className="lg:col-span-4">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Name of Collection (6)</AccordionTrigger>
                  <AccordionContent>
                    {/* Carousel of products in collection as large thumbnail */}
                    <div>
                      <Carousel className="w-full px-12">
                        <CarouselContent>
                          {[1, 2, 3, 4, 5, 6].map((item) => (
                            <CarouselItem key={item} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                              <div className="overflow-hidden rounded-lg group cursor-pointer">
                                <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden">
                                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                    Product Image
                                  </div>
                                  {/* Overlay */}
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex flex-col items-end justify-between p-4">
                                    <div className="text-2xl font-bold text-white">⭐</div>
                                    <div className="text-white w-full">
                                      <p className="text-xs opacity-90 mb-1">Designer Name</p>
                                      <h3 className="font-semibold text-sm">Product Title</h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-0 hover:bg-neutral-800 hover:text-white" />
                        <CarouselNext className="right-0 hover:bg-neutral-800 hover:text-white" />
                      </Carousel>
                    </div>

                    <div className="mt-4 space-y-2 pl-8">
                      <p className="text-sm text-neutral-600">Date created/time stamp: Jan 7, 2024</p>
                      <p className="text-sm text-neutral-600">Total products in collection: 6</p>
                      <p className="text-sm text-neutral-600">Total sales: $2,450</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>7@Night (5)</AccordionTrigger>
                  <AccordionContent>
                    The Fashion Independent is not a traditional online store. Items featured as Limited Drops are available for purchase. 
                    Products in Active Campaigns are open for voting and feedback only. Be sure to vote for the items you love. Successful 
                    campaigns are the ones that make it into our store as Limited Drops. 
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Free the People (8)</AccordionTrigger> 
                  <AccordionContent>
                    A Limited Drop is a product that successfully met its vote goal and earned its place in our store. These items are 
                    available at a steep discount for a limited time, usually 30 to 60 days, before they’re gone. Check Days Remaining 
                    to see how much time is left before the product is no longer available in our store. 
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Daughters of God (7)</AccordionTrigger>
                  <AccordionContent>
                    Yes! Your support helps designers bring their ideas to life. Just keep in mind that donations are separate from 
                    purchases and do not count toward owning the item. 
                  </AccordionContent>
                </AccordionItem>
            </Accordion>
            </div>
          </div>
        </div>

      </section>

      <section>
        <h1 className="ml-[2%] text-2xl font-bold mb-4">Products History</h1>
        <ProductsHistory />
      </section>
    </div>
  )
}