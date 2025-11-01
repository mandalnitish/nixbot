import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, MessageSquare, Zap, Shield, ArrowRight, Globe, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Natural Conversations",
    desc: "Chat seamlessly with AI that truly understands context, intent, and tone.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    desc: "Experience instant, intelligent responses powered by state-of-the-art AI models.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Private",
    desc: "Your data stays encrypted and confidential. Privacy is our top priority.",
    color: "from-emerald-500 to-teal-500"
  },
];

const stats = [
  { label: "Active Users", value: "50K+", icon: <Globe className="w-5 h-5" /> },
  { label: "Messages Sent", value: "2M+", icon: <MessageSquare className="w-5 h-5" /> },
  { label: "Uptime", value: "99.9%", icon: <Zap className="w-5 h-5" /> },
  { label: "Security", value: "A+", icon: <Lock className="w-5 h-5" /> },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity1 = useTransform(scrollY, [0, 200], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Enhanced Animated gradient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,40,200,0.2),transparent_60%)]" />
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[1000px] h-[1000px] rounded-full blur-[150px] opacity-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
          style={{
            left: `${mousePosition.x - 500}px`,
            top: `${mousePosition.y - 500}px`,
            transition: "left 0.5s cubic-bezier(0.16, 1, 0.3, 1), top 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-purple-600/20 blur-[180px] rounded-full" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-pink-600/20 blur-[180px] rounded-full" 
        />
      </div>

      {/* Enhanced Grid overlay with shimmer effect */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />

      {/* Navbar */}
      <nav className="relative z-20 container mx-auto px-6 py-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-between items-center backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl px-8 py-4 shadow-2xl hover:border-white/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-11 h-11 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              NixBot
            </motion.h1>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/chat"
                  className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-semibold flex items-center gap-2"
                >
                  Open Chat <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/login"
                    className="px-6 py-3 text-gray-300 hover:text-white transition-colors font-semibold"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-semibold"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        style={{ y: y1, opacity: opacity1 }}
        className="relative z-10 container mx-auto px-6 py-32 text-center max-w-6xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1]"
        >
          <motion.span 
            className="block"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Your Personal
          </motion.span>
          <motion.span 
            className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            AI Assistant
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Experience the future of conversation with AI that understands, adapts, and delivers — instantly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={isAuthenticated ? "/chat" : "/register"}
              className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-lg font-bold rounded-3xl shadow-2xl hover:shadow-purple-500/60 transition-all overflow-hidden"
            >
              <motion.span 
                className="relative z-10 flex items-center gap-2"
                whileHover={{ x: 2 }}
              >
                Start Chatting Now
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-blue-700"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.8 }}
              whileHover={{ scale: 1.08, y: -8 }}
              className="group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer"
            >
              <motion.div 
                className="flex justify-center mb-4 text-purple-400"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                {stat.icon}
              </motion.div>
              <motion.div 
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Feature Cards */}
      <motion.section 
        style={{ y: y2 }}
        className="relative z-10 container mx-auto px-6 pb-32 max-w-7xl"
      >
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl font-bold text-center mb-20"
        >
          Why Choose{" "}
          <motion.span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
            whileHover={{ scale: 1.05 }}
            style={{ display: "inline-block" }}
          >
            NixBot
          </motion.span>
          ?
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ 
                delay: i * 0.15,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true }}
              className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 hover:border-white/20 hover:bg-white/10 transition-all overflow-hidden cursor-pointer"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                style={{ background: `linear-gradient(to bottom right, ${f.color.split(' ')[1]}, ${f.color.split(' ')[3]})` }}
              />
              
              <motion.div 
                className={`relative w-16 h-16 bg-gradient-to-br ${f.color} rounded-3xl flex items-center justify-center mb-8 shadow-2xl text-white`}
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                {f.icon}
              </motion.div>
              
              <h3 className="relative text-2xl font-bold mb-4">{f.title}</h3>
              <p className="relative text-gray-400 leading-relaxed text-lg">{f.desc}</p>
              
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 pb-32 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-16 md:p-20 text-center overflow-hidden group cursor-pointer"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10"
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <h3 className="relative text-5xl md:text-6xl font-bold mb-8">
            Ready to Transform Your Workflow?
          </h3>
          <p className="relative text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already experiencing the power of intelligent AI assistance.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={isAuthenticated ? "/chat" : "/register"}
              className="relative inline-flex items-center gap-3 px-12 py-6 bg-white text-black text-xl font-bold rounded-3xl hover:shadow-2xl hover:shadow-white/30 transition-all"
            >
              Get Started Free
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 backdrop-blur-2xl">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold"
              whileHover={{ scale: 1.05 }}
            >
              NixBot
            </motion.span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} NixBot — Powered by cutting-edge AI technology
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;