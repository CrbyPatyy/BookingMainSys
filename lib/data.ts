import { Room, Tour } from '@/types'

// Room data matching dashboard room types and prices
export const roomsData: Room[] = [
  {
    id: 1,
    name: 'Standard Room',
    description: 'Comfortable and affordable accommodation with all essential amenities. Perfect for solo travelers or couples on a budget.',
    price: 500,
    size: '280',
    beds: '1 Queen Bed',
    maxGuests: 2,
    amenities: ['wifi', 'breakfast', 'parking'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'
    ],
  },
  {
    id: 2,
    name: 'Standard Room Twin',
    description: 'Cozy twin room ideal for friends traveling together. Features two comfortable single beds and modern amenities.',
    price: 500,
    size: '300',
    beds: '2 Twin Beds',
    maxGuests: 2,
    amenities: ['wifi', 'breakfast', 'parking'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'
    ],
  },
  {
    id: 3,
    name: 'Superior Room',
    description: 'Upgraded comfort with additional space and premium amenities. Features a king-size bed and enhanced room service.',
    price: 800,
    size: '350',
    beds: '1 King Bed',
    maxGuests: 2,
    amenities: ['wifi', 'breakfast', 'parking', 'gym'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
      'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800&q=80'
    ],
  },
  {
    id: 4,
    name: 'Superior Room Double',
    description: 'Spacious room with two double beds, perfect for families or groups. Includes premium bedding and extra storage.',
    price: 800,
    size: '380',
    beds: '2 Double Beds',
    maxGuests: 4,
    amenities: ['wifi', 'breakfast', 'parking', 'gym'],
    images: [
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'
    ],
  },
  {
    id: 5,
    name: 'Deluxe Room',
    description: 'Luxury accommodation with stunning views, jacuzzi tub, and premium amenities for the discerning traveler.',
    price: 1200,
    size: '450',
    beds: '1 King Bed',
    maxGuests: 2,
    amenities: ['wifi', 'breakfast', 'parking', 'gym', 'pool'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&q=80'
    ],
  },
  {
    id: 6,
    name: 'Deluxe Room Ocean View',
    description: 'Wake up to breathtaking ocean views from your private balcony. Features premium bedding and exclusive amenities.',
    price: 1200,
    size: '480',
    beds: '1 King Bed',
    maxGuests: 3,
    amenities: ['wifi', 'breakfast', 'parking', 'gym', 'pool', 'beach'],
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80'
    ],
  },
  {
    id: 7,
    name: 'Family Suite',
    description: 'Spacious suite designed for families with separate bedroom for parents and bunk beds for kids. Family-friendly amenities included.',
    price: 1500,
    size: '650',
    beds: '1 King Bed + 2 Bunk Beds',
    maxGuests: 5,
    amenities: ['wifi', 'breakfast', 'parking', 'gym', 'pool'],
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
      'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&q=80',
      'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800&q=80'
    ],
  },
  {
    id: 8,
    name: 'Family Suite Premium',
    description: 'Our largest family accommodation with two separate bedrooms, living area, and kitchenette. Perfect for extended stays.',
    price: 1500,
    size: '750',
    beds: '1 King Bed + 1 Queen Bed + Sofa Bed',
    maxGuests: 6,
    amenities: ['wifi', 'breakfast', 'parking', 'gym', 'pool', 'beach'],
    images: [
      'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
      'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800&q=80'
    ],
  },
]

export const toursData: Tour[] = [
  {
    id: 1,
    name: 'Tour A - Lagoon Adventure',
    description: 'Discover El Nido\'s most iconic lagoons including the breathtaking Big Lagoon, Secret Lagoon, and Shimizu Island. Perfect for kayaking and swimming.',
    price: 1200,
    duration: 'Full day',
    maxParticipants: 15,
    location: 'El Nido, Palawan',
    highlights: [
      'Big Lagoon kayaking',
      'Secret Lagoon exploration',
      'Shimizu Island snorkeling',
      'Lunch & equipment included',
    ],
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
      'https://images.unsplash.com/photo-1578674473246-26c8f0b723ba?w=800&q=80'
    ],
  },
  {
    id: 2,
    name: 'Tour B - Island Beach Hopping',
    description: 'Explore pristine beaches and caves at Pinagbuyutan Island, Cudugnon Cave, Cathedral Cave, and the famous Snake Island sandbar.',
    price: 1400,
    duration: 'Full day',
    maxParticipants: 15,
    location: 'El Nido, Palawan',
    highlights: [
      'Snake Island sandbar',
      'Pinagbuyutan Island beach',
      'Cudugnon Cave exploration',
      'Snorkeling & lunch included',
    ],
    images: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80'
    ],
  },
  {
    id: 3,
    name: 'Tour C - Hidden Beaches & Shrines',
    description: 'Visit the hidden beaches, secret beaches, and the Matinloc Shrine with stunning panoramic views of Tapiutan Island.',
    price: 1400,
    duration: 'Full day',
    maxParticipants: 15,
    location: 'El Nido, Palawan',
    highlights: [
      'Hidden Beach swimming',
      'Matinloc Shrine visit',
      'Helicopter Island beach',
      'Secret Beach exploration',
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=800&q=80',
      'https://images.unsplash.com/photo-1552083375-1447ce886485?w=800&q=80'
    ],
  },
  {
    id: 4,
    name: 'Tour D - Paradise Islands',
    description: 'Experience the ultimate island paradise at Cadlao Lagoon, Paradise Beach, and Pasandigan Cove with world-class snorkeling spots.',
    price: 1200,
    duration: 'Full day',
    maxParticipants: 15,
    location: 'El Nido, Palawan',
    highlights: [
      'Cadlao Lagoon kayaking',
      'Paradise Beach relaxation',
      'Pasandigan Beach snorkeling',
      'Nat-Nat Beach visit',
    ],
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80'
    ],
  },
  {
    id: 5,
    name: 'Spa & Wellness Package',
    description: 'Indulge in a relaxing spa experience with traditional Filipino hilot massage, body scrub, and aromatherapy treatment at our beachfront spa pavilion.',
    price: 1800,
    duration: '2 hours',
    maxParticipants: 2,
    location: 'Resort Spa Pavilion',
    highlights: [
      'Traditional hilot massage',
      'Coconut body scrub',
      'Aromatherapy treatment',
      'Welcome drink included',
    ],
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80'
    ],
  },
  {
    id: 6,
    name: 'Sunset Cruise Experience',
    description: 'Sail along the stunning El Nido coastline during golden hour. Enjoy cocktails, canapés, and breathtaking sunset views aboard our traditional bangka.',
    price: 2500,
    duration: '3 hours',
    maxParticipants: 8,
    location: 'El Nido Bay',
    highlights: [
      'Traditional bangka boat',
      'Cocktails & canapés',
      'Sunset photo opportunities',
      'Snorkeling gear provided',
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      'https://images.unsplash.com/photo-1476673160081-cf065f25c2b8?w=800&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80'
    ],
  },
]
