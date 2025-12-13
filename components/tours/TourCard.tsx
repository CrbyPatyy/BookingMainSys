'use client'

import Link from 'next/link'
import { Clock, Users, MapPin, ArrowRight, Star } from 'lucide-react'
import { Tour } from '@/types'
import { motion } from 'framer-motion'

interface TourCardProps {
  tour: Tour
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={tour.images[0]}
          alt={tour.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Rating/Badge (Mock) */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-900">4.9</span>
            <span className="text-xs text-gray-400">(120)</span>
          </div>
        </div>

        {/* Price Tag (Overlay) */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-primary-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-primary-900/20">
            <span className="text-lg font-bold">₱{tour.price}</span>
            <span className="text-xs text-primary-100 font-medium ml-1">/person</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
          {tour.name}
        </h3>

        <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
          <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
          <span className="truncate">{tour.location}</span>
        </div>

        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
          {tour.description}
        </p>

        <div className="mt-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <Clock className="w-5 h-5 text-primary-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Duration</span>
                <span className="text-sm font-semibold text-gray-700">{tour.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <Users className="w-5 h-5 text-primary-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Group Size</span>
                <span className="text-sm font-semibold text-gray-700">Max {tour.maxParticipants}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/tours/${tour.id}`}
              className="group/btn flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              <span>Details</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={`/tours/booking?tourId=${tour.id}`}
              className="group/btn flex items-center justify-center gap-2 bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-primary-600/30"
            >
              <span>Book Tour</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}