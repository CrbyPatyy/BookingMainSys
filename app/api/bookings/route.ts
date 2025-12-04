import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, use a real database
let bookings: any[] = []

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    
    // Basic validation
    if (!bookingData.name || !bookingData.email || !bookingData.checkIn || !bookingData.checkOut) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create a new booking with ID and timestamp
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    }

    // Add to "database"
    bookings.push(newBooking)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking confirmed!',
        booking: newBooking
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ bookings })
}