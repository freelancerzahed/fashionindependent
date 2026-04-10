import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/mirrormefashion/api/v2'
    
    const response = await fetch(`${API_URL}/auth/profile/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    
    return NextResponse.json({
      status: response.status,
      data: data,
      debug: {
        API_URL: API_URL,
        token_received: !!token,
        avatar_path_returned: data.data?.avatar_path,
        avatar_returned: data.data?.avatar,
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
