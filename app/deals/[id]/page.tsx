'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Check, ArrowLeft, Tag, Calendar, Users } from 'lucide-react'
import { Deal } from '@/types'

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchDeal()
    }
  }, [params.id])

  const fetchDeal = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deals/${params.id}`
      )
      const data = await response.json()
      if (data.success) {
        setDeal(data.data.deal)
      }
    } catch (error) {
      console.error('Error fetching deal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    setClaiming(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dealId: params.id }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Deal claimed successfully!')
        router.push('/dashboard')
      } else {
        // Check if verification is required
        if (data.requiresVerification) {
          const confirm = window.confirm(data.message + '\n\nWould you like to get verified now?')
          if (confirm) {
            router.push('/verification')
          }
        } else {
          alert(data.message)
        }
      }
    } catch (error) {
      console.error('Error claiming deal:', error)
      alert('Failed to claim deal')
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Deal not found</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Deals
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{deal.title}</h1>
                <p className="text-xl opacity-90">{deal.partnerName}</p>
              </div>
              {deal.isLocked && (
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Locked</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-medium">{deal.category.replace('_', ' ')}</span>
              </div>
              <div className="text-2xl font-bold">
                <span className="line-through opacity-60">${deal.originalPrice}</span>
                <span className="ml-3">${deal.discountedPrice}</span>
              </div>
              <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">
                {deal.discountPercentage}% OFF
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Deal</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {deal.description}
              </p>
            </div>

            {deal.features && deal.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                <ul className="space-y-3">
                  {deal.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Eligibility</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300">{deal.eligibilityCriteria}</p>
              </div>
            </div>

            {/* Deal Info */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {deal.validUntil && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valid Until</p>
                    <p className="font-medium">
                      {new Date(deal.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {deal.claimLimit && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Users className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className="font-medium">
                      {deal.claimLimit - deal.claimCount} / {deal.claimLimit}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Tag className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">You Save</p>
                  <p className="font-medium text-green-600">
                    ${deal.originalPrice - deal.discountedPrice}
                  </p>
                </div>
              </div>
            </div>

            {/* Claim Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClaim}
              disabled={claiming || !deal.isActive}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claiming ? 'Claiming...' : deal.isLocked ? 'Claim Deal (Verification Required)' : 'Claim This Deal'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
