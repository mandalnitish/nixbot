import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Home } from "lucide-react";
import { motion } from "framer-motion"; // ✅ For animations

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, password, confirmPassword } = formData;

    // ✅ Frontend validations
    if (!username.trim()) return setError("Username is required");
    if (!email.includes("@")) return setError("Enter a valid email address");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);

    try {
      await register({ username, email, password });
      navigate("/chat");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-400">Join NixBot and start chatting</p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none"
                placeholder="johndoe"
                required
                minLength={3}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-medium py-3 rounded-lg transition-all disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>

          {/* Sign In link */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </p>

          {/* 🏠 Return Home Button */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-600/10 hover:border-purple-500/50 transition-all"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
