"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAffiliate } from "@/lib/affiliate-context"
import { useState } from "react"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export default function InfluencerManagementPage() {
  const { affiliates, updateAffiliateStatus } = useAffiliate()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAffiliates = affiliates.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingCount = affiliates.filter((a) => a.status === "pending").length
  const approvedCount = affiliates.filter((a) => a.status === "approved").length
  const rejectedCount = affiliates.filter((a) => a.status === "rejected").length

  const handleApprove = (affiliateId: string) => {
    updateAffiliateStatus(affiliateId, "approved")
  }

  const handleReject = (affiliateId: string) => {
    updateAffiliateStatus(affiliateId, "rejected")
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Influencer Management</h1>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Approved Influencers</p>
              <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            </Card>
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Influencers</h2>
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Influencers</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Audience Size</th>
                    <th className="text-left py-3 px-4">Earnings</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAffiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{affiliate.name}</td>
                      <td className="py-3 px-4">{affiliate.email}</td>
                      <td className="py-3 px-4">{affiliate.audienceSize?.toLocaleString() || "N/A"}</td>
                      <td className="py-3 px-4">${affiliate.totalEarnings}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {affiliate.status === "approved" && (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">Approved</span>
                            </>
                          )}
                          {affiliate.status === "pending" && (
                            <>
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm text-yellow-600">Pending</span>
                            </>
                          )}
                          {affiliate.status === "rejected" && (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600">Rejected</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {affiliate.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="default" onClick={() => handleApprove(affiliate.id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(affiliate.id)}>
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
