import { Users, CreditCard, Bed, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    currentGuests: number
    todayRevenue: number
    occupancyRate: number
    avgDailyRate: number
    totalRooms: number
    occupiedRooms: number
    availableRooms: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: 'In-House Guests',
      value: stats.currentGuests > 0 ? stats.currentGuests.toString() : '0',
      change: 'Connect database',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Daily Revenue',
      value: stats.todayRevenue > 0 ? `₱${stats.todayRevenue.toLocaleString()}` : '₱0',
      change: 'Connect database',
      icon: CreditCard,
      color: 'bg-green-500',
    },
    {
      title: 'Occupancy Rate',
      value: stats.occupancyRate > 0 ? `${stats.occupancyRate}%` : '0%',
      change: 'Connect database',
      icon: Bed,
      color: 'bg-purple-500',
    },
    {
      title: 'Avg. Daily Rate',
      value: stats.avgDailyRate > 0 ? `₱${stats.avgDailyRate.toLocaleString()}` : '₱0',
      change: 'Connect database',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold mt-2 text-gray-900 group-hover:scale-105 transition-transform duration-300 origin-left">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-blue-600 mt-2 bg-blue-50 inline-block px-2 py-0.5 rounded-full">
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white`}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          </div>
        )
      })}
    </div>
  )
}