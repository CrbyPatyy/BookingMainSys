'use client'

import { Bed, Users, Wifi, Tv } from 'lucide-react'
import { useState } from 'react'

interface RoomGridProps {
  rooms: any[]
}

const statusColors = {
  available: 'bg-green-100 text-green-800 border-green-200',
  occupied: 'bg-red-100 text-red-800 border-red-200',
  reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  maintenance: 'bg-gray-100 text-gray-800 border-gray-200',
}

export default function RoomGrid({ rooms }: RoomGridProps) {
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all')

  const filteredRooms = filter === 'all'
    ? rooms
    : rooms.filter(room => room.status === filter)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Room Status</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-lg ${filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1 text-sm rounded-lg ${filter === 'available'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Available ({rooms.filter(r => r.status === 'available').length})
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-3 py-1 text-sm rounded-lg ${filter === 'occupied'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Occupied ({rooms.filter(r => r.status === 'occupied').length})
          </button>
          <button
            onClick={() => setFilter('reserved')}
            className={`px-3 py-1 text-sm rounded-lg ${filter === 'reserved'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Reserved ({rooms.filter(r => r.status === 'reserved').length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className={`
              group bg-white border border-gray-100 rounded-2xl p-5 
              shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
              ${statusColors[room.status as keyof typeof statusColors].replace('text-', 'ring-1 ring-').replace('border-', '')}
              relative overflow-hidden
            `}
          >
            {/* Status Indicator Stripe */}
            <div className={`absolute top-0 left-0 w-1 h-full ${statusColors[room.status as keyof typeof statusColors].split(' ')[0].replace('bg-', 'bg-')}`} />

            <div className="flex items-start justify-between mb-4 pl-3">
              <div>
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                  Room {room.number}
                </h3>
                <p className="text-sm font-medium text-gray-500">{room.type}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${statusColors[room.status as keyof typeof statusColors].split(' ')[0]}`}>
                <Bed size={20} className={statusColors[room.status as keyof typeof statusColors].split(' ')[1]} />
              </div>
            </div>

            <div className="space-y-3 pl-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[room.status as keyof typeof statusColors]}`}>
                  {room.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Price</span>
                <span className="font-bold text-gray-900">₱{room.price.toLocaleString()}<span className="text-gray-400 font-normal">/person</span></span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Capacity</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">{room.capacity}</span>
                  <Users size={14} className="text-gray-400" />
                </div>
              </div>

              {room.bookings?.[0]?.guests?.name && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Current Guest</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{room.bookings[0].guests.name}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 pl-3">
              {room.amenities?.includes('wifi') && (
                <div className="group/icon relative">
                  <Wifi size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              )}
              {room.amenities?.includes('tv') && (
                <div className="group/icon relative">
                  <Tv size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              )}
              {room.amenities?.includes('ac') && (
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors border border-gray-200 rounded px-1">AC</span>
              )}
              {room.amenities?.includes('jacuzzi') && (
                <span title="Jacuzzi" className="text-sm grayscale group-hover:grayscale-0 transition-all">🛁</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}