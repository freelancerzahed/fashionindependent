// Mock campaign data
export interface Campaign {
  id: string
  title: string
  designer: string
  image: string
  category: string
  subcategory: string
  description: string
  fundingGoal: number
  fundedAmount: number
  backers: number
  daysRemaining: number
  status: "active" | "closing-soon" | "funded" | "ended"
  pledgeOptions: PledgeOption[]
  createdAt: Date
}

export interface PledgeOption {
  id: string
  amount: number
  description: string
  quantity: number
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  image: string
  publishedAt: Date
  category: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "backer" | "creator" | "admin"
  avatar?: string
  createdAt: Date
}

export interface Pledge {
  id: string
  userId: string
  campaignId: string
  amount: number
  pledgeOptionId: string
  status: "pending" | "completed" | "shipped"
  createdAt: Date
}

// Mock affiliate data
export interface Affiliate {
  id: string
  userId: string
  name: string
  email: string
  website?: string
  socialMedia?: string
  audienceSize?: number
  trackingCode: string
  commissionRate: number
  totalEarnings: number
  totalReferrals: number
  status: "pending" | "approved" | "rejected"
  createdAt: Date
}

export interface AffiliateClick {
  id: string
  affiliateId: string
  campaignId: string
  timestamp: Date
  ipAddress?: string
}

export interface AffiliateCommission {
  id: string
  affiliateId: string
  pledgeId: string
  campaignId: string
  amount: number
  status: "pending" | "paid"
  createdAt: Date
  paidAt?: Date
}

export const mockAffiliates: Affiliate[] = [
  {
    id: "aff-1",
    userId: "influencer-1",
    name: "Fashion Blogger Sarah",
    email: "sarah@fashionblog.com",
    website: "https://fashionblog.com",
    socialMedia: "@fashionblogger",
    audienceSize: 150000,
    trackingCode: "SARAH_FASHION_001",
    commissionRate: 0.1,
    totalEarnings: 450,
    totalReferrals: 45,
    status: "approved",
    createdAt: new Date("2025-09-01"),
  },
  {
    id: "aff-2",
    userId: "influencer-2",
    name: "Style Influencer Marcus",
    email: "marcus@styleinfluencer.com",
    website: "https://styleinfluencer.com",
    socialMedia: "@styleinfluencer",
    audienceSize: 250000,
    trackingCode: "MARCUS_STYLE_001",
    commissionRate: 0.1,
    totalEarnings: 780,
    totalReferrals: 78,
    status: "approved",
    createdAt: new Date("2025-08-15"),
  },
]

export const mockAffiliateCommissions: AffiliateCommission[] = [
  {
    id: "comm-1",
    affiliateId: "aff-1",
    pledgeId: "1",
    campaignId: "1",
    amount: 7.5,
    status: "paid",
    createdAt: new Date("2025-09-20"),
    paidAt: new Date("2025-10-01"),
  },
  {
    id: "comm-2",
    affiliateId: "aff-2",
    pledgeId: "2",
    campaignId: "2",
    amount: 12,
    status: "pending",
    createdAt: new Date("2025-10-10"),
  },
]

export function getAffiliateByTrackingCode(code: string): Affiliate | undefined {
  return mockAffiliates.find((a) => a.trackingCode === code)
}

export function getAffiliateCommissions(affiliateId: string): AffiliateCommission[] {
  return mockAffiliateCommissions.filter((c) => c.affiliateId === affiliateId)
}

