'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toursData } from '@/lib/data'
import { Calendar, Users, Phone, Mail, User, MapPin, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

function TourBookingContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const tourId = searchParams.get('tourId')

    const [selectedTour, setSelectedTour] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [bookingConfirmed, setBookingConfirmed] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        tourDate: '',
        numberOfPeople: '1'
    })

    useEffect(() => {
        if (tourId) {
            const tour = toursData.find(t => t.id === parseInt(tourId))
            setSelectedTour(tour || null)
        }
        setLoading(false)
    }, [tourId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Tour Booking:', {
            tour: selectedTour,
            ...formData,
            total: calculateTotal()
        })
        setBookingConfirmed(true)
    }

    const calculateTotal = () => {
        if (!selectedTour) return 0
        return selectedTour.price * parseInt(formData.numberOfPeople)
    }

    const today = new Date().toISOString().split('T')[0]

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        )
    }

    if (!selectedTour) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 px-4">
                <div className="max-w-2xl mx-auto text-center py-20">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
                    <p className="text-gray-600 mb-8">The tour you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/tours')}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all"
                    >
                        Browse All Tours
                    </button>
                </div>
            </div>
        )
    }

    if (bookingConfirmed) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 px-4">
                <div className="max-w-2xl mx-auto py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                        <p className="text-gray-600 mb-2">Thank you for booking <strong>{selectedTour.name}</strong></p>
                        <p className="text-gray-600 mb-8">We've sent a confirmation email to <strong>{formData.email}</strong></p>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                            <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Guest Name:</span>
                                    <span className="font-medium">{formData.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tour Date:</span>
                                    <span className="font-medium">{new Date(formData.tourDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Number of People:</span>
                                    <span className="font-medium">{formData.numberOfPeople}</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between">
                                    <span className="text-gray-900 font-bold">Total Amount:</span>
                                    <span className="text-primary-600 font-bold text-lg">₱{calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.push('/tours')}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                            >
                                Browse More Tours
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Tour</h1>
                <p className="text-gray-600 mb-8">Complete the booking for your adventure</p>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Booking Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Selected Tour Preview */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary-600 rounded-lg text-white">
                                    <MapPin size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Selected Tour</h2>
                            </div>

                            <div className="flex gap-4">
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={selectedTour.images[0]}
                                        alt={selectedTour.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-2">{selectedTour.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            {selectedTour.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={16} />
                                            Max {selectedTour.maxParticipants} people
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-primary-600">₱{selectedTour.price.toLocaleString()}/person</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary-600 rounded-lg text-white">
                                    <User size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Guest Information</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+63 912 345 6789"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Tour Date and Number of People */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tour Date</label>
                                        <input
                                            type="date"
                                            name="tourDate"
                                            required
                                            min={today}
                                            value={formData.tourDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Number of People</label>
                                        <select
                                            name="numberOfPeople"
                                            required
                                            value={formData.numberOfPeople}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        >
                                            {Array.from({ length: selectedTour.maxParticipants }, (_, i) => i + 1).map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tour Price</span>
                                    <span className="font-medium">₱{selectedTour.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Number of People</span>
                                    <span className="font-medium">× {formData.numberOfPeople}</span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-primary-600">₱{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!formData.name || !formData.email || !formData.phone || !formData.tourDate}
                                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-600/30"
                            >
                                Confirm Booking
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By confirming, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Loading component for Suspense fallback
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent"></div>
        </div>
    )
}

// Main export with Suspense wrapper
export default function TourBookingPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <TourBookingContent />
        </Suspense>
    )
}
