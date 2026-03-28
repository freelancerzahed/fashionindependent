import { useState, useEffect } from "react"

export interface MenuCategory {
  id: string
  name: string
  href: string
  subcategories: Array<{
    id: string
    name: string
    href: string
  }>
}

export function useMenuCategories() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          throw new Error("API URL not configured")
        }

        const response = await fetch(`${apiUrl}/categories/menu`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }

        const data = await response.json()

        if (data.result && data.categories && Array.isArray(data.categories)) {
          console.log("✓ Loaded", data.categories.length, "menu categories")
          setCategories(data.categories)
        } else {
          console.warn("⚠️ Unexpected response format:", data)
          setError("Invalid response format")
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load categories"
        console.error("❌ Error fetching categories:", message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
