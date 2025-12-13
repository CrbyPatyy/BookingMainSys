// Folio system for tracking charges during guest stay

export type ChargeType = 'room_night' | 'room_service' | 'minibar' | 'laundry' | 'spa' | 'damage' | 'late_checkout' | 'early_checkin' | 'other'

export interface FolioItem {
    id: string
    booking_id: string
    charge_type: ChargeType
    description: string
    amount: number
    quantity: number
    created_at: string
    created_by?: string // Staff who added the charge
}

export interface Folio {
    booking_id: string
    items: FolioItem[]
    room_total: number // Original room booking
    charges_total: number // Additional charges
    payments_total: number // Payments made
    balance_due: number // Remaining to pay
}

// Get folio for a booking
export async function getFolio(bookingId: string): Promise<Folio> {
    // TODO: Backend - implement Supabase query
    return {
        booking_id: bookingId,
        items: [],
        room_total: 0,
        charges_total: 0,
        payments_total: 0,
        balance_due: 0
    }
}

// Add charge to folio
export async function addFolioCharge(
    bookingId: string,
    charge: Omit<FolioItem, 'id' | 'booking_id' | 'created_at'>
): Promise<FolioItem> {
    // TODO: Backend - implement
    const newCharge: FolioItem = {
        id: `charge-${Date.now()}`,
        booking_id: bookingId,
        ...charge,
        created_at: new Date().toISOString()
    }
    console.log('Adding charge:', newCharge)
    return newCharge
}

// Get all charges for a booking
export async function getFolioCharges(bookingId: string): Promise<FolioItem[]> {
    // TODO: Backend - implement
    return []
}
