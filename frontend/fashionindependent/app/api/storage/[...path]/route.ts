import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { extname, join, resolve } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const pathString = path.join('/')
    
    console.log(`🔄 Reading file from storage: ${pathString}`)
    
    // Construct file path to storage directory using environment variable
    const storageRoot = process.env.NEXT_STORAGE_PATH || 'C:\\laragon\\www\\mirrormefashion\\storage\\app\\public'
    console.log(`💾 Storage root from env: ${process.env.NEXT_STORAGE_PATH}`)
    console.log(`💾 Using storage root: ${storageRoot}`)
    const filePath = resolve(join(storageRoot, ...path))
    
    console.log(`📁 Resolved file path: ${filePath}`)
    
    // Check if file exists first
    try {
      await stat(filePath)
      console.log(`✅ File exists: ${filePath}`)
    } catch (statErr) {
      console.error(`❌ File not found at path: ${filePath}`)
      console.error(`   Error: ${statErr instanceof Error ? statErr.message : statErr}`)
      return new NextResponse('File not found', { status: 404 })
    }
    
    // Read file from disk
    const buffer = await readFile(filePath)
    
    // Determine content type from file extension
    const ext = extname(filePath).toLowerCase()
    let contentType = 'application/octet-stream'
    
    // Image types
    if (ext === '.png') contentType = 'image/png'
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    if (ext === '.gif') contentType = 'image/gif'
    if (ext === '.webp') contentType = 'image/webp'
    
    // Document types
    if (ext === '.pdf') contentType = 'application/pdf'
    if (ext === '.doc') contentType = 'application/msword'
    if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    if (ext === '.txt') contentType = 'text/plain'
    
    // Get filename for download
    const filename = pathString.split('/').pop() || 'file'
    
    console.log(`✅ Successfully read file: ${pathString} (${buffer.byteLength} bytes, type: ${contentType})`)
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error('❌ File read error:', error instanceof Error ? error.message : error)
    
    // Serve a placeholder SVG when file is not found
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
