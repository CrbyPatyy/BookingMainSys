import { notFound } from 'next/navigation'
import { toursData } from '@/lib/data'
import TourDetail from '@/components/tours/TourDetail'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TourPage(props: PageProps) {
  const params = await props.params
  
  if (!params?.id) {
    notFound()
  }

  const tour = toursData.find((t) => t.id.toString() === params.id)

  if (!tour) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TourDetail tour={tour} />
      <div className="mt-12 max-w-4xl mx-auto text-center">
        <Link 
          href={`/booking?tourId=${tour.id}&tourName=${encodeURIComponent(tour.name)}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          Book This Tour
        </Link>
        <p className="mt-4 text-gray-600">
          You'll be redirected to our booking form to complete your reservation.
        </p>
      </div>
    </div>
  )
}