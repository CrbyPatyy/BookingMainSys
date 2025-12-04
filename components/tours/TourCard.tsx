import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, MapPin, ArrowRight } from 'lucide-react'
import { Tour } from '@/types'

interface TourCardProps {
  tour: Tour
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Tour Image</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="flex justify-between items-end">
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-1 px-3 rounded-full text-sm">
              ₱{tour.price}
            </span>
            <span className="bg-black/60 text-white py-1 px-2 rounded text-xs">
              {tour.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {tour.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>

        <div className="space-y-2 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Max {tour.maxParticipants} people</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{tour.location}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-primary-600">
            ₱{tour.price} <span className="text-sm font-normal text-gray-500">per person</span>
          </div>
          <Link
            href={`/tours/${tour.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
          >
            Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}