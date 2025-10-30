// backend/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// General API limiter - increased for development
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 for dev, 100 for production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '::1', // Skip rate limit for localhost in dev
});

// Auth limiter - increased for development
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 100, // 100 for dev, 5 for production
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '::1',
});

// Chat limiter - increased for development
exports.chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 20 : 200, // 200 for dev, 20 for production
  message: 'Too many messages, please slow down.',
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '::1',
});