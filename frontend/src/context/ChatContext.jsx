// frontend/src/context/ChatContext.jsx
import React, { createContext, useState, useContext } from 'react';
import chatService from '../services/chatService';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatService.getConversations();
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title) => {
    try {
      const response = await chatService.createConversation(title);
      const newConv = response.data.conversation;
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversation(newConv);
      setMessages([]);
      return newConv;
    } catch (error) {
      console.error('Error creating conversation:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  };

  const selectConversation = async (conversationId) => {
    try {
      setLoading(true);
      const response = await chatService.getConversation(conversationId);
      setCurrentConversation(response.data.conversation);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error selecting conversation:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    if (!currentConversation) {
      const newConv = await createConversation();
      setCurrentConversation(newConv);
      // Retry sending message with new conversation
      return sendMessageWithConversation(newConv._id, content);
    }

    return sendMessageWithConversation(currentConversation._id, content);
  };

  const sendMessageWithConversation = async (conversationId, content) => {
    try {
      setSending(true);
      const response = await chatService.sendMessage(conversationId, content);
      
      setMessages(prev => [
        ...prev,
        response.data.userMessage,
        response.data.aiMessage
      ]);

      // Update conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv._id === conversationId
            ? { ...conv, updatedAt: new Date() }
            : conv
        )
      );

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Request was:', { conversationId, content });
      throw error;
    } finally {
      setSending(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await chatService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv._id !== conversationId));
      
      if (currentConversation?._id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  };

  const updateConversationTitle = async (conversationId, title) => {
    try {
      await chatService.updateConversation(conversationId, title);
      setConversations(prev =>
        prev.map(conv =>
          conv._id === conversationId ? { ...conv, title } : conv
        )
      );
      
      if (currentConversation?._id === conversationId) {
        setCurrentConversation(prev => ({ ...prev, title }));
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    sending,
    loadConversations,
    createConversation,
    selectConversation,
    sendMessage,
    deleteConversation,
    updateConversationTitle
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;