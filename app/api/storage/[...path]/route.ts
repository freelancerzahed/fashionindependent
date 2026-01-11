import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { extname } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const pathString = path.join('/')
    
    console.log(`🔄 Reading file from storage: ${pathString}`)
    
    // Construct file path to storage directory
    // Storage is at: D:\laragon\www\mirrormefashion\storage\app\public\
    const filePath = `D:\\laragon\\www\\mirrormefashion\\storage\\app\\public\\${pathString}`
    
    console.log(`📁 File path: ${filePath}`)
    
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
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error('❌ File read error:', error instanceof Error ? error.message : error)
    return new NextResponse('File not found', { status: 404 })
  }
}
