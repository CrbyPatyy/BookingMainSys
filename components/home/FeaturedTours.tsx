'use client'

import { toursData } from '@/lib/data'
import TourCard from '@/components/tours/TourCard'
import Link from 'next/link'
import { ArrowRight, Compass, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function FeaturedTours() {
  const featuredTours = toursData.slice(0, 3)

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                                 radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full mb-6">
              <Compass className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Adventure Awaits</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              El Nido Island Tours
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              Explore the breathtaking lagoons, hidden beaches, and pristine waters of Palawan's paradise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/tours"
              className="hidden md:inline-flex items-center gap-2 text-white hover:text-white/80 font-semibold text-lg group"
            >
              View all tours
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Diagonal Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                {/* Image with diagonal overlay */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={tour.images[0]}
                    alt={tour.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Diagonal gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 via-transparent to-black/60" />

                  {/* Top badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-primary-600 font-bold text-sm">{tour.duration}</span>
                  </div>

                  {/* Bottom price tag */}
                  <div className="absolute bottom-4 right-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2 rounded-full shadow-lg">
                    <span className="text-lg font-bold">₱{tour.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {tour.name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {tour.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <MapPin className="w-4 h-4" />
                    <span>{tour.location}</span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {tour.highlights.slice(0, 2).map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/tours/booking?tourId=${tour.id}`}
                    className="inline-flex items-center justify-center w-full gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-all group/btn"
                  >
                    <span>Book Tour</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center md:hidden"
        >
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-white/90 font-semibold py-3 px-8 rounded-full transition-all"
          >
            View all tours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
