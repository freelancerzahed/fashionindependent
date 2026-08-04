"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Trash2,
  Loader2,
  AlertCircle,
  ShoppingCart,
  Minus,
  Plus,
} from "lucide-react"

export default function BackerCartPage() {
  const { user, token } = useAuth()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  })

  // Fetch CSRF token on mount and then fetch cart data
  useEffect(() => {
    const initializeCart = async () => {
      if (!token) {
        console.warn("No auth token, skipping cart fetch")
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Try to get CSRF token from localStorage first
        let csrfTokenValue: string | null = localStorage.getItem("csrf_token")

        if (!csrfTokenValue) {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)

          try {
            const response = await fetch(`/api/csrf-token`, {
              method: "GET",
              credentials: "include",
              signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (response.ok) {
              const data = await response.json()
              const nextCsrfToken = typeof data.csrf_token === "string" ? data.csrf_token.trim() : ""

              if (nextCsrfToken) {
                csrfTokenValue = nextCsrfToken
                localStorage.setItem("csrf_token", nextCsrfToken)
                setCsrfToken(nextCsrfToken)
              }
            }
          } catch (fetchErr) {
            clearTimeout(timeoutId)
            console.warn("CSRF token fetch failed, proceeding without it:", fetchErr)
          }
        } else {
          setCsrfToken(csrfTokenValue)
        }

        const headers: HeadersInit = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }

        if (csrfTokenValue) {
          headers["X-CSRF-Token"] = csrfTokenValue
        }

        console.log("Fetching cart with headers:", { hasAuth: !!token, hasCsrf: !!csrfTokenValue })

        const cartResponse = await fetch(`/api/carts`, {
          method: "POST",
          headers,
          credentials: "include",
        })

        console.log("Cart response status:", cartResponse.status)

        let cartData
        const contentType = cartResponse.headers.get("content-type")

        if (contentType?.includes("application/json")) {
          cartData = await cartResponse.json()
          console.log("Cart data received:", cartData)
        } else {
          const text = await cartResponse.text()
          console.error("Non-JSON response:", { status: cartResponse.status, contentType, text: text.substring(0, 500) })
          throw new Error(`Server returned ${cartResponse.status}: Expected JSON`)
        }

        if (!cartResponse.ok) {
          const errorMsg = cartData?.message || cartData?.error || `HTTP ${cartResponse.status}`
          console.error("API error response:", { status: cartResponse.status, errorMsg, data: cartData })

          if (cartResponse.status === 401 || cartResponse.status === 403 || cartResponse.status === 500) {
            setCartItems([])
            setCartSummary({ subtotal: 0, tax: 0, shipping: 0, total: 0 })
            setError(null)
            return
          }

          throw new Error(errorMsg)
        }

        if (cartData.status && Array.isArray(cartData.data)) {
          const items = cartData.data.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product?.name || "Unknown Product",
            productImage: item.product?.image || "/placeholder.svg",
            price: item.price || item.product?.price || 0,
            quantity: item.quantity || 1,
            discount: item.discount || 0,
            total: (item.price || item.product?.price || 0) * (item.quantity || 1),
          }))

          console.log(`Cart loaded with ${items.length} items`)
          setCartItems(items)

          const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0)
          const tax = subtotal * 0.1
          const shipping = items.length > 0 ? 5 : 0

          setCartSummary({
            subtotal,
            tax,
            shipping,
            total: subtotal + tax + shipping,
          })
        } else {
          console.warn("Unexpected API response format:", cartData)
          setCartItems([])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        console.error("Error initializing cart:", { error: errorMessage, errorObj: err })
        setError(errorMessage || "Failed to load cart")
      } finally {
        setLoading(false)
      }
    }

    initializeCart()
  }, [token])

  const fetchCartItems = useCallback(async () => {
    if (!token) {
      console.warn("No auth token available")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      // Add CSRF token if available
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken
      }

      console.log("Fetching cart with headers:", { hasAuth: !!token, hasCsrf: !!csrfToken })

      const cartResponse = await fetch(`/api/carts`, {
        method: "POST",
        headers,
        credentials: "include",
      })

      console.log("Cart response status:", cartResponse.status)

      let cartData
      const contentType = cartResponse.headers.get("content-type")

      // Check if response is JSON before parsing
      if (contentType?.includes("application/json")) {
        cartData = await cartResponse.json()
        console.log("Cart data received:", cartData)
      } else {
        const text = await cartResponse.text()
        console.error("Non-JSON response:", { status: cartResponse.status, contentType, text: text.substring(0, 500) })
        throw new Error(`Server returned ${cartResponse.status}: Expected JSON but got ${contentType}`)
      }

      if (!cartResponse.ok) {
        const errorMsg = cartData?.message || cartData?.error || `HTTP ${cartResponse.status}`
        console.error("API error response:", { status: cartResponse.status, errorMsg, data: cartData })

        if (cartResponse.status === 401 || cartResponse.status === 403 || cartResponse.status === 500) {
          setCartItems([])
          setCartSummary({ subtotal: 0, tax: 0, shipping: 0, total: 0 })
          setError(null)
          return
        }

        throw new Error(errorMsg)
      }

      if (cartData.status && Array.isArray(cartData.data)) {
        const items = cartData.data.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product?.name || "Unknown Product",
          productImage: item.product?.image || "/placeholder.svg",
          price: item.price || item.product?.price || 0,
          quantity: item.quantity || 1,
          discount: item.discount || 0,
          total: (item.price || item.product?.price || 0) * (item.quantity || 1),
        }))

        console.log(`Cart loaded with ${items.length} items`)
        setCartItems(items)

        // Calculate summary
        const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0)
        const tax = subtotal * 0.1 // 10% tax
        const shipping = items.length > 0 ? 5 : 0 // $5 flat rate

        setCartSummary({
          subtotal,
          tax,
          shipping,
          total: subtotal + tax + shipping,
        })
      } else {
        // API returned OK but data wasn't in expected format
        console.warn("Unexpected API response format:", cartData)
        setCartItems([]) // Empty cart
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error("Error fetching cart:", { error: errorMessage, errorObj: err })
      setError(errorMessage || "Failed to load cart")
    } finally {
      setLoading(false)
    }
  }, [token, csrfToken])

  // This will be called from the initialization effect above

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(itemId)
    try {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken
      }

      const response = await fetch(`/api/carts/change-quantity`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          id: itemId,
          quantity: newQuantity,
        }),
      })

      const contentType = response.headers.get("content-type")
      const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()

      if (!response.ok) {
        const errorMsg = typeof responseData === "object" ? responseData?.message : `Server error: ${response.status}`
        throw new Error(errorMsg || "Failed to update quantity")
      }

      // Update local state
      setCartItems((items) =>
        items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
            : item
        )
      )

      // Recalculate summary
      const updatedItems = cartItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
      const subtotal = updatedItems.reduce((sum: number, item: any) => sum + item.total, 0)
      const tax = subtotal * 0.1
      const shipping = updatedItems.length > 0 ? 5 : 0

      setCartSummary({
        subtotal,
        tax,
        shipping,
        total: subtotal + tax + shipping,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update quantity"
      console.error("Error updating quantity:", { error: errorMessage, details: err })
      setError(errorMessage)
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    setUpdating(itemId)
    try {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken
      }

      const response = await fetch(`/api/carts/${itemId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      })

      const contentType = response.headers.get("content-type")
      const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()

      if (!response.ok) {
        const errorMsg = typeof responseData === "object" ? responseData?.message : `Server error: ${response.status}`
        throw new Error(errorMsg || "Failed to remove item")
      }

      // Update local state
      const updatedItems = cartItems.filter((item) => item.id !== itemId)
      setCartItems(updatedItems)

      // Recalculate summary
      const subtotal = updatedItems.reduce((sum: number, item: any) => sum + item.total, 0)
      const tax = subtotal * 0.1
      const shipping = updatedItems.length > 0 ? 5 : 0

      setCartSummary({
        subtotal,
        tax,
        shipping,
        total: subtotal + tax + shipping,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove item"
      console.error("Error removing item:", { error: errorMessage, details: err })
      setError(errorMessage)
    } finally {
      setUpdating(null)
    }
  }

  const handleRetry = () => {
    fetchCartItems()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col sm:flex-row items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 sm:mt-0.5 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 text-sm sm:text-base">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-red-600 hover:text-red-700 text-xs sm:text-sm"
              onClick={handleRetry}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-slate-900">Shopping Cart</h1>
        <p className="text-sm sm:text-base text-slate-600">Review and manage your items</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-white">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-40 sm:h-32 bg-slate-100 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 line-clamp-2 mb-2 sm:mb-3">
                        {item.productName}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">
                        <span className="font-semibold text-slate-900">${item.price.toFixed(2)}</span> per item
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-4">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="p-1 sm:p-2 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4 text-slate-600" />
                        </button>

                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newVal = parseInt(e.target.value) || 1
                            if (newVal > 0) handleUpdateQuantity(item.id, newVal)
                          }}
                          disabled={updating === item.id}
                          className="w-12 sm:w-14 text-center border border-slate-300 rounded py-1 sm:py-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        />

                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="p-1 sm:p-2 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4 text-slate-600" />
                        </button>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updating === item.id}
                          className="ml-auto p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-200">
                      <span className="text-xs sm:text-sm text-slate-600">Subtotal</span>
                      <span className="text-lg sm:text-xl font-bold text-slate-900">
                        ${item.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm bg-white sticky top-6">
              <CardContent className="pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-slate-900">Order Summary</h2>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-200">
                  <div className="flex items-center justify-between text-sm sm:text-base text-slate-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${cartSummary.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm sm:text-base text-slate-600">
                    <span>Tax (10%)</span>
                    <span>${cartSummary.tax.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm sm:text-base text-slate-600">
                    <span>Shipping</span>
                    <span>${cartSummary.shipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <span className="text-base sm:text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                    ${cartSummary.total.toFixed(2)}
                  </span>
                </div>

                <Button className="w-full text-sm sm:text-base bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 sm:py-3">
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-3 text-xs sm:text-sm border-slate-200 hover:bg-slate-50"
                  asChild
                >
                  <Link href="/discover">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Empty Cart */
        <Card className="border-0 shadow-sm p-8 sm:p-12 text-center bg-gradient-to-br from-slate-50 to-white">
          <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-slate-300 mb-4 sm:mb-6" />
          <p className="text-base sm:text-lg text-slate-600 mb-2">Your cart is empty</p>
          <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
            Start shopping to add items to your cart
          </p>
          <Link href="/discover">
            <Button size="lg" className="text-sm sm:text-base bg-slate-900 hover:bg-slate-800">
              Discover Products
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
