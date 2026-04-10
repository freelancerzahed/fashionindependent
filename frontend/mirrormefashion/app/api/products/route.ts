export const dynamic = "force-dynamic"

import type { NextRequest } from "next/server"
import {
  createMethodHandler,
  createSuccessResponse,
  getPaginationParams,
  createPaginatedResponse,
  ValidationError,
} from "@/lib/api/utils"
import { runMiddleware, rateLimitMiddleware, validateJsonMiddleware } from "@/lib/api/middleware"
import { productDb } from "@/lib/api/database"
import type { CreateProductRequest, ProductFilters } from "@/lib/api/types"

export const GET = createMethodHandler({
  GET: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [(req) => rateLimitMiddleware(req, 200, 15 * 60 * 1000)])

    if (middlewareResult) return middlewareResult

    // Get pagination and filter parameters
    const { page, limit } = getPaginationParams(request)
    const url = new URL(request.url)

    const filters: ProductFilters = {
      category: url.searchParams.get("category") || undefined,
      subcategory: url.searchParams.get("subcategory") || undefined,
      brand: url.searchParams.get("brand") || undefined,
      minPrice: url.searchParams.get("minPrice") ? Number.parseFloat(url.searchParams.get("minPrice")!) : undefined,
      maxPrice: url.searchParams.get("maxPrice") ? Number.parseFloat(url.searchParams.get("maxPrice")!) : undefined,
      sizes: url.searchParams.get("sizes")?.split(",") || undefined,
      colors: url.searchParams.get("colors")?.split(",") || undefined,
      tags: url.searchParams.get("tags")?.split(",") || undefined,
      inStock: url.searchParams.get("inStock") ? url.searchParams.get("inStock") === "true" : undefined,
      search: url.searchParams.get("search") || undefined,
    }

    // Get products from database
    const { products, total } = await productDb.findAll(filters, page, limit)

    // Return paginated response
    const response = createPaginatedResponse(products, total, page, limit, "Products retrieved successfully")
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  },

  POST: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [
      (req) => rateLimitMiddleware(req, 20, 15 * 60 * 1000),
      validateJsonMiddleware,
    ])

    if (middlewareResult) return middlewareResult

    // Parse request body
    const body: CreateProductRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.category || !body.brand) {
      throw new ValidationError("Missing required fields: name, description, price, category, brand")
    }

    // Create product
    const newProduct = await productDb.create(body)

    return createSuccessResponse(newProduct, "Product created successfully", 201)
  },
})
