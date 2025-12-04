import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Booking Inn</h1>
          <p className="text-gray-600 text-lg">
            Where luxury meets comfort in the heart of nature
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2010, Booking Inn began as a dream to create a sanctuary 
                where travelers could escape the hustle and bustle of everyday life. 
                What started as a small family-run guesthouse has grown into a 
                premier boutique inn, known for its exceptional service and attention to detail.
              </p>
              <p>
                Our philosophy is simple: every guest deserves to feel at home. We combine 
                modern amenities with rustic charm, creating spaces that are both luxurious 
                and welcoming. Each room is thoughtfully designed to provide maximum comfort 
                while showcasing local craftsmanship and materials.
              </p>
              <p>
                Today, we continue to uphold our founding values while constantly innovating 
                to provide unique experiences that create lasting memories for our guests.
              </p>
            </div>
          </div>

          <div className="relative h-64 md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl" />
            <div className="absolute inset-4 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-500">Property Image</span>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto text-lg">
            To provide exceptional hospitality experiences that connect guests with 
            local culture and nature, creating memorable stays that inspire return visits 
            and genuine connections.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto text-primary-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Location</h3>
            <p className="text-gray-600">123 Serenity Lane, Mountain View</p>
          </div>

          <div className="card p-6 text-center">
            <Phone className="w-12 h-12 mx-auto text-primary-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>

          <div className="card p-6 text-center">
            <Mail className="w-12 h-12 mx-auto text-primary-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p className="text-gray-600">hello@bookinginn.com</p>
          </div>

          <div className="card p-6 text-center">
            <Clock className="w-12 h-12 mx-auto text-primary-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Reception Hours</h3>
            <p className="text-gray-600">24/7</p>
          </div>
        </div>
      </div>
    </div>
  )
}