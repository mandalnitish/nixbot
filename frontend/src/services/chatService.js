// frontend/src/services/chatService.js
import api from './api';

const chatService = {
  createConversation: async (title = 'New Conversation') => {
    const response = await api.post('/conversations', { title });
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  getConversation: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data;
  },

  updateConversation: async (conversationId, title) => {
    const response = await api.put(`/conversations/${conversationId}`, { title });
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/conversations/${conversationId}`);
    return response.data;
  },

  sendMessage: async (conversationId, content) => {
    const response = await api.post('/chat/message', {
      conversationId,
      content
    });
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
  }
};

export default chatService;