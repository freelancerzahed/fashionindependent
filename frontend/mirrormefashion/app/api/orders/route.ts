export const dynamic = "force-dynamic"

import type { NextRequest } from "next/server"
import {
  createMethodHandler,
  createSuccessResponse,
  getPaginationParams,
  createPaginatedResponse,
  ValidationError,
} from "@/lib/api/utils"
import { runMiddleware, rateLimitMiddleware, validateJsonMiddleware, authMiddleware } from "@/lib/api/middleware"
import { orderDb } from "@/lib/api/database"
import type { CreateOrderRequest } from "@/lib/api/types"

export const GET = createMethodHandler({
  GET: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [(req) => rateLimitMiddleware(req, 100, 15 * 60 * 1000)])

    if (middlewareResult) return middlewareResult

    // Get pagination parameters
    const { page, limit } = getPaginationParams(request)
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId") || undefined

    // Get orders from database
    const { orders, total } = await orderDb.findAll(userId, page, limit)

    // Return paginated response
    const response = createPaginatedResponse(orders, total, page, limit, "Orders retrieved successfully")
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  },

  POST: async (request: NextRequest) => {
    // Run middleware (including auth for creating orders)
    const middlewareResult = await runMiddleware(request, [
      (req) => rateLimitMiddleware(req, 20, 15 * 60 * 1000),
      validateJsonMiddleware,
      authMiddleware,
    ])

    if (middlewareResult) return middlewareResult

    // Parse request body
    const body: CreateOrderRequest = await request.json()

    // Validate required fields
    if (!body.items || !body.shippingAddress || !body.billingAddress || !body.paymentMethod) {
      throw new ValidationError("Missing required fields: items, shippingAddress, billingAddress, paymentMethod")
    }

    // Mock user ID (in real implementation, get from auth middleware)
    const userId = "user-1"

    // Create order
    const newOrder = await orderDb.create({ ...body, userId })

    return createSuccessResponse(newOrder, "Order created successfully", 201)
  },
})
