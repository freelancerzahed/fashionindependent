import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createMethodHandler, createSuccessResponse, NotFoundError } from "@/lib/api/utils"
import { runMiddleware, rateLimitMiddleware, validateJsonMiddleware } from "@/lib/api/middleware"
import { productDb, getProductById } from "@/lib/api/database"
import type { UpdateProductRequest } from "@/lib/api/types"

export const GET = createMethodHandler({
  GET: async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params
    const product = await getProductById(id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  },

  PUT: async (request: NextRequest, { params }: { params: { id: string } }) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [
      (req) => rateLimitMiddleware(req, 50, 15 * 60 * 1000),
      validateJsonMiddleware,
    ])

    if (middlewareResult) return middlewareResult

    // Parse request body
    const body: UpdateProductRequest = await request.json()

    // Check if product exists
    const existingProduct = await productDb.findById(params.id)
    if (!existingProduct) {
      throw new NotFoundError("Product not found")
    }

    // Update product
    const updatedProduct = await productDb.update(params.id, body)

    return createSuccessResponse(updatedProduct, "Product updated successfully")
  },

  DELETE: async (request: NextRequest, { params }: { params: { id: string } }) => {
    // Run middleware
    const middlewareResult = await runMiddleware(request, [(req) => rateLimitMiddleware(req, 10, 15 * 60 * 1000)])

    if (middlewareResult) return middlewareResult

    // Check if product exists
    const existingProduct = await productDb.findById(params.id)
    if (!existingProduct) {
      throw new NotFoundError("Product not found")
    }

    // Delete product
    const deleted = await productDb.delete(params.id)

    if (!deleted) {
      throw new Error("Failed to delete product")
    }

    return createSuccessResponse(null, "Product deleted successfully")
  },
})
