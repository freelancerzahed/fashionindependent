import type { NextRequest } from "next/server"
import { createMethodHandler, createSuccessResponse, NotFoundError } from "@/lib/api/utils"
import { runMiddleware, rateLimitMiddleware, validateJsonMiddleware } from "@/lib/api/middleware"
import { userDb } from "@/lib/api/database"
import type { UpdateUserRequest } from "@/lib/api/types"

export const GET = createMethodHandler({
  GET: async (request: NextRequest, { params }: { params: { id: string } }) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [(req) => rateLimitMiddleware(req, 100, 15 * 60 * 1000)])

    if (middlewareResult) return middlewareResult

    // Get user from database
    const user = await userDb.findById(params.id)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    return createSuccessResponse(user, "User retrieved successfully")
  },

  PUT: async (request: NextRequest, { params }: { params: { id: string } }) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [
      (req) => rateLimitMiddleware(req, 50, 15 * 60 * 1000),
      validateJsonMiddleware,
    ])

    if (middlewareResult) return middlewareResult

    // Parse request body
    const body: UpdateUserRequest = await request.json()

    // Check if user exists
    const existingUser = await userDb.findById(params.id)
    if (!existingUser) {
      throw new NotFoundError("User not found")
    }

    // Update user
    const updatedUser = await userDb.update(params.id, body)

    return createSuccessResponse(updatedUser, "User updated successfully")
  },

  DELETE: async (request: NextRequest, { params }: { params: { id: string } }) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [(req) => rateLimitMiddleware(req, 10, 15 * 60 * 1000)])

    if (middlewareResult) return middlewareResult

    // Check if user exists
    const existingUser = await userDb.findById(params.id)
    if (!existingUser) {
      throw new NotFoundError("User not found")
    }

    // Delete user
    const deleted = await userDb.delete(params.id)

    if (!deleted) {
      throw new Error("Failed to delete user")
    }

    return createSuccessResponse(null, "User deleted successfully")
  },
})
