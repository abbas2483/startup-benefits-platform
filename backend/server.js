require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const dealRoutes = require('./routes/deals');
const claimRoutes = require('./routes/claims');
const verificationRoutes = require('./routes/verification');
const Deal = require('./models/Deal');
const { buildDealsCacheKey, setCachedDeals } = require('./utils/dealsCache');
const { DEAL_LIST_FIELDS, DEFAULT_SORT } = require('./utils/dealsQuery');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-benefits')
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    try {
      const cacheKey = buildDealsCacheKey({
        category: undefined,
        search: undefined,
        isLocked: undefined,
        sort: undefined,
      });
      const deals = await Deal.find({ isActive: true })
        .select(DEAL_LIST_FIELDS)
        .sort(DEFAULT_SORT)
        .lean();
      setCachedDeals(cacheKey, deals, 2 * 60_000);
      console.log(`⚡ Deals cache warmed (${deals.length} items)`);
    } catch (error) {
      console.warn('⚠️ Deals cache warm failed:', error.message);
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/verification', verificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

module.exports = app;
