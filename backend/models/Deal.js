const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'], // keep titles reasonably short
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'cloud_services',
        'marketing_tools',
        'analytics',
        'productivity',
        'development',
        'design',
        'communication',
        'other',
      ],
    },
    partnerName: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true,
    },
    partnerLogo: {
      type: String,
      default: '',
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountedPrice: {
      type: Number,
      required: [true, 'Discounted price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPercentage: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    eligibilityCriteria: {
      type: String,
      default: 'Available to all users',
    },
    requiresVerification: {
      type: Boolean,
      default: false,
    },
    features: [
      {
        type: String,
      },
    ],
    termsAndConditions: {
      type: String,
      default: '',
    },
    validUntil: {
      type: Date,
    },
    claimLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    claimCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
dealSchema.index({ category: 1, isActive: 1 });
dealSchema.index({ isLocked: 1 });
dealSchema.index({ title: 'text', description: 'text' });
dealSchema.index({ isActive: 1, createdAt: -1 });
dealSchema.index({ isActive: 1, discountedPrice: 1 });
dealSchema.index({ isActive: 1, discountPercentage: -1 });

// Calculate discount percentage before saving
dealSchema.pre('save', function (next) {
  if (this.originalPrice && this.discountedPrice) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100
    );
  }
  next();
});

// Virtual for checking if deal is available
dealSchema.virtual('isAvailable').get(function () {
  if (!this.isActive) return false;
  if (this.validUntil && new Date() > this.validUntil) return false;
  if (this.claimLimit && this.claimCount >= this.claimLimit) return false;
  return true;
});

module.exports = mongoose.model('Deal', dealSchema);
