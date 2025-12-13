'use client'

import { toursData } from '@/lib/data'
import TourCard from '@/components/tours/TourCard'
import PageHero from '@/components/common/PageHero'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Camera, Sun, Mountain, Map } from 'lucide-react'

// Categories for filtering
const categories = [
  { id: 'all', label: 'All Experiences', icon: Compass },
  { id: 'island', label: 'Island Hopping', icon: Sun },
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'sightseeing', label: 'Sightseeing', icon: Camera },
]

export default function ToursPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  // Filter tours (Mock logic since we don't have real categories in data yet, 
  // but we can simulate based on ID or Name for now)
  const filteredTours = toursData.filter(tour => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'island') return tour.name.includes('Lagoon') || tour.name.includes('Island')
    if (activeCategory === 'adventure') return tour.name.includes('Biking') || tour.name.includes('Stargazing')
    if (activeCategory === 'sightseeing') return tour.name.includes('Shrine')
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Explore El Nido"
        subtitle="Embark on unforgettable journeys through crystal-clear waters and hidden lagoons."
        image="https://images.unsplash.com/photo-1552083375-1447ce886485?w=1920&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Intro Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full mb-6"
          >
            <Map className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Curated Experiences</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Find Your Perfect Adventure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            Whether you seek adrenalin-pumping activities or peaceful moments in nature,
            we have curated the best tours El Nido has to offer.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all font-medium text-lg ${activeCategory === cat.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-white' : 'text-primary-500'}`} />
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Tour Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredTours.map((tour) => (
              <motion.div
                key={tour.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <TourCard tour={tour} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTours.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No tours found in this category.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-4 text-primary-600 font-bold hover:underline"
            >
              View all tours
            </button>
          </div>
        )}
      </div>
    </div>
  )
}