import React from "react";
import { motion } from "framer-motion";

const Button = ({ children, onClick, type = "button", disabled = false, className = "" }) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium text-white 
        bg-gradient-to-r from-purple-600 to-pink-600 
        hover:from-purple-700 hover:to-pink-700 
        disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed
        transition-all ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
