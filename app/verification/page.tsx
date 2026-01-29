'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock, Shield } from 'lucide-react'

export default function VerificationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<any>(null)
  const [formData, setFormData] = useState({
    startupName: '',
    startupDescription: '',
    foundingDate: '',
    teamSize: '',
    website: '',
  })

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verification/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      console.error('Error fetching verification status:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verification/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          teamSize: parseInt(formData.teamSize),
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchVerificationStatus()
        if (data.data.autoApproved) {
          setTimeout(() => router.push('/dashboard'), 2000)
        }
      } else {
        alert(data.message)
      }
    } catch (error: any) {
      alert('Error submitting verification request: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (status?.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
        >
          <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Already Verified!</h1>
          <p className="text-gray-300 mb-6">
            Your account is verified. You can now access all locked deals.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  if (status?.verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
        >
          <Clock className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold text-white mb-2">Verification Pending</h1>
          <p className="text-gray-300 mb-6">
            Your verification request is under review. You will be notified once approved.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-10">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Get Verified</h1>
          <p className="text-gray-300 text-lg">
            Unlock exclusive locked deals by verifying your startup
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Verification Criteria
            </h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Startup must be less than 5 years old</li>
              <li>• Team size between 2-50 members</li>
              <li>• Valid startup information required</li>
              <li>• Auto-approved if criteria met</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Startup Name *
              </label>
              <input
                type="text"
                name="startupName"
                value={formData.startupName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., TechStartup Inc."
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Startup Description *
              </label>
              <textarea
                name="startupDescription"
                value={formData.startupDescription}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Describe what your startup does..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Founding Date *
                </label>
                <input
                  type="date"
                  name="foundingDate"
                  value={formData.foundingDate}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Team Size *
                </label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g., 5"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="https://yourstartup.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Verification Request'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}
