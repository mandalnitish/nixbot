// backend/src/controllers/chatController.js

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const aiService = require('../services/aiService');

/**
 * 📤 Send a message and get AI response
 */
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    // Verify conversation ownership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Save user message
    const userMessage = await Message.create({
      conversationId,
      role: 'user',
      content
    });

    // Get conversation history (last 20)
    const history = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(20);

    // Generate AI response
    const startTime = Date.now();
    const aiResponse = await aiService.generateResponse(content, history);
    const latency = Date.now() - startTime;

    // Save AI message
    const aiMessage = await Message.create({
      conversationId,
      role: 'assistant',
      content: aiResponse.content,
      metadata: {
        model: aiResponse.model,
        tokens: aiResponse.tokens,
        latency
      }
    });

    // ✅ Update conversation details
    conversation.metadata.messageCount += 2;
    conversation.metadata.lastMessageAt = Date.now();
    conversation.lastMessage = aiResponse.content.slice(0, 80); // short preview

    // If title is still default, update it with first user message
    if (!conversation.title || conversation.title === 'New Conversation') {
      conversation.title = content.slice(0, 40);
    }

    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        userMessage,
        aiMessage
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 💬 Get all messages in a conversation
 */
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: { messages }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 📋 Get all user conversations (for sidebar)
 */
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title metadata lastMessage updatedAt');

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
