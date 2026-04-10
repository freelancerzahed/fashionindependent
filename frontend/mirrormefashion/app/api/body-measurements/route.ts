export const dynamic = "force-dynamic"

import type { NextRequest } from "next/server"
import { createMethodHandler, createSuccessResponse, ValidationError } from "@/lib/api/utils"
import { runMiddleware, rateLimitMiddleware, validateJsonMiddleware } from "@/lib/api/middleware"
import { bodyMeasurementDb } from "@/lib/api/database"
import type { CreateBodyMeasurementRequest } from "@/lib/api/types"

export const GET = createMethodHandler({
  GET: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [(req) => rateLimitMiddleware(req, 100, 15 * 60 * 1000)])

    if (middlewareResult) return middlewareResult

    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      throw new ValidationError("userId parameter is required")
    }

    // Get body measurements from database
    const measurements = await bodyMeasurementDb.findByUserId(userId)

    return createSuccessResponse(measurements, "Body measurements retrieved successfully")
  },

  POST: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [
      (req) => rateLimitMiddleware(req, 10, 15 * 60 * 1000),
      validateJsonMiddleware,
    ])

    if (middlewareResult) return middlewareResult

    // Parse request body
    const body: CreateBodyMeasurementRequest & { userId: string } = await request.json()

    // Validate required fields
    if (!body.userId || !body.gender || !body.measurements) {
      throw new ValidationError("Missing required fields: userId, gender, measurements")
    }

    // Create body measurements
    const newMeasurements = await bodyMeasurementDb.create(body)

    return createSuccessResponse(newMeasurements, "Body measurements created successfully", 201)
  },

  PUT: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [
      (req) => rateLimitMiddleware(req, 20, 15 * 60 * 1000),
      validateJsonMiddleware,
    ])

    if (middlewareResult) return middlewareResult

    // Parse request body
    const body: Partial<CreateBodyMeasurementRequest> & { userId: string } = await request.json()

    if (!body.userId) {
      throw new ValidationError("userId is required")
    }

    // Update body measurements
    const updatedMeasurements = await bodyMeasurementDb.update(body.userId, body)

    return createSuccessResponse(updatedMeasurements, "Body measurements updated successfully")
  },
})
