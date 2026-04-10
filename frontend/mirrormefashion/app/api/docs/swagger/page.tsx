"use client"

import { useEffect, useState } from "react"

export default function SwaggerUI() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Dynamically load Swagger UI
    const loadSwaggerUI = async () => {
      // Load Swagger UI CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css"
      document.head.appendChild(link)

      // Load Swagger UI JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"
      script.onload = () => {
        // Initialize Swagger UI
        ;(window as any).SwaggerUIBundle({
          url: "/api/docs",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [(window as any).SwaggerUIBundle.presets.apis, (window as any).SwaggerUIBundle.presets.standalone],
          plugins: [(window as any).SwaggerUIBundle.plugins.DownloadUrl],
          layout: "StandaloneLayout",
          tryItOutEnabled: true,
          requestInterceptor: (request: any) => {
            // Add any custom headers or modifications here
            return request
          },
          responseInterceptor: (response: any) => {
            // Handle responses here
            return response
          },
        })
        setIsLoaded(true)
      }
      document.head.appendChild(script)
    }

    loadSwaggerUI()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Fashion Social Commerce API Documentation</h1>
          <p className="text-gray-600 mb-4">
            Comprehensive API documentation for the Fashion Social Commerce platform. Use this interactive documentation
            to explore and test all available endpoints.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Start:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• All endpoints return JSON responses with consistent structure</li>
              <li>• Use the "Try it out" button to test endpoints directly</li>
              <li>• Authentication required for protected endpoints (use Bearer token)</li>
              <li>• Rate limiting applies to all endpoints (check response headers)</li>
            </ul>
          </div>
        </div>

        {!isLoaded && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading API Documentation...</span>
          </div>
        )}

        <div id="swagger-ui"></div>
      </div>
    </div>
  )
}
