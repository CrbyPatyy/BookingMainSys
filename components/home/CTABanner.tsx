'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CTABanner() {
    return (
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                 radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`,
                    }}
                />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full mb-8">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Limited Time Offer</span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Ready to Experience <br className="hidden sm:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-blue-400">
                            True Luxury?
                        </span>
                    </h2>

                    <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        Book your dream stay today and discover why our guests keep coming back. Your perfect vacation awaits.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/booking"
                            className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-2xl hover:shadow-primary-500/50 hover:scale-105"
                        >
                            <Calendar className="w-5 h-5" />
                            <span>Book Your Stay</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 border-2 border-white/30 hover:border-white/50"
                        >
                            <Phone className="w-5 h-5" />
                            <span>Contact Us</span>
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-12 flex flex-wrap justify-center gap-8 text-white/60 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>Free Cancellation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>Best Price Guarantee</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>24/7 Support</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
