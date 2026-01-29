const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired'],
      default: 'pending',
    },
    claimDate: {
      type: Date,
      default: Date.now,
    },
    approvalDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    couponCode: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate claims
claimSchema.index({ user: 1, deal: 1 }, { unique: true });

// Indexes for efficient queries
claimSchema.index({ user: 1, status: 1 });
claimSchema.index({ deal: 1 });

module.exports = mongoose.model('Claim', claimSchema);
