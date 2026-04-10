export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/config";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/api/v2/auth/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "App-Key": "123456",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      backendStatus: res.status,
      backendData: data,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}

import type { NextRequest } from "next/server"
import {
  createMethodHandler,
  createSuccessResponse,
  getPaginationParams,
  createPaginatedResponse,
  ValidationError,
} from "@/lib/api/utils"
import { runMiddleware, rateLimitMiddleware, validateJsonMiddleware } from "@/lib/api/middleware"
import { userDb } from "@/lib/api/database"
import type { CreateUserRequest } from "@/lib/api/types"

export const GET = createMethodHandler({
  GET: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [(req) => rateLimitMiddleware(req, 100, 15 * 60 * 1000)])

    if (middlewareResult) return middlewareResult

    // Get pagination parameters
    const { page, limit } = getPaginationParams(request)

    // Get users from database
    const { users, total } = await userDb.findAll(page, limit)

    // Return paginated response
    const response = createPaginatedResponse(users, total, page, limit, "Users retrieved successfully")
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  },

  POST: async (request: NextRequest) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [
      (req) => rateLimitMiddleware(req, 10, 15 * 60 * 1000),
      validateJsonMiddleware,
    ])

    if (middlewareResult) return middlewareResult

    // Parse request body
    const body: CreateUserRequest = await request.json()

    // Validate required fields
    if (!body.email || !body.username || !body.firstName || !body.lastName || !body.password) {
      throw new ValidationError("Missing required fields: email, username, firstName, lastName, password")
    }

    // Check if user already exists
    const existingUser = await userDb.findByEmail(body.email)
    if (existingUser) {
      throw new ValidationError("User with this email already exists")
    }

    const existingUsername = await userDb.findByUsername(body.username)
    if (existingUsername) {
      throw new ValidationError("Username already taken")
    }

    // Create user
    const newUser = await userDb.create(body)

    // Remove password from response
    const { password, ...userResponse } = newUser as any

    return createSuccessResponse(userResponse, "User created successfully", 201)
  },
})

// OpenAPI Documentation
export const metadata = {
  openapi: "3.0.0",
  info: {
    title: "Users API",
    version: "1.0.0",
    description: "User management endpoints",
  },
  paths: {
    "/api/users": {
      get: {
        summary: "Get all users",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10, maximum: 100 },
            description: "Number of items per page",
          },
        ],
        responses: {
          200: {
            description: "Users retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
}
