import Hero from '@/components/home/Hero'
import FeaturedRooms from '@/components/home/FeaturedRooms'
import FeaturedTours from '@/components/home/FeaturedTours'
import Amenities from '@/components/home/Amenities'
import Testimonials from '@/components/home/Testimonials'
import CTABanner from '@/components/home/CTABanner'

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <FeaturedRooms />
      <FeaturedTours />
      <Amenities />
      <Testimonials />
      <CTABanner />
    </div>
  )
}