'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  // Setup scroll-based animation for parallax - constrained to hero section only
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  // Animation variants for initial load
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any // Custom easing for smooth effect
      }
    }
  }

  return (
    <section ref={heroRef} className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background Image with parallax effect */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, willChange: 'transform' }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="w-full h-full relative">
          <img
            src="https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=2560&q=85"
            alt="Luxury hotel interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/75 to-gray-900/35" />
        </div>
      </motion.div>

      {/* Content with fade effect on scroll and initial animations */}
      <motion.div
        className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-16 md:py-24 lg:py-32"
        style={{ opacity, willChange: 'opacity' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          {/* Center content on mobile, left-align on larger screens */}
          <div className="max-w-3xl text-center md:text-left mx-auto md:mx-0">
            {/* Responsive heading with fluid scaling and stunning gradient */}
            <motion.h1
              className="font-bold text-white mb-6 leading-tight tracking-tight"
              variants={itemVariants}
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-2xl">
                Experience
              </span>
              <span className="relative block mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-50 to-white drop-shadow-2xl animate-pulse-slow">
                  True Luxury
                </span>
                {/* Shimmer effect overlay */}
                <span className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                  style={{ backgroundSize: '200% 100%' }}>
                  True Luxury
                </span>
              </span>
            </motion.h1>

            {/* Improved, more evocative tagline */}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 md:mb-12 font-light leading-relaxed max-w-2xl drop-shadow-lg mx-auto md:mx-0"
              variants={itemVariants}
            >
              Where timeless elegance meets extraordinary moments
            </motion.p>

            {/* Button group - centered on mobile */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-center md:items-start"
              variants={itemVariants}
            >
              <Link
                href="/rooms"
                className="inline-flex items-center justify-center bg-gradient-to-r from-white to-gray-50 text-gray-900 font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group shadow-xl"
              >
                Explore Rooms
                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center border-2 border-white/80 bg-white/10 backdrop-blur-md text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 hover:bg-white/20 hover:border-white hover:scale-105 hover:shadow-2xl shadow-xl"
              >
                Book Your Stay
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced scroll indicator with smoother animation */}
      <div className="absolute bottom-8 left-0 right-0 z-10 md:bottom-12 flex justify-center">
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-white/80 text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase">Discover</span>
          <div className="relative w-[2px] h-12 md:h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent"
              animate={{ y: [0, 40, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}