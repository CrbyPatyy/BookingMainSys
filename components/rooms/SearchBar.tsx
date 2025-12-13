'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Real-time search as user types
  useEffect(() => {
    onSearchChange(searchTerm)
  }, [searchTerm, onSearchChange])

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search rooms by name, type, or amenities..."
          className="w-full pl-12 pr-24 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white shadow-sm"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}