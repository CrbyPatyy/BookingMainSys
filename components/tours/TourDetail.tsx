import { Tour } from '@/types'
import { Clock, Users, MapPin, Check } from 'lucide-react'

interface TourDetailProps {
  tour: Tour
}

export default function TourDetail({ tour }: TourDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Tour header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{tour.name}</h1>
        <p className="text-xl text-primary-600 font-bold">
          ${tour.price} <span className="text-base font-normal text-gray-600">per person</span>
        </p>
      </div>

      {/* Main image */}
      <div className="mb-12">
        <div className="aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
          <span className="text-gray-500">Tour Banner Image</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column - Details */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Tour Description</h2>
            <p className="text-gray-700 leading-relaxed">{tour.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tour.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">What's Included</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Professional guide</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Transportation to and from the inn</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">All necessary equipment</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Bottled water and snacks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column - Info card */}
        <div>
          <div className="card p-6 sticky top-6">
            <h3 className="font-bold text-lg mb-6">Tour Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium">{tour.duration}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500">Group Size</div>
                  <div className="font-medium">Up to {tour.maxParticipants} people</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500">Meeting Point</div>
                  <div className="font-medium">Hotel Lobby</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  ${tour.price}
                </div>
                <p className="text-gray-600">per person</p>
              </div>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p>✓ Free cancellation 24h before</p>
                <p>✓ Reserve now, pay later</p>
                <p>✓ Instant confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}