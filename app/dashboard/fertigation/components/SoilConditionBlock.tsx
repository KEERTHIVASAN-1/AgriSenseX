"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SoilConditionBlockProps {
  pH: number;
  targetpH: number;
  onClick: () => void;
  isDark: boolean;
}

export default function SoilConditionBlock({
  pH,
  targetpH,
  onClick,
  isDark,
}: SoilConditionBlockProps) {
  const [isSmoothing, setIsSmoothing] = useState(false);

  const handleClick = () => {
    setIsSmoothing(true);
    setTimeout(() => setIsSmoothing(false), 300);
    onClick();
  };

  // Calculate soil color based on pH
  const isAcidic = pH < 6.0;
  const isAlkaline = pH > 7.0;
  const soilColor = isDark
    ? isAcidic
      ? "#6b5a4a"
      : isAlkaline
      ? "#7a6b5a"
      : "#8b7a6a"
    : isAcidic
    ? "#8B6F47"
    : isAlkaline
    ? "#A68B5B"
    : "#9B7A57";

  const warmColor = isDark ? "#9b8a7a" : "#B89B7A";

  const soilStatus = isAcidic ? "Acidic" : isAlkaline ? "Alkaline" : "OK";

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
      <div className="flex items-center gap-2">
        <span className="text-2xl">🟫</span>
        <div className="flex-1">
          <p className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-900"}`}>
            Soil: {soilStatus}
          </p>
        </div>
      </div>
      <div className="relative h-16 overflow-hidden rounded-lg mt-2">
        {/* Soil cube/layer illustration */}
        <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          {/* Soil layers */}
          <motion.rect
            x="20"
            y="30"
            width="160"
            height="20"
            fill={soilColor}
            rx="4"
            animate={{
              fill: isSmoothing ? warmColor : soilColor,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.rect
            x="30"
            y="50"
            width="140"
            height="20"
            fill={soilColor}
            rx="4"
            animate={{
              fill: isSmoothing ? warmColor : soilColor,
            }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          />
          <motion.rect
            x="40"
            y="70"
            width="120"
            height="20"
            fill={soilColor}
            rx="4"
            animate={{
              fill: isSmoothing ? warmColor : soilColor,
            }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          />

          {/* Texture dots */}
          {!isSmoothing && (
            <>
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx={40 + i * 15}
                  cy={40 + (i % 3) * 20}
                  r="2"
                  fill={isDark ? "#5a4a3a" : "#6B5A4A"}
                  opacity="0.6"
                />
              ))}
            </>
          )}
        </svg>

      </div>
    </motion.button>
  );
}

