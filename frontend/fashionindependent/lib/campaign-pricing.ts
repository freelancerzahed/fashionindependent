export function getCampaignPrice(campaign: Record<string, any> | null | undefined): number {
  if (!campaign) return 0

  const candidateValues = [
    campaign.sale_price,
    campaign.product_price,
    campaign.retail_price,
    campaign.price,
    campaign.price,
    campaign.discounted_price,
    campaign.buy_now_price,
    campaign.funding_goal,
    campaign.current_funding,
  ]

  for (const value of candidateValues) {
    const numericValue = typeof value === "string" ? Number.parseFloat(value) : Number(value)

    if (Number.isFinite(numericValue) && numericValue > 0) {
      return Math.round(numericValue)
    }
  }

  return 0
}
