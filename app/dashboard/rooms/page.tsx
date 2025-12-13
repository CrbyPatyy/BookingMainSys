'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bed, Users, Wifi, Tv, Coffee, Wind, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { getRooms } from '@/lib/db/rooms'
import RoomModal from '@/components/adminDashboard/RoomModal'

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700 border-green-200 ring-green-100',
  occupied: 'bg-red-100 text-red-700 border-red-200 ring-red-100',
  reserved: 'bg-yellow-100 text-yellow-700 border-yellow-200 ring-yellow-100',
  maintenance: 'bg-gray-100 text-gray-700 border-gray-200 ring-gray-100',
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  tv: <Tv size={14} />,
  ac: <Wind size={14} />,
  coffee: <Coffee size={14} />,
}

export default function RoomsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Date Selection State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')
  const [activeRoom, setActiveRoom] = useState<any>(null)

  const handleOpenModal = (room: any, mode: 'view' | 'edit') => {
    setActiveRoom(room)
    setModalMode(mode)
    setModalOpen(true)
  }

  const handleSaveRoom = (updatedRoom: any) => {
    // Update local state (in a real app, this would be an API call)
    setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r))
  }

  // Fetch rooms
  useEffect(() => {
    fetchRooms()
  }, []) // Fetch once, filtering is done locally for status mock

  const fetchRooms = async () => {
    setLoading(true)
    try {
      // simulate API call or use real one
      const data = await getRooms()

      if (data) {
        setRooms(data)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get room status - now uses actual status from database
  // TODO: For date-based availability, implement a booking lookup query
  const getRoomStatusForDate = (room: any, date: Date): string => {
    // Return the actual room status from the database
    // In a full implementation, this would check bookings for the selected date
    return room.status || 'available'
  }

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    // Get actual status from database
    const dynamicStatus = getRoomStatusForDate(room, selectedDate)

    const matchesSearch = room.number?.includes(search) ||
      room.type?.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || room.type?.toLowerCase().includes(typeFilter)

    // Filter by dynamic status
    const matchesStatus = statusFilter === 'all' || dynamicStatus === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  // Date manipulation helpers
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + days)
    setSelectedDate(newDate)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={activeRoom}
        mode={modalMode}
        onSave={handleSaveRoom}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rooms Management</h1>
          <p className="text-gray-500 mt-1">Check availability and manage rooms</p>
        </div>
        <div className="flex gap-4">
          {/* Date Control */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2 px-2">
              <CalendarIcon size={18} className="text-blue-600" />
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="text-sm font-bold text-gray-900 bg-transparent outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={() => setSelectedDate(new Date())}
              className="ml-2 px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Today
            </button>
          </div>

          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-medium">
            + Add Room
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Search */}
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by room number or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all hover:bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard Room</option>
              <option value="superior">Superior Room</option>
              <option value="deluxe">Deluxe Room</option>
              <option value="family">Family Suite</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading rooms...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => {
            // Get status from database
            const currentStatus = getRoomStatusForDate(room, selectedDate)

            return (
              <div key={room.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 w-full h-1 ${statusColors[currentStatus as keyof typeof statusColors]?.split(' ')[0]}`} />

                {/* Room Header */}
                <div className="p-5 border-b border-gray-50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[currentStatus]}`}>
                        {currentStatus}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Room {room.number}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">{room.type}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors`}>
                    <Bed size={22} strokeWidth={2} />
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-900">
                      <span className="text-xl font-bold">₱{room.price?.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 font-medium">/person</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                      <Users size={14} />
                      <span>{room.capacity}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex gap-2 mb-6">
                      {room.amenities.map((amenity: string) => (
                        <div key={amenity} className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors" title={amenity}>
                          {amenityIcons[amenity as keyof typeof amenityIcons] || amenity.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentStatus === 'available' ? (
                      <>
                        <button
                          onClick={() => router.push(`/dashboard/bookings?newBooking=true&roomId=${room.id}&roomNumber=${room.number}&date=${selectedDate.toISOString()}`)}
                          className="col-span-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all"
                        >
                          Book Now
                        </button>
                        <button
                          onClick={() => handleOpenModal({ ...room, status: currentStatus }, 'view')}
                          className="bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleOpenModal({ ...room, status: currentStatus }, 'edit')}
                          className="bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenModal({ ...room, status: currentStatus }, 'view')}
                          className="bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleOpenModal({ ...room, status: currentStatus }, 'edit')}
                          className="bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
