import { NextRequest, NextResponse } from 'next/server'

// Mock database - in a real app, this would be a proper database
let listings: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    let filteredListings = listings

    if (userId) {
      filteredListings = filteredListings.filter(listing => listing.userId === userId)
    }

    if (status) {
      filteredListings = filteredListings.filter(listing => listing.status === status)
    }

    return NextResponse.json(filteredListings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newListing = {
      id: `listing_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    listings.push(newListing)

    return NextResponse.json(newListing, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}