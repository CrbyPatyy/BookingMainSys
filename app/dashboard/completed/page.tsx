'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, User, Bed, CheckCircle, XCircle } from 'lucide-react'
import { getBookings, Booking } from '@/lib/db/bookings'

export default function CompletedPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    checkedOut: 0,
    cancelled: 0,
    noShow: 0
  })

  // Fetch completed bookings from database
  useEffect(() => {
    async function fetchCompletedBookings() {
      setLoading(true)
      try {
        // Fetch all bookings and filter for completed statuses
        const allBookings = await getBookings()
        const completed = allBookings.filter(b =>
          b.status === 'checked-out' || b.status === 'cancelled' || b.status === 'no-show'
        )
        setCompletedBookings(completed)

        // Calculate stats
        setStats({
          total: completed.length,
          checkedOut: completed.filter(b => b.status === 'checked-out').length,
          cancelled: completed.filter(b => b.status === 'cancelled').length,
          noShow: completed.filter(b => b.status === 'no-show').length
        })
      } catch (error) {
        console.error('Error fetching completed bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCompletedBookings()
  }, [])

  const filteredBookings = completedBookings.filter(booking => {
    const matchesSearch = booking.guests?.name.toLowerCase().includes(search.toLowerCase()) ||
      booking.assigned_room_number?.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || booking.status === typeFilter
    return matchesSearch && matchesType
  })

  // Calculate nights between dates
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : '-'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Completed Bookings</h1>
          <p className="text-gray-600">View all checked-out and cancelled bookings</p>
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
                placeholder="Search completed bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${typeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 transform -translate-y-0.5'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('checked-out')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${typeFilter === 'checked-out'
                ? 'bg-green-600 text-white shadow-lg shadow-green-200 transform -translate-y-0.5'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <CheckCircle size={16} />
              Checked-out
            </button>
            <button
              onClick={() => setTypeFilter('cancelled')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${typeFilter === 'cancelled'
                ? 'bg-red-600 text-white shadow-lg shadow-red-200 transform -translate-y-0.5'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <XCircle size={16} />
              Cancelled
            </button>
            <button
              onClick={() => setTypeFilter('no-show')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${typeFilter === 'no-show'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 transform -translate-y-0.5'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <XCircle size={16} />
              No-Show
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Completed</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Successful Stays</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">{stats.checkedOut}</p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cancellations</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">{stats.cancelled}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <XCircle size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Completed Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading completed bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No completed bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          <User size={18} className="text-gray-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{booking.guests?.name || 'Unknown Guest'}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">{booking.confirmation_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Bed size={16} className="text-gray-400 mr-2.5" />
                        <span className="font-medium">{booking.room_type} {booking.assigned_room_number ? `- ${booking.assigned_room_number}` : ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <span className="w-8 text-xs text-gray-400 font-medium">IN</span>
                          {booking.check_in}
                        </div>
                        <div className="flex items-center">
                          <span className="w-8 text-xs text-gray-400 font-medium">OUT</span>
                          {booking.check_out}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${booking.status === 'checked-out'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : booking.status === 'cancelled'
                            ? 'bg-red-50 text-red-700 border-red-100'
                            : 'bg-orange-50 text-orange-700 border-orange-100'
                        }`}>
                        {booking.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                      {calculateNights(booking.check_in, booking.check_out)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">₱{booking.total_amount.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}