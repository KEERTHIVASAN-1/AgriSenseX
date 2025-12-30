"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SoilMoistureBlockProps {
  moisture: number;
  waterValue: number;
  isWatering: boolean;
  onClick: () => void;
  isDark: boolean;
}

export default function SoilMoistureBlock({
  moisture,
  waterValue,
  isWatering,
  onClick,
  isDark,
}: SoilMoistureBlockProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [cracksVisible, setCracksVisible] = useState(false);

  useEffect(() => {
    if (isWatering || waterValue > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [isWatering, waterValue]);

  const handleClick = () => {
    setCracksVisible(true);
    setTimeout(() => setCracksVisible(false), 300);
    onClick();
  };

  // Calculate soil color based on moisture
  const soilColor = isDark
    ? moisture < 40
      ? "#5a4a3a"
      : moisture < 60
      ? "#6b5a4a"
      : "#7a6b5a"
    : moisture < 40
    ? "#8B6F47"
    : moisture < 60
    ? "#9B7A57"
    : "#A68B5B";

  const moistureLevel = Math.min(100, moisture + waterValue * 0.3);

  const status = moisture < 40 ? "Dry" : moisture < 60 ? "Needs Water" : "OK";

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      className={`w-full rounded-xl border p-3 transition-all duration-200 ${
        isDark
          ? "border-gray-700 bg-gray-800/50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💧</span>
          <span className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-900"}`}>
            Soil: {status}
          </span>
        </div>
      </div>
      <div className="relative h-12 overflow-hidden rounded-lg mt-2">
        {/* Soil patch illustration */}
        <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          {/* Base soil layer */}
          <motion.rect
            x="0"
            y="40"
            width="200"
            height="60"
            fill={soilColor}
            animate={{
              fill: soilColor,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Moisture layer */}
          {moistureLevel > 30 && (
            <motion.rect
              x="0"
              y="40"
              width="200"
              height="60"
              fill="#4a90e2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: (moistureLevel / 100) * 0.4,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}

          {/* Soil cracks (when dry and clicked) */}
          {cracksVisible && moisture < 40 && (
            <>
              <motion.line
                x1="50"
                y1="50"
                x2="60"
                y2="70"
                stroke={isDark ? "#4a3a2a" : "#6B5A4A"}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.line
                x1="100"
                y1="55"
                x2="110"
                y2="75"
                stroke={isDark ? "#4a3a2a" : "#6B5A4A"}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
              <motion.line
                x1="150"
                y1="50"
                x2="160"
                y2="70"
                stroke={isDark ? "#4a3a2a" : "#6B5A4A"}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </>
          )}

          {/* Water seep animation */}
          {isAnimating && (
            <motion.circle
              cx="100"
              cy="50"
              r="5"
              fill="#42a5f5"
              initial={{ r: 0, opacity: 0.8 }}
              animate={{
                r: [0, 15, 20],
                opacity: [0.8, 0.4, 0],
                cy: [50, 60, 70],
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
        </svg>

      </div>
    </motion.button>
  );
}