export function getAffiliateStats(affiliateId: string) {
  const affiliate = mockAffiliates.find((a) => a.id === affiliateId)
  const commissions = getAffiliateCommissions(affiliateId)
  const paidCommissions = commissions.filter((c) => c.status === "paid")
  const pendingCommissions = commissions.filter((c) => c.status === "pending")

  return {
    affiliate,
    totalEarnings: affiliate?.totalEarnings || 0,
    totalReferrals: affiliate?.totalReferrals || 0,
    paidAmount: paidCommissions.reduce((sum, c) => sum + c.amount, 0),
    pendingAmount: pendingCommissions.reduce((sum, c) => sum + c.amount, 0),
    commissions,
  }
}

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Sustainable Linen Collection",
    designer: "Emma Studios",
    image: "/sustainable-linen-fashion-collection.jpg",
    category: "Womenswear",
    subcategory: "Dresses",
    description: "Eco-friendly linen dresses made from organic materials",
    fundingGoal: 5000,
    fundedAmount: 3500,
    backers: 45,
    daysRemaining: 7,
    status: "closing-soon",
    pledgeOptions: [
      { id: "1-1", amount: 50, description: "Early Bird - 30% off", quantity: 20 },
      { id: "1-2", amount: 75, description: "Standard Pledge", quantity: 100 },
      { id: "1-3", amount: 150, description: "VIP Bundle + Exclusive Design", quantity: 10 },
    ],
    createdAt: new Date("2025-09-17"),
  },
  {
    id: "2",
    title: "Minimalist Menswear Line",
    designer: "Urban Threads",
    image: "/minimalist-mens-fashion-clothing.jpg",
    category: "Menswear",
    subcategory: "Shirts",
    description: "Clean, modern menswear with sustainable practices",
    fundingGoal: 8000,
    fundedAmount: 8500,
    backers: 120,
    daysRemaining: 3,
    status: "funded",
    pledgeOptions: [
      { id: "2-1", amount: 60, description: "Single Shirt", quantity: 50 },
      { id: "2-2", amount: 120, description: "Shirt Bundle (2)", quantity: 75 },
      { id: "2-3", amount: 200, description: "Complete Collection", quantity: 25 },
    ],
    createdAt: new Date("2025-08-20"),
  },
  {
    id: "3",
    title: "Kidswear Adventure Series",
    designer: "Little Explorers Co",
    image: "/colorful-kids-clothing-adventure.jpg",
    category: "Kidswear",
    subcategory: "Tops",
    description: "Fun and durable clothing for active kids",
    fundingGoal: 4000,
    fundedAmount: 2100,
    backers: 35,
    daysRemaining: 15,
    status: "active",
    pledgeOptions: [
      { id: "3-1", amount: 35, description: "Single Piece", quantity: 100 },
      { id: "3-2", amount: 65, description: "Mix & Match Set", quantity: 50 },
    ],
    createdAt: new Date("2025-10-02"),
  },
  {
    id: "4",
    title: "Smart Wearables Tech Jacket",
    designer: "TechStyle Innovations",
    image: "/smart-tech-jacket-wearable.jpg",
    category: "Wearables",
    subcategory: "Jackets",
    description: "Jacket with integrated temperature control and health monitoring",
    fundingGoal: 15000,
    fundedAmount: 12000,
    backers: 200,
    daysRemaining: 10,
    status: "active",
    pledgeOptions: [
      { id: "4-1", amount: 150, description: "Early Bird Special", quantity: 30 },
      { id: "4-2", amount: 200, description: "Standard Edition", quantity: 100 },
      { id: "4-3", amount: 300, description: "Premium + Accessories", quantity: 20 },
    ],
    createdAt: new Date("2025-09-25"),
  },
]

