// frontend/src/pages/Chat.jsx - Mobile Optimized
import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loadConversations } = useChat();

  useEffect(() => {
    loadConversations();
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;