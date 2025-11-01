import React from "react";

const Input = ({ label, type = "text", value, onChange, placeholder, required = false }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 
                   rounded-lg text-white placeholder-gray-500 
                   focus:border-purple-500/50 focus:outline-none transition-all"
      />
    </div>
  );
};

export default Input;
