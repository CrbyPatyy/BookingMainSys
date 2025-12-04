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
  const [activeHover, setActiveHover] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'
  const shouldShowWhiteBg = scrolled || !isHome

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldShowWhiteBg 
          ? 'bg-white shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className={`text-2xl font-bold tracking-tight transition-colors ${
              shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
            }`}>
              BOOKING INN
            </span>
            <span className={`text-xs tracking-widest font-medium transition-colors ${
              shouldShowWhiteBg ? 'text-gray-600' : 'text-white/70'
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
                <span className={`text-sm font-medium transition-colors ${
                  shouldShowWhiteBg ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                }`}>
                  {item.name}
                </span>
                <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                  pathname === item.path 
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 bg-white shadow-lg">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === item.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}