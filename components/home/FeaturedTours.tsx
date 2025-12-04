import { toursData } from '@/lib/data'
import TourCard from '@/components/tours/TourCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function FeaturedTours() {
  const featuredTours = toursData.slice(0, 3)

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Tours
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Explore local attractions and activities curated for our guests.
            </p>
          </div>
          <Link
            href="/tours"
            className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            View all tours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="mt-8 md:mt-12 text-center md:hidden">
          <Link
            href="/tours"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
          >
            View all tours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
