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
  const [searchTerm, setSearchTerm] = useState("");
  const [productsPage, setProductsPage] = useState(1);
  const itemsPerPage = 10;

  // Memoized filtered campaigns (using real data from props)
  const filteredCampaigns = useMemo(
    () => propCampaigns.filter((campaign) => {
      const matchesStatus =
        campaignFilter === "all"
          ? true
          : campaignFilter === "active"
            ? campaign.status === "live" || campaign.status === "active"
            : campaign.status === campaignFilter;

      const searchableText = `${campaign.title ?? ""} ${campaign.status ?? ""}`.toLowerCase();
      const matchesSearch = searchTerm.trim() === "" || searchableText.includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    }),
    [propCampaigns, campaignFilter, searchTerm],
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

  useEffect(() => {
    setProductsPage(1);
  }, [campaignFilter, searchTerm]);

  const totalProductsPages = Math.ceil(tableProducts.length / itemsPerPage);

  // Memoized handlers with useCallback
  const handlePublishCampaign = useCallback((campaignId: string | number) => {
    console.log("Publish campaign", campaignId);
  }, []);

  const handleEditCampaign = useCallback((campaign: Campaign) => {
    console.log("Edit campaign", campaign);
  }, []);

  return (
    <Card className="space-y-3 border-neutral-200 p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-neutral-900">Products History</h2>
      </div>

      <div className="border-b border-neutral-200">
        <div className="flex gap-4 overflow-x-auto pb-2">
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

      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-3 sm:p-4 min-h-[200px]">
        {activeTab === "campaigns" ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-neutral-900">Campaigns</h2>
                <Link href="/launch-campaign">
                  <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-1 h-4 w-4" /> New
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search campaigns"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 sm:min-w-[220px]"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={campaignFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignFilter("all")}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  <Button
                    variant={campaignFilter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignFilter("active")}
                    className="rounded-full"
                  >
                    Active
                  </Button>
                  <Button
                    variant={campaignFilter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignFilter("completed")}
                    className="rounded-full"
                  >
                    Completed
                  </Button>
                  <Button
                    variant={campaignFilter === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignFilter("draft")}
                    className="rounded-full"
                  >
                    Draft
                  </Button>
                </div>
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
                      className="overflow-hidden border border-neutral-200 transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col">
                        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300">
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
                        <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                          <div>
                            <h3 className="mb-2 text-base font-semibold text-neutral-900">{campaign.title}</h3>

                            <div className="mb-2">
                              <div className="mb-1 flex items-center justify-between text-xs text-neutral-700">
                                <span>
                                  ${((campaign.current_funding || campaign.funded_amount || 0)).toLocaleString()} of ${campaign.funding_goal?.toLocaleString() || "0"}
                                </span>
                                <span className="font-semibold text-blue-600">
                                  {Math.round(fundingPercentage)}%
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-neutral-200">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                                  style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="rounded-lg bg-neutral-50 p-2">
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">Status</p>
                                <p className="font-semibold text-neutral-900 capitalize">
                                  {campaign.status === "live" ? "Live" : campaign.status}
                                </p>
                              </div>
                              <div className="rounded-lg bg-neutral-50 p-2">
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">Backers</p>
                                <p className="font-semibold text-blue-600">
                                  {(campaign.backers_count || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button variant="outline" className="flex-1 rounded-full">
                              Details
                            </Button>
                            {campaign.status === "draft" && (
                              <Button
                                className="flex-1 rounded-full bg-green-600 hover:bg-green-700"
                                onClick={() => handlePublishCampaign(campaign.id)}
                              >
                                <Flame className="mr-1 h-4 w-4" /> Publish
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="rounded-full"
                              onClick={() => handleEditCampaign(campaign)}
                            >
                              <Edit2 className="mr-1 h-4 w-4" /> Edit
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
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-neutral-900">Products Table</h2>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 md:max-w-xs"
                />
                {lastUpdated && (
                  <p className="text-xs text-neutral-500">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                )}
              </div>
            </div>

            {tableProducts.length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed border-neutral-300 bg-neutral-50">
                <Target className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 font-semibold">No products found</p>
              </Card>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-neutral-200">
                  <table className="w-full min-w-[560px] text-sm">
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
                  <div className="flex items-center justify-between border-t border-neutral-200 py-3">
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

