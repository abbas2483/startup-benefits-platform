const DEFAULT_TTL_MS = Number(process.env.DEALS_CACHE_TTL_MS) || 60_000;

const cache = new Map();

const buildDealsCacheKey = (params) => JSON.stringify(params);

const getCachedDeals = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
};

const setCachedDeals = (key, value, ttlMs = DEFAULT_TTL_MS) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
};

module.exports = {
  DEFAULT_TTL_MS,
  buildDealsCacheKey,
  getCachedDeals,
  setCachedDeals,
};
