'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bed, Users, Wifi, Coffee, Sparkles, ArrowRight, Maximize } from 'lucide-react'
import { Room } from '@/types'
import { motion } from 'framer-motion'

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {room.price >= 1000 && (
            <div className="bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>PREMIUM</span>
            </div>
          )}
        </div>

        {/* Price Tag (Overlay) */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20">
            <span className="text-xl font-bold text-gray-900">₱{room.price.toLocaleString()}</span>
            <span className="text-xs text-gray-500 font-medium">/person</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
            {room.name}
          </h3>
        </div>

        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
          {room.description}
        </p>

        <div className="mt-auto space-y-6">
          {/* Key Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Guests</span>
                <span className="text-sm font-semibold text-gray-700">{room.maxGuests} Max</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm flex-shrink-0">
                <Maximize className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Size</span>
                <span className="text-sm font-semibold text-gray-700">{room.size} ft²</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100 col-span-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm flex-shrink-0">
                <Bed className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Bedding</span>
                <span className="text-sm font-semibold text-gray-700 line-clamp-1">{room.beds}</span>
              </div>
            </div>
          </div>

          <Link
            href={`/rooms/${room.id}`}
            className="group/btn w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-primary-500/30"
          >
            <span>View Room Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}