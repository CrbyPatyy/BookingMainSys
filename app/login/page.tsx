'use client'

import { useState } from 'react'
import { Lock, User, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple authentication for demo
    // Replace with real authentication in production
    await new Promise(resolve => setTimeout(resolve, 1000))

    const validUsers = [
      { username: 'admin', password: 'admin123' },
      { username: 'reception', password: 'reception123' },
      { username: 'staff', password: 'staff123' },
    ]

    const isValid = validUsers.some(
      user => user.username === username && user.password === password
    )

    if (isValid) {
      // Store auth in localStorage for demo
      localStorage.setItem('dashboard_auth', 'true')
      localStorage.setItem('dashboard_user', username)
      router.push('/dashboard')
    } else {
      setError('Invalid username or password')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Inn</h1>
          <p className="text-gray-600 mt-2">Staff Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Login</h2>
          <p className="text-gray-600 mb-6">Enter your credentials to access the dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>

            {/* Demo Credentials */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Demo credentials: <br />
                <span className="font-mono">admin / admin123</span> or <span className="font-mono">reception / reception123</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}