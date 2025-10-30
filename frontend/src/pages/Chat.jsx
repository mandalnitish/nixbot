// frontend/src/pages/Chat.jsx
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

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;