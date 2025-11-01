import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loadConversations } = useChat();

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex h-screen overflow-hidden bg-slate-900"
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col w-full">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />
        <ChatMessages />
        <ChatInput />
      </div>
    </motion.div>
  );
};

export default Chat;
