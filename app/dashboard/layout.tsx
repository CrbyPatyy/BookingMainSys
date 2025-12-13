import Sidebar from '@/components/adminDashboard/Sidebar'
import Header from '@/components/adminDashboard/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-900">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Header />
        <main className="p-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}