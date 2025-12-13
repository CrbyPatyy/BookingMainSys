'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, CreditCard, Receipt, Clock, AlertCircle, Check, Printer } from 'lucide-react'

interface CheckOutModalProps {
    isOpen: boolean
    onClose: () => void
    booking: {
        id: string
        confirmation_code?: string
        guestName: string
        roomNumber: string
        roomType: string
        checkIn: string
        checkOut: string
        totalAmount: number
        folioCharges: number
        balanceDue: number
        paymentStatus: string
        nights: number
    } | null
    onConfirmCheckOut: (bookingId: string, paymentReceived: boolean, lateCheckOutFee: boolean) => void
}

const LATE_CHECKOUT_FEE = 500

export default function CheckOutModal({ isOpen, onClose, booking, onConfirmCheckOut }: CheckOutModalProps) {
    const [mounted, setMounted] = useState(false)
    const [paymentReceived, setPaymentReceived] = useState(false)
    const [lateCheckOut, setLateCheckOut] = useState(false)
    const [processing, setProcessing] = useState(false)

    // Mount check for Portal
    useState(() => {
        setMounted(true)
    })

    if (!isOpen || !mounted || !booking) return null

    const currentHour = new Date().getHours()
    const isAfterNoon = currentHour >= 12

    const calculateFinalTotal = () => {
        let total = booking.balanceDue || 0
        if (lateCheckOut) total += LATE_CHECKOUT_FEE
        return total
    }

    const handleConfirm = async () => {
        if (calculateFinalTotal() > 0 && !paymentReceived) {
            return // Require payment confirmation if balance due
        }
        setProcessing(true)
        await onConfirmCheckOut(booking.id, paymentReceived, lateCheckOut)
        setProcessing(false)
        onClose()
    }

    const modalContent = (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-[9998]"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Guest Check-Out</h2>
                                <p className="text-gray-300 text-sm">{booking.guestName} • Room {booking.roomNumber}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto flex-1 space-y-6">
                        {/* Stay Summary */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Receipt size={18} className="text-gray-500" />
                                Stay Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Confirmation Code</span>
                                    <span className="font-mono font-bold">{booking.confirmation_code || booking.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Room</span>
                                    <span>{booking.roomNumber} - {booking.roomType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Check-In</span>
                                    <span>{booking.checkIn}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Check-Out</span>
                                    <span>{booking.checkOut}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Nights</span>
                                    <span>{booking.nights}</span>
                                </div>
                            </div>
                        </div>

                        {/* Billing Breakdown */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <CreditCard size={18} className="text-gray-500" />
                                Billing Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Room Charges</span>
                                    <span>₱{(booking.totalAmount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Folio Charges (Extras)</span>
                                    <span>₱{(booking.folioCharges || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Payments Received</span>
                                    <span>-₱{((booking.totalAmount || 0) - (booking.balanceDue || 0)).toLocaleString()}</span>
                                </div>

                                {/* Late Check-Out Option */}
                                {isAfterNoon && (
                                    <label className="flex items-center justify-between py-2 border-t border-dashed mt-2 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-amber-500" />
                                            <span className="text-amber-700">Late Check-Out Fee</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-amber-700">₱{LATE_CHECKOUT_FEE.toLocaleString()}</span>
                                            <input
                                                type="checkbox"
                                                checked={lateCheckOut}
                                                onChange={(e) => setLateCheckOut(e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                        </div>
                                    </label>
                                )}

                                <div className="flex justify-between pt-3 border-t border-gray-200 text-lg font-bold">
                                    <span>Balance Due</span>
                                    <span className={calculateFinalTotal() > 0 ? 'text-red-600' : 'text-green-600'}>
                                        ₱{calculateFinalTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Confirmation (if balance due) */}
                        {calculateFinalTotal() > 0 && (
                            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentReceived
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                }`}>
                                <input
                                    type="checkbox"
                                    checked={paymentReceived}
                                    onChange={(e) => setPaymentReceived(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <div>
                                    <span className="font-bold text-gray-900">Payment Received & Confirmed</span>
                                    <p className="text-xs text-gray-500">Check this box after collecting the balance from the guest</p>
                                </div>
                            </label>
                        )}

                        {/* Warning if balance due and not confirmed */}
                        {calculateFinalTotal() > 0 && !paymentReceived && (
                            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                <p>Please collect and confirm payment before completing check-out.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-all"
                        >
                            <Printer size={18} />
                            Print Receipt
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={processing || (calculateFinalTotal() > 0 && !paymentReceived)}
                                className="px-6 py-2.5 bg-gray-800 text-white rounded-xl font-bold shadow-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                <Check size={18} />
                                {processing ? 'Processing...' : 'Complete Check-Out'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    return createPortal(modalContent, document.body)
}
