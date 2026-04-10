// This file is deprecated - use [...path]/route.ts instead
// This is a catch-all route that handles nested paths like /api/storage/uploads/profiles/image.jpg

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'This route is deprecated. Use ./[...path]/route.ts' },
    { status: 404 }
  )
}

