export interface Room {
  id: number
  name: string
  description: string
  price: number
  size: string
  beds: string
  maxGuests: number
  amenities: string[]
  images: string[]
}

export interface Tour {
  id: number
  name: string
  description: string
  price: number
  duration: string
  maxParticipants: number
  location: string
  highlights: string[]
  images: string[]
}

export interface Booking {
  id: string
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  roomId?: number
  tourId?: number
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}