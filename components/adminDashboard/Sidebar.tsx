'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Users,
  CheckCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, tooltip: 'Property overview and daily activity' },
  { name: 'Bookings', path: '/dashboard/bookings', icon: Calendar, tooltip: 'Upcoming arrivals — pending & confirmed reservations' },
  { name: 'Rooms', path: '/dashboard/rooms', icon: Bed, tooltip: 'Room inventory and availability' },
  { name: 'In-House', path: '/dashboard/guests', icon: Users, tooltip: 'Currently staying guests — checked-in only' },
  { name: 'Completed', path: '/dashboard/completed', icon: CheckCircle, tooltip: 'Past bookings — checked-out, cancelled, no-shows' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white transform transition-transform duration-300 z-40
        shadow-2xl border-r border-white/10 flex flex-col justify-between
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl font-bold text-white">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Booking Inn</h1>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Manager</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={item.tooltip}
                  className={`
                    group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-1'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                    }
                  `}
                >
                  <Icon size={20} className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className="font-medium tracking-wide">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User / Logout */}
        <div className="p-6 border-t border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={() => {
              window.location.href = '/login'
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}