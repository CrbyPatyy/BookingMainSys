'use client'

import { Wifi, Coffee, Waves, Car, Dumbbell, Utensils, Sparkles, Check } from 'lucide-react'
import { motion } from 'framer-motion'

const amenities = [
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Free high-speed internet throughout the property',
  },
  {
    icon: Coffee,
    title: 'Complimentary Breakfast',
    description: 'Daily breakfast buffet with local specialties',
  },
  {
    icon: Waves,
    title: 'Beach Access',
    description: 'Private beach access just steps away',
  },
  {
    icon: Car,
    title: 'Free Parking',
    description: 'Secure parking available for all guests',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Center',
    description: '24/7 gym with modern equipment',
  },
  {
    icon: Utensils,
    title: 'Restaurant & Bar',
    description: 'On-site dining with local and international cuisine',
  },
]

export default function Amenities() {
  return (
    <section id="amenities" className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary-200/30 to-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-primary-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-5 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">World-Class Facilities</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need, <span className="text-primary-600">All in One Place</span>
            </h2>

            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              From the moment you arrive, enjoy premium amenities designed to make your stay extraordinary. We've thought of every detail.
            </p>

            {/* Amenity List Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {amenities.map((amenity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <amenity.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {amenity.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Large image */}
              <div className="col-span-2 h-72 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                  alt="Hotel Lobby"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Two smaller images */}
              <div className="h-56 rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
                  alt="Hotel Restaurant"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="h-56 rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80"
                  alt="Hotel Pool"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Floating stats badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">25+</div>
                  <div className="text-sm text-gray-600">Premium Amenities</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}