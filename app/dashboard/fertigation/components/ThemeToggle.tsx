"use client";

import { motion } from "framer-motion";

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
        isDark ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-yellow-400 text-white hover:bg-yellow-500"
      }`}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ scale: 0.5, rotate: isDark ? -90 : 90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.5, rotate: isDark ? 90 : -90, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute text-2xl"
      >
        {isDark ? "🌙" : "🌞"}
      </motion.div>
    </motion.button>
  );
}
