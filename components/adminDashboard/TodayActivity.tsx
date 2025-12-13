'use client'

import { Calendar, Clock, MapPin, User, Users, CreditCard, Bed, Plane } from 'lucide-react'
import { useState } from 'react'
import { updateBookingStatus } from '@/lib/db/bookings'
import CheckInModal from './CheckInModal'
import RoomAssignmentModal from './RoomAssignmentModal'
import CheckOutModal from './CheckOutModal'

interface TodayActivityProps {
  arrivals: any[]
  departures: any[]
}

export default function TodayActivity({ arrivals, departures }: TodayActivityProps) {
  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures'>('arrivals')
  const [loading, setLoading] = useState<string | null>(null)

  // Room Assignment modal state (Step 1 of check-in)
  const [roomAssignModalOpen, setRoomAssignModalOpen] = useState(false)
  const [bookingForAssignment, setBookingForAssignment] = useState<any>(null)

  // Check-in modal state (Step 2 of check-in)
  const [checkInModalOpen, setCheckInModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [assignedRoom, setAssignedRoom] = useState<{ id: string; number: string } | null>(null)

  // Check-out modal state
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false)
  const [bookingForCheckOut, setBookingForCheckOut] = useState<any>(null)

  // Step 1: Open Room Assignment Modal
  const startCheckIn = (arrival: any) => {
    setBookingForAssignment({
      id: arrival.id,
      guestName: arrival.guests?.name || 'Guest',
      roomType: arrival.rooms?.type || arrival.room_type || 'Standard Room',
      checkIn: arrival.check_in,
      checkOut: arrival.check_out
    })
    setRoomAssignModalOpen(true)
  }

  // Step 2: After room assigned, open Check-In Modal for ID verification
  const handleRoomAssigned = (bookingId: string, roomId: string, roomNumber: string, earlyCheckIn?: boolean) => {
    setAssignedRoom({ id: roomId, number: roomNumber })
    setRoomAssignModalOpen(false)

    // Now open CheckInModal for ID verification
    const arrival = arrivals.find(a => a.id === bookingId)
    setSelectedBooking({
      id: bookingId,
      confirmation_code: arrival?.confirmation_code,
      guestName: arrival?.guests?.name || 'Guest',
      roomNumber: roomNumber, // Assigned room
      roomType: arrival?.rooms?.type || '',
      checkIn: arrival?.check_in,
      totalAmount: arrival?.total_amount || 0,
      paymentStatus: arrival?.payment_status || 'paid'
    })
    setCheckInModalOpen(true)
  }

  // Step 3: Final check-in after ID verification
  const handleConfirmCheckIn = async (bookingId: string, notes: string) => {
    setLoading(bookingId)
    try {
      await updateBookingStatus(bookingId, 'checked-in')
      // TODO: Also update assigned_room_id in booking
      window.location.reload()
    } catch (error) {
      console.error('Error checking in:', error)
    } finally {
      setLoading(null)
    }
  }

  // Legacy direct check-in handler (kept for backwards compatibility)
  const handleCheckIn = async (bookingId: string) => {
    setLoading(bookingId)
    try {
      await updateBookingStatus(bookingId, 'checked-in')
      window.location.reload()
    } catch (error) {
      console.error('Error checking in:', error)
    } finally {
      setLoading(null)
    }
  }

  // Start checkout flow - open CheckOutModal
  const startCheckOut = (departure: any) => {
    const checkInDate = new Date(departure.check_in)
    const checkOutDate = new Date(departure.check_out)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

    setBookingForCheckOut({
      id: departure.id,
      confirmation_code: departure.confirmation_code,
      guestName: departure.guests?.name || 'Guest',
      roomNumber: departure.rooms?.number || departure.assigned_room_number || 'N/A',
      roomType: departure.rooms?.type || departure.room_type || '',
      checkIn: departure.check_in,
      checkOut: departure.check_out,
      totalAmount: departure.total_amount || 0,
      folioCharges: departure.folio_charges || 0,
      balanceDue: departure.balance_due || 0,
      paymentStatus: departure.payment_status || 'paid',
      nights: nights
    })
    setCheckOutModalOpen(true)
  }

  // Handle confirmed checkout
  const handleConfirmCheckOut = async (bookingId: string, paymentReceived: boolean, lateCheckOutFee: boolean) => {
    setLoading(bookingId)
    try {
      await updateBookingStatus(bookingId, 'checked-out')
      window.location.reload()
    } catch (error) {
      console.error('Error checking out:', error)
    } finally {
      setLoading(null)
    }
  }

  // Legacy direct checkout (kept for fallback)
  const handleCheckOut = async (bookingId: string) => {
    setLoading(bookingId)
    try {
      await updateBookingStatus(bookingId, 'checked-out')
      // Refresh page or update state
      window.location.reload()
    } catch (error) {
      console.error('Error checking out:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Today's Activity</h2>
        <div className="flex border border-gray-200 rounded-lg">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${activeTab === 'arrivals'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
          >
            Arriving Today ({arrivals?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('departures')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${activeTab === 'departures'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
          >
            Departing Today ({departures?.length || 0})
          </button>
        </div>
      </div>

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        booking={selectedBooking}
        onConfirmCheckIn={handleConfirmCheckIn}
      />

      {activeTab === 'arrivals' ? (
        <div className="space-y-4">
          {arrivals?.length > 0 ? arrivals.map((arrival) => (
            <div key={arrival.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{arrival.guests?.name}</h3>
                      {/* Guest count badge */}
                      {(arrival.adults || arrival.children) && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          <Users size={10} className="inline mr-1" />
                          {arrival.adults || 1}{arrival.children > 0 ? `+${arrival.children}` : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      {arrival.confirmation_code || arrival.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-600">{arrival.rooms?.number} - {arrival.rooms?.type}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>Check-in: {arrival.check_in}</span>
                      </div>
                      {arrival.airport_pickup && arrival.pickup_time && (
                        <div className="flex items-center gap-1.5 text-sm bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">
                          <Plane size={14} />
                          <span>Pickup: {arrival.pickup_time}</span>
                        </div>
                      )}
                      {/* Booking source */}
                      {arrival.booking_source && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span className="capitalize">via {arrival.booking_source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {/* Payment status badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${arrival.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : arrival.payment_status === 'deposit'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      <CreditCard size={10} className="inline mr-1" />
                      {arrival.payment_status?.toUpperCase() || 'UNPAID'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${arrival.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {arrival.status}
                    </span>
                  </div>
                  <button
                    onClick={() => startCheckIn(arrival)}
                    disabled={loading === arrival.id}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading === arrival.id ? 'Processing...' : 'Check In'}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              No arrivals scheduled for today
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {departures?.length > 0 ? departures.map((departure) => (
            <div key={departure.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{departure.guests?.name}</h3>
                    <p className="text-sm text-gray-600">{departure.rooms?.number} - {departure.rooms?.type}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>Check-out: {departure.check_out}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>By: 12:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {departure.status}
                  </span>
                  <button
                    onClick={() => startCheckOut(departure)}
                    disabled={loading === departure.id}
                    className="px-3 py-1 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 disabled:opacity-50"
                  >
                    {loading === departure.id ? 'Processing...' : 'Check Out'}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              No departures scheduled for today
            </div>
          )}
        </div>
      )}

      {/* Room Assignment Modal (Step 1) */}
      <RoomAssignmentModal
        isOpen={roomAssignModalOpen}
        onClose={() => setRoomAssignModalOpen(false)}
        booking={bookingForAssignment}
        onAssign={handleRoomAssigned}
      />

      {/* Check-In Modal (Step 2) */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        booking={selectedBooking}
        onConfirmCheckIn={handleConfirmCheckIn}
      />

      {/* Check-Out Modal */}
      <CheckOutModal
        isOpen={checkOutModalOpen}
        onClose={() => setCheckOutModalOpen(false)}
        booking={bookingForCheckOut}
        onConfirmCheckOut={handleConfirmCheckOut}
      />
    </div>
  )
}