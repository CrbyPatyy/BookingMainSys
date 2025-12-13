'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

// Price ranges matching per-person/night pricing (₱500 - ₱1,500)
const priceRanges = [
  { label: 'Under ₱600', min: 0, max: 600 },
  { label: '₱600 - ₱1,000', min: 600, max: 1000 },
  { label: '₱1,000 - ₱1,300', min: 1000, max: 1300 },
  { label: '₱1,300+', min: 1300, max: 99999 },
]

const guestOptions = [1, 2, 3, 4, 5, 6]

const bedTypes = ['King', 'Queen', 'Double', 'Twin']

export interface FilterState {
  priceRange: { min: number; max: number } | null
  guests: number | null
  bedType: string | null
  amenities: string[]
}

interface FiltersProps {
  onFiltersChange: (filters: FilterState) => void
}

export default function Filters({ onFiltersChange }: FiltersProps) {
  const [priceRangeLabel, setPriceRangeLabel] = useState('')
  const [guests, setGuests] = useState('')
  const [bedType, setBedType] = useState('')
  const [showAmenities, setShowAmenities] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const amenities = ['wifi', 'breakfast', 'parking', 'gym', 'beach', 'pool']

  // Helper to build filter state from current values
  const buildFilters = (
    newPriceLabel: string,
    newGuests: string,
    newBedType: string,
    newAmenities: string[]
  ): FilterState => {
    const priceRange = priceRanges.find(r => r.label === newPriceLabel)
    return {
      priceRange: priceRange ? { min: priceRange.min, max: priceRange.max } : null,
      guests: newGuests ? parseInt(newGuests) : null,
      bedType: newBedType || null,
      amenities: newAmenities
    }
  }

  // Handle price range change
  const handlePriceChange = (label: string) => {
    const newLabel = priceRangeLabel === label ? '' : label  // Toggle off if same
    setPriceRangeLabel(newLabel)
    onFiltersChange(buildFilters(newLabel, guests, bedType, selectedAmenities))
  }

  // Handle guests change
  const handleGuestsChange = (num: string) => {
    const newGuests = guests === num ? '' : num  // Toggle off if same
    setGuests(newGuests)
    onFiltersChange(buildFilters(priceRangeLabel, newGuests, bedType, selectedAmenities))
  }

  // Handle bed type change
  const handleBedTypeChange = (type: string) => {
    const newBedType = bedType === type ? '' : type  // Toggle off if same
    setBedType(newBedType)
    onFiltersChange(buildFilters(priceRangeLabel, guests, newBedType, selectedAmenities))
  }

  // Handle amenity toggle
  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity]
    setSelectedAmenities(newAmenities)
    onFiltersChange(buildFilters(priceRangeLabel, guests, bedType, newAmenities))
  }

  // Handle reset - clear all filters
  const handleReset = () => {
    setPriceRangeLabel('')
    setGuests('')
    setBedType('')
    setSelectedAmenities([])
    onFiltersChange({
      priceRange: null,
      guests: null,
      bedType: null,
      amenities: []
    })
  }

  const activeFiltersCount = [
    priceRangeLabel,
    guests,
    bedType,
    selectedAmenities.length > 0 ? 'amenities' : ''
  ].filter(Boolean).length

  return (
    <div className="p-4">
      <div className="space-y-8">
        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Price Range</h4>
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handlePriceChange(range.label)}
              >
                <div className="relative flex items-center">
                  <div className={`w-5 h-5 border-2 rounded-full transition-all ${priceRangeLabel === range.label
                    ? 'border-primary-600 border-4'
                    : 'border-gray-300'
                    }`} />
                </div>
                <span className="text-gray-600 group-hover:text-primary-600 transition-colors">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Guests */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Guests</h4>
          <div className="grid grid-cols-3 gap-2">
            {guestOptions.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleGuestsChange(num.toString())}
                className={`py-2 rounded-xl text-center border-2 font-medium transition-all ${guests === num.toString()
                  ? 'border-primary-600 bg-primary-50 text-primary-600 shadow-sm'
                  : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>

        {/* Bed Type */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Bed Type</h4>
          <div className="space-y-3">
            {bedTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleBedTypeChange(type)}
              >
                <div className="relative flex items-center">
                  <div className={`w-5 h-5 border-2 rounded-full transition-all ${bedType === type
                    ? 'border-primary-600 border-4'
                    : 'border-gray-300'
                    }`} />
                </div>
                <span className="text-gray-600 group-hover:text-primary-600 transition-colors">{type} Bed</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <button
            onClick={() => setShowAmenities(!showAmenities)}
            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span>Amenities {selectedAmenities.length > 0 && `(${selectedAmenities.length})`}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showAmenities ? 'rotate-180' : ''
                }`}
            />
          </button>

          {showAmenities && (
            <div className="mt-3 space-y-3 animate-slide-up pl-1">
              {amenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-3 cursor-pointer capitalize group"
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  <div className="relative flex items-center">
                    <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${selectedAmenities.includes(amenity)
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300'
                      }`}>
                      {selectedAmenities.includes(amenity) && (
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-600 group-hover:text-primary-600 transition-colors">{amenity}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          {activeFiltersCount > 0 && (
            <div className="text-center text-sm text-primary-600 font-medium mb-2">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
            </div>
          )}
          <button
            onClick={handleReset}
            disabled={activeFiltersCount === 0}
            className="w-full py-3 text-gray-500 font-medium hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  )
}