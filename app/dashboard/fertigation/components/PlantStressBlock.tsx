"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PlantStressBlockProps {
  nutrients: number;
  fertilizerValue: number;
  isFertilizing: boolean;
  onClick: () => void;
  isDark: boolean;
}

export default function PlantStressBlock({
  nutrients,
  fertilizerValue,
  isFertilizing,
  onClick,
  isDark,
}: PlantStressBlockProps) {
  const [isShaking, setIsShaking] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    if (isFertilizing || fertilizerValue > 0) {
      setIsRecovering(true);
      setTimeout(() => setIsRecovering(false), 400);
    }
  }, [isFertilizing, fertilizerValue]);

  const handleClick = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsRecovering(true);
      setTimeout(() => setIsRecovering(false), 300);
    }, 200);
    onClick();
  };

  const plantHealth = Math.min(100, nutrients + fertilizerValue * 0.5);
  const droopAmount = plantHealth < 50 ? 15 : plantHealth < 70 ? 8 : 0;
  const plantColor = plantHealth < 50 ? "#81c784" : plantHealth < 70 ? "#66bb6a" : "#4caf50";
  const plantHeight = 30 + (plantHealth / 100) * 20;

  const plantStatus = plantHealth < 50 ? "Weak" : plantHealth < 70 ? "OK" : "Good";

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
          <span className="text-2xl">🌱</span>
          <span className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-900"}`}>
            Plant: {plantStatus}
          </span>
        </div>
      </div>
      <div className="relative h-12 overflow-hidden rounded-lg mt-2 flex items-center justify-center">
        {/* Plant illustration */}
        <motion.svg
          width="60"
          height={plantHeight}
          viewBox="0 0 40 60"
          animate={{
            rotate: isShaking ? [0, -5, 5, -5, 5, 0] : 0,
            y: isRecovering ? [droopAmount, 0] : droopAmount,
          }}
          transition={{
            rotate: { duration: 0.4, ease: "easeInOut" },
            y: { duration: 0.8, ease: "easeOut" },
          }}
        >
          {/* Stem */}
          <rect
            x="18"
            y="20"
            width="4"
            height={plantHeight - 20}
            fill={plantColor}
          />

          {/* Leaves */}
          <motion.ellipse
            cx="12"
            cy="25"
            rx="8"
            ry="12"
            fill={plantColor}
            animate={{
              ry: isRecovering ? [12, 14, 12] : 12,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.ellipse
            cx="28"
            cy="25"
            rx="8"
            ry="12"
            fill={plantColor}
            animate={{
              ry: isRecovering ? [12, 14, 12] : 12,
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
          <motion.ellipse
            cx="20"
            cy="15"
            rx="10"
            ry="8"
            fill={plantColor}
            animate={{
              ry: isRecovering ? [8, 10, 8] : 8,
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </motion.svg>

      </div>
    </motion.button>
  );
}

