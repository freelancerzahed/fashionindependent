import type { NextRequest } from "next/server"
import { createMethodHandler, createSuccessResponse } from "@/lib/api/utils"

export const GET = createMethodHandler({
  GET: async (request: NextRequest) => {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        database: "connected", // Replace with actual database health check
        cache: "connected", // Replace with actual cache health check
        storage: "connected", // Replace with actual storage health check
      },
    }

    return createSuccessResponse(healthData, "Service is healthy")
  },
})
