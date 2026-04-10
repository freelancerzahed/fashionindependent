import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, ApiError } from "./types"
import { v4 as uuidv4 } from "uuid"

// API Response Utilities
export function createApiResponse<T>(data?: T, message?: string, success = true): ApiResponse<T> {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
    requestId: uuidv4(),
  }
}

export function createErrorResponse(error: string | ApiError, statusCode = 500): NextResponse {
  const errorObj: ApiError = typeof error === "string" ? { code: "INTERNAL_ERROR", message: error, statusCode } : error

  const response: ApiResponse = {
    success: false,
    error: errorObj.message,
    timestamp: new Date().toISOString(),
    requestId: uuidv4(),
  }

  return NextResponse.json(response, { status: statusCode })
}

export function createSuccessResponse<T>(data: T, message?: string, statusCode = 200): NextResponse {
  const response = createApiResponse(data, message, true)
  return NextResponse.json(response, { status: statusCode })
}

// Request Validation
export async function validateRequest(
  request: NextRequest,
  schema: any,
): Promise<{ isValid: boolean; data?: any; errors?: string[] }> {
  try {
    const body = await request.json()
    // Here you would integrate with a validation library like Zod or Joi
    // For now, we'll do basic validation
    return { isValid: true, data: body }
  } catch (error) {
    return {
      isValid: false,
      errors: ["Invalid JSON in request body"],
    }
  }
}

// Pagination Utilities
export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const url = new URL(request.url)
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") || "10")))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

export function createPaginatedResponse<T>(data: T[], total: number, page: number, limit: number, message?: string) {
  const totalPages = Math.ceil(total / limit)

  return {
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
    requestId: uuidv4(),
  }
}

// Error Classes
export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message)
    this.name = "NotFoundError"
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message)
    this.name = "ForbiddenError"
  }
}

// HTTP Method Handler
export function createMethodHandler(handlers: {
  GET?: (request: NextRequest, context?: any) => Promise<NextResponse>
  POST?: (request: NextRequest, context?: any) => Promise<NextResponse>
  PUT?: (request: NextRequest, context?: any) => Promise<NextResponse>
  DELETE?: (request: NextRequest, context?: any) => Promise<NextResponse>
  PATCH?: (request: NextRequest, context?: any) => Promise<NextResponse>
}) {
  return async function handler(request: NextRequest, context?: any) {
    try {
      const method = request.method as keyof typeof handlers
      const methodHandler = handlers[method]

      if (!methodHandler) {
        return createErrorResponse(
          {
            code: "METHOD_NOT_ALLOWED",
            message: `Method ${method} not allowed`,
            statusCode: 405,
          },
          405,
        )
      }

      return await methodHandler(request, context)
    } catch (error) {
      console.error("API Error:", error)

      if (error instanceof ValidationError) {
        return createErrorResponse(
          {
            code: "VALIDATION_ERROR",
            message: error.message,
            details: error.details,
            statusCode: 400,
          },
          400,
        )
      }

      if (error instanceof NotFoundError) {
        return createErrorResponse(
          {
            code: "NOT_FOUND",
            message: error.message,
            statusCode: 404,
          },
          404,
        )
      }

      if (error instanceof UnauthorizedError) {
        return createErrorResponse(
          {
            code: "UNAUTHORIZED",
            message: error.message,
            statusCode: 401,
          },
          401,
        )
      }

      if (error instanceof ForbiddenError) {
        return createErrorResponse(
          {
            code: "FORBIDDEN",
            message: error.message,
            statusCode: 403,
          },
          403,
        )
      }

      return createErrorResponse(
        {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
          statusCode: 500,
        },
        500,
      )
    }
  }
}

// Request Logging Middleware
export function logRequest(request: NextRequest) {
  const timestamp = new Date().toISOString()
  const method = request.method
  const url = request.url
  const userAgent = request.headers.get("user-agent") || "Unknown"

  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`)
}
