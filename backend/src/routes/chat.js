// backend/src/routes/chat.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { validateMessage } = require('../middleware/validator');
const { chatLimiter } = require('../middleware/rateLimiter');

router.use(protect);

// 💬 Chat routes
router.post('/message', chatLimiter, validateMessage, chatController.sendMessage);
router.get('/messages/:conversationId', chatController.getMessages);

// 🧾 Conversations list
router.get('/conversations', chatController.getConversations);

module.exports = router;
