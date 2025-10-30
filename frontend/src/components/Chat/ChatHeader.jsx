// frontend/src/components/Chat/ChatHeader.jsx
import React from 'react';
import { Bot, Menu } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const ChatHeader = ({ onMenuClick }) => {
  const { currentConversation } = useChat();

  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white hover:text-purple-400 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {currentConversation?.title || 'NixBot AI'}
            </h2>
            <p className="text-xs text-gray-400">Always ready to help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;