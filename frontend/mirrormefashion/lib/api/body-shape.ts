export interface BodyShapeData {
  id?: number
  user_id: number
  bust?: string
  shoe_size?: string
  weight?: number
  height?: number
  bmi?: number
  age?: string
  gender?: string
  shape?: string
  shape_keys?: Record<string, any>
  slider_values?: Record<string, number>
  alphanumeric_code?: string
  created_at?: string
  updated_at?: string
}

export interface BodyShapeResponse {
  success: boolean
  data?: BodyShapeData
  message?: string
  errors?: Record<string, string[]>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class BodyShapeAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    // Add auth token if available
    const token = localStorage.getItem("auth_token")
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async getBodyShape(userId: number): Promise<BodyShapeResponse> {
    return this.request<BodyShapeResponse>(`/body-data/${userId}`)
  }

  async createBodyShape(data: Omit<BodyShapeData, "id" | "created_at" | "updated_at">): Promise<BodyShapeResponse> {
    return this.request<BodyShapeResponse>("/body-data", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateBodyShape(id: number, data: Partial<BodyShapeData>): Promise<BodyShapeResponse> {
    return this.request<BodyShapeResponse>(`/body-data/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteBodyShape(id: number): Promise<BodyShapeResponse> {
    return this.request<BodyShapeResponse>(`/body-data/${id}`, {
      method: "DELETE",
    })
  }

  // Get body shape history for a user
  async getBodyShapeHistory(userId: number): Promise<BodyShapeResponse[]> {
    return this.request<BodyShapeResponse[]>(`/body-data/history/${userId}`)
  }
}

export const bodyShapeAPI = new BodyShapeAPI()
