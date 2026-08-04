import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { extname, join, resolve } from 'path'
import { BACKEND_URL } from '@/config'

function getContentType(filePath: string) {
  const ext = extname(filePath).toLowerCase()

  switch (ext) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    case '.webp':
      return 'image/webp'
    case '.pdf':
      return 'application/pdf'
    case '.doc':
      return 'application/msword'
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case '.txt':
      return 'text/plain'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const normalizedPath = (path || [])
      .filter(Boolean)
      .map((segment) => segment.replace(/^\/+|\/+$/g, ''))
      .join('/')

    const pathString = normalizedPath

    console.log(`🔄 Reading file from storage: ${pathString}`)

    const storageRoot = process.env.NEXT_STORAGE_PATH || 'C:\\laragon\\www\\mirrormefashion\\storage\\app\\public'
    const filePath = resolve(join(storageRoot, ...path))

    console.log(`💾 Storage root from env: ${process.env.NEXT_STORAGE_PATH}`)
    console.log(`💾 Using storage root: ${storageRoot}`)
    console.log(`📁 Resolved file path: ${filePath}`)

    try {
      const fileStats = await stat(filePath)
      if (fileStats.isFile()) {
        const buffer = await readFile(filePath)
        const contentType = getContentType(filePath)
        const filename = pathString.split('/').pop() || 'file'

        console.log(`✅ Successfully read local file: ${pathString} (${buffer.byteLength} bytes, type: ${contentType})`)

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${filename}"`,
            'Cache-Control': 'public, max-age=86400',
          },
        })
      }
    } catch (statErr) {
      console.warn(`⚠️ Local storage file not found, trying backend storage URL: ${filePath}`)
    }

    const backendBaseUrl = BACKEND_URL.replace(/\/api\/v2\/?$/, '')
    const remoteStorageUrl = `${backendBaseUrl}/storage/${pathString}`

    console.log(`🌐 Fetching image from backend storage URL: ${remoteStorageUrl}`)

    const remoteResponse = await fetch(remoteStorageUrl, {
      headers: {
        Accept: 'image/*,*/*',
      },
    })

    if (remoteResponse.ok) {
      const buffer = Buffer.from(await remoteResponse.arrayBuffer())
      const contentType = remoteResponse.headers.get('content-type') || getContentType(filePath)
      const filename = pathString.split('/').pop() || 'file'

      console.log(`✅ Successfully fetched remote file: ${pathString} (${buffer.byteLength} bytes, type: ${contentType})`)

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }

    console.error(`❌ Remote storage fetch failed: ${remoteResponse.status} ${remoteResponse.statusText}`)
    return new NextResponse('File not found', { status: 404 })
  } catch (error) {
    console.error('❌ File read error:', error instanceof Error ? error.message : error)

    const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="#f0f0f0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="#999">
        Image Not Available
      </text>
    </svg>`

    return new NextResponse(placeholderSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}
