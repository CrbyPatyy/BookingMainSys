'use client'

import { useState, useEffect } from 'react'
import RoomCard from './RoomCard'
import { Room } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RoomGridProps {
  rooms: Room[]
}

export default function RoomGrid({ rooms }: RoomGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const roomsPerPage = 6

  // Reset to page 1 when rooms change (due to filtering)
  useEffect(() => {
    setCurrentPage(1)
  }, [rooms])

  const totalPages = Math.ceil(rooms.length / roomsPerPage)
  const startIndex = (currentPage - 1) * roomsPerPage
  const endIndex = startIndex + roomsPerPage
  const currentRooms = rooms.slice(startIndex, endIndex)

  return (
    <div>
      {rooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Instant rendering without animation delays */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentRooms.map((room) => (
              <div
                key={room.id}
                className="animate-fade-in"
                style={{ animationDuration: '0.2s' }}
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:border-primary-500 hover:text-primary-500 transition-all bg-white shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center ${currentPage === page
                    ? 'bg-primary-600 text-white shadow-primary-500/30 shadow-lg scale-110'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:border-primary-500 hover:text-primary-500 transition-all bg-white shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}