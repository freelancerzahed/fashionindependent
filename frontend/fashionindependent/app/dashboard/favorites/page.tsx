"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Trash2, Loader2 } from "lucide-react"
import { BACKEND_URL } from "@/config"

export default function FavoritesPage() {
  const { user, token } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFavorites = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      // Try to fetch favorites from API
      const response = await fetch(`${BACKEND_URL}/favorites`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status && Array.isArray(data.data)) {
          const favoritesList = data.data.map((favorite: any) => ({
            id: favorite.id,
            campaignId: favorite.campaign_id,
            campaignTitle: favorite.campaign?.title || "Unknown Campaign",
            creatorName: favorite.campaign?.creator?.name || "Unknown Creator",
            description: favorite.campaign?.description || "",
            image: favorite.campaign?.image || "/placeholder.svg",
            fundingGoal: favorite.campaign?.funding_goal || 0,
            fundedAmount: favorite.campaign?.funded_amount || 0,
            daysRemaining: favorite.campaign?.days_remaining || 0,
            status: favorite.campaign?.status || "active",
          }))

          setFavorites(favoritesList)
        }
      } else {
        // If API doesn't support favorites yet, show empty state
        setFavorites([])
      }
    } catch (err) {
      console.error("Error fetching favorites:", err)
      // Don't show error, just empty state for now
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [token])

  const removeFavorite = async (campaignId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/favorites/${campaignId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setFavorites(favorites.filter((f) => f.campaignId !== campaignId))
      }
    } catch (err) {
      console.error("Error removing favorite:", err)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Favorites</h1>
        <p className="text-neutral-600">
          {favorites.length} {favorites.length === 1 ? "campaign" : "campaigns"} saved
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-200 flex flex-col bg-white">
              {/* Campaign Image */}
              <div className="relative h-48 bg-neutral-100 overflow-hidden group">
                <img
                  src={favorite.image}
                  alt={favorite.campaignTitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => removeFavorite(favorite.campaignId)}
                    className="bg-white rounded-full p-2.5 shadow-md hover:bg-red-50 hover:shadow-lg transition-all duration-200"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg text-neutral-900 line-clamp-2 mb-2">
                  {favorite.campaignTitle}
                </h3>
                <p className="text-sm text-neutral-600 font-medium mb-3">{favorite.creatorName}</p>
                <p className="text-sm text-neutral-600 line-clamp-2 mb-5 flex-1">
                  {favorite.description}
                </p>

                {/* Funding Progress */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-neutral-900">
                      ${favorite.fundedAmount.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                      {Math.round((favorite.fundedAmount / favorite.fundingGoal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (favorite.fundedAmount / favorite.fundingGoal) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Days Remaining */}
                {favorite.daysRemaining > 0 && (
                  <p className="text-xs font-semibold text-blue-600 mb-5 bg-blue-50 px-3 py-1.5 rounded-full inline-block">
                    ⏱ {favorite.daysRemaining} days remaining
                  </p>
                )}

                {/* CTA Button */}
                <Button asChild className="w-full mt-auto bg-blue-600 hover:bg-blue-700">
                  <Link href={`/discover/${favorite.campaignId}`}>View Campaign</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="mb-6">
            <Heart className="h-20 w-20 text-neutral-200 mx-auto" />
          </div>
          <p className="text-lg text-neutral-600 mb-8">You haven't saved any campaigns yet.</p>
          <Button asChild className="px-8">
            <Link href="/discover">Discover Campaigns</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
