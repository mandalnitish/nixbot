import React from "react";
import { motion } from "framer-motion";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-300">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mb-3"
      ></motion.div>
      <p className="text-sm">{text}</p>
    </div>
  );
};

export default Loading;
