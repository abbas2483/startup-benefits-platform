'use client'

import { motion } from 'framer-motion'
import { Package, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'

interface ClaimCardProps {
  claim: any
  index: number
}

export default function ClaimCard({ claim, index }: ClaimCardProps) {
  const getStatusColor = (status: string) => {
    // return different colors based on claim status
    switch (status) {
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'rejected':
        return <XCircle className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{claim.deal?.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{claim.deal?.partnerName}</p>
        </div>
        <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(claim.status)}`}>
          {getStatusIcon(claim.status)}
          <span className="text-sm font-medium capitalize">{claim.status}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Claimed on {new Date(claim.claimDate).toLocaleDateString()}</span>
        </div>

        {claim.couponCode && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Coupon Code</p>
            <p className="text-lg font-mono font-bold">{claim.couponCode}</p>
          </div>
        )}

        {claim.status === 'approved' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-400">
              ✓ Your deal is ready to use! Check your email for instructions.
            </p>
          </div>
        )}

        {claim.status === 'pending' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              ⏳ Your claim is being reviewed. This usually takes 1-2 business days.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
