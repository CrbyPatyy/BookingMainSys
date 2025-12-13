export interface Room {
  id: string
  number: string
  type: string
  price: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  amenities: string[]
  description?: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

// Room data - Replace with database query when ready
export const rooms: Room[] = Array.from({ length: 24 }, (_, i) => {
  const roomNum = 100 + i + 1
  const types = ['Standard Room', 'Superior Room', 'Deluxe Room', 'Family Suite']
  const typeIndex = i % 4

  // Varied capacities: Different rooms have different guest capacities (1-5)
  let capacity: number
  if (typeIndex === 0) { // Standard Room
    capacity = (i % 3) + 1 // Varies: 1, 2, or 3 guests
  } else if (typeIndex === 1) { // Superior Room
    capacity = ((i % 3) + 2) // Varies: 2, 3, or 4 guests
  } else if (typeIndex === 2) { // Deluxe Room
    capacity = ((i % 3) + 3) // Varies: 3, 4, or 5 guests
  } else { // Family Suite
    capacity = ((i % 2) + 4) // Varies: 4 or 5 guests
  }

  return {
    id: `room-${i}`,
    number: `${roomNum}`,
    type: types[typeIndex],
    // Realistic per-person/night pricing (Philippine resort model)
    price: typeIndex === 0 ? 500 : typeIndex === 1 ? 800 : typeIndex === 2 ? 1200 : 1500,
    capacity: capacity,
    status: 'available', // Default status
    amenities: ['wifi', 'tv', 'ac', 'coffee'].slice(0, (i % 3) + 2),
    description: `Experience comfort in our ${types[typeIndex]}. Perfect for relaxation with modern amenities.`,
    image_url: typeIndex === 0
      ? 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
      : typeIndex === 1
        ? 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'
        : typeIndex === 2
          ? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'
          : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'
  }
})

export async function getRooms(status?: string): Promise<Room[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  if (status && status !== 'all') {
    return rooms.filter(r => r.status === status)
  }
  return rooms
}

export async function getRoom(id: string): Promise<Room | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return rooms.find(r => r.id === id)
}

// Get available rooms based on check-in/check-out dates and guest count
export async function getAvailableRooms(
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<Room[]> {
  await new Promise(resolve => setTimeout(resolve, 300))

  // Filter by capacity - in real app would also check bookings
  return rooms.filter(room => room.capacity >= guests)
}