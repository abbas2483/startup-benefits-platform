const express = require('express');
const Deal = require('../models/Deal');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/deals
// @desc    Get all deals with filters and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, isLocked, sort } = req.query;

    // start with base query for active deals
    let query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (isLocked !== undefined) {
      query.isLocked = isLocked === 'true';
    }

    // Text search using MongoDB full-text
    if (search) {
      query.$text = { $search: search };
    }

    // sorting - default to newest
    let sortOption = { createdAt: -1 };
    if (sort === 'price_low') {
      sortOption = { discountedPrice: 1 };
    } else if (sort === 'price_high') {
      sortOption = { discountedPrice: -1 };
    } else if (sort === 'discount') {
      sortOption = { discountPercentage: -1 };
    }

    const deals = await Deal.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: deals.length,
      data: {
        deals,
      },
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deals',
    });
  }
});

// @route   GET /api/deals/:id
// @desc    Get single deal
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        deal,
      },
    });
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deal',
    });
  }
});

// @route   POST /api/deals
// @desc    Create a new deal (Admin only - for demo purposes)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const deal = await Deal.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Deal created successfully',
      data: {
        deal,
      },
    });
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating deal',
    });
  }
});

module.exports = router;
