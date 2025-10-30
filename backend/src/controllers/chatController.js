// backend/src/controllers/chatController.js
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const aiService = require('../services/aiService');

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

    // Get conversation history
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

    // Update conversation metadata
    conversation.metadata.messageCount += 2;
    conversation.metadata.lastMessageAt = Date.now();
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