'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Lock, Tag, TrendingUp, Star } from 'lucide-react'
import { Deal } from '@/types'

interface DealCardProps {
  deal: Deal
  index: number
}

export default function DealCard({ deal, index }: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // reset positions
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
    >
      <Link href={`/deals/${deal._id}`}>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer h-full group">
          {/* Hover particles */}
          {isHovered && [...Array(8)].map((_, i) => (
            <motion.div
              key={`hover-particle-${i}`}
              className="absolute w-1 h-1 bg-primary-400 rounded-full pointer-events-none"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 0.8,
              }}
              animate={{
                x: `${50 + (Math.cos((i / 8) * Math.PI * 2) * 100)}%`,
                y: `${50 + (Math.sin((i / 8) * Math.PI * 2) * 100)}%`,
                opacity: 0,
                scale: [1, 2, 0],
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
          
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
            animate={isHovered ? { translateX: '200%' } : {}}
            transition={{ duration: 0.6 }}
            style={{ pointerEvents: 'none' }}
          />

          {/* Header */}
          <motion.div 
            className="relative bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 p-6 text-white overflow-hidden"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: '200% auto' }}
          >
            {/* Floating particles */}
            <motion.div
              className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 10, 0],
                y: [0, 10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {deal.isLocked ? (
              <motion.div 
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 border border-white/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Locked</span>
              </motion.div>
            ) : (
              <motion.div 
                className="absolute top-4 right-4 bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 border border-green-400/50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Available</span>
              </motion.div>
            )}
            
            <h3 className="text-xl font-bold mb-2 line-clamp-2 relative z-10">{deal.title}</h3>
            <p className="text-sm opacity-90 relative z-10">{deal.partnerName}</p>
          </motion.div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {deal.shortDescription}
            </p>

            {/* Category Badge */}
            <motion.div 
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Tag className="w-4 h-4 text-primary-600" />
              </motion.div>
              <span className="text-sm font-medium text-primary-600 capitalize">
                {deal.category.replace('_', ' ')}
              </span>
            </motion.div>

            {/* Price */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <motion.p 
                  className="text-sm text-gray-500 line-through"
                  initial={{ opacity: 0.5 }}
                  whileHover={{ opacity: 1 }}
                >
                  ${deal.originalPrice}
                </motion.p>
                <motion.p 
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ${deal.discountedPrice}
                </motion.p>
              </div>
              <motion.div 
                className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(34, 197, 94, 0.4)",
                    "0 0 20px rgba(34, 197, 94, 0.4)",
                    "0 0 0px rgba(34, 197, 94, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {deal.discountPercentage}% OFF
                </span>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: deal.isLocked ? "0 10px 30px rgba(0,0,0,0.1)" : "0 10px 30px rgba(14, 165, 233, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full py-3 rounded-lg font-semibold transition-all overflow-hidden ${
                deal.isLocked
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white'
              }`}
            >
              {!deal.isLocked && (
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%', opacity: 0.3 }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {deal.isLocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Verification Required
                  </>
                ) : (
                  <>
                    View Deal
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
