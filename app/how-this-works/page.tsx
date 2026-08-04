"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ThreeStepsForward() {
  const [activeTab, setActiveTab] = useState("shoppers")

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">


        {/* About Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">How This Works</h2>

              <div className="border-b mb-8 ">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveTab("shoppers")}
                    className={`py-3 px-4 font-medium border-b-2 transition ${
                      activeTab === "shoppers"
                        ? "border-foreground text-foreground"
                        : "border-transparent text-neutral-500 hover:text-foreground"
                    }`}
                  >
                    For Shoppers
                  </button>
                  <button
                    onClick={() => setActiveTab("designers")}
                    className={`py-3 px-4 font-medium border-b-2 transition ${
                      activeTab === "designers"
                        ? "border-foreground text-foreground"
                        : "border-transparent text-neutral-500 hover:text-foreground"
                    }`}
                  >
                    For Designers
                  </button>
                </div>
              </div>

              {activeTab === "shoppers" ? (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-[5%]">
                    <h2 className="text-xl font-semibold mb-4">1️⃣ Browse Active Campaigns</h2>
                    <p className="text-sm text-neutral-600 mb-4">All active campaigns appear on the Home and Discover pages. 
                      Freely explore each campaign to find designs that catch your eye. 
                      <br />
                      <br />Home page: <a href="/" className="text-neutral-600 visited:underline">www.fashionindependent.com</a>
                      <br />Discover Page: <a href="/discover" className="text-neutral-600 visited:underline">www.fashionindependent.com/discover</a>
                      <br />
                      </p>
                    <img src="images/rack-browsing.png" alt="Browse Campaigns" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <div className="text-center p-[5%]">
                    <h2 className="text-xl font-semibold mb-4">2️⃣ Vote-Up Designs You Like</h2>
                    <p className="text-sm text-neutral-600 mb-4">During the 7–30 day campaign period, upvote your favorite designs to 
                      help the designer reach their campaign goal. Successful campaigns become available for sale as a Limited Drop when 
                      the campaign ends. You may also pledge a donation to support the designer, but donations do not count toward 
                      purchasing the design. 
                      </p>
                    <img src="images/twelve-days-left.png" alt="Vote on Designs" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <div className="text-center p-[5%]">
                    <h2 className="text-xl font-semibold mb-4">3️⃣ Shop the Limited Drop</h2>
                    <p className="text-sm text-neutral-600 mb-4">A campaign is successful when it reaches its vote goal. Successful 
                      designs move to our store and are sold at a steep discount for a limited time, usually 30–60 days.  
                      The discount disappears when the drop ends. </p>
                    <img src="images/about_3.jpg" alt="Make Pledges" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <div className="text-center p-[5%]">
                    <h2 className="text-xl font-semibold mb-4">4️⃣ Keep Supporting Your Favs</h2>
                    <p className="text-sm text-neutral-600 mb-4">When the Limited Drop ends, the product is showcased on our Discover 
                      page and the designer’s profile but is no longer sold in our store. You will be directed to the designer’s 
                      external website to purchase the design thereafter. </p>
                    <img src="/images/study.jpg" alt="Receive Rewards" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-[5%]">
                    <h2 className="text-xl font-semibold mb-4">1️⃣ Launch a Campaign</h2>
                    <p className="text-sm text-neutral-600 mb-4">Upload your designs to the launch a campaign form to share your creative fashion vision with our members. </p>
                    <img src="/images/phoning.png" alt="Launch Campaign" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <div className="text-center p-[5%]">
                    <h2 className="text-xl font-semibold mb-4">2️⃣ Offer Your Products</h2>
                    <p className="text-sm text-neutral-600 mb-4">You can opt in to sell your product in our store as a Limited Drop if your campaign reaches its vote goal. </p>
                    <img src="/images/rack-of-clothes.png" alt="Upload Designs" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <div className="text-center p-[5%]">
                    <h2 className="text-xl font-semibold mb-4">3️⃣ Fulfill Orders</h2>
                    <p className="text-sm text-neutral-600 mb-4">Produce and ship your designs to backers who supported your campaign. 
                      We offer tech pack development and manufacturing services as needed. </p>
                    <img src="/images/package.png" alt="Fulfill Orders" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <div className="text-center p-[5%]">
                    <h2 className="text-xl font-semibold mb-4">4️⃣ Extended Promo Period</h2>
                    <p className="text-sm text-neutral-600 mb-4">Your product will stay visible on our site for an additional 60 days but won't be for sale. Shoppers will be directed to the external site you provide to make a purchase. </p>
                    <img src="images/fourteen-days-left.png" alt="Get Paid" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                </div>
              )}
            </div>
            <div className="max-w-3xl mx-auto">
                            {/* CTA Buttons */}
              <div className="border-t border-neutral-200 mt-8 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">📞</div>
                    <h3 className="font-semibold text-lg">Support</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">ℹ️</div>
                    <h3 className="font-semibold text-lg">FAQs</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/faqs">FAQs</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                    <div className="text-4xl mb-2">✅</div>
                    <h3 className="font-semibold text-lg">Rules</h3>
                  </div>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/rules">Rules</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
