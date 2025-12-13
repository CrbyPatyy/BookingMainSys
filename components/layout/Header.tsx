'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Rooms', path: '/rooms' },
  { name: 'Tours', path: '/tours' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeHover, setActiveHover] = useState('')
  const pathname = usePathname()




  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Update scrolled state for background color
      setScrolled(currentScrollY > 50)

      // Handle visibility based on scroll direction
      if (currentScrollY < 50) {
        // Always show header at top of page
        setVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header
        setVisible(false)
      } else {
        // Scrolling up - show header
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const isHome = pathname === '/'
  const shouldShowWhiteBg = scrolled || !isHome

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${shouldShowWhiteBg
          ? 'bg-white shadow-sm'
          : 'bg-transparent'
          } ${visible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col">
              <span className={`text-2xl font-bold tracking-tight transition-colors ${shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
                }`}>
                BOOKING INN
              </span>
              <span className={`text-xs tracking-widest font-medium transition-colors ${shouldShowWhiteBg ? 'text-gray-600' : 'text-white/70'
                }`}>
                LUXURY EXPERIENCE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-12">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onMouseEnter={() => setActiveHover(item.name)}
                  onMouseLeave={() => setActiveHover('')}
                  className="relative group"
                >
                  <span className={`text-sm font-medium transition-colors ${shouldShowWhiteBg ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                    }`}>
                    {item.name}
                  </span>
                  <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${pathname === item.path
                    ? 'w-full bg-primary-600'
                    : activeHover === item.name
                      ? 'w-full bg-gray-400'
                      : 'w-0'
                    }`} />
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              <svg className={`w-6 h-6 ${shouldShowWhiteBg ? 'text-gray-900' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Minimal Clean Menu */}
      <div
        className={`lg:hidden fixed top-20 left-0 right-0 bottom-0 z-[80] transition-all duration-300 ${isMenuOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content - Clean White Panel */}
        <div className="relative h-full overflow-y-auto bg-white">
          <div className="min-h-full flex flex-col p-6">
            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block group ${isMenuOpen ? 'animate-slide-in' : ''
                    }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div
                    className={`relative overflow-hidden rounded-lg px-4 py-3.5 transition-all duration-200 ${pathname === item.path
                      ? 'bg-primary-50 border-l-3 border-primary-500'
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-medium transition-colors ${pathname === item.path
                        ? 'text-primary-600'
                        : 'text-gray-700'
                        }`}>
                        {item.name}
                      </span>
                      <svg
                        className={`w-5 h-5 transition-all duration-200 ${pathname === item.path
                          ? 'text-primary-500 translate-x-0 opacity-100'
                          : 'text-gray-400 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link
                href="/booking"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg px-4 py-3.5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-white">Book Your Stay</span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}