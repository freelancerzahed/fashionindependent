"use client"

import { useState, useEffect } from "react"
import { bodyShapeAPI, type BodyShapeData, type BodyShapeResponse } from "@/lib/api/body-shape"
import { useToast } from "@/hooks/use-toast"

export function useBodyShape(userId?: number) {
  const [bodyShape, setBodyShape] = useState<BodyShapeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBodyShape = async (id: number) => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response = await bodyShapeAPI.getBodyShape(id)
      if (response.success && response.data) {
        setBodyShape(response.data)
      } else {
        setError(response.message || "Failed to fetch body shape data")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveBodyShape = async (data: Omit<BodyShapeData, "id" | "created_at" | "updated_at">) => {
    setLoading(true)
    setError(null)

    try {
      let response: BodyShapeResponse

      if (bodyShape?.id) {
        // Update existing
        response = await bodyShapeAPI.updateBodyShape(bodyShape.id, data)
      } else {
        // Create new
        response = await bodyShapeAPI.createBodyShape(data)
      }

      if (response.success && response.data) {
        setBodyShape(response.data)
        toast({
          title: "Success",
          description: "Body shape data saved successfully",
        })
        return response.data
      } else {
        throw new Error(response.message || "Failed to save body shape data")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBodyShape = async () => {
    if (!bodyShape?.id) return

    setLoading(true)
    setError(null)

    try {
      const response = await bodyShapeAPI.deleteBodyShape(bodyShape.id)
      if (response.success) {
        setBodyShape(null)
        toast({
          title: "Success",
          description: "Body shape data deleted successfully",
        })
      } else {
        throw new Error(response.message || "Failed to delete body shape data")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchBodyShape(userId)
    }
  }, [userId])

  return {
    bodyShape,
    loading,
    error,
    saveBodyShape,
    deleteBodyShape,
    refetch: () => userId && fetchBodyShape(userId),
  }
}
