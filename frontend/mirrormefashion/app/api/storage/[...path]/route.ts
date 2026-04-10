/**
 * Proxy route for serving storage files from backend
 * Converts /api/storage/{path} requests to backend storage URLs
 */

import { NextRequest, NextResponse } from 'next/server'

// Extract base URL from API_URL (remove /api/v2 suffix)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/mirrormefashion/api/v2'
const BACKEND_URL = API_URL.replace('/api/v2', '')

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the file path from the URL segments
    const filePath = (params.path || []).join('/')
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      )
    }

    // Build the complete backend URL for the storage file
    const backendUrl = `${BACKEND_URL}/storage/${filePath}`
    
    console.log(`[Storage Proxy] Fetching: ${backendUrl}`)

    // Fetch the file from backend
    const response = await fetch(backendUrl)

    if (!response.ok) {
      console.error(`[Storage Proxy] Backend returned ${response.status} for ${backendUrl}`)
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: response.status }
      )
    }

    // Get the content type from backend response
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    
    // Stream the file content with proper headers
    const buffer = await response.arrayBuffer()
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('[Storage Proxy] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch file from storage' },
      { status: 500 }
    )
  }
}
