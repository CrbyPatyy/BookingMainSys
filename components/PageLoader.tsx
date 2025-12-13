'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function PageLoader() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2200)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white"
                >
                    <div className="flex flex-col items-center gap-12">
                        {/* Hotel Building Icon with animated windows */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Building structure */}
                            <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                                {/* Main building */}
                                <rect x="20" y="20" width="80" height="100" fill="#0284c7" opacity="0.1" stroke="#0284c7" strokeWidth="2" rx="2" />

                                {/* Windows - 3 columns, 4 rows */}
                                {[0, 1, 2, 3].map((row) =>
                                    [0, 1, 2].map((col) => (
                                        <motion.rect
                                            key={`${row}-${col}`}
                                            x={30 + col * 20}
                                            y={30 + row * 20}
                                            width="12"
                                            height="14"
                                            rx="1"
                                            initial={{ fill: '#cbd5e1', opacity: 0.3 }}
                                            animate={{
                                                fill: ['#cbd5e1', '#0ea5e9', '#cbd5e1'],
                                                opacity: [0.3, 1, 0.3]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: (row * 3 + col) * 0.15,
                                                ease: 'easeInOut'
                                            }}
                                        />
                                    ))
                                )}

                                {/* Entrance */}
                                <rect x="47" y="105" width="26" height="15" fill="#0284c7" opacity="0.2" rx="1" />
                                <motion.rect
                                    x="50"
                                    y="108"
                                    width="20"
                                    height="12"
                                    fill="#0ea5e9"
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </svg>
                        </motion.div>

                        {/* Brand Name with elegant letter animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="flex items-center gap-2">
                                {['B', 'o', 'o', 'k', 'i', 'n', 'g', ' ', 'I', 'n', 'n'].map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.7 + index * 0.05,
                                            ease: 'easeOut'
                                        }}
                                        className="text-4xl font-bold text-gray-900 tracking-tight"
                                    >
                                        {letter === ' ' ? '\u00A0' : letter}
                                    </motion.span>
                                ))}
                            </div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 1.5 }}
                                className="text-sm text-gray-500 font-light tracking-[0.2em] uppercase"
                            >
                                Premium Stays
                            </motion.p>
                        </motion.div>

                        {/* Minimal progress indicator */}
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="w-48 h-[2px] bg-gradient-to-r from-transparent via-primary-400 to-transparent"
                        >
                            <motion.div
                                animate={{ x: [-200, 200] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-full w-20 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
