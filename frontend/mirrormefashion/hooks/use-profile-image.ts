import { useState, useCallback } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/mirrormefashion/api/v2'

export interface UserProfile {
  id: number
  name: string
  email: string
  avatar?: string | null
  avatar_path?: string | null
  avatar_original?: string | null
  user_type?: string
  bio?: string | null
  location?: string | null
  website?: string | null
  username?: string | null
  dateOfBirth?: string | null
}

export interface UseProfileImageReturn {
  loading: boolean
  error: string | null
  success: boolean
  uploadProfileImage: (file: File) => Promise<{ image_url: string; image_path: string }>
  removeProfileImage: () => Promise<void>
  fetchProfile: () => Promise<UserProfile>
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>
}

export function useProfileImage(): UseProfileImageReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }, [])

  const uploadProfileImage = useCallback(
    async (file: File) => {
      setLoading(true)
      setError(null)
      setSuccess(false)

      try {
        const formData = new FormData()
        formData.append('image', file)

        const token = getToken()
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(`${BACKEND_URL}/auth/profile/image/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to upload image')
        }

        const data = await response.json()
        setSuccess(true)
        // Return the image URL in /api/storage format for frontend display
        const imageUrl = `/api/storage/${data.data.image_path}`
        return {
          image_url: imageUrl,
          image_path: data.data.image_path,
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getToken]
  )

  const removeProfileImage = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${BACKEND_URL}/auth/profile/image/remove`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove image')
      }

      setSuccess(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove image'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const fetchProfile = useCallback(async (): Promise<UserProfile> => {
    setLoading(true)
    setError(null)

    try {
      const token = getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch profile from backend API endpoint
      const url = `${BACKEND_URL}/auth/profile/`
      console.log('[useProfileImage] Fetching profile from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('[useProfileImage] Profile fetch response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[useProfileImage] Profile fetch error:', errorData)
        throw new Error(errorData.message || 'Failed to fetch profile')
      }

      const data = await response.json()
      console.log('[useProfileImage] Profile data received:', data)
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile'
      console.error('[useProfileImage] Error:', errorMessage)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const updateProfile = useCallback(
    async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
      setLoading(true)
      setError(null)

      try {
        const token = getToken()
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(`${BACKEND_URL}/auth/profile/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to update profile')
        }

        const data = await response.json()
        setSuccess(true)
        return data.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getToken]
  )

  return {
    loading,
    error,
    success,
    uploadProfileImage,
    removeProfileImage,
    fetchProfile,
    updateProfile,
  }
}
