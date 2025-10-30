// backend/src/services/userService.js
const User = require('../models/User');

class UserService {
  async getUserById(userId) {
    return await User.findById(userId);
  }

  async updateLastActive(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { lastActive: Date.now() },
      { new: true }
    );
  }

  async getUserStats(userId) {
    const user = await User.findById(userId);
    const Conversation = require('../models/Conversation');
    const Message = require('../models/Message');

    const conversations = await Conversation.find({ userId });
    const conversationIds = conversations.map(c => c._id);
    
    const totalMessages = await Message.countDocuments({
      conversationId: { $in: conversationIds }
    });

    return {
      user,
      stats: {
        totalConversations: conversations.length,
        totalMessages,
        memberSince: user.createdAt
      }
    };
  }
}

module.exports = new UserService();