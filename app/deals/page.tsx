'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Lock, Unlock } from 'lucide-react'
import DealCard from '@/components/deals/DealCard'
import { Deal } from '@/types'

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [accessFilter, setAccessFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeals()
  }, [])

  useEffect(() => {
    filterDeals()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deals, searchTerm, selectedCategory, accessFilter])

  const fetchDeals = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deals`)
      const data = await response.json()
      if (data.success) {
        setDeals(data.data.deals)
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterDeals = () => {
    let filtered = [...deals]

    // filter by category first
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((deal) => deal.category === selectedCategory)
    }

    // then by access level
    if (accessFilter === 'locked') {
      filtered = filtered.filter((deal) => deal.isLocked)
    } else if (accessFilter === 'unlocked') {
      filtered = filtered.filter((deal) => !deal.isLocked)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDeals(filtered)
  }

  return (
    <main className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Exclusive Deals
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover premium tools and services at unbeatable prices
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg"
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {categories.map((category) => (
              <motion.button
                key={category.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </div>

          {/* Access Filter */}
          <div className="flex gap-3">
            {accessFilters.map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAccessFilter(filter.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  accessFilter === filter.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter.icon}
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          Showing {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'}
        </motion.p>

        {/* Deals Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${accessFilter}-${searchTerm}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDeals.map((deal, index) => (
                <DealCard key={deal._id} deal={deal} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filteredDeals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400 mb-2">No deals found</p>
            <p className="text-gray-500">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>
    </main>
  )
}

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Cloud Services', value: 'cloud_services' },
  { label: 'Marketing', value: 'marketing_tools' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Productivity', value: 'productivity' },
  { label: 'Development', value: 'development' },
  { label: 'Design', value: 'design' },
  { label: 'Communication', value: 'communication' },
]

const accessFilters = [
  { label: 'All Deals', value: 'all', icon: <Filter className="w-4 h-4" /> },
  { label: 'Unlocked', value: 'unlocked', icon: <Unlock className="w-4 h-4" /> },
  { label: 'Locked', value: 'locked', icon: <Lock className="w-4 h-4" /> },
]
