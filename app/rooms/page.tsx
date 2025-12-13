'use client'

import { useState, useMemo, useCallback } from 'react'
import { roomsData } from '@/lib/data'
import RoomGrid from '@/components/rooms/RoomGrid'
import Filters, { FilterState } from '@/components/rooms/Filters'
import SearchBar from '@/components/rooms/SearchBar'
import PageHero from '@/components/common/PageHero'
import { motion } from 'framer-motion'
import { Sparkles, BedDouble, Key, SlidersHorizontal } from 'lucide-react'

export default function RoomsPage() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: null,
    guests: null,
    bedType: null,
    amenities: []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Memoize callbacks to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  // Filter rooms based on all criteria
  const filteredRooms = useMemo(() => {
    return roomsData.filter(room => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesName = room.name.toLowerCase().includes(search)
        const matchesDescription = room.description.toLowerCase().includes(search)
        const matchesAmenities = room.amenities.some(a => a.toLowerCase().includes(search))
        if (!matchesName && !matchesDescription && !matchesAmenities) {
          return false
        }
      }

      // Price range filter (inclusive boundaries)
      if (filters.priceRange) {
        if (room.price < filters.priceRange.min || room.price > filters.priceRange.max) {
          return false
        }
      }

      // Guests filter (room must accommodate at least this many guests)
      if (filters.guests) {
        if (room.maxGuests < filters.guests) {
          return false
        }
      }

      // Bed type filter
      if (filters.bedType) {
        const bedTypeLower = filters.bedType.toLowerCase()
        if (!room.beds.toLowerCase().includes(bedTypeLower)) {
          return false
        }
      }

      // Amenities filter (room must have ALL selected amenities)
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          room.amenities.includes(amenity)
        )
        if (!hasAllAmenities) {
          return false
        }
      }

      return true
    })
  }, [searchTerm, filters])

  const activeFiltersCount = [
    filters.priceRange,
    filters.guests,
    filters.bedType,
    filters.amenities.length > 0 ? 'amenities' : null
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Luxury Accommodations"
        subtitle="Experience unparalleled comfort in our meticulously designed rooms and suites."
        image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-30">

        {/* Quick Stats / Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4">
          {[
            { icon: Sparkles, label: 'Premium Amenities', text: 'Top-tier comforts in every room' },
            { icon: BedDouble, label: 'Luxury Bedding', text: 'Sleep in cloud-like comfort' },
            { icon: Key, label: 'Smart Access', text: 'Seamless & secure entry' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4"
            >
              <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-500">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white py-3 px-4 rounded-xl shadow-sm border border-gray-200 font-medium text-gray-700"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar - Desktop always visible, mobile conditional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`lg:w-1/4 lg:sticky lg:top-24 w-full ${showMobileFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white rounded-3xl shadow-xl p-1 border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-lg text-gray-900">Filter Your Stay</h2>
              </div>
              <div className="p-2">
                <Filters onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:w-3/4 w-full space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <SearchBar onSearchChange={handleSearchChange} />
            </motion.div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredRooms.length}</span> room{filteredRooms.length !== 1 ? 's' : ''} found
                {(searchTerm || activeFiltersCount > 0) && (
                  <span className="text-primary-600"> matching your criteria</span>
                )}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <RoomGrid rooms={filteredRooms} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}