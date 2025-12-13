'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Plus, User, Calendar, Bed, CreditCard, LogOut, Receipt, Phone, Mail, FileText, CheckCircle, MoreVertical } from 'lucide-react'
import CheckOutModal from '@/components/adminDashboard/CheckOutModal'
import Folio from '@/components/adminDashboard/Folio'
import { getBookings, Booking } from '@/lib/db/bookings'

export default function GuestsPage() {
  const [search, setSearch] = useState('')
  const [guests, setGuests] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState<string | null>(null)

  // CheckOut Modal state
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<any>(null)

  // Folio Modal state
  const [folioOpen, setFolioOpen] = useState(false)
  const [folioGuest, setFolioGuest] = useState<any>(null)

  // Fetch checked-in guests from database
  useEffect(() => {
    async function fetchGuests() {
      setLoading(true)
      try {
        // Get only checked-in guests (in-house)
        const bookings = await getBookings('checked-in')
        setGuests(bookings)
      } catch (error) {
        console.error('Error fetching guests:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGuests()
  }, [])

  // Open CheckOut modal instead of confirm dialog
  const openCheckOutModal = (guest: Booking) => {
    setSelectedGuest({
      id: guest.id,
      confirmation_code: guest.confirmation_code,
      guestName: guest.guests?.name || 'Guest',
      roomNumber: guest.assigned_room_number || '',
      roomType: guest.room_type || '',
      checkIn: guest.check_in,
      checkOut: guest.check_out,
      totalAmount: guest.total_amount || 0,
      folioCharges: guest.folio_charges || 0,
      balanceDue: guest.balance_due || 0,
      paymentStatus: guest.payment_status || 'paid',
      nights: Math.ceil((new Date(guest.check_out).getTime() - new Date(guest.check_in).getTime()) / (1000 * 60 * 60 * 24))
    })
    setCheckOutModalOpen(true)
  }

  // Open Folio to view/add charges
  const openFolio = (guest: Booking) => {
    setFolioGuest({
      id: guest.id,
      guestName: guest.guests?.name || 'Guest',
      roomNumber: guest.assigned_room_number || '',
      checkIn: guest.check_in,
      checkOut: guest.check_out,
      totalAmount: guest.total_amount || 0
    })
    setFolioOpen(true)
  }

  // Handle checkout completion
  const handleConfirmCheckOut = async (bookingId: string, balancePaid: boolean, lateCheckout: boolean) => {
    setCheckingOut(bookingId)
    // TODO: Call real API to update booking status
    // await updateBookingStatus(bookingId, 'checked-out')
    await new Promise(resolve => setTimeout(resolve, 800))
    // Remove from list (would update status in real DB)
    setGuests(prev => prev.filter(guest => guest.id !== bookingId))
    setCheckingOut(null)
    setCheckOutModalOpen(false)
  }

  const filteredGuests = guests.filter(guest =>
    guest.guests?.name?.toLowerCase().includes(search.toLowerCase()) ||
    guest.room_type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Current Guests</h1>
          <p className="text-gray-600">Manage guests currently staying</p>
        </div>
        <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredGuests.length}</span> guests checked in
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading guests...</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full table-fixed"><thead className="bg-gray-50"><tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Guest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Check-in</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Check-out</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-36">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">Actions</th>
            </tr></thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{guest.guests?.name}</div>
                          <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                            <Mail size={10} />
                            <span className="truncate">{guest.guests?.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bed size={14} className="text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{guest.room_type}</div>
                          <div className="text-xs text-gray-500">Room {guest.assigned_room_number || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                        {guest.check_in}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                        {guest.check_out}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium w-fit">
                          CHECKED IN
                        </span>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          <CreditCard size={10} />
                          ₱{(guest.total_amount || 0).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{guest.guests?.phone}</span>
                        </div>
                        {guest.special_requests && (
                          <div className="text-xs text-gray-500 truncate" title={guest.special_requests}>
                            {guest.special_requests}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openFolio(guest)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-200 transition-colors"
                        >
                          <FileText size={14} />
                          <span>Folio</span>
                        </button>
                        <button
                          onClick={() => openCheckOutModal(guest)}
                          disabled={checkingOut === guest.id}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-black disabled:opacity-50 transition-colors shadow-sm"
                        >
                          {checkingOut === guest.id ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <LogOut size={14} />
                              <span>Check Out</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody></table>

            {filteredGuests.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                  <User className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {search ? 'No Guests Found' : 'No Current Guests'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {search ? 'Try a different search' : 'No guests are currently checked in'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Guests</p>
              <p className="text-xl font-bold">{filteredGuests.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today Check-outs</p>
              <p className="text-xl font-bold">
                {filteredGuests.filter(g => g.check_out === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <LogOut className="text-green-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold">
                ₱{filteredGuests.reduce((sum, g) => sum + (g.total_amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="text-purple-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* CheckOut Modal */}
      <CheckOutModal
        isOpen={checkOutModalOpen}
        onClose={() => setCheckOutModalOpen(false)}
        booking={selectedGuest}
        onConfirmCheckOut={handleConfirmCheckOut}
      />

      {/* Folio Modal */}
      <Folio
        isOpen={folioOpen}
        onClose={() => setFolioOpen(false)}
        booking={folioGuest}
      />
    </div>
  )
}