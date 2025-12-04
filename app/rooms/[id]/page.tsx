import { notFound } from 'next/navigation'
import { roomsData } from '@/lib/data'
import RoomDetail from '@/components/rooms/RoomDetail'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RoomPage(props: PageProps) {
  const params = await props.params
  
  if (!params?.id) {
    notFound()
  }

  const room = roomsData.find((r) => r.id.toString() === params.id)

  if (!room) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RoomDetail room={room} />
      <div className="mt-12 max-w-4xl mx-auto text-center">
        <Link 
          href={`/booking?roomId=${room.id}&roomName=${encodeURIComponent(room.name)}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          Book Now
        </Link>
        <p className="mt-4 text-gray-600">
          You'll be redirected to our booking form to complete your reservation.
        </p>
      </div>
    </div>
  )
}