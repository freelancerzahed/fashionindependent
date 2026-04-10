import type { Product } from "@/lib/api/types"

// Mock product data with real image URLs
const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Classic White T-Shirt",
    description:
      "A timeless classic, this comfortable white t-shirt is made from 100% organic cotton. Perfect for everyday wear or layering.",
    price: 29.99,
    originalPrice: 35.0,
    currency: "USD",
    category: "Apparel",
    subcategory: "T-Shirts",
    brand: "EcoWear",
    images: [
      "https://images.unsplash.com/photo-1618677737822-371777797103?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1622470706969-ef294515117b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1622470706969-ef294515117b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Grey"],
    tags: ["organic", "cotton", "basic", "unisex"],
    inStock: true,
    stockQuantity: 150,
    rating: 4.5,
    reviewCount: 120,
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-10-20T14:30:00Z",
  },
  {
    id: "prod2",
    name: "Premium Noise-Cancelling Headphones",
    description:
      "Experience unparalleled audio quality with these premium noise-cancelling headphones. Perfect for travel, work, or relaxation.",
    price: 199.99,
    originalPrice: 249.99,
    currency: "USD",
    category: "Electronics",
    subcategory: "Audio",
    brand: "SoundBlast",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1585298723682-7ad9dc846748?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    sizes: [],
    colors: ["Black", "Silver", "Rose Gold"],
    tags: ["wireless", "bluetooth", "audio", "travel"],
    inStock: true,
    stockQuantity: 75,
    rating: 4.8,
    reviewCount: 85,
    createdAt: "2023-02-01T11:00:00Z",
    updatedAt: "2023-10-21T09:00:00Z",
  },
  {
    id: "prod3",
    name: "Ergonomic Mesh Office Chair",
    description:
      "Designed for maximum comfort and support during long working hours. Features adjustable lumbar support, armrests, and headrest.",
    price: 349.99,
    currency: "USD",
    category: "Home Office",
    subcategory: "Furniture",
    brand: "ComfyDesk",
    images: [
      "https://images.unsplash.com/photo-1591668970109-0060011d3484?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1591668970109-0060011d3484?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1591668970109-0060011d3484?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    sizes: [],
    colors: ["Black", "Grey", "Blue"],
    tags: ["office", "chair", "ergonomic", "comfort"],
    inStock: true,
    stockQuantity: 30,
    rating: 4.2,
    reviewCount: 45,
    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2023-10-19T16:00:00Z",
  },
  {
    id: "prod4",
    name: "Advanced Fitness Smartwatch",
    description:
      "Track your fitness, monitor your health, and stay connected with this sleek and advanced smartwatch. Features GPS, heart rate tracking, and long battery life.",
    price: 149.99,
    currency: "USD",
    category: "Electronics",
    subcategory: "Wearables",
    brand: "FitPulse",
    images: [
      "https://images.unsplash.com/photo-1579586337278-f29a071f0251?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1579586337278-f29a071f0251?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1579586337278-f29a071f0251?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    sizes: [],
    colors: ["Black", "Rose Gold", "Space Grey"],
    tags: ["fitness", "health", "smartwatch", "wearable"],
    inStock: true,
    stockQuantity: 90,
    rating: 4.6,
    reviewCount: 90,
    createdAt: "2023-04-05T14:00:00Z",
    updatedAt: "2023-10-22T10:00:00Z",
  },
  {
    id: "prod5",
    name: "Elegant Leather Handbag",
    description:
      "A sophisticated and spacious handbag crafted from premium genuine leather. Perfect for any occasion, from daily use to special events.",
    price: 249.99,
    originalPrice: 299.99,
    currency: "USD",
    category: "Accessories",
    subcategory: "Bags",
    brand: "ChicCarry",
    images: [
      "https://images.unsplash.com/photo-1566150905421-ce7b99116179?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1566150905421-ce7b99116179?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1566150905421-ce7b99116179?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    sizes: [],
    colors: ["Black", "Brown", "Burgundy"],
    tags: ["leather", "handbag", "fashion", "luxury"],
    inStock: true,
    stockQuantity: 25,
    rating: 4.7,
    reviewCount: 60,
    createdAt: "2023-05-12T10:00:00Z",
    updatedAt: "2023-10-23T11:00:00Z",
  },
  {
    id: "prod6",
    name: "Organic Cotton Hoodie",
    description:
      "Stay cozy and stylish with this soft organic cotton hoodie. Features a relaxed fit and a front pouch pocket.",
    price: 59.99,
    currency: "USD",
    category: "Apparel",
    subcategory: "Hoodies & Sweatshirts",
    brand: "EcoWear",
    images: [
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9aa5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9aa5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9aa5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Grey", "Forest Green"],
    tags: ["organic", "cotton", "hoodie", "casual"],
    inStock: true,
    stockQuantity: 100,
    rating: 4.4,
    reviewCount: 70,
    createdAt: "2023-06-01T09:00:00Z",
    updatedAt: "2023-10-24T15:00:00Z",
  },
  {
    id: "prod7",
    name: "Portable Bluetooth Speaker",
    description:
      "Take your music anywhere with this compact and powerful portable Bluetooth speaker. Delivers rich sound and deep bass.",
    price: 79.99,
    currency: "USD",
    category: "Electronics",
    subcategory: "Audio",
    brand: "SoundBlast",
    images: [
      "https://images.unsplash.com/photo-1545127398-1d0716992318?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1545127398-1d0716992318?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1545127398-1d0716992318?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    sizes: [],
    colors: ["Black", "Red", "Blue"],
    tags: ["bluetooth", "speaker", "portable", "music"],
    inStock: true,
    stockQuantity: 60,
    rating: 4.3,
    reviewCount: 110,
    createdAt: "2023-07-01T10:00:00Z",
    updatedAt: "2023-10-25T12:00:00Z",
  },
  {
    id: "prod8",
    name: "Minimalist Leather Wallet",
    description:
      "A sleek and minimalist wallet crafted from genuine leather, designed to hold your essentials without bulk.",
    price: 49.99,
    currency: "USD",
    category: "Accessories",
    subcategory: "Wallets",
    brand: "ChicCarry",
    images: [
      "https://images.unsplash.com/photo-1584917865442-ce84550965c5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1584917865442-ce84550965c5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1584917865442-ce84550965c5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    sizes: [],
    colors: ["Black", "Brown", "Tan"],
    tags: ["leather", "wallet", "minimalist", "mens"],
    inStock: true,
    stockQuantity: 80,
    rating: 4.6,
    reviewCount: 55,
    createdAt: "2023-08-01T11:00:00Z",
    updatedAt: "2023-10-26T09:00:00Z",
  },
]

export const productUtils = {
  getAllProducts: (): Product[] => mockProducts,

  getProductById: (id: string): Product | undefined => {
    return mockProducts.find((product) => product.id === id)
  },

  getProductsByCategory: (category: string): Product[] => {
    return mockProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  },

  getProductsByBrand: (brand: string): Product[] => {
    return mockProducts.filter((product) => product.brand.toLowerCase() === brand.toLowerCase())
  },

  searchProducts: (query: string, limit = 10): Product[] => {
    const lowerCaseQuery = query.toLowerCase()
    return mockProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery) ||
          product.brand.toLowerCase().includes(lowerCaseQuery) ||
          product.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)),
      )
      .slice(0, limit)
  },

  filterProducts: (filters: {
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    sizes?: string[]
    colors?: string[]
    tags?: string[]
    inStock?: boolean
  }): Product[] => {
    return mockProducts.filter((product) => {
      if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false
      }
      if (filters.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false
      }
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false
      }
      if (filters.sizes && filters.sizes.length > 0 && !filters.sizes.some((size) => product.sizes.includes(size))) {
        return false
      }
      if (
        filters.colors &&
        filters.colors.length > 0 &&
        !filters.colors.some((color) => product.colors.includes(color))
      ) {
        return false
      }
      if (filters.tags && filters.tags.length > 0 && !filters.tags.some((tag) => product.tags.includes(tag))) {
        return false
      }
      if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
        return false
      }
      return true
    })
  },

  getCategories: (): string[] => {
    const categories = new Set<string>()
    mockProducts.forEach((product) => categories.add(product.category))
    return Array.from(categories)
  },

  getBrands: (): string[] => {
    const brands = new Set<string>()
    mockProducts.forEach((product) => brands.add(product.brand))
    return Array.from(brands)
  },

  getPriceRange: (): { min: number; max: number } => {
    if (mockProducts.length === 0) return { min: 0, max: 0 }
    const prices = mockProducts.map((p) => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  },
}

// A cached version of productUtils for client-side filtering/searching
// In a real application, this would likely involve server-side API calls
export const cachedProductUtils = {
  searchProducts: (query: string, limit = 10): Product[] => {
    return productUtils.searchProducts(query, limit)
  },
  filterProducts: (filters: {
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    sizes?: string[]
    colors?: string[]
    tags?: string[]
    inStock?: boolean
  }): Product[] => {
    return productUtils.filterProducts(filters)
  },
}

/* -------------------------------------------------------------------------- */
/*  Legacy named exports (back-compat with existing front-end code)           */
/* -------------------------------------------------------------------------- */

/**
 * Default items per page when paginating products.
 * Older pages/components import this constant.
 */
export const PRODUCTS_PER_PAGE = 12

/**
 * Alias to the full products array used by earlier components.
 */
export const products = mockProducts // Re-added this export

/**
 * Flat list of product categories (with “All” prepended) used by filters.
 * Keeps existing category-filter UI working without changes.
 */
export const categories = ["All", ...productUtils.getCategories()]

export default mockProducts
