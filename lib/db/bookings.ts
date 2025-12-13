// Booking source tracks where the reservation came from
export type BookingSource = 'direct' | 'booking.com' | 'agoda' | 'expedia' | 'phone' | 'walk-in'

// Payment methods - for walk-ins and balance settlements
export type PaymentMethod = 'online' | 'cash' | 'card' | 'bank_transfer' | 'gcash' | 'maya'

// Generate a guest-facing confirmation code (e.g., "SAN-A7X9K2")
export function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude confusing chars (0,O,1,I)
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `SAN-${code}`
}

export interface Booking {
  id: string
  confirmation_code: string // Guest-facing reference (e.g., "SAN-A7X9K2")
  guest_id: string

  // Room booking - guests book a TYPE, room assigned at check-in
  room_type: string // e.g., "Deluxe Suite", "Standard Room"
  room_type_id?: string // Reference to room type for pricing
  assigned_room_id?: string // Specific room assigned at check-in
  assigned_room_number?: string // Room number (e.g., "101")

  check_in: string // Scheduled date (YYYY-MM-DD)
  check_out: string // Scheduled date (YYYY-MM-DD)
  check_in_time?: string // Actual check-in time (HH:MM)
  check_out_time?: string // Actual check-out time (HH:MM)
  eta?: string // Estimated arrival time (HH:MM)

  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show'
  booking_source: BookingSource // Where the booking came from

  // Payment tracking
  total_amount: number // Original booking cost
  folio_charges: number // Extra charges during stay (room service, etc.)
  balance_due: number // Remaining amount to pay (for extras)
  payment_status: 'unpaid' | 'deposit' | 'paid' | 'refunded'
  payment_method: PaymentMethod // How they paid
  payment_confirmed: boolean // For walk-ins: staff confirmed payment received
  transaction_id?: string

  // Add-ons
  airport_pickup: boolean
  pickup_time?: string
  special_requests?: string

  // Guest count
  adults: number
  children: number

  // Check-in verification
  id_verified?: boolean // ID checked during check-in

  created_at: string
  updated_at: string

  // Related data (joined)
  guests?: {
    name: string
    email: string
    phone: string
  }
  rooms?: {
    number: string
    type: string
    price: number
  }
}

// TODO: Connect to real database - returns empty array for now
export async function getBookings(
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<Booking[]> {
  // Replace with real database query
  // Example: const { data } = await supabase.from('bookings').select('*, guests(*), rooms(*)')
  return []
}

// TODO: Connect to real database
export async function getTodayArrivals(): Promise<Booking[]> {
  // Replace with real database query
  // Filter: check_in = today AND status = 'confirmed'
  return []
}

// TODO: Connect to real database
export async function getTodayDepartures(): Promise<Booking[]> {
  // Replace with real database query
  // Filter: check_out = today AND status = 'checked-in'
  return []
}

// TODO: Connect to real database
export async function updateBookingStatus(
  bookingId: string,
  status: Booking['status']
): Promise<boolean> {
  // Replace with real database update
  // Example: await supabase.from('bookings').update({ status, updated_at: new Date().toISOString() }).eq('id', bookingId)
  return true
}