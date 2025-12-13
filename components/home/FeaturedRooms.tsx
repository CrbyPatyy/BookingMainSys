'use client'

import { roomsData } from '@/lib/data'
import RoomCard from '@/components/rooms/RoomCard'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function FeaturedRooms() {
  const featuredRooms = roomsData.slice(0, 3)

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Floating background blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-primary-600 mb-6 bg-primary-50 px-6 py-2 rounded-full"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Signature Collection</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 animate-gradient" style={{ backgroundSize: '200% auto' }}>Premium</span> Suites
          </h2>

          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Each suite is a masterpiece of design, blending luxury with comfort for an unforgettable stay.
          </p>
        </motion.div>

        {/* Bento Box Layout - Varied card sizes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-12">
          {/* Large Featured Card - Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 md:row-span-2"
          >
            <div className="relative group h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={featuredRooms[0].images[0]}
                alt={featuredRooms[0].name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="bg-primary-500/90 backdrop-blur-sm inline-block px-4 py-2 rounded-full text-sm font-bold mb-4">
                  MOST POPULAR
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">{featuredRooms[0].name}</h3>
                <p className="text-white/90 mb-6 text-lg">{featuredRooms[0].description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    ₱{featuredRooms[0].price}<span className="text-lg font-normal text-white/80">/person</span>
                  </div>
                  <Link
                    href={`/rooms/${featuredRooms[0].id}`}
                    className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2 group/btn"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stacked Smaller Cards - Right */}
          <div className="md:col-span-5 flex flex-col gap-6 md:gap-8">
            {featuredRooms.slice(1, 3).map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative h-[240px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
              >
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">₱{room.price}</div>
                    <Link
                      href={`/rooms/${room.id}`}
                      className="text-white hover:text-primary-300 font-medium inline-flex items-center gap-1 text-sm"
                    >
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/rooms"
            className="inline-flex items-center gap-3 group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <span>View All Suites</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
