'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Bed, Users, Save, History, Calendar, CheckCircle } from 'lucide-react'

interface Room {
    id: string
    number: string
    type: string
    price: number
    capacity: number
    status: string
    amenities: string[]
}

interface RoomModalProps {
    isOpen: boolean
    onClose: () => void
    room: Room | null
    mode: 'view' | 'edit'
    onSave: (updatedRoom: Room) => void
}

const statusOptions = ['available', 'occupied', 'reserved', 'maintenance']
const amenityOptions = ['wifi', 'tv', 'ac', 'coffee', 'minibar', 'sea_view']

export default function RoomModal({ isOpen, onClose, room, mode, onSave }: RoomModalProps) {
    const [mounted, setMounted] = useState(false)
    const [formData, setFormData] = useState<Room | null>(null)

    // Mount check for Portal
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    // Reset form data when modal opens or room changes
    useEffect(() => {
        if (room) {
            setFormData({ ...room })
        }
    }, [room, isOpen])

    if (!isOpen || !mounted || !room || !formData) return null

    const handleSave = () => {
        if (formData) {
            onSave(formData)
            onClose()
        }
    }

    const toggleAmenity = (amenity: string) => {
        if (formData.amenities.includes(amenity)) {
            setFormData({
                ...formData,
                amenities: formData.amenities.filter(a => a !== amenity)
            })
        } else {
            setFormData({
                ...formData,
                amenities: [...formData.amenities, amenity]
            })
        }
    }

    const modalContent = (
        <>
            {/* Backdrop - no blur, just dark overlay */}
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
                                {mode === 'view' ? `Room ${room.number} Details` : `Edit Room ${room.number}`}
                            </h2>
                            <p className="text-sm text-gray-500">{room.type}</p>
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
                        {mode === 'view' ? (
                            /* View Mode */
                            <div className="space-y-8">
                                {/* Key Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="text-sm text-blue-600 font-medium mb-1">Status</div>
                                        <div className="font-bold text-gray-900 capitalize">{room.status}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-sm text-gray-500 font-medium mb-1">Price</div>
                                        <div className="font-bold text-gray-900">₱{room.price.toLocaleString()}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-sm text-gray-500 font-medium mb-1">Capacity</div>
                                        <div className="font-bold text-gray-900">{room.capacity} Guests</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-sm text-gray-500 font-medium mb-1">Type</div>
                                        <div className="font-bold text-gray-900 truncate" title={room.type}>{room.type}</div>
                                    </div>
                                </div>

                                {/* Amenities List */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-blue-600" />
                                        Included Amenities
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities.map(amenity => (
                                            <span key={amenity} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium capitalize">
                                                {amenity.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent History */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <History size={18} className="text-gray-500" />
                                        Recent History
                                    </h3>
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                                            <span>Guest</span>
                                            <span>Date</span>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                No history available - connect to database
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Edit Mode */
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Price */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Nightly Price (₱)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Capacity */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Guest Capacity</label>
                                        <div className="relative">
                                            <select
                                                value={formData.capacity}
                                                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                                            >
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                                ▼
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Current Status</label>
                                        <div className="relative">
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none capitalize"
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                                ▼
                                            </div>
                                        </div>
                                    </div>

                                    {/* Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Room Type</label>
                                        <input
                                            type="text"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Amenities Checklist */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Room Amenities</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {amenityOptions.map(amenity => (
                                            <label
                                                key={amenity}
                                                className={`
                                                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                                    ${formData.amenities.includes(amenity)
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                                                `}
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                    ${formData.amenities.includes(amenity)
                                                        ? 'bg-blue-600 border-blue-600'
                                                        : 'bg-white border-gray-300'}
                                                `}>
                                                    {formData.amenities.includes(amenity) && <CheckCircle size={12} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.amenities.includes(amenity)}
                                                    onChange={() => toggleAmenity(amenity)}
                                                    className="hidden"
                                                />
                                                <span className="text-sm font-medium capitalize">{amenity.replace('_', ' ')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 z-10">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            {mode === 'view' ? 'Close' : 'Cancel'}
                        </button>

                        {mode === 'edit' && (
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all flex items-center gap-2"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )

    return createPortal(modalContent, document.body)
}
