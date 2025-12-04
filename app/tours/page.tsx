import { toursData } from '@/lib/data'
import TourCard from '@/components/tours/TourCard'

export default function ToursPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Tours & Activities</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the best experiences around our inn. From cultural tours to adventure activities, 
          we have something for every traveler.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {toursData.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}