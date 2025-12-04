'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bed, Users, Wifi, Coffee, Sparkles, ArrowRight } from 'lucide-react'
import { Room } from '@/types'
import { motion } from 'framer-motion'

interface RoomCardProps {
  room: Room
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  breakfast: <Coffee className="w-4 h-4" />,
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl bg-white shadow-soft hover:shadow-hard transition-all duration-500 border border-gray-100"
    >
      {/* Premium badge */}
      {room.price > 400 && (
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-3 h-3" />
            <span>PREMIUM</span>
          </div>
        </div>
      )}

      {/* Image section */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5" />
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Suite Preview</span>
        </div>
        
        {/* Price tag */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-2 px-4 rounded-xl shadow-lg">
            <span className="text-2xl">₱{room.price}</span>
            <span className="text-sm text-gray-500 ml-1">/night</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-2xl text-gray-900 group-hover:text-primary-600 transition-colors">
            {room.name}
          </h3>
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {room.size} sq ft
          </span>
        </div>

        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{room.description}</p>

        {/* Amenities */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Bed className="w-4 h-4" />
            <span>{room.beds}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Users className="w-4 h-4" />
            <span>{room.maxGuests} guests</span>
          </div>
          {room.amenities.includes('wifi') && (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Wifi className="w-4 h-4" />
              <span>WiFi</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <div className="text-2xl font-bold text-gradient">
            ₱{room.price} <span className="text-sm font-normal text-gray-500">/night</span>
          </div>
          <Link
            href={`/rooms/${room.id}`}
            className="group/link inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
          >
            <span>Explore Suite</span>
            <div className="relative overflow-hidden">
              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-600/5 transition-all duration-500 pointer-events-none rounded-3xl" />
    </motion.div>
  )
}