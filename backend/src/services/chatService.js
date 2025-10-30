// backend/src/services/chatService.js
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

class ChatService {
  async getConversationHistory(conversationId, limit = 20) {
    return await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .sort({ createdAt: 1 });
  }

  async createMessage(conversationId, role, content, metadata = {}) {
    return await Message.create({
      conversationId,
      role,
      content,
      metadata
    });
  }

  async updateConversationMetadata(conversationId) {
    const conversation = await Conversation.findById(conversationId);
    if (conversation) {
      conversation.metadata.messageCount = await Message.countDocuments({ conversationId });
      conversation.metadata.lastMessageAt = Date.now();
      await conversation.save();
    }
    return conversation;
  }

  async searchMessages(userId, query) {
    const conversations = await Conversation.find({ userId }).select('_id');
    const conversationIds = conversations.map(c => c._id);

    return await Message.find({
      conversationId: { $in: conversationIds },
      content: { $regex: query, $options: 'i' }
    })
      .populate('conversationId')
      .sort({ createdAt: -1 })
      .limit(50);
  }
}

module.exports = new ChatService();

