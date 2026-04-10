import { type NextRequest, NextResponse } from "next/server"

// OpenAPI Specification
const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Fashion Social Commerce API",
    version: "1.0.0",
    description: "A comprehensive API for fashion social commerce platform with AI-powered features",
    contact: {
      name: "API Support",
      email: "api-support@fashionsocial.com",
    },
  },
  servers: [
    {
      url: process.env.NODE_ENV === "production" ? "https://your-domain.com/api" : "http://localhost:3000/api",
      description: process.env.NODE_ENV === "production" ? "Production server" : "Development server",
    },
  ],
  paths: {
    "/users": {
      get: {
        summary: "Get all users",
        tags: ["Users"],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Page number for pagination",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10, minimum: 1, maximum: 100 },
            description: "Number of items per page",
          },
        ],
        responses: {
          200: {
            description: "Users retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/User" },
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" },
                      },
                    },
                  ],
                },
              },
            },
          },
          429: { $ref: "#/components/responses/RateLimitError" },
        },
      },
      post: {
        summary: "Create a new user",
        tags: ["Users"],
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
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/User" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          429: { $ref: "#/components/responses/RateLimitError" },
        },
      },
    },
    "/users/{id}": {
      get: {
        summary: "Get user by ID",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "User retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/User" },
                      },
                    },
                  ],
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
      put: {
        summary: "Update user",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/User" },
                      },
                    },
                  ],
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
      delete: {
        summary: "Delete user",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
    },
    "/products": {
      get: {
        summary: "Get all products with filtering",
        tags: ["Products"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10, maximum: 100 } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "subcategory", in: "query", schema: { type: "string" } },
          { name: "brand", in: "query", schema: { type: "string" } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "sizes", in: "query", schema: { type: "string" }, description: "Comma-separated sizes" },
          { name: "colors", in: "query", schema: { type: "string" }, description: "Comma-separated colors" },
          { name: "tags", in: "query", schema: { type: "string" }, description: "Comma-separated tags" },
          { name: "inStock", in: "query", schema: { type: "boolean" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Products retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Product" },
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new product",
        tags: ["Products"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProductRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Product created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Product" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/products/{id}": {
      get: {
        summary: "Get product by ID",
        tags: ["Products"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product ID",
          },
        ],
        responses: {
          200: {
            description: "Product retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Product" },
                      },
                    },
                  ],
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
      put: {
        summary: "Update product",
        tags: ["Products"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProductRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Product updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Product" },
                      },
                    },
                  ],
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
      delete: {
        summary: "Delete product",
        tags: ["Products"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product ID",
          },
        ],
        responses: {
          200: {
            description: "Product deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
    },
    "/orders": {
      get: {
        summary: "Get all orders",
        tags: ["Orders"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "userId", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Orders retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Order" },
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new order",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Order created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Order" },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { $ref: "#/components/responses/UnauthorizedError" },
        },
      },
    },
    "/body-measurements": {
      get: {
        summary: "Get body measurements",
        tags: ["Body Measurements"],
        parameters: [
          {
            name: "userId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "Body measurements retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/BodyMeasurement" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create body measurements",
        tags: ["Body Measurements"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBodyMeasurementRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Body measurements created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/BodyMeasurement" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update body measurements",
        tags: ["Body Measurements"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateBodyMeasurementRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Body measurements updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/BodyMeasurement" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/posts": {
      get: {
        summary: "Get all posts",
        tags: ["Social"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "userId", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Posts retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Post" },
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new post",
        tags: ["Social"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Post created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Post" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          timestamp: { type: "string", format: "date-time" },
          requestId: { type: "string" },
        },
        required: ["success", "timestamp", "requestId"],
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer" },
          limit: { type: "integer" },
          total: { type: "integer" },
          totalPages: { type: "integer" },
          hasNext: { type: "boolean" },
          hasPrev: { type: "boolean" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          username: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          avatar: { type: "string" },
          bio: { type: "string" },
          isVerified: { type: "boolean" },
          preferences: { $ref: "#/components/schemas/UserPreferences" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserPreferences: {
        type: "object",
        properties: {
          notifications: { type: "boolean" },
          newsletter: { type: "boolean" },
          privacy: { type: "string", enum: ["public", "private", "friends"] },
          theme: { type: "string", enum: ["light", "dark", "auto"] },
        },
      },
      CreateUserRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          username: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          password: { type: "string", minLength: 8 },
        },
        required: ["email", "username", "firstName", "lastName", "password"],
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          bio: { type: "string" },
          avatar: { type: "string" },
          preferences: { $ref: "#/components/schemas/UserPreferences" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          originalPrice: { type: "number" },
          currency: { type: "string" },
          category: { type: "string" },
          subcategory: { type: "string" },
          brand: { type: "string" },
          images: { type: "array", items: { type: "string" } },
          sizes: { type: "array", items: { type: "string" } },
          colors: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          inStock: { type: "boolean" },
          stockQuantity: { type: "integer" },
          rating: { type: "number" },
          reviewCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateProductRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          originalPrice: { type: "number" },
          currency: { type: "string" },
          category: { type: "string" },
          subcategory: { type: "string" },
          brand: { type: "string" },
          images: { type: "array", items: { type: "string" } },
          sizes: { type: "array", items: { type: "string" } },
          colors: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          stockQuantity: { type: "integer" },
        },
        required: ["name", "description", "price", "category", "brand"],
      },
      UpdateProductRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          originalPrice: { type: "number" },
          currency: { type: "string" },
          category: { type: "string" },
          subcategory: { type: "string" },
          brand: { type: "string" },
          images: { type: "array", items: { type: "string" } },
          sizes: { type: "array", items: { type: "string" } },
          colors: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          stockQuantity: { type: "integer" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
          subtotal: { type: "number" },
          tax: { type: "number" },
          shipping: { type: "number" },
          total: { type: "number" },
          currency: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
          },
          shippingAddress: { $ref: "#/components/schemas/Address" },
          billingAddress: { $ref: "#/components/schemas/Address" },
          paymentMethod: { type: "string" },
          trackingNumber: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          productId: { type: "string" },
          product: { $ref: "#/components/schemas/Product" },
          quantity: { type: "integer" },
          price: { type: "number" },
          size: { type: "string" },
          color: { type: "string" },
        },
      },
      Address: {
        type: "object",
        properties: {
          street: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          zipCode: { type: "string" },
          country: { type: "string" },
        },
        required: ["street", "city", "state", "zipCode", "country"],
      },
      CreateOrderRequest: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "string" },
                quantity: { type: "integer" },
                size: { type: "string" },
                color: { type: "string" },
              },
              required: ["productId", "quantity"],
            },
          },
          shippingAddress: { $ref: "#/components/schemas/Address" },
          billingAddress: { $ref: "#/components/schemas/Address" },
          paymentMethod: { type: "string" },
        },
        required: ["items", "shippingAddress", "billingAddress", "paymentMethod"],
      },
      BodyMeasurement: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          gender: { type: "string", enum: ["male", "female", "other"] },
          measurements: {
            type: "object",
            properties: {
              height: { type: "number" },
              weight: { type: "number" },
              chest: { type: "number" },
              waist: { type: "number" },
              hips: { type: "number" },
              shoulders: { type: "number" },
              inseam: { type: "number" },
              neck: { type: "number" },
              sleeve: { type: "number" },
            },
          },
          preferences: {
            type: "object",
            properties: {
              fit: { type: "string", enum: ["tight", "regular", "loose"] },
              style: { type: "array", items: { type: "string" } },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateBodyMeasurementRequest: {
        type: "object",
        properties: {
          userId: { type: "string" },
          gender: { type: "string", enum: ["male", "female", "other"] },
          measurements: {
            type: "object",
            properties: {
              height: { type: "number" },
              weight: { type: "number" },
              chest: { type: "number" },
              waist: { type: "number" },
              hips: { type: "number" },
              shoulders: { type: "number" },
              inseam: { type: "number" },
              neck: { type: "number" },
              sleeve: { type: "number" },
            },
          },
          preferences: {
            type: "object",
            properties: {
              fit: { type: "string", enum: ["tight", "regular", "loose"] },
              style: { type: "array", items: { type: "string" } },
            },
          },
        },
        required: ["userId", "gender", "measurements"],
      },
      UpdateBodyMeasurementRequest: {
        type: "object",
        properties: {
          userId: { type: "string" },
          gender: { type: "string", enum: ["male", "female", "other"] },
          measurements: {
            type: "object",
            properties: {
              height: { type: "number" },
              weight: { type: "number" },
              chest: { type: "number" },
              waist: { type: "number" },
              hips: { type: "number" },
              shoulders: { type: "number" },
              inseam: { type: "number" },
              neck: { type: "number" },
              sleeve: { type: "number" },
            },
          },
          preferences: {
            type: "object",
            properties: {
              fit: { type: "string", enum: ["tight", "regular", "loose"] },
              style: { type: "array", items: { type: "string" } },
            },
          },
        },
        required: ["userId"],
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          content: { type: "string" },
          images: { type: "array", items: { type: "string" } },
          products: { type: "array", items: { $ref: "#/components/schemas/Product" } },
          likes: { type: "integer" },
          comments: { type: "integer" },
          shares: { type: "integer" },
          isLiked: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreatePostRequest: {
        type: "object",
        properties: {
          userId: { type: "string" },
          content: { type: "string" },
          images: { type: "array", items: { type: "string" } },
          productIds: { type: "array", items: { type: "string" } },
        },
        required: ["userId", "content"],
      },
    },
    responses: {
      ValidationError: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: {
              allOf: [
                { $ref: "#/components/schemas/ApiResponse" },
                {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              ],
            },
          },
        },
      },
      NotFoundError: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              allOf: [
                { $ref: "#/components/schemas/ApiResponse" },
                {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              ],
            },
          },
        },
      },
      UnauthorizedError: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              allOf: [
                { $ref: "#/components/schemas/ApiResponse" },
                {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              ],
            },
          },
        },
      },
      RateLimitError: {
        description: "Rate limit exceeded",
        content: {
          "application/json": {
            schema: {
              allOf: [
                { $ref: "#/components/schemas/ApiResponse" },
                {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
}

export async function GET(request: NextRequest) {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
