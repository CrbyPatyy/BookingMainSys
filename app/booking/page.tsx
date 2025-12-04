'use client'

import { useState } from 'react'
import { Calendar, Users, Check, Sparkles, Bed, MapPin, Clock, Shield, CreditCard, Mail, Phone, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BookingFormProps {
  roomId?: number
  roomName?: string
  roomPrice?: number
  roomImage?: string
  roomBeds?: string
  roomGuests?: number
  tourId?: number
  tourName?: string
  tourPrice?: number
  tourDuration?: string
  tourLocation?: string
}

export default function BookingForm({ 
  roomId, 
  roomName, 
  roomPrice = 0,
  roomImage,
  roomBeds,
  roomGuests,
  tourId, 
  tourName,
  tourPrice = 0,
  tourDuration,
  tourLocation
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    specialRequests: '',
  })

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 0
  }

  const nights = calculateNights()
  const subtotal = roomId ? roomPrice * nights : tourPrice
  const tax = subtotal * 0.12 // 12% tax
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const bookingPayload = {
      ...formData,
      roomId,
      roomName,
      tourId,
      tourName,
      type: roomId ? 'room' : 'tour',
      total,
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
    
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '1',
        specialRequests: '',
      })
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const today = new Date().toISOString().split('T')[0]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="h-20" /> {/* Spacer for fixed header */}
        <div className="flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full mb-8 shadow-lg"
            >
              <Check className="w-12 h-12" />
            </motion.div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Your reservation has been successfully confirmed
            </p>
            
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 mb-8">
              <div className="text-sm text-primary-600 font-medium mb-2">Confirmation Number</div>
              <div className="text-4xl font-mono font-bold text-primary-700 mb-4">
                BK{Date.now().toString().slice(-8)}
              </div>
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to <strong>{formData.email}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 rounded-xl p-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Check-in</div>
                <div className="font-semibold text-gray-900">{new Date(formData.checkIn).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Check-out</div>
                <div className="font-semibold text-gray-900">{new Date(formData.checkOut).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Guests</div>
                <div className="font-semibold text-gray-900">{formData.guests} {parseInt(formData.guests) === 1 ? 'guest' : 'guests'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Total</div>
                <div className="font-semibold text-primary-600">₱{total.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4"> {/* Changed py-12 to pt-24 pb-12 */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Just a few details to confirm your reservation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Guest Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Stay Details</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        required
                        min={today}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        required
                        min={formData.checkIn || today}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'guest' : 'guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    placeholder="Any special requirements or preferences..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || nights === 0}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Booking Summary</h3>

              {/* Room/Tour Preview */}
              {roomName && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="bg-gray-100 rounded-xl h-40 mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Suite Preview</span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{roomName}</h4>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    {roomBeds && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{roomBeds}</span>
                      </div>
                    )}
                    {roomGuests && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{roomGuests} guests</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tourName && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">{tourName}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {tourDuration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{tourDuration}</span>
                      </div>
                    )}
                    {tourLocation && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{tourLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                {roomId && nights > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>₱{roomPrice.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span className="font-semibold">₱{subtotal.toLocaleString()}</span>
                  </div>
                )}
                {tourId && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tour Price</span>
                    <span className="font-semibold">₱{tourPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Taxes & Fees (12%)</span>
                  <span className="font-semibold">₱{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">₱{total.toLocaleString()}</span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <div className="font-semibold mb-1">Secure Booking</div>
                      <div>Your payment information is encrypted and secure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}