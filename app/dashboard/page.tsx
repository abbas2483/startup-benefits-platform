'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Package, LogOut, Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import ClaimCard from '@/components/dashboard/ClaimCard'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // make sure user is actually logged in
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchUserData()
    fetchClaims()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setClaims(data.data.claims)
      }
    } catch (error) {
      console.error('Error fetching claims:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name}!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Verification Alert */}
        {!user?.isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Get Verified to Unlock Premium Deals
                </h3>
                <p className="text-gray-300 mb-4">
                  Verify your startup to access exclusive locked deals from AWS, Google Cloud, GitHub, and more!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/verification')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Start Verification Process
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account Status</p>
              <p className="font-semibold flex items-center gap-2">
                {user?.isVerified ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-600">Unverified</span>
                  </>
                )}
              </p>
            </div>
            {user?.startupName && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Startup</p>
                <p className="font-semibold">{user.startupName}</p>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
              <p className="font-semibold capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </motion.div>

        {/* Claimed Deals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold">
              Claimed Deals ({claims.length})
            </h2>
          </div>

          {claims.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
                No deals claimed yet
              </p>
              <p className="text-gray-400 mb-6">
                Browse our exclusive deals and start saving!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/deals')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Explore Deals
              </motion.button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {claims.map((claim, index) => (
                <ClaimCard key={claim._id} claim={claim} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
