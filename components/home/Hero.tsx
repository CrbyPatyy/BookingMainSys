'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background Image with optimized responsiveness */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          <img
            src="https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=2560&q=85"
            alt="Luxury hotel interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/40" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Responsive heading with fluid scaling */}
            <h1 className="font-bold text-white mb-6 leading-tight tracking-tight">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                Experience
              </span>
              <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                True Luxury
              </span>
            </h1>
            
            {/* Responsive paragraph */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/85 mb-8 md:mb-12 font-light leading-relaxed max-w-2xl">
              Immerse yourself in unparalleled comfort and elegance
            </p>
            
            {/* Responsive button group */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/rooms"
                className="inline-flex items-center justify-center bg-white text-gray-900 font-medium text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg group shadow-md"
              >
                Explore Rooms
                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center border-2 border-white text-white font-medium text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 hover:bg-white hover:text-gray-900 hover:shadow-lg shadow-md"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 md:bottom-12">
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <span className="text-white text-[10px] sm:text-xs tracking-widest font-medium uppercase">Scroll</span>
          <div className="w-px h-8 md:h-12 bg-white/30 animate-pulse">
            <div className="w-px h-3 bg-white rounded-full mt-1 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}