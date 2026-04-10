"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
              <div className="flex gap-3 items-start">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h1 className="font-bold text-red-900">Something went wrong</h1>
                  <p className="text-sm text-red-700 mt-1">
                    {this.state.error?.message || "An unexpected error occurred"}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Reload Page
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export function APIErrorAlert({ error }: { error: string }) {
  return (
    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-red-900">Error</p>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    </div>
  )
}

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    let message = "An unexpected error occurred"

    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === "string") {
      message = err
    } else if (err && typeof err === "object" && "message" in err) {
      message = String(err.message)
    }

    console.error("[ErrorHandler]", message, err)
    setError(message)
  }

  const clearError = () => setError(null)

  return { error, handleError, clearError }
}
