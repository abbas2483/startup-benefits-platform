// API helpers for making requests from the frontend
// keeps all the fetch logic in one place

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Get auth token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Set auth token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

// Remove auth token
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}

// wrapper function to handle all API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Add any custom headers
  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred')
  }

  return data
}

// Authentication API
export const authAPI = {
  async register(userData: {
    name: string
    email: string
    password: string
    startupName?: string
    role?: string
  }) {
    const data = await apiCall<{
      success: boolean
      data: { user: any; token: string }
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    if (data.success && data.data.token) {
      setToken(data.data.token)
    }
    return data
  },

  async login(credentials: { email: string; password: string }) {
    const data = await apiCall<{
      success: boolean
      data: { user: any; token: string }
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    if (data.success && data.data.token) {
      setToken(data.data.token)
    }
    return data
  },

  async getCurrentUser() {
    return apiCall<{ success: boolean; data: { user: any } }>('/auth/me')
  },

  logout() {
    removeToken()
  },
}

// Deals API
export const dealsAPI = {
  async getAll(params?: {
    category?: string
    search?: string
    isLocked?: boolean
    sort?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    const queryString = queryParams.toString()
    const endpoint = queryString ? `/deals?${queryString}` : '/deals'

    return apiCall<{ success: boolean; data: { deals: any[] } }>(endpoint)
  },

  async getById(id: string) {
    return apiCall<{ success: boolean; data: { deal: any } }>(`/deals/${id}`)
  },

  async create(dealData: any) {
    return apiCall<{ success: boolean; data: { deal: any } }>('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    })
  },
}

// Claims API
export const claimsAPI = {
  async create(dealId: string) {
    return apiCall<{ success: boolean; data: { claim: any } }>('/claims', {
      method: 'POST',
      body: JSON.stringify({ dealId }),
    })
  },

  async getUserClaims() {
    return apiCall<{ success: boolean; data: { claims: any[] } }>('/claims')
  },

  async getById(id: string) {
    return apiCall<{ success: boolean; data: { claim: any } }>(`/claims/${id}`)
  },

  async updateStatus(id: string, status: string) {
    return apiCall<{ success: boolean; data: { claim: any } }>(
      `/claims/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    )
  },
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// Verification API
export const verificationAPI = {
  async requestVerification(data: {
    startupName: string
    startupDescription: string
    foundingDate: string
    teamSize: number
    website?: string
  }) {
    return apiCall<{ success: boolean; data: any; message: string }>(
      '/verification/request',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  },

  async getStatus() {
    return apiCall<{ success: boolean; data: any }>('/verification/status')
  },

  async approve(userId: string) {
    return apiCall<{ success: boolean; data: any }>(
      `/verification/approve/${userId}`,
      {
        method: 'PATCH',
      }
    )
  },
}

// Example usage in components:
/*
import { authAPI, dealsAPI, claimsAPI } from '@/lib/api'

// Login
const handleLogin = async () => {
  try {
    const response = await authAPI.login({ email, password })
    console.log('Logged in:', response.data.user)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}

// Get deals
const fetchDeals = async () => {
  try {
    const response = await dealsAPI.getAll({ category: 'cloud_services' })
    setDeals(response.data.deals)
  } catch (error) {
    console.error('Error fetching deals:', error.message)
  }
}

// Claim a deal
const handleClaim = async (dealId: string) => {
  try {
    const response = await claimsAPI.create(dealId)
    console.log('Claim successful:', response.data.claim)
  } catch (error) {
    console.error('Claim failed:', error.message)
  }
}
*/