// Mock blog posts
export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "sustainable-fashion-future",
    title: "The Future of Sustainable Fashion",
    excerpt: "Discover how independent designers are leading the sustainable fashion revolution.",
    content: `Sustainable fashion is no longer a niche market. Independent designers are at the forefront of this movement, creating beautiful pieces that don't compromise on environmental responsibility.

From organic cotton to recycled materials, these creatives are proving that style and sustainability can go hand in hand. The Fashion Independent platform supports these designers by connecting them directly with conscious consumers who value quality and ethics.

Learn how you can support the sustainable fashion movement by backing campaigns from designers who care about our planet.`,
    author: "Sarah Chen",
    image: "/sustainable-fashion-future.jpg",
    publishedAt: new Date("2025-10-15"),
    category: "Sustainability",
  },
  {
    id: "2",
    slug: "designer-spotlight-emma-studios",
    title: "Designer Spotlight: Emma Studios",
    excerpt: "Meet Emma, the creative behind the viral Sustainable Linen Collection.",
    content: `Emma Studios has been making waves in the fashion industry with their commitment to sustainable practices and timeless design. Starting from a small studio in Brooklyn, Emma has grown her brand through direct customer support and crowdfunding.

Her latest collection features organic linen pieces that are both beautiful and environmentally conscious. Each piece is carefully crafted to ensure quality and longevity, reducing the need for fast fashion replacements.

Discover Emma's journey and support her latest campaign on The Fashion Independent.`,
    author: "Marcus Johnson",
    image: "/fashion-designers-studio.jpg",
    publishedAt: new Date("2025-10-10"),
    category: "Designer Stories",
  },
  {
    id: "3",
    slug: "how-to-support-indie-designers",
    title: "How to Support Independent Designers",
    excerpt: "A guide to backing campaigns and supporting the next generation of fashion talent.",
    content: `Supporting independent designers has never been easier. Through crowdfunding platforms like The Fashion Independent, you can directly impact the careers of talented creatives.

When you back a campaign, you're not just buying a product—you're investing in someone's dream. You're helping them bring their vision to life and proving that there's a market for quality, thoughtfully-designed fashion.

Here are some tips for supporting indie designers: Research the designer's background, read reviews from other backers, understand the production timeline, and share campaigns with friends who might be interested.`,
    author: "Jessica Martinez",
    image: "/fashion-community-support.jpg",
    publishedAt: new Date("2025-10-05"),
    category: "Community",
  },
]

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "backer@example.com",
    name: "Alex Thompson",
    role: "backer",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    email: "creator@example.com",
    name: "Emma Studios",
    role: "creator",
    createdAt: new Date("2025-02-20"),
  },
]

// Mock pledges
export const mockPledges: Pledge[] = [
  {
    id: "1",
    userId: "1",
    campaignId: "1",
    amount: 75,
    pledgeOptionId: "1-2",
    status: "completed",
    createdAt: new Date("2025-09-20"),
  },
  {
    id: "2",
    userId: "1",
    campaignId: "2",
    amount: 120,
    pledgeOptionId: "2-2",
    status: "pending",
    createdAt: new Date("2025-10-10"),
  },
]

export interface TechPack {
  id: string
  name: string
  price: number
  quantity: number
  description: string
  features: string[]
  createdAt: Date
}

export interface TechPackPurchase {
  id: string
  userId: string
  techPackId: string
  quantity: number
  totalPrice: number
  status: "pending" | "completed" | "downloaded"
  downloadUrl?: string
  createdAt: Date
}

export const mockTechPacks: TechPack[] = [
  {
    id: "tp-1",
    name: "Single Tech Pack",
    price: 59,
    quantity: 1,
    description: "Perfect for individual designers starting their first collection",
    features: [
      "Complete technical specifications",
      "Measurement charts",
      "Material sourcing guide",
      "Production timeline",
      "Quality control checklist",
    ],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "tp-3",
    name: "Bundle - 3 Tech Packs",
    price: 159,
    quantity: 3,
    description: "Great for designers launching multiple product lines",
    features: [
      "3 complete technical specifications",
      "Customized measurement charts",
      "Advanced material sourcing guide",
      "Production timeline optimization",
      "Quality control templates",
      "Priority support",
    ],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "tp-5",
    name: "Bundle - 5 Tech Packs",
    price: 299,
    quantity: 5,
    description: "Best value for established designers with multiple collections",
    features: [
      "5 complete technical specifications",
      "Customized measurement charts",
      "Advanced material sourcing guide",
      "Production timeline optimization",
      "Quality control templates",
      "Priority support",
      "Manufacturing consultation",
      "Lifetime updates",
    ],
    createdAt: new Date("2025-01-01"),
  },
]

export const mockTechPackPurchases: TechPackPurchase[] = []

export function getTechPackById(id: string): TechPack | undefined {
  return mockTechPacks.find((tp) => tp.id === id)
}

export function getUserTechPackPurchases(userId: string): TechPackPurchase[] {
  return mockTechPackPurchases.filter((p) => p.userId === userId)
}

export function getCampaignById(id: string): Campaign | undefined {
  return mockCampaigns.find((c) => c.id === id)
}

export function getCampaignsByCategory(category: string): Campaign[] {
  return mockCampaigns.filter((c) => c.category === category)
}

