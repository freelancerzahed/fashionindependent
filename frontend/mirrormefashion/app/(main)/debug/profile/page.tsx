"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function ProfileDebugPage() {
  const [token, setToken] = useState<string | null>(null)
  const [profileData, setProfileData] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [steps, setSteps] = useState<any[]>([])

  useEffect(() => {
    const t = localStorage.getItem('token')
    setToken(t)
  }, [])

  const runDebugFlow = async () => {
    const newSteps: any[] = []

    try {
      // Step 1: Check token
      newSteps.push({
        step: 1,
        name: 'Check Token',
        status: token ? '✓' : '✗',
        message: token ? `Token found: ${token.substring(0, 20)}...` : 'No token in localStorage',
      })

      if (!token) {
        setSteps(newSteps)
        return
      }

      // Step 2: Fetch profile
      newSteps.push({
        step: 2,
        name: 'Fetch Profile',
        status: 'loading',
        message: 'Calling /api/v2/auth/profile/...',
      })
      setSteps([...newSteps])

      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/mirrormefashion/api/v2'
      const profileRes = await fetch(`${BACKEND_URL}/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const profileJson = await profileRes.json()
      const success = profileRes.ok
      
      newSteps[newSteps.length - 1] = {
        ...newSteps[newSteps.length - 1],
        status: success ? '✓' : '✗',
        message: success ? 'Profile fetched successfully' : `Error: ${profileRes.status}`,
        data: profileJson,
      }
      setSteps([...newSteps])
      setProfileData(profileJson.data)

      if (!success) return

      const profile = profileJson.data
      const avatarPath = profile?.avatar_path
      const avatarUrl = profile?.avatar

      // Step 3: Check avatar
      newSteps.push({
        step: 3,
        name: 'Check Avatar Path',
        status: avatarPath ? '✓' : '✗',
        message: avatarPath ? `Avatar path: ${avatarPath}` : 'No avatar_path in response',
      })
      setSteps([...newSteps])

      if (!avatarPath) return

      // Step 4: Construct frontend URL
      const frontendUrl = `/api/storage/${avatarPath}`
      newSteps.push({
        step: 4,
        name: 'Frontend URL',
        status: '✓',
        message: `URL: ${frontendUrl}`,
      })
      setImageUrl(frontendUrl)
      setSteps([...newSteps])

      // Step 5: Test image load
      newSteps.push({
        step: 5,
        name: 'Test Image Load',
        status: 'loading',
        message: `Testing: ${frontendUrl}`,
      })
      setSteps([...newSteps])

      const img = new Image()
      img.onload = () => {
        newSteps[newSteps.length - 1] = {
          ...newSteps[newSteps.length - 1],
          status: '✓',
          message: `Image loaded successfully! Size: ${img.width}x${img.height}`,
        }
        setSteps([...newSteps])
      }
      img.onerror = (e) => {
        newSteps[newSteps.length - 1] = {
          ...newSteps[newSteps.length - 1],
          status: '✗',
          message: `Image failed to load. Check Network tab for details.`,
        }
        setSteps([...newSteps])
      }
      img.src = frontendUrl
    } catch (err) {
      newSteps.push({
        step: 'error',
        name: 'Error',
        status: '✗',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
      setSteps(newSteps)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile Image Debug</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Debug Flow</CardTitle>
          <CardDescription>Follow the steps to identify where the issue is</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runDebugFlow} className="bg-blue-600 hover:bg-blue-700">
            Run Debug Check
          </Button>

          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="border rounded p-3 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className={`text-xl font-bold w-8 flex-shrink-0 ${
                    s.status === '✓' ? 'text-green-600' :
                    s.status === '✗' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {s.status}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm text-gray-600">{s.message}</p>
                    {s.data && (
                      <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto max-h-48">
                        {JSON.stringify(s.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              URL: <code className="bg-gray-100 px-2 py-1 rounded">{imageUrl}</code>
            </p>
            <div className="border rounded p-4 bg-gray-50 flex justify-center">
              <img src={imageUrl} alt="Profile" className="max-w-xs max-h-64" onError={() => console.log('Image load error')} onLoad={() => console.log('Image loaded')} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">What to Check</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-blue-800">
          <h4 className="font-semibold">If Step 1 fails: No token</h4>
          <p>• User not logged in - need to login first</p>

          <h4 className="font-semibold mt-4">If Step 2 fails: Profile fetch error</h4>
          <p>• Check if backend is running: http://localhost/mirrormefashion/api/v2/auth/profile/</p>
          <p>• Token might be invalid or expired - logout and login again</p>

          <h4 className="font-semibold mt-4">If Step 3 fails: No avatar</h4>
          <p>• User hasn't uploaded a profile picture yet</p>
          <p>• Upload a new profile picture first</p>

          <h4 className="font-semibold mt-4">If Step 5 fails: Image load error</h4>
          <p>• Open Network tab (F12) and check request to {imageUrl}</p>
          <p>• Check if backend file exists: http://localhost/mirrormefashion/storage/{imageUrl.replace('/api/storage/', '')}</p>
          <p>• Check browser console for CORS or other errors</p>
        </CardContent>
      </Card>
    </div>
  )
}
