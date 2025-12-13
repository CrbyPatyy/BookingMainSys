'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Calendar, User, CreditCard, Bed, Save } from 'lucide-react'

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: any // Can be pre-filled room data or editing booking data
    onSave: (bookingData: any) => void
}

export default function BookingModal({ isOpen, onClose, initialData, onSave }: BookingModalProps) {
    const [mounted, setMounted] = useState(false)
    const [formData, setFormData] = useState({
        guestName: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        roomType: '', // Changed from roomNumber - guests book TYPE
        roomNumber: '', // Only for walk-ins assigning specific room
        status: 'pending',
        amount: '',
        email: '',
        phone: '',
        bookingSource: 'walk-in' as 'direct' | 'walk-in' | 'phone', // Dashboard bookings default to walk-in
        paymentMethod: 'cash' as 'cash' | 'card' | 'gcash' | 'maya' | 'bank_transfer',
        paymentConfirmed: false, // Must confirm for walk-ins
    })

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    guestName: initialData.guestName || '',
                    checkIn: initialData.checkIn || new Date().toISOString().split('T')[0],
                    checkOut: initialData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    guests: initialData.guests || 1,
                    roomType: initialData.roomType || initialData.type || '',
                    roomNumber: initialData.roomNumber || '',
                    status: initialData.status || 'pending',
                    amount: initialData.price ? `${initialData.price}` : '',
                    email: initialData.email || '',
                    phone: initialData.phone || '',
                    bookingSource: initialData.bookingSource || 'walk-in',
                    paymentMethod: initialData.paymentMethod || 'cash',
                    paymentConfirmed: initialData.paymentConfirmed || false,
                })
            } else {
                setFormData({
                    guestName: '',
                    checkIn: new Date().toISOString().split('T')[0],
                    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    guests: 1,
                    roomType: '',
                    roomNumber: '',
                    status: 'pending',
                    amount: '',
                    email: '',
                    phone: '',
                    bookingSource: 'walk-in',
                    paymentMethod: 'cash',
                    paymentConfirmed: false,
                })
            }
        }
    }, [isOpen, initialData])

    // Mount check for Portal
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!isOpen || !mounted) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
        onClose()
    }

    const modalContent = (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black/60 z-[9998]"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Modal Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {initialData?.id ? 'Edit Booking' : 'New Booking'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {initialData?.roomNumber
                                    ? `Reservation for Room ${initialData.roomNumber}`
                                    : 'Create a new guest reservation'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">

                            {/* Guest Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <User size={16} className="text-blue-600" />
                                    Guest Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.guestName}
                                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Phone (Optional)</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Number of Guests</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.guests}
                                            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4"></div>

                            {/* Stay Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-600" />
                                    Stay Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Check In</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.checkIn}
                                            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Check Out</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.checkOut}
                                            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Room Type</label>
                                        <select
                                            required
                                            value={formData.roomType}
                                            onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="">Select room type</option>
                                            <option value="Standard Room">Standard Room</option>
                                            <option value="Superior Room">Superior Room</option>
                                            <option value="Deluxe Room">Deluxe Room</option>
                                            <option value="Family Suite">Family Suite</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Total Amount (₱)</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                required
                                                type="number"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4"></div>

                            {/* Payment Section (for walk-ins) */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <CreditCard size={16} className="text-green-600" />
                                    Payment Details
                                    <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-normal normal-case">
                                        🚶 Walk-In Guest
                                    </span>
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Payment Method</label>
                                        <select
                                            value={formData.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="cash">💵 Cash</option>
                                            <option value="card">💳 Credit/Debit Card</option>
                                            <option value="gcash">📱 GCash</option>
                                            <option value="maya">📱 Maya</option>
                                            <option value="bank_transfer">🏦 Bank Transfer</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Payment Confirmation for Walk-ins */}
                                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentConfirmed
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={formData.paymentConfirmed}
                                        onChange={(e) => setFormData({ ...formData, paymentConfirmed: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <div>
                                        <span className="font-bold text-gray-900">Payment Received & Confirmed</span>
                                        <p className="text-xs text-gray-500">Check this box after collecting payment from the guest</p>
                                    </div>
                                </label>
                            </div>

                            <div className="border-t border-gray-100 my-4"></div>

                            {/* Status Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Booking Status</label>
                                <div className="flex gap-3">
                                    {['pending', 'confirmed', 'checked-in'].map(status => (
                                        <label key={status} className={`
                      flex-1 border rounded-xl p-3 cursor-pointer text-center text-sm font-bold capitalize transition-all
                      ${formData.status === status
                                                ? status === 'checked-in'
                                                    ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500'
                                                    : 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                   `}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status}
                                                checked={formData.status === status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="hidden"
                                            />
                                            {status.replace('-', ' ')}
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            form="booking-form"
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all flex items-center gap-2"
                        >
                            <Save size={18} />
                            {initialData?.id ? 'Update Booking' : 'Create Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )

    return createPortal(modalContent, document.body)
}

