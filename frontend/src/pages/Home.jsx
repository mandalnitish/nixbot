import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Zap, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
    title: "Natural Conversations",
    desc: "Chat seamlessly with AI that truly understands context, intent, and tone.",
  },
  {
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    title: "Lightning Fast",
    desc: "Experience instant, intelligent responses powered by state-of-the-art AI models.",
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    title: "Secure & Private",
    desc: "Your data stays encrypted and confidential. Privacy is our top priority.",
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 text-white">
      {/* Floating gradient blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/30 blur-[180px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/30 blur-[180px] rounded-full animate-pulse delay-500" />

      {/* Navbar */}
      <nav className="relative z-20 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">NixBot</h1>
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Link
              to="/chat"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
            >
              Open Chat
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 text-center max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Personal AI Assistant</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl text-gray-300 mb-10"
        >
          Chat smarter, faster, and safer — with NixBot. Always ready to assist you.
        </motion.p>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to={isAuthenticated ? "/chat" : "/register"}
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Start Chatting
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 container mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8 max-w-6xl">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-slate-800/40 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-xl hover:bg-slate-800/60 transition-all shadow-lg hover:shadow-purple-500/10"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              {f.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} NixBot — All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
