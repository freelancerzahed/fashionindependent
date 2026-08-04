import { NextRequest, NextResponse } from 'next/server'

// Mock database - in a real app, this would be a proper database
let listings: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = listings.find(l => l.id === params.id)

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const listingIndex = listings.findIndex(l => l.id === params.id)

    if (listingIndex === -1) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const updatedListing = {
      ...listings[listingIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    listings[listingIndex] = updatedListing

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingIndex = listings.findIndex(l => l.id === params.id)

    if (listingIndex === -1) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    listings.splice(listingIndex, 1)

    return NextResponse.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
}