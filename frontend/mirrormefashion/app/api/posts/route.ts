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
import { postDb } from "@/lib/api/database"
import type { CreatePostRequest } from "@/lib/api/types"

export const GET = createMethodHandler({
  GET: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [(req) => rateLimitMiddleware(req, 200, 15 * 60 * 1000)])

    if (middlewareResult) return middlewareResult

    // Get pagination parameters
    const { page, limit } = getPaginationParams(request)
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId") || undefined

    // Get posts from database
    const { posts, total } = await postDb.findAll(userId, page, limit)

    // Return paginated response
    const response = createPaginatedResponse(posts, total, page, limit, "Posts retrieved successfully")
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  },

  POST: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [
      (req) => rateLimitMiddleware(req, 30, 15 * 60 * 1000),
      validateJsonMiddleware,
    ])

    if (middlewareResult) return middlewareResult

    // Parse request body
    const body: CreatePostRequest & { userId: string } = await request.json()

    // Validate required fields
    if (!body.userId || !body.content) {
      throw new ValidationError("Missing required fields: userId, content")
    }

    // Create post
    const newPost = await postDb.create(body)

    return createSuccessResponse(newPost, "Post created successfully", 201)
  },
})
