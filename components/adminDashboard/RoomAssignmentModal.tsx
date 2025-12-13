'use client'

import { useState, useEffect } from 'react'
import { X, Bed, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react'
import { getRooms } from '@/lib/db/rooms'

interface RoomAssignmentModalProps {
    isOpen: boolean
    onClose: () => void
    booking: {
        id: string
        guestName: string
        roomType: string
        checkIn: string
        checkOut: string
    } | null
    onAssign: (bookingId: string, roomId: string, roomNumber: string, earlyCheckIn?: boolean) => void
}

export default function RoomAssignmentModal({ isOpen, onClose, booking, onAssign }: RoomAssignmentModalProps) {
    const [rooms, setRooms] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
    const [earlyCheckIn, setEarlyCheckIn] = useState(false)
    const [assigning, setAssigning] = useState(false)

    useEffect(() => {
        if (isOpen && booking) {
            fetchAvailableRooms()
        }
    }, [isOpen, booking])

    const fetchAvailableRooms = async () => {
        setLoading(true)
        try {
            const allRooms = await getRooms()
            // Filter to rooms of the booked type that are available
            const matchingRooms = allRooms.filter(room =>
                room.type?.toLowerCase().includes(booking?.roomType?.toLowerCase() || '') &&
                room.status === 'available'
            )
            setRooms(matchingRooms)
        } catch (error) {
            console.error('Error fetching rooms:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !booking) return null

    const handleAssign = async () => {
        if (!selectedRoom) return
        const room = rooms.find(r => r.id === selectedRoom)
        if (!room) return

        setAssigning(true)
        await onAssign(booking.id, room.id, room.number, earlyCheckIn)
        setAssigning(false)
        setSelectedRoom(null)
        onClose()
    }

    // Filter to only available rooms
    const availableRooms = rooms.filter(r => r.status === 'available')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Assign Room</h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Select an available {booking.roomType} for {booking.guestName}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700 font-medium">Check-in: {booking.checkIn}</span>
                        <span className="text-blue-600">→</span>
                        <span className="text-blue-700 font-medium">Check-out: {booking.checkOut}</span>
                    </div>
                </div>

                {/* Room List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        </div>
                    ) : availableRooms.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertTriangle className="mx-auto text-amber-500 mb-3" size={48} />
                            <h3 className="font-bold text-gray-900">No Rooms Available</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                No available rooms of type "{booking.roomType}" found
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableRooms.map((room) => {
                                const isSelected = selectedRoom === room.id

                                return (
                                    <button
                                        key={room.id}
                                        onClick={() => setSelectedRoom(room.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xl font-bold text-gray-900">{room.number}</span>
                                            {isSelected && <CheckCircle className="text-blue-600" size={20} />}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{room.type}</p>
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            Available
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Early Check-in Option */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={earlyCheckIn}
                            onChange={(e) => setEarlyCheckIn(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                            <span className="font-medium text-gray-900">Early Check-in</span>
                            <span className="text-sm text-gray-500 ml-2">(Before 2:00 PM — additional charge may apply)</span>
                        </div>
                    </label>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedRoom || assigning}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${selectedRoom
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {assigning ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Assign & Continue
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
