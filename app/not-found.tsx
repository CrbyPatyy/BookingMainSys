'use client'

import Link from 'next/link'
import { Home, Compass, Map } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-60">
        <img
          src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1920&q=80"
          alt="Lost in Paradise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-block"
        >
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20 shadow-2xl">
            <Compass className="w-12 h-12 text-blue-400 animate-[spin_8s_linear_infinite]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-7xl md:text-9xl font-bold text-white mb-4 tracking-tighter drop-shadow-lg"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-blue-100 mb-6"
        >
          Lost in Paradise?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-lg mx-auto"
        >
          It seems you've ventured off the beaten path. Don't worry, the best discoveries often happen when we get lost.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="group px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-600/30 flex items-center gap-2 hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            <span>Return to Resort</span>
          </Link>
          <Link
            href="/tours"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/10 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <Map className="w-5 h-5" />
            <span>Find an Adventure</span>
          </Link>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent z-0" />
    </div>
  )
}