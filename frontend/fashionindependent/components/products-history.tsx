"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Plus, Flame, Edit2, Target } from "lucide-react";

const tabs = [
  { id: "all-products", label: "All Products" },
  { id: "campaigns", label: "Campaigns" },
  { id: "active-sales", label: "Active Sales" },
  { id: "closed", label: "Closed" },
];

export function ProductsHistory() {
  const [activeTab, setActiveTab] = useState("all-products");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const [campaignFilter, setCampaignFilter] = useState<"all" | "active" | "completed" | "draft">("all");
  const [loading, setLoading] = useState(false);
  const [viewingCampaignId, setViewingCampaignId] = useState<string | null>(null);

  const products: any[] = useMemo(
    () => [
      {
        id: "product-1",
        name: "Summer Bloom Drop",
        type: "campaign",
        timestamp: "2024-04-02T14:30:00Z",
        totalVotes: 1240,
        totalSales: 18320,
      },
      {
        id: "product-2",
        name: "Minimalist Streetwear",
        type: "drop",
        timestamp: "2024-03-18T09:15:00Z",
        totalVotes: 856,
        totalSales: 12450,
      },
      {
        id: "product-3",
        name: "Neon Nights Collection",
        type: "drop",
        timestamp: "2024-02-20T16:45:00Z",
        totalVotes: 2104,
        totalSales: 27000,
      },
      {
        id: "product-4",
        name: "Urban Explorer Jacket",
        type: "campaign",
        timestamp: "2024-03-10T11:20:00Z",
        totalVotes: 945,
        totalSales: 8920,
      },
      {
        id: "product-5",
        name: "Eco-Friendly Tees",
        type: "drop",
        timestamp: "2024-01-15T13:55:00Z",
        totalVotes: 1523,
        totalSales: 15780,
      },
    ],
    [],
  );

  const campaigns: any[] = useMemo(
    () => [
      {
        id: "campaign-1",
        title: "Summer Bloom Drop",
        status: "live",
        current_funding: 18320,
        funding_goal: 25000,
        days_active: 12,
        created_at: "2024-04-02T00:00:00Z",
        product_images: ["/placeholder.svg"],
      },
      {
        id: "campaign-2",
        title: "Minimalist Streetwear",
        status: "draft",
        current_funding: 0,
        funding_goal: 18000,
        days_active: 0,
        created_at: "2024-03-18T00:00:00Z",
        product_images: ["/placeholder.svg"],
      },
      {
        id: "campaign-3",
        title: "Neon Nights Collection",
        status: "completed",
        current_funding: 27000,
        funding_goal: 24000,
        days_active: 35,
        created_at: "2024-02-20T00:00:00Z",
        product_images: ["/placeholder.svg"],
      },
    ],
    [],
  );

  const filteredCampaigns = useMemo(
    () => campaigns.filter((campaign) => {
      if (campaignFilter === "all") return true;
      return campaignFilter === campaign.status;
    }),
    [campaignFilter, campaigns],
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 500);
  };

  const fetchCampaigns = (refresh = false) => {
    setLoading(true);
    window.setTimeout(() => {
      if (refresh) {
        setLastUpdated(new Date());
      }
      setLoading(false);
    }, 500);
  };

  const handlePublishCampaign = (campaignId: string) => {
    console.log("Publish campaign", campaignId);
  };

  const handleEditCampaign = (campaign: any) => {
    console.log("Edit campaign", campaign);
  };

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Products History</h2>
          {lastUpdated && (
            <p className="text-xs text-neutral-500 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="border-b">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
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

      <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-8 min-h-[200px]">
        {activeTab === "campaigns" ? (
          <>
            {/* All Campaigns Section */}
            <div className="space-y-6 pt-8 border-t border-neutral-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">All Campaigns</h2>
                  {lastUpdated && (
                    <p className="text-xs text-neutral-500 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={campaignFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignFilter("all")}
                    className="rounded-lg"
                  >
                    All
                  </Button>
                  <Button
                    variant={campaignFilter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignFilter("active")}
                    className="rounded-lg"
                  >
                    Active
                  </Button>
                  <Button
                    variant={campaignFilter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignFilter("completed")}
                    className="rounded-lg"
                  >
                    Completed
                  </Button>
                  <Button
                    variant={campaignFilter === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignFilter("draft")}
                    className="rounded-lg"
                  >
                    Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-lg"
                    onClick={() => fetchCampaigns(true)}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Link href="/launch-campaign">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                      <Plus className="w-4 h-4 mr-1" /> New
                    </Button>
                  </Link>
                </div>
              </div>

              {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredCampaigns.map((campaign) => {
                    const fundingPercentage = campaign.funding_goal ? (campaign.current_funding || 0) / campaign.funding_goal * 100 : 0;

                    return (
                      <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-all border border-neutral-200">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-48 h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 flex-shrink-0 relative overflow-hidden">
                            {campaign.product_images && campaign.product_images.length > 0 ? (
                              (() => {
                                const img = campaign.product_images[0];
                                let imagePath = typeof img === "object" ? (img.path || img.url) : img;

                                if (imagePath?.includes("storage/")) {
                                  imagePath = imagePath.substring(imagePath.indexOf("storage/") + 8);
                                }

                                const apiImageUrl = `/api/storage/${imagePath}`;

                                return (
                                  <img
                                    src={apiImageUrl}
                                    alt={campaign.title}
                                    className="w-full h-full object-cover"
                                    style={{ display: "block" }}
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.svg";
                                    }}
                                  />
                                );
                              })()
                            ) : (
                              <>
                                <img src="/placeholder.svg" alt={campaign.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-xs text-neutral-500">
                                  No images (product_images length: {campaign.product_images?.length || 0})
                                </div>
                              </>
                            )}
                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${campaign.status === "live" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                              {campaign.status === "live" ? "Live" : "Draft"}
                            </div>
                          </div>
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-xl font-bold">{campaign.title}</h3>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${campaign.status === "live" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                                  {campaign.status === "live" ? "Live" : "Draft"}
                                </span>
                              </div>

                              <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-semibold text-neutral-700">${(campaign.current_funding || 0).toLocaleString()} of ${campaign.funding_goal?.toLocaleString() || "0"}</span>
                                  <span className="text-sm font-bold text-blue-600">{Math.round(fundingPercentage)}%</span>
                                </div>
                                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                                    style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-neutral-50 p-3 rounded-lg">
                                  <p className="text-xs text-neutral-600 font-semibold mb-1">Status</p>
                                  <p className="text-lg font-bold text-neutral-900 capitalize">{campaign.status}</p>
                                </div>
                                <div className="bg-neutral-50 p-3 rounded-lg">
                                  <p className="text-xs text-neutral-600 font-semibold mb-1">Days Left</p>
                                  <p className="text-lg font-bold text-blue-600">{campaign.days_active || 0}</p>
                                </div>
                                <div className="bg-neutral-50 p-3 rounded-lg">
                                  <p className="text-xs text-neutral-600 font-semibold mb-1">Created</p>
                                  <p className="text-lg font-bold text-neutral-700">{new Date(campaign.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 pt-4 flex-wrap">
                              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setViewingCampaignId(campaign.id)}>
                                View Product
                              </Button>
                              {campaign.status === "draft" && (
                                <Button className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg" onClick={() => handlePublishCampaign(campaign.id)}>
                                  <Flame className="w-4 h-4 mr-1" /> Publish
                                </Button>
                              )}
                              <Button variant="outline" className="rounded-lg" onClick={() => handleEditCampaign(campaign)}>
                                <Edit2 className="w-4 h-4 mr-1" /> Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-12 text-center border-2 border-dashed border-neutral-300 bg-neutral-50">
                  <Target className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                  <p className="text-neutral-600 mb-2 text-lg font-semibold">No campaigns found</p>
                  <p className="text-neutral-500 mb-6">Try adjusting your filters or launch a new campaign</p>
                  <Link href="/launch-campaign">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" /> Create Campaign
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </>
        ) : activeTab === "all-products" ? (
          <>
            {/* All Products Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">All Products</h2>
                {lastUpdated && (
                  <p className="text-xs text-neutral-500 mb-4">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                )}
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-neutral-900">Timestamp</th>
                      <th className="px-6 py-3 text-left font-semibold text-neutral-900">Product Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-neutral-900">Type</th>
                      <th className="px-6 py-3 text-right font-semibold text-neutral-900">Total Votes</th>
                      <th className="px-6 py-3 text-right font-semibold text-neutral-900">Total Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 text-neutral-700">
                            {new Date(product.timestamp).toLocaleDateString()} {new Date(product.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 font-medium text-neutral-900">{product.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.type === "campaign"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {product.type === "campaign" ? "Campaign" : "Drop"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-neutral-700 font-medium">
                            {product.totalVotes.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-neutral-700 font-medium">
                            ${product.totalSales.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-600">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-neutral-600">Select another tab to see content.</div>
        )}
      </div>
    </Card>
  );
}
