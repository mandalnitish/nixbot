import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, MessageSquare, Zap, Shield, ArrowRight, Globe, Lock } from "lucide-react";

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
  const isAuthenticated = false; // Replace with useAuth hook
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity1 = useTransform(scrollY, [0, 200], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        rafRef.current = null;
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Optimized background - reduced blur and complexity */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />
        
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 bg-gradient-to-r from-purple-600 to-pink-600"
          style={{
            filter: "blur(120px)",
            left: `${mousePosition.x - 400}px`,
            top: `${mousePosition.y - 400}px`,
            willChange: "transform",
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
        
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full" 
          style={{ filter: "blur(100px)" }}
        />
        
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.18, 0.15]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-600/20 rounded-full" 
          style={{ filter: "blur(100px)" }}
        />
      </div>

      {/* Simplified grid overlay */}
      <div className="fixed inset-0 z-0 opacity-30" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "100px 100px",
        maskImage: "radial-gradient(ellipse at center, black, transparent 85%)"
      }} />

      {/* Navbar - optimized backdrop blur */}
      <nav className="relative z-20 container mx-auto px-6 py-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center bg-white/5 border border-white/10 rounded-3xl px-8 py-4 shadow-2xl"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-11 h-11 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              NixBot
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/chat"
                  className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold flex items-center gap-2 transition-shadow hover:shadow-lg hover:shadow-purple-500/50"
                >
                  Open Chat <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors font-semibold"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold transition-shadow hover:shadow-lg hover:shadow-purple-500/50"
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1]"
        >
          <span className="block">Your Personal</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            AI Assistant
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Experience the future of conversation with AI that understands, adapts, and delivers — instantly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center mb-20"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={isAuthenticated ? "/chat" : "/register"}
              className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-lg font-bold rounded-3xl shadow-2xl overflow-hidden transition-shadow hover:shadow-purple-500/60"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Chatting Now
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 transition-all hover:border-purple-500/50 hover:bg-white/10 cursor-pointer"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <div className="flex justify-center mb-4 text-purple-400">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-center mb-20"
        >
          Why Choose{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            NixBot
          </span>
          ?
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ 
                delay: i * 0.1,
                duration: 0.5,
              }}
              viewport={{ once: true }}
              className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-10 hover:border-white/20 hover:bg-white/10 transition-all overflow-hidden cursor-pointer"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <div 
                className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-3xl flex items-center justify-center mb-8 text-white`}
              >
                {f.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 pb-32 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 border border-white/10 rounded-[3rem] p-16 md:p-20 text-center overflow-hidden cursor-pointer"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <h3 className="text-5xl md:text-6xl font-bold mb-8">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already experiencing the power of intelligent AI assistance.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={isAuthenticated ? "/chat" : "/register"}
              className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black text-xl font-bold rounded-3xl transition-shadow hover:shadow-2xl hover:shadow-white/30"
            >
              Get Started Free
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10" style={{ backdropFilter: "blur(20px)" }}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">NixBot</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} NixBot — Powered by NixITCompany
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;