'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Lock, TrendingUp, Zap, ExternalLink } from 'lucide-react'
import ThreeBackground from '@/components/3d/ThreeBackground'

interface Deal {
  _id: string
  title: string
  description: string
  company: string
  category: string
  benefit: string
  accessLevel: string
  savings: string
  link: string
  originalPrice: number
  discountedPrice: number
  partnerName: string
  shortDescription: string
  isLocked: boolean
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorParticles, setCursorParticles] = useState<Array<{x: number, y: number, id: number}>>([])
  const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const fetchFeaturedDeals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/deals')
        if (response.ok) {
          const data = await response.json()
          
          // sorting by best value - highest savings first
          const sortedDeals = data.sort((a: Deal, b: Deal) => {
            const savingsA = a.originalPrice - a.discountedPrice
            const savingsB = b.originalPrice - b.discountedPrice
            return savingsB - savingsA
          })
          
          setFeaturedDeals(sortedDeals.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching deals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedDeals()
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    setMousePosition({
      x: (clientX - innerWidth / 2) / 50,
      y: (clientY - innerHeight / 2) / 50,
    })
    
    // only add particles 20% of the time to avoid performance issues
    if (Math.random() > 0.8) {
      const newParticle = {
        x: clientX,
        y: clientY,
        id: Date.now() + Math.random(),
      }
      setCursorParticles(prev => [...prev.slice(-10), newParticle])
    }
  }

  return (
    <main className="min-h-screen relative" onMouseMove={handleMouseMove}>
      {/* 3D Background */}
      <ThreeBackground />
      
      {/* Cursor Trail Particles */}
      {cursorParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed w-2 h-2 bg-primary-400 rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            zIndex: 9999,
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ 
            scale: 0,
            opacity: 0,
            y: -50,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          onAnimationComplete={() => {
            setCursorParticles(prev => prev.filter(p => p.id !== particle.id))
          }}
        />
      ))}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div className="container mx-auto px-6 z-10" style={{ y, opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-primary-200 dark:border-primary-800"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium">Exclusive Deals for Startups</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <motion.span
                className="inline-block bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% auto' }}
              >
                Build Your Startup
              </motion.span>
              <br />
              <motion.span
                className="inline-block bg-gradient-to-r from-pink-600 via-purple-600 to-primary-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Without Breaking the Bank
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
            >
              Access premium SaaS tools, cloud services, and productivity software
              at exclusive discounts. Perfect for founders, indie hackers, and early-stage teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/deals">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 60px rgba(14, 165, 233, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg"
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileHover={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                  <Zap className="w-5 h-5" />
                  Explore Deals
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </Link>

              <Link href="/register">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: "rgb(14, 165, 233)",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 transition-all"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Get Started Free</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              🔥 Top Deals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our highest-value offers sorted by maximum savings. Get the best deals first!
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredDeals.map((deal, index) => (
                  <motion.div
                    key={deal._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {/* Access level badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        deal.accessLevel === 'locked' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {deal.accessLevel === 'locked' ? <Lock className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        {deal.accessLevel === 'locked' ? 'Verified Only' : 'Open Access'}
                      </span>
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                        {deal.category}
                      </span>
                    </div>

                    {/* Company & Title */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {deal.partnerName || deal.company}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {deal.title}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {deal.shortDescription || deal.description}
                    </p>

                    {/* Savings Display */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                          💰 Save ${(deal.originalPrice - deal.discountedPrice).toLocaleString()}
                        </span>
                        {deal.discountedPrice === 0 && (
                          <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-500 line-through">
                          ${deal.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                          {deal.discountedPrice === 0 ? 'FREE' : `$${deal.discountedPrice.toLocaleString()}`}
                        </span>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="text-primary-600 dark:text-primary-400"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>

                    {/* Hover effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    />
                  </motion.div>
                ))}
              </div>

              {/* View All CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link href="/deals">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>View All Deals</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why Choose Our Platform?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                
                <motion.div 
                  className="relative w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    backgroundColor: "rgb(224, 242, 254)"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-3 relative">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 relative">{feature.description}</p>
                
                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-purple-600"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-12 text-center text-white overflow-hidden"
          >
            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                initial={{ 
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: 0.3
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${20 + i * 15}%`,
                  top: '50%'
                }}
              />
            ))}
            
            <motion.h2 
              className="text-4xl font-bold mb-4 relative"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Ready to Save Thousands?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 opacity-90 relative"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join thousands of startups already benefiting from our exclusive deals
            </motion.p>
            <Link href="/register">
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 40px rgba(255, 255, 255, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(255, 255, 255, 0.5)",
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                    "0 0 0px rgba(255, 255, 255, 0.5)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-2 z-10"
              >
                <span>Start Saving Today</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-primary-600" />,
    title: 'Exclusive Deals',
    description: 'Access deals not available anywhere else, specially curated for startups and indie hackers.',
  },
  {
    icon: <Lock className="w-6 h-6 text-primary-600" />,
    title: 'Verified Benefits',
    description: 'Get access to premium deals once verified. Protect exclusive offers for legitimate startups.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary-600" />,
    title: 'Save Up to 90%',
    description: 'Significant discounts on essential tools. Redirect savings toward growth and product development.',
  },
]
