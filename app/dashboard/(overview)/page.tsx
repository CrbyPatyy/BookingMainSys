import StatsCards from '@/components/adminDashboard/StatsCards'
import TodayActivity from '@/components/adminDashboard/TodayActivity'
import RevenueChart from '@/components/adminDashboard/charts/RevenueChart'
import OccupancyChart from '@/components/adminDashboard/charts/OccupancyChart'
import { getDashboardStats } from '@/lib/db/stats'
import { getTodayArrivals, getTodayDepartures } from '@/lib/db/bookings'
import { getRevenueData, getOccupancyStats, getKeyMetrics } from '@/lib/db/reports'

export default async function DashboardPage() {
  // Fetch real data from database
  const stats = await getDashboardStats()
  const arrivals = await getTodayArrivals()
  const departures = await getTodayDepartures()

  // Fetch chart data from database
  const revenueData = getRevenueData()
  const occupancyData = getOccupancyStats()
  const keyMetrics = getKeyMetrics()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Dashboard</h1>
          <p className="text-gray-600">Real-time overview of hotel performance and daily operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold animate-pulse">
            ● Real-Time
          </span>
          <p className="text-sm text-gray-500">System Status: Online</p>
        </div>
      </div>

      {/* Top Row: Key Metrics */}
      <StatsCards stats={stats} />

      {/* Middle Row: Today's Activity & Occupancy */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Activity (2/3 width) */}
        <div className="lg:col-span-2">
          <TodayActivity arrivals={arrivals} departures={departures} />
        </div>

        {/* Occupancy Breakdown (1/3 width) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900">Occupancy Status</h3>
            <p className="text-sm text-gray-500">Live Room Allocation</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <OccupancyChart data={occupancyData} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Revenue & Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Performance (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Revenue Performance</h3>
              <p className="text-sm text-gray-500">Gross Revenue (Trailing 30 Days)</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl text-emerald-600">₱{keyMetrics.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total Revenue</p>
            </div>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white h-fit">
          <h3 className="font-bold text-lg mb-4">Front Desk Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href="/dashboard/bookings?newBooking=true" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-center transition-all">
              <span className="block font-bold text-sm">Create Reservation</span>
            </a>
            <a href="/dashboard/guests" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-center transition-all">
              <span className="block font-bold text-sm">Guest Checkout</span>
            </a>
            <a href="/dashboard/rooms" className="col-span-2 bg-white text-blue-700 hover:bg-blue-50 p-3 rounded-xl text-center font-bold text-sm transition-all shadow-sm">
              Room Management
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}