export function searchCampaigns(query: string): Campaign[] {
  const lowerQuery = query.toLowerCase()
  return mockCampaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.designer.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery),
  )
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return mockBlogPosts.find((p) => p.slug === slug)
}

export function getFeaturedCampaigns(): Campaign[] {
  return mockCampaigns.slice(0, 3)
}

export function getClosingSoonCampaigns(): Campaign[] {
  return mockCampaigns.filter((c) => c.daysRemaining <= 7 && c.status !== "ended")
}

export interface StoreProduct {
  id: string
  campaignId: string
  name: string
  price: number
  inventory: number
  sold: number
  image: string
  description: string
  category: string
  status: "in-stock" | "low-stock" | "out-of-stock"
  createdAt: Date
}

export interface StoreOrder {
  id: string
  userId: string
  productId: string
  quantity: number
  totalPrice: number
  status: "pending" | "processing" | "shipped" | "delivered"
  shippingAddress?: string
  createdAt: Date
  deliveredAt?: Date
}

export const mockStoreProducts: StoreProduct[] = [
  {
    id: "prod-1",
    campaignId: "1",
    name: "Sustainable Linen Dress",
    price: 89.99,
    inventory: 45,
    sold: 120,
    image: "/sustainable-linen-fashion-collection.jpg",
    description: "Eco-friendly linen dress from the successful Sustainable Linen Collection campaign",
    category: "Womenswear",
    status: "in-stock",
    createdAt: new Date("2025-10-20"),
  },
  {
    id: "prod-2",
    campaignId: "2",
    name: "Minimalist Shirt",
    price: 59.99,
    inventory: 8,
    sold: 95,
    image: "/minimalist-mens-fashion-clothing.jpg",
    description: "Clean, modern menswear shirt from Urban Threads",
    category: "Menswear",
    status: "low-stock",
    createdAt: new Date("2025-10-18"),
  },
  {
    id: "prod-3",
    campaignId: "3",
    name: "Kids Adventure Shirt",
    price: 34.99,
    inventory: 0,
    sold: 78,
    image: "/colorful-kids-clothing-adventure.jpg",
    description: "Fun and durable clothing for active kids",
    category: "Kidswear",
    status: "out-of-stock",
    createdAt: new Date("2025-10-15"),
  },
  {
    id: "prod-4",
    campaignId: "4",
    name: "Smart Tech Jacket",
    price: 199.99,
    inventory: 12,
    sold: 45,
    image: "/smart-tech-jacket-wearable.jpg",
    description: "Jacket with integrated temperature control and health monitoring",
    category: "Wearables",
    status: "in-stock",
    createdAt: new Date("2025-10-10"),
  },
]

export const mockStoreOrders: StoreOrder[] = [
  {
    id: "order-1",
    userId: "1",
    productId: "prod-1",
    quantity: 2,
    totalPrice: 179.98,
    status: "delivered",
    shippingAddress: "123 Main St, New York, NY 10001",
    createdAt: new Date("2025-10-15"),
    deliveredAt: new Date("2025-10-20"),
  },
  {
    id: "order-2",
    userId: "1",
    productId: "prod-2",
    quantity: 1,
    totalPrice: 59.99,
    status: "shipped",
    shippingAddress: "123 Main St, New York, NY 10001",
    createdAt: new Date("2025-10-18"),
  },
]

export function getStoreProductById(id: string): StoreProduct | undefined {
  return mockStoreProducts.find((p) => p.id === id)
}

export function getStoreProductsByCampaign(campaignId: string): StoreProduct[] {
  return mockStoreProducts.filter((p) => p.campaignId === campaignId)
}

export function getUserStoreOrders(userId: string): StoreOrder[] {
  return mockStoreOrders.filter((o) => o.userId === userId)
}

export function getStoreInventoryStatus(): { inStock: number; lowStock: number; outOfStock: number } {
  return {
    inStock: mockStoreProducts.filter((p) => p.status === "in-stock").length,
    lowStock: mockStoreProducts.filter((p) => p.status === "low-stock").length,
    outOfStock: mockStoreProducts.filter((p) => p.status === "out-of-stock").length,
  }
}
