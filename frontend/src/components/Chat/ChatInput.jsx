// frontend/src/components/Chat/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Square, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { sendMessage, sending } = useChat();

  const MAX_LENGTH = 2000;

  // ✅ Auto-adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // ✅ Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, TXT, DOCX, and image files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/files/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        setUploadedFile({
          name: file.name,
          size: file.size,
          extractedText: data.data.extractedText,
        });
      } else {
        alert(data.message || 'Failed to upload file');
      }
    } catch (err) {
      alert('Error uploading file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle text submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    try {
      let messageContent = input.trim();
      if (uploadedFile?.extractedText) {
        messageContent = `[File: ${uploadedFile.name}]\n\nFile content:\n${uploadedFile.extractedText}\n\nUser question: ${messageContent}`;
      }

      await sendMessage(messageContent);
      setInput('');
      setUploadedFile(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // ✅ Handle Enter key for send
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // ✅ Voice input feature
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + ' ' + transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      isRecording ? recognition.stop() : recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const charCount = input.length;
  const isOverLimit = charCount > MAX_LENGTH;

  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border-t border-purple-500/20 px-3 sm:px-6 py-3 sm:py-4">
      <div className="max-w-4xl mx-auto">
        {/* File Upload Preview */}
        {uploadedFile && (
          <div className="mb-3 p-3 bg-purple-600/20 border border-purple-500/50 rounded-lg flex items-center justify-between">
            <span className="text-white text-sm truncate">📎 {uploadedFile.name}</span>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
        />

        {/* Main Chat Input */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 bg-slate-800/50 border border-purple-500/20 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 focus-within:border-purple-500/50 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  uploadedFile ? "Ask a question about your file..." : "Ask NixBot anything..."
                }
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none resize-none max-h-32 overflow-y-auto"
                rows="1"
                disabled={sending}
                maxLength={MAX_LENGTH}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5 sm:gap-2">
              {/* File Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${
                  uploadedFile
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title="Upload file"
              >
                {uploading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>

              {/* Voice Input */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title="Voice input"
              >
                {isRecording ? (
                  <Square className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>

              {/* Send */}
              <button
                type="submit"
                disabled={!input.trim() || sending || isOverLimit}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition-all disabled:cursor-not-allowed active:scale-95"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center px-2 text-xs">
            <div className="flex gap-3 text-gray-400 flex-wrap">
              <span>Shift + Enter for new line</span>
              {sending && <span className="text-purple-400 animate-pulse">AI is thinking...</span>}
              {uploadedFile && <span className="text-purple-400">📎 File attached</span>}
            </div>
            <span className={`${isOverLimit ? 'text-red-400' : 'text-gray-400'}`}>
              {charCount} / {MAX_LENGTH}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
