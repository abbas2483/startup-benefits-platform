const express = require('express');
const Claim = require('../models/Claim');
const Deal = require('../models/Deal');
const User = require('../models/User');
const { protect, requireVerified } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/claims
// @desc    Claim a deal
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { dealId } = req.body;

    if (!dealId) {
      return res.status(400).json({
        success: false,
        message: 'Deal ID is required',
      });
    }

    // make sure the deal actually exists
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    // Check if deal is active and available
    if (!deal.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This deal is no longer active',
      });
    }

    // Check if deal requires verification
    if (deal.isLocked && !req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'This deal requires account verification',
        requiresVerification: true,
      });
    }

    // Check if user has already claimed this deal
    const existingClaim = await Claim.findOne({
      user: req.user._id,
      deal: dealId,
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You have already claimed this deal',
      });
    }

    // Check claim limit
    if (deal.claimLimit && deal.claimCount >= deal.claimLimit) {
      return res.status(400).json({
        success: false,
        message: 'This deal has reached its claim limit',
      });
    }

    // Create claim
    const claim = await Claim.create({
      user: req.user._id,
      deal: dealId,
      status: deal.requiresVerification ? 'pending' : 'approved',
      approvalDate: deal.requiresVerification ? null : Date.now(),
      couponCode: generateCouponCode(),
    });

    // Update deal claim count
    deal.claimCount += 1;
    await deal.save();

    // Add claim to user's claimed deals
    await User.findByIdAndUpdate(req.user._id, {
      $push: { claimedDeals: claim._id },
    });

    // Populate claim with deal info
    await claim.populate('deal');

    res.status(201).json({
      success: true,
      message: 'Deal claimed successfully',
      data: {
        claim,
      },
    });
  } catch (error) {
    console.error('Claim deal error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error claiming deal',
    });
  }
});

// @route   GET /api/claims
// @desc    Get user's claimed deals
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user._id })
      .populate('deal')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: {
        claims,
      },
    });
  } catch (error) {
    console.error('Get claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching claims',
    });
  }
});

// @route   GET /api/claims/:id
// @desc    Get single claim
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('deal');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Check if claim belongs to user
    if (claim.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this claim',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        claim,
      },
    });
  } catch (error) {
    console.error('Get claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching claim',
    });
  }
});

// Helper function to generate coupon code
function generateCouponCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SBP-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = router;
