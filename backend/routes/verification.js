const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/verification/request
// @desc    Request verification
// @access  Private
router.post('/request', protect, async (req, res) => {
  try {
    const { startupName, startupDescription, foundingDate, teamSize, website } = req.body;

    // Validation
    if (!startupName || !startupDescription || !foundingDate || !teamSize) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: startup name, description, founding date, and team size',
      });
    }

    // Check if already verified
    if (req.user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Your account is already verified',
      });
    }

    // Check if verification is already pending
    if (req.user.verificationStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Your verification request is already pending review',
      });
    }

    // Validation criteria: Startup must be less than 5 years old
    const startupAge = (Date.now() - new Date(foundingDate)) / (1000 * 60 * 60 * 24 * 365);
    const teamSizeNum = parseInt(teamSize);
    
    console.log('🔍 Verification Debug:', {
      startupAge: startupAge.toFixed(2) + ' years',
      teamSize: teamSizeNum,
      foundingDate,
      meetsAgeCriteria: startupAge <= 5,
      meetsTeamCriteria: teamSizeNum >= 2 && teamSizeNum <= 50,
    });
    
    if (startupAge > 5) {
      return res.status(400).json({
        success: false,
        message: 'Verification is only available for startups less than 5 years old',
      });
    }

    // Auto-approve if meets criteria
    const autoApprove = teamSizeNum >= 2 && teamSizeNum <= 60 && startupAge <= 5;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        startupName,
        startupDescription,
        foundingDate,
        teamSize: teamSizeNum,
        website,
        verificationStatus: autoApprove ? 'approved' : 'pending',
        verificationRequestedAt: Date.now(),
        isVerified: autoApprove,
        verifiedAt: autoApprove ? Date.now() : null,
      },
      { new: true }
    );

    console.log('✅ Auto-approved:', autoApprove);

    res.status(200).json({
      success: true,
      message: autoApprove 
        ? 'Congratulations! Your account has been verified automatically' 
        : 'Verification request submitted successfully. You will be notified once reviewed.',
      data: {
        user,
        autoApproved: autoApprove,
      },
    });
  } catch (error) {
    console.error('Verification request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting verification request',
    });
  }
});

// @route   GET /api/verification/status
// @desc    Get verification status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        verificationRequestedAt: user.verificationRequestedAt,
        verifiedAt: user.verifiedAt,
        hasRequiredInfo: !!(user.startupName && user.startupDescription && user.foundingDate && user.teamSize),
      },
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching verification status',
    });
  }
});

// @route   PATCH /api/verification/approve/:userId
// @desc    Approve verification (Admin only - for demo)
// @access  Private
router.patch('/approve/:userId', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isVerified: true,
        verificationStatus: 'approved',
        verifiedAt: Date.now(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User verified successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving verification',
    });
  }
});

// @route   PATCH /api/verification/reject/:userId
// @desc    Reject verification (Admin only - for demo)
// @access  Private
router.patch('/reject/:userId', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        verificationStatus: 'rejected',
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification rejected',
      data: { user, reason },
    });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting verification',
    });
  }
});

module.exports = router;
