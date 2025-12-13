'use client'

import { useState, useEffect } from 'react'
import { X, Plus, CreditCard, Coffee, Sparkles, Shirt, Utensils, Wine, AlertCircle, FileText } from 'lucide-react'
import { FolioItem, ChargeType, addFolioCharge, getFolioCharges } from '@/lib/db/folios'

interface FolioProps {
    isOpen: boolean
    onClose: () => void
    booking: {
        id: string
        guestName: string
        roomNumber: string
        checkIn: string
        checkOut: string
        totalAmount: number
    } | null
}

const chargeTypes: { type: ChargeType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'room_service', label: 'Room Service', icon: <Utensils size={18} />, color: 'bg-orange-100 text-orange-600' },
    { type: 'minibar', label: 'Mini-bar', icon: <Wine size={18} />, color: 'bg-purple-100 text-purple-600' },
    { type: 'laundry', label: 'Laundry', icon: <Shirt size={18} />, color: 'bg-blue-100 text-blue-600' },
    { type: 'spa', label: 'Spa & Wellness', icon: <Sparkles size={18} />, color: 'bg-pink-100 text-pink-600' },
    { type: 'damage', label: 'Damage Fee', icon: <AlertCircle size={18} />, color: 'bg-red-100 text-red-600' },
    { type: 'other', label: 'Other', icon: <Coffee size={18} />, color: 'bg-gray-100 text-gray-600' },
]

export default function Folio({ isOpen, onClose, booking }: FolioProps) {
    const [items, setItems] = useState<FolioItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [saving, setSaving] = useState(false)

    const [newCharge, setNewCharge] = useState({
        charge_type: 'room_service' as ChargeType,
        description: '',
        amount: '',
        quantity: 1
    })

    useEffect(() => {
        if (isOpen && booking) {
            fetchCharges()
        }
    }, [isOpen, booking])

    const fetchCharges = async () => {
        if (!booking) return
        setLoading(true)
        try {
            const charges = await getFolioCharges(booking.id)
            setItems(charges)
        } catch (error) {
            console.error('Error fetching charges:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddCharge = async () => {
        if (!booking || !newCharge.description || !newCharge.amount) return

        setSaving(true)
        try {
            const charge = await addFolioCharge(booking.id, {
                charge_type: newCharge.charge_type,
                description: newCharge.description,
                amount: parseFloat(newCharge.amount),
                quantity: newCharge.quantity
            })
            setItems([...items, charge])
            setNewCharge({ charge_type: 'room_service', description: '', amount: '', quantity: 1 })
            setShowAddForm(false)
        } catch (error) {
            console.error('Error adding charge:', error)
        } finally {
            setSaving(false)
        }
    }

    if (!isOpen || !booking) return null

    const chargesTotal = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText size={24} />
                                Guest Folio
                            </h2>
                            <p className="text-emerald-100 text-sm mt-1">
                                {booking.guestName} • Room {booking.roomNumber}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Summary Bar */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-emerald-50 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Stay: {booking.checkIn} → {booking.checkOut}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Charges</p>
                        <p className="text-2xl font-bold text-emerald-600">₱{chargesTotal.toLocaleString()}</p>
                    </div>
                </div>

                {/* Charges List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <CreditCard className="mx-auto mb-3 text-gray-300" size={48} />
                            <p className="font-medium">No additional charges</p>
                            <p className="text-sm">Add charges for room service, minibar, etc.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => {
                                const chargeConfig = chargeTypes.find(c => c.type === item.charge_type)
                                return (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${chargeConfig?.color}`}>
                                                {chargeConfig?.icon}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.description}</p>
                                                <p className="text-xs text-gray-500">{chargeConfig?.label} • {new Date(item.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">₱{(item.amount * item.quantity).toLocaleString()}</p>
                                            {item.quantity > 1 && <p className="text-xs text-gray-500">{item.quantity} × ₱{item.amount}</p>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Add Charge Form */}
                    {showAddForm && (
                        <div className="mt-4 p-4 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/50">
                            <h3 className="font-bold text-gray-900 mb-4">Add New Charge</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        value={newCharge.charge_type}
                                        onChange={(e) => setNewCharge({ ...newCharge, charge_type: e.target.value as ChargeType })}
                                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {chargeTypes.map(ct => (
                                            <option key={ct.type} value={ct.type}>{ct.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCharge.quantity}
                                        onChange={(e) => setNewCharge({ ...newCharge, quantity: parseInt(e.target.value) })}
                                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Club Sandwich, Laundry - 5 pcs"
                                        value={newCharge.description}
                                        onChange={(e) => setNewCharge({ ...newCharge, description: e.target.value })}
                                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Amount (₱)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newCharge.amount}
                                        onChange={(e) => setNewCharge({ ...newCharge, amount: e.target.value })}
                                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddCharge}
                                        disabled={saving || !newCharge.description || !newCharge.amount}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                    >
                        Close
                    </button>
                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700"
                        >
                            <Plus size={18} />
                            Add Charge
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
