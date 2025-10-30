
// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">NixBot</h1>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link
                to="/chat"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Open Chat
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-white hover:text-purple-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your Personal AI Assistant
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Chat with NixBot, powered by advanced AI. Get answers, insights, and assistance anytime.
          </p>
          <Link
            to={isAuthenticated ? '/chat' : '/register'}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Start Chatting Now
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Natural Conversations</h3>
            <p className="text-gray-400">
              Have meaningful conversations with AI that understands context and nuance.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Get instant responses powered by cutting-edge AI technology.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400">
              Your conversations are encrypted and private. We respect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

