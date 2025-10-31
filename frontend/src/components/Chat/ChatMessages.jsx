// frontend/src/components/Chat/ChatMessages.jsx - Mobile Optimized
import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const ChatMessages = () => {
  const { messages, sending, loading } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-white text-sm sm:text-base">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl sm:text-4xl">🤖</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome to NixBot!</h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-md">
              Start a conversation by typing a message below. You can ask questions, upload files, or just chat!
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
        
        {sending && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;