// backend/src/controllers/conversationController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    
    const conversation = await Conversation.create({
      userId: req.user.id,
      title: title || 'New Conversation'
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created',
      data: { conversation }
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      userId: req.user.id,
      isActive: true 
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({ 
      conversationId: conversation._id 
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: { conversation, messages }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateConversation = async (req, res) => {
  try {
    const { title } = req.body;
    
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation updated',
      data: { conversation }
    });
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};