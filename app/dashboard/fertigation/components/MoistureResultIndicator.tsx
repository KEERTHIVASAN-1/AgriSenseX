"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MoistureResultIndicatorProps {
  waterValue: number;
  isStarted: boolean;
  isDark: boolean;
}

export default function MoistureResultIndicator({
  waterValue,
  isStarted,
  isDark,
}: MoistureResultIndicatorProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (isStarted) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1500);
    }
  }, [isStarted]);

  const fillLevel = Math.min(100, (waterValue / 100) * 100);

  return (
    <div className={`w-full rounded-2xl border-2 p-4 ${
      isDark
        ? "border-gray-700 bg-gray-800/50"
        : "border-gray-200 bg-white"
    }`}>
      <div className="relative h-24 flex items-center justify-center">
        {/* Circular fill / droplet */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="none"
              stroke={isDark ? "#374151" : "#e5e7eb"}
              strokeWidth="4"
            />
            {/* Fill circle */}
            {fillLevel > 0 && (
              <motion.circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke={isDark ? "#4a90e2" : "#42a5f5"}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: fillLevel / 100 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                strokeDasharray={`${2 * Math.PI * 30}`}
              />
            )}
          </svg>

          {/* Droplet icon in center */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-3xl"
            animate={{
              scale: isPulsing ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            💧
          </motion.div>
        </div>

        {/* Label */}
        <div className="absolute bottom-2 left-2 right-2">
          <p className={`text-xs font-semibold text-center ${isDark ? "text-gray-300" : "text-gray-900"}`}>
            Moisture
          </p>
        </div>
      </div>
    </div>
  );
}

