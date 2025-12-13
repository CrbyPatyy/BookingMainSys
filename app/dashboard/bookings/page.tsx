'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search, Calendar, User, Bed, CreditCard, Plane } from 'lucide-react'
import { getBookings, updateBookingStatus, Booking } from '@/lib/db/bookings'
import { useSearchParams, useRouter } from 'next/navigation'
import BookingModal from '@/components/adminDashboard/BookingModal'
import RoomAssignmentModal from '@/components/adminDashboard/RoomAssignmentModal'
import CheckInModal from '@/components/adminDashboard/CheckInModal'

// Only statuses shown on Bookings page (upcoming arrivals)
// checked-in → In-House page | checked-out, cancelled, no-show → Completed page
const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'confirmed': 'bg-blue-100 text-blue-800',
}

function BookingsPageContent() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalInitialData, setModalInitialData] = useState<any>(null)

  // Check-In Flow State
  const [roomAssignModalOpen, setRoomAssignModalOpen] = useState(false)
  const [checkInModalOpen, setCheckInModalOpen] = useState(false)
  const [bookingForCheckIn, setBookingForCheckIn] = useState<any>(null)
  const [assignedRoomNumber, setAssignedRoomNumber] = useState<string>('')

  // Cancel Confirmation State
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<any>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  // Check for URL parameters to open modal automatically
  useEffect(() => {
    const newBookingParam = searchParams.get('newBooking')
    const roomIdParam = searchParams.get('roomId')
    const roomNumberParam = searchParams.get('roomNumber')

    if (newBookingParam === 'true') {
      setIsModalOpen(true)
      if (roomNumberParam) {
        setModalInitialData({ roomNumber: roomNumberParam })
      }
    }
  }, [searchParams])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalInitialData(null)
    // Clear URL params
    router.replace('/dashboard/bookings')
  }

  const handleSaveBooking = (bookingData: any) => {
    // In a real app, send to API
    console.log('Saving booking:', bookingData)

    // Add to local state for demo
    const newBooking = {
      id: `BK-${Date.now()}`,
      guestName: bookingData.guestName,
      room: `Room ${bookingData.roomNumber}`,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      type: bookingData.status,
      amount: `₱${bookingData.amount || '0'}`
    }

    setBookings([newBooking, ...bookings])
    handleCloseModal()
  }

  const fetchBookings = async () => {
    setLoading(true)
    try {
      // Only fetch pending/confirmed for Bookings page
      // checked-in goes to In-House, others to Completed
      let data = await getBookings(statusFilter === 'all' ? undefined : statusFilter)

      // Filter to only show pending and confirmed statuses
      data = data.filter(b => b.status === 'pending' || b.status === 'confirmed')

      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId)
    try {
      await updateBookingStatus(bookingId, newStatus as Booking['status'])
      fetchBookings() // Refresh data
    } catch (error) {
      console.error('Error updating booking:', error)
    } finally {
      setUpdating(null)
    }
  }

  // Step 1: Start check-in flow by opening Room Assignment Modal
  const startCheckIn = (booking: any) => {
    setBookingForCheckIn({
      id: booking.id,
      guestName: booking.guests?.name || 'Guest',
      roomType: booking.rooms?.type || booking.room_type || 'Standard Room',
      checkIn: booking.check_in,
      checkOut: booking.check_out
    })
    setRoomAssignModalOpen(true)
  }

  // Step 2: After room assigned, open Check-In Modal for ID verification
  const handleRoomAssigned = (bookingId: string, roomId: string, roomNumber: string, earlyCheckIn?: boolean) => {
    setAssignedRoomNumber(roomNumber)
    setRoomAssignModalOpen(false)

    // Find the booking to get details for CheckInModal
    const booking = bookings.find(b => b.id === bookingId)
    setBookingForCheckIn({
      id: bookingId,
      confirmation_code: booking?.confirmation_code,
      guestName: booking?.guests?.name || 'Guest',
      roomNumber: roomNumber,
      roomType: booking?.rooms?.type || '',
      checkIn: booking?.check_in,
      totalAmount: booking?.total_amount || 0,
      paymentStatus: booking?.payment_status || 'paid'
    })
    setCheckInModalOpen(true)
  }

  // Step 3: Final check-in after ID verification
  const handleConfirmCheckIn = async (bookingId: string, notes: string) => {
    setUpdating(bookingId)
    try {
      await updateBookingStatus(bookingId, 'checked-in')
      fetchBookings()
    } catch (error) {
      console.error('Error checking in:', error)
    } finally {
      setUpdating(null)
      setCheckInModalOpen(false)
    }
  }

  // Cancel confirmation handlers
  const openCancelConfirmation = (booking: any) => {
    setBookingToCancel(booking)
    setCancelModalOpen(true)
  }

  const confirmCancel = async () => {
    if (bookingToCancel) {
      await handleStatusUpdate(bookingToCancel.id, 'cancelled')
      setCancelModalOpen(false)
      setBookingToCancel(null)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const guestName = booking.guests?.name?.toLowerCase() || ''
    const roomNumber = booking.rooms?.number?.toLowerCase() || ''
    const searchTerm = search.toLowerCase()

    return guestName.includes(searchTerm) || roomNumber.includes(searchTerm)
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={modalInitialData}
        onSave={handleSaveBooking}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">Manage all guest bookings and reservations</p>
        </div>
        <button
          onClick={() => {
            setModalInitialData(null)
            setIsModalOpen(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-bold flex items-center gap-2"
        >
          <Calendar size={18} />
          New Booking
        </button>
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
                placeholder="Search by guest name or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter - Only pending/confirmed (In-House handles checked-in) */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'pending', 'confirmed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 ${statusFilter === status
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 transform -translate-y-0.5'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading bookings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pickup</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{booking.guests?.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{booking.id.slice(0, 8)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Bed size={16} className="text-gray-400 mr-2.5" />
                        <span className="font-medium">{booking.rooms?.number}</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-sm">{booking.rooms?.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                        <Calendar size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        {booking.check_in}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                        <Calendar size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        {booking.check_out}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.airport_pickup ? (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1.5 bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full font-medium">
                            <Plane size={14} />
                            <span>{booking.pickup_time}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border whitespace-nowrap ${statusColors[booking.status].replace('bg-', 'bg-opacity-50 bg-').replace('text-', 'text-').replace('bg-', 'border-')
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">₱{booking.total_amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-0.5 capitalize">{booking.payment_status}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => startCheckIn(booking)}
                            disabled={updating === booking.id}
                            className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 shadow-sm transition-all hover:shadow-md disabled:opacity-50 whitespace-nowrap"
                          >
                            Check In
                          </button>
                        )}
                        {/* Check-out happens on In-House page, not here */}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => openCancelConfirmation(booking)}
                            disabled={updating === booking.id}
                            className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50 whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <p className="text-gray-900 font-medium">No bookings found</p>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Room Assignment Modal (Step 1 of Check-In) */}
      <RoomAssignmentModal
        isOpen={roomAssignModalOpen}
        onClose={() => setRoomAssignModalOpen(false)}
        booking={bookingForCheckIn}
        onAssign={handleRoomAssigned}
      />

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h3>
              <p className="text-gray-600 mb-1">
                Are you sure you want to cancel the booking for
              </p>
              <p className="font-semibold text-gray-900 mb-4">
                {bookingToCancel?.guests?.name || 'this guest'}?
              </p>
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-6">
                ⚠️ This action cannot be undone. The room will become available again.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCancelModalOpen(false)
                    setBookingToCancel(null)
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={updating === bookingToCancel?.id}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {updating === bookingToCancel?.id ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Check-In Modal (Step 2 of Check-In) */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        booking={bookingForCheckIn}
        onConfirmCheckIn={handleConfirmCheckIn}
      />
    </div>
  )
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingsPageContent />
    </Suspense>
  )
}