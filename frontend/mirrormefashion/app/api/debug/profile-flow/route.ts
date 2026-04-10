import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/mirrormefashion/api/v2'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.nextUrl.searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ 
        error: 'No token provided. Pass token as Bearer header or ?token=YOUR_TOKEN',
        example: `${request.nextUrl.pathname}?token=your_token_here`
      }, { status: 401 })
    }

    console.log('[Debug] Testing profile flow with token:', token.substring(0, 20) + '...')

    // Step 1: Fetch profile
    console.log('[Debug] Step 1: Fetching profile from', BACKEND_URL + '/auth/profile/')
    const profileResponse = await fetch(`${BACKEND_URL}/auth/profile/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('[Debug] Profile response status:', profileResponse.status)
    const profileData = await profileResponse.json()
    console.log('[Debug] Profile data:', JSON.stringify(profileData, null, 2))

    if (!profileResponse.ok) {
      return NextResponse.json({
        step: 'fetch_profile',
        status: profileResponse.status,
        data: profileData,
        error: 'Failed to fetch profile'
      }, { status: profileResponse.status })
    }

    const profile = profileData.data
    const avatarPath = profile?.avatar_path
    const avatarUrl = profile?.avatar

    console.log('[Debug] Avatar path from response:', avatarPath)
    console.log('[Debug] Avatar URL from response:', avatarUrl)

    // Step 2: Check if avatar path exists
    if (!avatarPath && !avatarUrl) {
      return NextResponse.json({
        step: 'check_avatar',
        status: 'no_avatar',
        profile: profile,
        message: 'No avatar_path or avatar in profile response'
      })
    }

    // Step 3: Construct frontend URL
    let constructedUrl = null
    if (avatarPath) {
      constructedUrl = `/api/storage/${avatarPath}`
    } else if (avatarUrl) {
      constructedUrl = avatarUrl
    }

    console.log('[Debug] Constructed URL for frontend:', constructedUrl)

    // Step 4: Test if backend storage file exists
    if (avatarPath) {
      const baseUrl = BACKEND_URL.replace('/api/v2', '')
      const storageUrl = `${baseUrl}/storage/${avatarPath}`
      console.log('[Debug] Testing backend storage URL:', storageUrl)
      
      const storageResponse = await fetch(storageUrl)
      console.log('[Debug] Storage file response status:', storageResponse.status)
      
      return NextResponse.json({
        step: 'complete',
        profile: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          user_type: profile.user_type,
          avatar_path: avatarPath,
          avatar_url: avatarUrl,
        },
        frontend_image_url: constructedUrl,
        backend_storage_test: {
          url: storageUrl,
          accessible: storageResponse.ok,
          status: storageResponse.status,
          content_type: storageResponse.headers.get('content-type'),
        },
        instructions: `
1. Frontend should use this URL for the image: ${constructedUrl}
2. Verify the image is displayed in <img src="${constructedUrl}" />
3. If not displaying, check:
   - Browser console for CORS errors
   - Network tab to see if request to ${constructedUrl} succeeds
   - Check if ${storageUrl} is accessible
        `
      })
    }

    return NextResponse.json({
      step: 'complete',
      profile: profile,
      frontend_image_url: constructedUrl,
    })

  } catch (error) {
    console.error('[Debug] Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      trace: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}
