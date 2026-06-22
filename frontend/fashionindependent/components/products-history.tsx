"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Flame, Edit2, Target, Loader2 } from "lucide-react";

const tabs = [
  { id: "campaigns", label: "Campaigns" },
  { id: "all-products", label: "Products Table" },
];

interface Campaign {
  id: string | number;
  title: string;
  status: string;
  current_funding?: number;
  funding_goal?: number;
  funded_amount?: number;
  backers_count?: number;
  days_active?: number;
  created_at: string;
  product_images?: any[];
  upvote_count?: number;
}

interface ProductsHistoryProps {
  campaigns?: Campaign[];
}

export function ProductsHistory({ campaigns: propCampaigns = [] }: ProductsHistoryProps) {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [campaignFilter, setCampaignFilter] = useState<"all" | "active" | "completed" | "draft">("all");
  const [productsPage, setProductsPage] = useState(1);
  const itemsPerPage = 10;

  // Memoized filtered campaigns (using real data from props)
  const filteredCampaigns = useMemo(
    () => propCampaigns.filter((campaign) => {
      if (campaignFilter === "all") return true;
      // Map API statuses to filter status
      if (campaignFilter === "active") return campaign.status === "live" || campaign.status === "active";
      return campaign.status === campaignFilter;
    }),
    [propCampaigns, campaignFilter],
  );

  // Transform campaigns to products table format (memoized)
  const tableProducts = useMemo(
    () => filteredCampaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.title,
      type: "campaign",
      timestamp: campaign.created_at,
      totalVotes: campaign.upvote_count || 0,
      totalSales: campaign.funded_amount || 0,
    })),
    [filteredCampaigns],
  );

  // Paginated table products (memoized)
  const paginatedProducts = useMemo(() => {
    const startIdx = (productsPage - 1) * itemsPerPage;
    return tableProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [tableProducts, productsPage]);

  const totalProductsPages = Math.ceil(tableProducts.length / itemsPerPage);

  // Memoized handlers with useCallback
  const handlePublishCampaign = useCallback((campaignId: string | number) => {
    console.log("Publish campaign", campaignId);
  }, []);

  const handleEditCampaign = useCallback((campaign: Campaign) => {
    console.log("Edit campaign", campaign);
  }, []);

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Products History</h2>
        </div>
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
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Campaigns</h2>
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
                  const fundingPercentage = campaign.funding_goal
                    ? ((campaign.current_funding || campaign.funded_amount || 0) / campaign.funding_goal) * 100
                    : 0;

                  return (
                    <Card
                      key={campaign.id}
                      className="overflow-hidden hover:shadow-lg transition-all border border-neutral-200"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 flex-shrink-0 relative overflow-hidden">
                          {campaign.product_images && campaign.product_images.length > 0 ? (
                            (() => {
                              const img = campaign.product_images[0];
                              let imagePath = typeof img === "object" ? img.path || img.url : img;

                              if (imagePath?.includes("storage/")) {
                                imagePath = imagePath.substring(imagePath.indexOf("storage/") + 8);
                              }

                              const apiImageUrl = `/api/storage/${imagePath}`;

                              return (
                                <img
                                  src={apiImageUrl}
                                  alt={campaign.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              );
                            })()
                          ) : (
                            <img
                              src="/placeholder.svg"
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <div
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                              campaign.status === "live" || campaign.status === "active"
                                ? "bg-blue-100 text-blue-800"
                                : campaign.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {campaign.status === "live" ? "Live" : campaign.status === "active" ? "Active" : campaign.status === "completed" ? "Completed" : "Draft"}
                          </div>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-3">{campaign.title}</h3>

                            <div className="mb-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-neutral-700">
                                  ${((campaign.current_funding || campaign.funded_amount || 0)).toLocaleString()} of ${campaign.funding_goal?.toLocaleString() || "0"}
                                </span>
                                <span className="text-sm font-bold text-blue-600">
                                  {Math.round(fundingPercentage)}%
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 rounded-full h-2.5">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                                  style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div className="bg-neutral-50 p-3 rounded-lg">
                                <p className="text-xs text-neutral-600 font-semibold mb-1">Status</p>
                                <p className="text-sm font-bold text-neutral-900 capitalize">
                                  {campaign.status === "live" ? "Live" : campaign.status}
                                </p>
                              </div>
                              <div className="bg-neutral-50 p-3 rounded-lg">
                                <p className="text-xs text-neutral-600 font-semibold mb-1">Backers</p>
                                <p className="text-sm font-bold text-blue-600">
                                  {(campaign.backers_count || 0).toLocaleString()}
                                </p>
                              </div>
                              <div className="bg-neutral-50 p-3 rounded-lg">
                                <p className="text-xs text-neutral-600 font-semibold mb-1">Created</p>
                                <p className="text-sm font-bold text-neutral-700">
                                  {new Date(campaign.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 pt-4 flex-wrap">
                            <Button variant="outline" className="flex-1 rounded-lg">
                              View Details
                            </Button>
                            {campaign.status === "draft" && (
                              <Button
                                className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg"
                                onClick={() => handlePublishCampaign(campaign.id)}
                              >
                                <Flame className="w-4 h-4 mr-1" /> Publish
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="rounded-lg"
                              onClick={() => handleEditCampaign(campaign)}
                            >
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
        ) : activeTab === "all-products" ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Products Table</h2>
              {lastUpdated && (
                <p className="text-xs text-neutral-500 mb-4">Last updated: {lastUpdated.toLocaleTimeString()}</p>
              )}
            </div>

            {tableProducts.length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed border-neutral-300 bg-neutral-50">
                <Target className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 font-semibold">No products found</p>
              </Card>
            ) : (
              <>
                <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-neutral-900">Date</th>
                        <th className="px-6 py-3 text-left font-semibold text-neutral-900">Product Name</th>
                        <th className="px-6 py-3 text-left font-semibold text-neutral-900">Type</th>
                        <th className="px-6 py-3 text-right font-semibold text-neutral-900">Total Votes</th>
                        <th className="px-6 py-3 text-right font-semibold text-neutral-900">Total Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-neutral-700">
                            {new Date(product.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-medium text-neutral-900">{product.name}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              Campaign
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-neutral-700 font-medium">
                            {product.totalVotes.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-neutral-700 font-medium">
                            ${product.totalSales.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalProductsPages > 1 && (
                  <div className="flex items-center justify-between py-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                      disabled={productsPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-neutral-600">
                      Page {productsPage} of {totalProductsPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setProductsPage((p) => Math.min(totalProductsPages, p + 1))}
                      disabled={productsPage === totalProductsPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

