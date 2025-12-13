'use client'

import PageHero from '@/components/common/PageHero'
import { motion } from 'framer-motion'
import { CheckCircle, Users, Heart, Award, Clock, MapPin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Our Story"
        subtitle="A journey of hospitality, nature, and creating unforgettable memories since 2010."
        image="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80"
      />

      {/* Story Section - Zig Zag Layout */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Part 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <span className="text-primary-600 font-bold uppercase tracking-wider text-sm mb-2 block">Our Beginnings</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">From Humble Roots to <br /><span className="text-primary-600">Luxury Sanctuary</span></h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2010, Booking Inn began as a dream to create a sanctuary where travelers could escape the hustle and bustle of everyday life.
                What started as a small family-run guesthouse has grown into a premier boutique inn, known for its exceptional service and attention to detail.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every corner of our property tells a story of local craftsmanship, dedication to nature, and the warmth of Filipino hospitality.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                  alt="Hotel Interior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs hidden md:block">
                <p className="font-serif italic text-gray-800 text-lg">"The best way to find yourself is to lose yourself in the service of others."</p>
                <p className="text-right text-gray-500 mt-2 text-sm">- Mahatma Gandhi</p>
              </div>
            </motion.div>
          </div>

          {/* Part 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <span className="text-primary-600 font-bold uppercase tracking-wider text-sm mb-2 block">Our Philosophy</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">Designed for <br /><span className="text-primary-600">Genuine Connection</span></h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our philosophy is simple: every guest deserves to feel at home. We combine modern amenities with rustic charm, creating spaces that are both luxurious and welcoming.
              </p>
              <ul className="space-y-4">
                {[
                  'Sustainable practices & Eco-friendly amenities',
                  'Locally sourced organic ingredients',
                  'Personalized concierge service'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="h-64 rounded-2xl overflow-hidden shadow-lg mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80"
                    alt="Hotel Detail 1"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-64 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80"
                    alt="Hotel Detail 2"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-900 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Clock, value: '10+', label: 'Years of Excellence' },
              { icon: Users, value: '50k+', label: 'Happy Guests' },
              { icon: MapPin, value: '15', label: 'Local Tours' },
              { icon: Award, value: '25', label: 'Awards Won' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary-300" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-200 text-sm font-medium uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide every interaction and detail at Booking Inn.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Authenticity', desc: 'We stay true to our roots and local culture.', icon: MapPin },
              { title: 'Excellence', desc: 'We strive for perfection in every service.', icon: Award },
              { title: 'Care', desc: 'We treat every guest like family.', icon: Heart },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}