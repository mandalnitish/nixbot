// frontend/src/components/Sidebar/ConversationList.jsx - Enhanced with PDF Export
import React from 'react';
import { MessageSquare, Trash2, Download, FileText } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { exportChatToPDF } from '../../utils/pdfExport';

const ConversationList = ({ onClose, conversations, searchQuery }) => {
  const { currentConversation, selectConversation, deleteConversation } = useChat();

  const handleSelectConversation = async (id) => {
    await selectConversation(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation(id);
    }
  };

  const exportToPDF = async (e, conversation) => {
    e.stopPropagation();
    
    try {
      // Get messages for this conversation
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/chat/messages/${conversation._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        exportChatToPDF(conversation, data.data.messages);
      } else {
        alert('Failed to export conversation');
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export conversation');
    }
  };

  const exportConversation = async (e, conversation) => {
    e.stopPropagation();
    
    try {
      // Get messages for this conversation
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/chat/messages/${conversation._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const data = await response.json();
      
      const exportData = {
        conversation: {
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt
        },
        messages: data.data.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt
        })),
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting conversation:', error);
      alert('Failed to export conversation');
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
        {searchQuery ? (
          <p>No conversations found for "{searchQuery}"</p>
        ) : (
          <>
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start a new chat to begin</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          onClick={() => handleSelectConversation(conversation._id)}
          className={`group relative p-4 rounded-xl cursor-pointer transition-all ${
            currentConversation?._id === conversation._id
              ? 'bg-purple-600/20 border border-purple-500/50'
              : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate mb-1">
                {conversation.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
                {conversation.metadata?.messageCount > 0 && (
                  <>
                    <span>•</span>
                    <span>{conversation.metadata.messageCount} messages</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => exportToPDF(e, conversation)}
                className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded transition-all"
                title="Export as PDF"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => exportConversation(e, conversation)}
                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-all"
                title="Export as JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleDelete(e, conversation._id)}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                title="Delete conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;