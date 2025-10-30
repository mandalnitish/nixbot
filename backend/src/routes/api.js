// backend/src/routes/api.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const conversationRoutes = require('./conversation');
const chatRoutes = require('./chat');
const fileRoutes = require('./file');

router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);
router.use('/chat', chatRoutes);
router.use('/files', fileRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NixBot API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;