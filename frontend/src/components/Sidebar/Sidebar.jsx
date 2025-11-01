// frontend/src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { Sparkles, Plus, LogOut, Search, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ConversationList from './ConversationList';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { createConversation, conversations } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewChat = async () => {
    try {
      await createConversation('New Conversation');
      if (window.innerWidth < 1024) onClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const exportAllChats = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      user: { username: user?.username, email: user?.email },
      conversations: conversations.map(conv => ({
        id: conv._id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        messageCount: conv.metadata?.messageCount || 0
      })),
      totalConversations: conversations.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nixbot-conversations-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 z-50 w-80 h-screen bg-slate-800/50 backdrop-blur-xl border-r border-purple-500/20 transition-transform duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">NixBot</h1>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-medium transition-all mb-4"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white text-sm placeholder-gray-500 focus:border-purple-500/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            onClose={onClose}
            conversations={filteredConversations}
            searchQuery={searchQuery}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/20 space-y-3">
          <button
            onClick={exportAllChats}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Chats
          </button>

          <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate text-sm">{user?.username}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
