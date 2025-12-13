'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Travel Blogger',
    content: 'Absolutely stunning property! The attention to detail and service was exceptional. Every moment felt like a dream. Will definitely return for another magical experience.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    location: 'New York, USA'
  },
  {
    name: 'Michael Chen',
    role: 'Business Traveler',
    content: 'Perfect blend of luxury and comfort. The location is ideal and the amenities are top-notch. The staff went above and beyond to ensure my stay was perfect.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    location: 'Singapore'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Family Vacationer',
    content: 'Our family had an amazing time. The kids loved the activities and we appreciated the peaceful atmosphere. This was truly a vacation to remember!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    location: 'Madrid, Spain'
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <Quote className="absolute top-20 left-10 w-32 h-32 text-primary-200 rotate-12" />
        <Quote className="absolute bottom-20 right-10 w-40 h-40 text-primary-100 -rotate-12" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-5 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold uppercase tracking-wider">Guest Reviews</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied guests
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-primary-100"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      <Quote className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Stars */}
                  <div className="flex justify-center md:justify-start items-center gap-1 mb-6">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-lg md:text-xl mb-8 italic leading-relaxed">
                    "{testimonials[current].content}"
                  </p>

                  {/* Author */}
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 mb-1">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-gray-600 mb-1">{testimonials[current].role}</p>
                    <p className="text-primary-600 text-sm font-medium">{testimonials[current].location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 hover:text-primary-500 flex items-center justify-center transition-all shadow-md hover:shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 hover:text-primary-500 flex items-center justify-center transition-all shadow-md hover:shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all ${current === index ? 'bg-primary-600 w-8' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}