// frontend/src/components/Chat/ChatMessages.jsx
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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
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

