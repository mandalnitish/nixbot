// backend/src/routes/chat.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { validateMessage } = require('../middleware/validator');
const { chatLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.post('/message', chatLimiter, validateMessage, chatController.sendMessage);
router.get('/messages/:conversationId', chatController.getMessages);

module.exports = router;