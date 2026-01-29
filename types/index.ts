export interface Deal {
  _id: string
  title: string
  description: string
  shortDescription: string
  category: string
  partnerName: string
  partnerLogo?: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  isLocked: boolean
  eligibilityCriteria: string
  requiresVerification: boolean
  features: string[]
  termsAndConditions?: string
  validUntil?: Date
  claimLimit?: number
  claimCount: number
  isActive: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id: string
  name: string
  email: string
  isVerified: boolean
  startupName?: string
  role: 'founder' | 'team_member' | 'indie_hacker'
  claimedDeals: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Claim {
  _id: string
  user: string | User
  deal: string | Deal
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  claimDate: Date
  approvalDate?: Date
  rejectionReason?: string
  couponCode: string
  expiresAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}
