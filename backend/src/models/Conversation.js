// backend/src/models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation',
    maxlength: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    messageCount: {
      type: Number,
      default: 0
    },
    lastMessageAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
conversationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);