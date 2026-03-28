/**
 * API Error Handling Utilities
 * Provides consistent error handling, retry logic, and user-friendly messages
 */

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
  isNetworkError: boolean
  isValidationError: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

/**
 * Parse API error response into standardized format
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  const isNetworkError = !response.ok && response.status === 0
  
  let data: any = {}
  try {
    data = await response.json()
  } catch {
    // Response is not JSON, use status text
  }

  const message = data.message || data.error || response.statusText || "Unknown error"
  const errors = data.errors || {}
  const isValidationError = response.status === 422 || response.status === 400

  // Create user-friendly message
  let friendlyMessage = message

  switch (response.status) {
    case 400:
      friendlyMessage = "Invalid request. Please check your input."
      break
    case 401:
      friendlyMessage = "Session expired. Please log in again."
      break
    case 403:
      friendlyMessage = "You don't have permission to perform this action."
      break
    case 404:
      friendlyMessage = "The requested resource was not found."
      break
    case 408:
      friendlyMessage = "Request timeout. Please try again."
      break
    case 429:
      friendlyMessage = "Too many requests. Please wait a moment and try again."
      break
    case 500:
      friendlyMessage = "Server error. Please try again later."
      break
    case 502:
    case 503:
      friendlyMessage = "Service temporarily unavailable. Please try again later."
      break
    case 0:
      friendlyMessage = "Network error. Please check your connection."
      break
  }

  return {
    status: response.status,
    message: friendlyMessage,
    errors,
    isNetworkError,
    isValidationError,
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryFetch<T>(
  fn: () => Promise<Response>,
  options: {
    maxRetries?: number
    delay?: number
    backoffMultiplier?: number
  } = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, backoffMultiplier = 2 } = options
  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fn()

      if (response.ok) {
        return response.json()
      }

      // Don't retry on client errors (4xx), only server errors (5xx) and network errors
      if (response.status >= 400 && response.status < 500) {
        const error = await parseApiError(response)
        throw new Error(error.message)
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      lastError = error
      const currentDelay = delay * Math.pow(backoffMultiplier, attempt)

      if (attempt < maxRetries - 1) {
        console.warn(
          `[API Retry] Attempt ${attempt + 1} failed, waiting ${currentDelay}ms before retry...`,
          error
        )
        await new Promise(resolve => setTimeout(resolve, currentDelay))
      }
    }
  }

  throw lastError
}

/**
 * Make API call with error handling
 */
export async function apiCall<T = any>(
  url: string,
  options: RequestInit & {
    token?: string
    csrfToken?: string
    retryable?: boolean
  } = {}
): Promise<ApiResponse<T>> {
  const { token, csrfToken, retryable = false, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers || {})

  // Add auth header
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  // Add CSRF header for non-GET requests
  if (csrfToken && fetchOptions.method && fetchOptions.method !== "GET") {
    headers.set("X-CSRF-Token", csrfToken)
  }

  headers.set("Content-Type", "application/json")

  const makeRequest = async () => {
    return fetch(url, {
      ...fetchOptions,
      headers,
    })
  }

  try {
    let response: Response

    if (retryable) {
      try {
        const data = await retryFetch(makeRequest)
        return { success: true, data }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Request failed"
        return {
          success: false,
          error: {
            status: 0,
            message,
            isNetworkError: true,
            isValidationError: false,
          },
        }
      }
    } else {
      response = await makeRequest()

      if (!response.ok) {
        const error = await parseApiError(response)
        
        // Handle session expiry
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user")
            window.location.href = "/login"
          }
        }

        return { success: false, error, message: error.message }
      }

      const data = await response.json()
      return { success: true, data, message: data.message }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed"
    console.error("[apiCall] Error:", message, error)

    return {
      success: false,
      error: {
        status: 0,
        message,
        isNetworkError: true,
        isValidationError: false,
      },
    }
  }
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join("\n")
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: ApiError): string {
  if (error.isValidationError && error.errors) {
    return `Please check your input:\n${formatValidationErrors(error.errors)}`
  }
  return error.message
}

/**
 * Log errors to monitoring service (e.g., Sentry)
 */
export function captureException(error: Error, context?: Record<string, any>) {
  console.error("[captureException]", error, context)

  // TODO: Send to Sentry or similar service
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(error, { extra: context })
  // }
}
