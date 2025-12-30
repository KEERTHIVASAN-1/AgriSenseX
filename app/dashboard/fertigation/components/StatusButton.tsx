"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatusButtonProps {
  icon: string;
  label: string;
  status: string;
  color: string;
  onTap: () => void;
  farmReaction?: React.ReactNode;
  isDark?: boolean;
}

export default function StatusButton({
  icon,
  label,
  status,
  color,
  onTap,
  farmReaction,
  isDark = false,
}: StatusButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTap = () => {
    setIsExpanded(!isExpanded);
    setIsAnimating(true);
    onTap();
    // Reset animation after effect completes
    setTimeout(() => setIsAnimating(false), 1500);
  };

  return (
    <div className="w-full">
      <motion.button
        onClick={handleTap}
        className={`w-full rounded-xl ${color} p-4 lg:p-5 active:scale-95 transition-transform relative overflow-hidden`}
        whileTap={{ scale: 0.98 }}
        animate={isAnimating ? {
          boxShadow: [
            "0 0 0 0 rgba(255,255,255,0.7)",
            "0 0 0 20px rgba(255,255,255,0)",
          ]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Ripple effect */}
        {isAnimating && (
          <motion.div
            className="absolute inset-0 bg-white/30"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
        <div className="flex items-center justify-center gap-3 lg:gap-4 relative z-10">
          <motion.div
            animate={isAnimating ? {
              scale: [1, 1.2, 1],
              rotate: label === "Water" ? [0, -10, 10, 0] : label === "Plant Food" ? [0, 5, -5, 0] : 0,
            } : {}}
            transition={{ duration: 0.5 }}
            className="text-4xl lg:text-5xl"
          >
            {icon}
          </motion.div>
          {!isExpanded && <span className="text-base lg:text-lg font-semibold text-white">{label}</span>}
        </div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-3 rounded-xl border-2 p-4 transition-colors duration-300 ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <p className={`text-base font-medium text-center transition-colors duration-300 ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>{status}</p>
            {farmReaction}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

