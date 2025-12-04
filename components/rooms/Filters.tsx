'use client'

import { useState } from 'react'
import { Filter, ChevronDown } from 'lucide-react'

const priceRanges = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $300', min: 200, max: 300 },
  { label: '$300+', min: 300, max: 1000 },
]

const guestOptions = [1, 2, 3, 4, 5, 6]

const bedTypes = ['King', 'Queen', 'Double', 'Twin']

export default function Filters() {
  const [priceRange, setPriceRange] = useState('')
  const [guests, setGuests] = useState('')
  const [bedType, setBedType] = useState('')
  const [showAmenities, setShowAmenities] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const amenities = ['wifi', 'breakfast', 'parking', 'gym', 'beach', 'pool']

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    )
  }

  const handleReset = () => {
    setPriceRange('')
    setGuests('')
    setBedType('')
    setSelectedAmenities([])
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary-600" />
        <h3 className="font-bold text-lg">Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="price"
                  value={range.label}
                  checked={priceRange === range.label}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-600">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Guests */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Number of Guests</h4>
          <div className="grid grid-cols-3 gap-2">
            {guestOptions.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setGuests(num.toString())}
                className={`py-2 rounded-lg text-center border transition-colors ${
                  guests === num.toString()
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Bed Type */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Bed Type</h4>
          <div className="space-y-2">
            {bedTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="bed"
                  value={type}
                  checked={bedType === type}
                  onChange={(e) => setBedType(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-600">{type} Bed</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <button
            onClick={() => setShowAmenities(!showAmenities)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
          >
            <span>Amenities</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAmenities ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showAmenities && (
            <div className="space-y-2 animate-slide-up">
              {amenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-3 cursor-pointer capitalize"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-600">{amenity}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <button
            onClick={() => {
              // In a real app, this would apply the filters
              console.log('Applying filters:', {
                priceRange,
                guests,
                bedType,
                amenities: selectedAmenities,
              })
            }}
            className="btn-primary w-full"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary w-full"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  )
}