'use client'

import { useState } from 'react'
import { Room } from '@/types'
import { 
  Bed, 
  Users, 
  Wifi, 
  Coffee, 
  Car, 
  Dumbbell, 
  Waves,
  Check,
  Square
} from 'lucide-react'

interface RoomDetailProps {
  room: Room
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-5 h-5" />,
  breakfast: <Coffee className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  gym: <Dumbbell className="w-5 h-5" />,
  beach: <Waves className="w-5 h-5" />,
}

export default function RoomDetail({ room }: RoomDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Room header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{room.name}</h1>
        <p className="text-xl text-primary-600 font-bold">
          ₱{room.price} <span className="text-base font-normal text-gray-600">/ night</span>
        </p>
      </div>

      {/* Image gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
        <div className="lg:col-span-2">
          <div className="aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
            <span className="text-gray-500">Main Room Image</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((img) => (
            <div
              key={img}
              className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(img)}
            >
              <span className="text-gray-400 text-sm">Image {img}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column - Details */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{room.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Bed className="w-5 h-5" />
                <span>Bed Type</span>
              </div>
              <p className="font-medium">{room.beds}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span>Maximum Guests</span>
              </div>
              <p className="font-medium">{room.maxGuests} guests</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Square className="w-5 h-5" />
                <span>Room Size</span>
              </div>
              <p className="font-medium">{room.size} sq ft</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5" />
                <span>Availability</span>
              </div>
              <p className="font-medium text-green-600">Available</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-primary-600">
                    {amenityIcons[amenity] || <Check className="w-5 h-5" />}
                  </div>
                  <span className="capitalize">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Highlights */}
        <div>
          <div className="card p-6 sticky top-6">
            <h3 className="font-bold text-lg mb-4">Room Highlights</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Free high-speed WiFi</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Daily housekeeping</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">24/7 room service</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Air conditioning</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Private bathroom</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Flat-screen TV</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  ₱{room.price}
                </div>
                <p className="text-gray-600">per night</p>
                <p className="text-sm text-gray-500 mt-2">+ taxes and fees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}