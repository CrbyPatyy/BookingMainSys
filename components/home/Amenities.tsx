import { Wifi, Coffee, Waves, Car, Dumbbell, Utensils } from 'lucide-react'

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
    <section id="amenities" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Amenities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need for a comfortable and memorable stay
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="card p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 text-primary-600 rounded-lg mb-4">
                <amenity.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{amenity.title}</h3>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}