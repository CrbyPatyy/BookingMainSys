'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Calendar, Users, Check, Shield, Bed, MapPin, Clock, User, Mail, Phone, ArrowLeft, Utensils, Plane, Anchor, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import { getRooms, getRoom, getAvailableRooms, Room } from '@/lib/db/rooms'
import { toursData } from '@/lib/data'

// Wrapper for Suspense
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')

  const [rooms, setRooms] = useState<Room[]>([])
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingAvailability, setLoadingAvailability] = useState(false)

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    specialRequests: '',
    paymentMethod: 'arrival', // 'arrival' | 'card' | 'online'
    mealPlan: {
      breakfast: false,
      lunch: false,
      dinner: false
    },
    airportPickup: {
      required: false,
      flightNumber: '',
      pickupTime: ''
    },
    tours: [] as number[], // Array of selected tour IDs
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Prices
  const MEAL_PRICES = { breakfast: 250, lunch: 350, dinner: 450 }
  const AIRPORT_FEE = 1000

  // Fetch Data
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const allRooms = await getRooms()
      setRooms(allRooms)
      setLoading(false)

      // Don't pre-select room from URL - wait for dates to be selected first
      // The room will be selected in the availability useEffect if it's available
    }
    init()
  }, [])

  // Fetch available rooms when dates/guests change
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (formData.checkIn && formData.checkOut && formData.guests) {
        setLoadingAvailability(true)
        const available = await getAvailableRooms(
          formData.checkIn,
          formData.checkOut,
          parseInt(formData.guests)
        )
        setAvailableRooms(available)

        // Auto-select room based on URL parameter or first available
        if (available.length > 0) {
          // If there's a roomId in URL and it's available, select it
          if (roomId) {
            const preferredRoom = available.find(r => r.id === roomId)
            if (preferredRoom) {
              setSelectedRoom(preferredRoom)
            } else {
              // Preferred room not available, select first available
              setSelectedRoom(available[0])
            }
          } else {
            // Check if current selection is still available
            const currentRoomStillAvailable = selectedRoom && available.find(r => r.id === selectedRoom.id)
            if (!currentRoomStillAvailable) {
              setSelectedRoom(available[0])
            }
          }
        } else {
          setSelectedRoom(null)
        }

        setLoadingAvailability(false)
      } else {
        setAvailableRooms([])
        setSelectedRoom(null)
      }
    }
    fetchAvailableRooms()
  }, [formData.checkIn, formData.checkOut, formData.guests, roomId])

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoomId = e.target.value
    const room = availableRooms.find(r => r.id === newRoomId)
    if (room) {
      setSelectedRoom(room)
      // Optionally update URL
      const url = new URL(window.location.href)
      url.searchParams.set('roomId', room.id)
      window.history.pushState({}, '', url)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (name.startsWith('meal_')) {
      const meal = name.replace('meal_', '')
      setFormData(prev => ({
        ...prev,
        mealPlan: { ...prev.mealPlan, [meal]: (e.target as HTMLInputElement).checked }
      }))
    } else if (name === 'airportRequired') {
      setFormData(prev => ({
        ...prev,
        airportPickup: { ...prev.airportPickup, required: (e.target as HTMLInputElement).checked }
      }))
    } else if (name.startsWith('airport_')) {
      const field = name.replace('airport_', '')
      setFormData(prev => ({
        ...prev,
        airportPickup: { ...prev.airportPickup, [field]: value }
      }))
    } else if (name === 'tours') {
      const tourId = parseInt(value)
      setFormData(prev => ({
        ...prev,
        tours: prev.tours.includes(tourId)
          ? prev.tours.filter(id => id !== tourId)
          : [...prev.tours, tourId]
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut || !selectedRoom) return 0

    const start = new Date(formData.checkIn)
    const end = new Date(formData.checkOut)
    const nights = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    const guests = parseInt(formData.guests) || 1

    // Room: Per-Person/Night pricing (Philippine/Asian model)
    let total = selectedRoom.price * guests * nights

    // Meals (Price * Guests * Nights) - already per person
    let dailyMealCost = 0
    if (formData.mealPlan.breakfast) dailyMealCost += MEAL_PRICES.breakfast
    if (formData.mealPlan.lunch) dailyMealCost += MEAL_PRICES.lunch
    if (formData.mealPlan.dinner) dailyMealCost += MEAL_PRICES.dinner
    total += dailyMealCost * guests * nights

    // Airport Pickup (flat fee)
    if (formData.airportPickup.required) total += AIRPORT_FEE

    // Tours (Price * Guests)
    const toursCost = formData.tours.reduce((acc, tourId) => {
      const tour = toursData.find(t => t.id === tourId)
      return acc + (tour ? tour.price : 0)
    }, 0)
    total += toursCost * guests

    // Tax
    const tax = total * 0.12
    return total + tax
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate booking
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    const paymentLabels: Record<string, string> = {
      arrival: 'Pay Upon Arrival',
      card: 'Credit/Debit Card',
      online: 'Online Payment'
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full mb-8 shadow-lg">
            <Check className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-xl text-gray-600 mb-8">We can't wait to welcome you.</p>
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">₱{calculateTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold text-gray-900">{paymentLabels[formData.paymentMethod]}</span>
            </div>
            {formData.paymentMethod === 'arrival' && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                  💳 Please prepare your payment upon check-in. We accept Cash, Credit Cards, GCash, and Maya.
                </p>
              </div>
            )}
          </div>
          <button onClick={() => window.location.href = '/'} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition">
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
        <p className="text-gray-600 mb-8">Finalize your stay details below</p>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent"></div>
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* STEP 1: Stay Details - DATE FIRST! */}
              <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-sm p-8 border-2 border-primary-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-600 rounded-lg text-white"><Calendar size={20} /></div>
                    <h2 className="text-xl font-bold text-gray-900">Step 1: Select Your Dates & Guests</h2>
                  </div>
                  <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">Required</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">Choose your check-in and check-out dates to see available rooms</p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
                    <input required type="date" min={today} name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
                    <input required type="date" min={formData.checkIn || today} name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests</label>
                    <select name="guests" value={formData.guests} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 && 's'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {formData.checkIn && formData.checkOut && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>{Math.max(0, Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24)))} night(s)</strong> for {formData.guests} guest(s)
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 2: Room Selection - Shows Available Rooms */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Bed size={20} /></div>
                  <h2 className="text-xl font-bold text-gray-900">Step 2: Choose Your Room</h2>
                </div>
                {!formData.checkIn || !formData.checkOut ? (
                  <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Calendar className="mx-auto mb-3 text-gray-400" size={40} />
                    <p className="text-gray-500 font-medium">Please select your check-in and check-out dates first</p>
                    <p className="text-sm text-gray-400 mt-1">We'll show you available rooms for your selected dates</p>
                  </div>
                ) : loadingAvailability ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
                    <p className="text-gray-500 mt-3">Checking availability...</p>
                  </div>
                ) : availableRooms.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-600 font-semibold">No rooms available for your selected dates</p>
                    <p className="text-sm text-red-500 mt-1">Please try different dates or contact us for assistance</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Available Rooms ({availableRooms.length} option{availableRooms.length !== 1 && 's'})
                    </label>
                    <select
                      value={selectedRoom?.id || ''}
                      onChange={handleRoomChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white font-medium text-gray-900"
                    >
                      {availableRooms.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.type} - Room {room.number} - ₱{room.price.toLocaleString()}/person/night (Max {room.capacity} guests)
                        </option>
                      ))}
                    </select>
                    {selectedRoom && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex gap-4">
                          <img src={selectedRoom.image_url} alt={selectedRoom.type} className="w-24 h-24 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{selectedRoom.type}</h4>
                            <p className="text-sm text-gray-600 mt-1">{selectedRoom.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-500"><Users size={14} className="inline mr-1" />Up to {selectedRoom.capacity} guests</span>
                              <span className="text-sm font-semibold text-primary-600">₱{selectedRoom.price.toLocaleString()}/person/night</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 3: Guest Information */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><User size={20} /></div>
                  <h2 className="text-xl font-bold text-gray-900">Step 3: Guest Information</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="+63 900 000 0000" />
                  </div>
                </div>
              </div>

              {/* STEP 4: Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600"><CreditCard size={20} /></div>
                  <h2 className="text-xl font-bold text-gray-900">Step 4: Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {/* Pay Upon Arrival */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'arrival' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="arrival"
                      checked={formData.paymentMethod === 'arrival'}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <span className="block font-semibold text-gray-900">Pay Upon Arrival</span>
                      <span className="block text-sm text-gray-500">Pay when you check-in at the hotel</span>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield size={20} className="text-green-600" />
                    </div>
                  </label>

                  {/* Credit/Debit Card */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="block font-semibold text-gray-900">Credit / Debit Card</span>
                      <span className="block text-sm text-gray-500">Secure payment via Visa, Mastercard</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-10 h-6 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                      <div className="w-10 h-6 bg-red-500 rounded text-white text-[8px] font-bold flex items-center justify-center">MC</div>
                    </div>
                  </label>

                  {/* Online Payment */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <span className="block font-semibold text-gray-900">Online Payment</span>
                      <span className="block text-sm text-gray-500">GCash, Maya, or Bank Transfer</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-10 h-6 bg-blue-500 rounded text-white text-[8px] font-bold flex items-center justify-center">GCash</div>
                      <div className="w-10 h-6 bg-green-600 rounded text-white text-[8px] font-bold flex items-center justify-center">Maya</div>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'arrival' && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Your booking will be held for 24 hours. Please present a valid ID upon check-in.
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 5: Add-ons Section (Optional) */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Step 5: Enhance Your Stay (Optional)</h2>
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">Optional</span>
                </div>

                {/* Meals */}
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Utensils className="text-orange-500" size={20} />
                    <h3 className="font-bold text-gray-900">Meal Plans (Per Person/Day)</h3>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                      <input type="checkbox" name="meal_breakfast" checked={formData.mealPlan.breakfast} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                      <div>
                        <span className="block text-sm font-semibold">Breakfast</span>
                        <span className="block text-xs text-gray-500">₱{MEAL_PRICES.breakfast}</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                      <input type="checkbox" name="meal_lunch" checked={formData.mealPlan.lunch} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                      <div>
                        <span className="block text-sm font-semibold">Lunch</span>
                        <span className="block text-xs text-gray-500">₱{MEAL_PRICES.lunch}</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                      <input type="checkbox" name="meal_dinner" checked={formData.mealPlan.dinner} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                      <div>
                        <span className="block text-sm font-semibold">Dinner</span>
                        <span className="block text-xs text-gray-500">₱{MEAL_PRICES.dinner}</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Airport Pickup */}
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Plane className="text-blue-500" size={20} />
                      <h3 className="font-bold text-gray-900">Airport Pickup (+₱{AIRPORT_FEE.toLocaleString()})</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="airportRequired" checked={formData.airportPickup.required} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  {formData.airportPickup.required && (
                    <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
                      <input required name="airport_flightNumber" placeholder="Flight Number" value={formData.airportPickup.flightNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg text-sm" />
                      <input required type="time" name="airport_pickupTime" value={formData.airportPickup.pickupTime} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  )}
                </div>

                {/* Island Tours */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Anchor className="text-teal-500" size={20} />
                    <h3 className="font-bold text-gray-900">Island Tours</h3>
                  </div>
                  <div className="space-y-3">
                    {toursData.slice(0, 4).map(tour => (
                      <label key={tour.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" name="tours" value={tour.id} checked={formData.tours.includes(tour.id)} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                          <span className="text-sm font-semibold">{tour.name}</span>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">₱{tour.price.toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sticky top-24 border border-gray-100">
                <h3 className="font-bold text-xl text-gray-900 mb-6 border-b border-gray-100 pb-4">Booking Summary</h3>

                {selectedRoom ? (
                  <>
                    {/* Room Preview */}
                    <div className="mb-6 flex gap-4">
                      <img src={selectedRoom.image_url} alt="" className="w-20 h-20 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{selectedRoom.type}</h4>
                        <p className="text-xs text-gray-500">Room {selectedRoom.number}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Users size={12} /> {formData.guests} Guest(s)
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 text-sm mb-6 max-h-[40vh] overflow-y-auto">
                      <div className="flex justify-between text-gray-600">
                        <span>Room ({formData.guests} guest{parseInt(formData.guests) > 1 ? 's' : ''})</span>
                        <span>₱{selectedRoom.price.toLocaleString()} /person/night</span>
                      </div>

                      {Object.entries(formData.mealPlan).map(([meal, selected]) => selected && (
                        <div key={meal} className="flex justify-between text-orange-600">
                          <span className="capitalize">{meal}</span>
                          <span>+₱{MEAL_PRICES[meal as keyof typeof MEAL_PRICES]} /person</span>
                        </div>
                      ))}

                      {formData.airportPickup.required && (
                        <div className="flex justify-between text-blue-600">
                          <span>Airport Pickup</span>
                          <span>+₱{AIRPORT_FEE.toLocaleString()}</span>
                        </div>
                      )}

                      {formData.tours.map(id => {
                        const tour = toursData.find(t => t.id === id)
                        return tour ? (
                          <div key={id} className="flex justify-between text-teal-600">
                            <span className="truncate max-w-[150px]">{tour.name}</span>
                            <span>+₱{tour.price.toLocaleString()}</span>
                          </div>
                        ) : null
                      })}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-xl text-gray-900">Total</span>
                        <div className="text-right">
                          <span className="block text-2xl font-bold text-primary-600">₱{calculateTotal().toLocaleString()}</span>
                          <span className="text-xs text-gray-400">Includes taxes & fees</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Display */}
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Payment</span>
                        <span className={`font-semibold ${formData.paymentMethod === 'arrival' ? 'text-green-600' :
                            formData.paymentMethod === 'card' ? 'text-blue-600' : 'text-purple-600'
                          }`}>
                          {formData.paymentMethod === 'arrival' && '💵 Pay Upon Arrival'}
                          {formData.paymentMethod === 'card' && '💳 Credit/Debit Card'}
                          {formData.paymentMethod === 'online' && '📱 Online Payment'}
                        </span>
                      </div>
                    </div>

                    <button onClick={handleSubmit} disabled={isSubmitting || !formData.checkIn || !formData.checkOut} className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Bed className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-gray-400 font-medium">No room selected</p>
                    <p className="text-sm text-gray-400 mt-2">Complete Steps 1 & 2 to see your booking summary</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No rooms available at the moment.
          </div>
        )}
      </div>
    </div>
  )
}
