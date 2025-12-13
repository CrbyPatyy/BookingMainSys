'use client'

import { Bell, Search, User } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 transition-all duration-300">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search bookings, guests, rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-300 hover:bg-white"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:text-blue-600">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500 font-medium">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
              <User size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}