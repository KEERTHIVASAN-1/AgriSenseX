"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PlantHealthIndicatorProps {
  fertilizerValue: number;
  isStarted: boolean;
  isDark: boolean;
}

export default function PlantHealthIndicator({
  fertilizerValue,
  isStarted,
  isDark,
}: PlantHealthIndicatorProps) {
  const [stage, setStage] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);

  useEffect(() => {
    if (fertilizerValue > 0) {
      const newStage = Math.min(3, Math.floor((fertilizerValue / 50) * 3));
      setStage(newStage);
    }
  }, [fertilizerValue]);

  useEffect(() => {
    if (isStarted) {
      setIsGrowing(true);
      setTimeout(() => setIsGrowing(false), 2000);
    }
  }, [isStarted]);

  const stages = [
    { height: 20, leaves: 1, color: isDark ? "#81c784" : "#66bb6a" },
    { height: 30, leaves: 2, color: isDark ? "#66bb6a" : "#4caf50" },
    { height: 40, leaves: 3, color: isDark ? "#4caf50" : "#388e3c" },
    { height: 50, leaves: 4, color: isDark ? "#388e3c" : "#2e7d32" },
  ];

  const currentStage = stages[stage];

  return (
    <div className={`w-full rounded-2xl border-2 p-4 ${
      isDark
        ? "border-gray-700 bg-gray-800/50"
        : "border-gray-200 bg-white"
    }`}>
      <div className="relative h-24 flex items-center justify-center">
        {/* Plant growth stages */}
        <motion.svg
          width="60"
          height={currentStage.height}
          viewBox="0 0 40 60"
          animate={{
            height: isGrowing ? [currentStage.height, currentStage.height + 10, currentStage.height] : currentStage.height,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Stem */}
          <rect
            x="18"
            y="20"
            width="4"
            height={currentStage.height - 20}
            fill={currentStage.color}
          />

          {/* Leaves based on stage */}
          {currentStage.leaves >= 1 && (
            <ellipse cx="20" cy="15" rx="10" ry="8" fill={currentStage.color} />
          )}
          {currentStage.leaves >= 2 && (
            <>
              <ellipse cx="12" cy="25" rx="8" ry="12" fill={currentStage.color} />
              <ellipse cx="28" cy="25" rx="8" ry="12" fill={currentStage.color} />
            </>
          )}
          {currentStage.leaves >= 3 && (
            <>
              <ellipse cx="8" cy="35" rx="6" ry="10" fill={currentStage.color} />
              <ellipse cx="32" cy="35" rx="6" ry="10" fill={currentStage.color} />
            </>
          )}
          {currentStage.leaves >= 4 && (
            <ellipse cx="20" cy="10" rx="12" ry="6" fill={currentStage.color} />
          )}
        </motion.svg>

        {/* Label */}
        <div className="absolute bottom-2 left-2 right-2">
          <p className={`text-xs font-semibold text-center ${isDark ? "text-gray-300" : "text-gray-900"}`}>
            Plant Health
          </p>
        </div>
      </div>
    </div>
  );
}

