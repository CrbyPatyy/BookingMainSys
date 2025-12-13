'use client'

import { useState } from 'react'
import { X, CheckCircle, CreditCard, UserCheck, AlertTriangle } from 'lucide-react'

interface CheckInModalProps {
    isOpen: boolean
    onClose: () => void
    booking: {
        id: string
        confirmation_code?: string
        guestName: string
        roomNumber: string
        roomType: string
        checkIn: string
        totalAmount: number
        paymentStatus: string
    } | null
    onConfirmCheckIn: (bookingId: string, notes: string) => void
}

export default function CheckInModal({ isOpen, onClose, booking, onConfirmCheckIn }: CheckInModalProps) {
    const [paymentConfirmed, setPaymentConfirmed] = useState(false)
    const [idVerified, setIdVerified] = useState(false)
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen || !booking) return null

    const canCheckIn = paymentConfirmed && idVerified
    const isPaid = booking.paymentStatus === 'paid'

    const handleConfirm = async () => {
        if (!canCheckIn) return
        setLoading(true)
        await onConfirmCheckIn(booking.id, notes)
        setLoading(false)
        // Reset state
        setPaymentConfirmed(false)
        setIdVerified(false)
        setNotes('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Check-In Verification</h2>
                            <p className="text-blue-100 text-sm mt-1">Complete verification before check-in</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Guest Info */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="font-bold text-lg text-gray-900">{booking.guestName}</p>
                            <p className="text-sm text-gray-500">
                                {booking.confirmation_code || booking.id.slice(0, 8)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">Room {booking.roomNumber}</p>
                            <p className="text-sm text-gray-500">{booking.roomType}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Check-in Date</span>
                        <span className="font-medium">{booking.checkIn}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-500">Total Amount</span>
                        <span className="font-bold text-gray-900">₱{booking.totalAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Verification Checklist */}
                <div className="p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500" />
                        Verification Required
                    </h3>

                    {/* Payment Status */}
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentConfirmed
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }`}>
                        <input
                            type="checkbox"
                            checked={paymentConfirmed}
                            onChange={(e) => setPaymentConfirmed(e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentConfirmed ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                            {paymentConfirmed && <CheckCircle size={16} className="text-white" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                <CreditCard size={16} />
                                Payment Confirmed
                            </p>
                            <p className="text-sm text-gray-500">
                                {isPaid
                                    ? 'Payment already received'
                                    : 'Verify payment has been collected'}
                            </p>
                        </div>
                        {isPaid && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                PAID
                            </span>
                        )}
                    </label>

                    {/* ID Verification */}
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${idVerified
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }`}>
                        <input
                            type="checkbox"
                            checked={idVerified}
                            onChange={(e) => setIdVerified(e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idVerified ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                            {idVerified && <CheckCircle size={16} className="text-white" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                <UserCheck size={16} />
                                ID Verified
                            </p>
                            <p className="text-sm text-gray-500">Guest has presented valid identification</p>
                        </div>
                    </label>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-in Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special notes for this check-in..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none"
                            rows={2}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!canCheckIn || loading}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${canCheckIn
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                Confirm Check-In
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
