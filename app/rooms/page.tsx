import { roomsData } from '@/lib/data'
import RoomGrid from '@/components/rooms/RoomGrid'
import Filters from '@/components/rooms/Filters'
import SearchBar from '@/components/rooms/SearchBar'

export default function RoomsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Rooms</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated selection of rooms, each designed to provide 
          the perfect balance of comfort, style, and functionality.
        </p>
      </div>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Filters />
        </div>
        <div className="lg:w-3/4">
          <RoomGrid rooms={roomsData} />
        </div>
      </div>
    </div>
  )
}