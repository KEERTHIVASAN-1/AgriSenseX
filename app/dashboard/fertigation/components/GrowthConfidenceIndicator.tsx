"use client";

import { motion } from "framer-motion";

interface GrowthConfidenceIndicatorProps {
  waterValue: number;
  fertilizerValue: number;
  isStarted: boolean;
  isDark: boolean;
}

export default function GrowthConfidenceIndicator({
  waterValue,
  fertilizerValue,
  isStarted,
  isDark,
}: GrowthConfidenceIndicatorProps) {
  const totalValue = waterValue + fertilizerValue * 2;
  const confidence = Math.min(100, (totalValue / 200) * 100);

  const barColor = isDark
    ? confidence < 30
      ? "#6b7280"
      : confidence < 60
      ? "#4a90e2"
      : "#4caf50"
    : confidence < 30
    ? "#d1d5db"
    : confidence < 60
    ? "#42a5f5"
    : "#7faf3b";

  return (
    <div className={`w-full rounded-2xl border-2 p-4 ${
      isDark
        ? "border-gray-700 bg-gray-800/50"
        : "border-gray-200 bg-white"
    }`}>
      <div className="relative h-24 flex flex-col items-center justify-center gap-2">
        {/* Leaf meter / bar */}
        <div className="relative w-full h-8 rounded-full overflow-hidden" style={{
          backgroundColor: isDark ? "#374151" : "#e5e7eb",
        }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Leaf icon */}
        <motion.div
          className="text-2xl"
          animate={{
            filter: confidence > 50 ? "brightness(1.2)" : "brightness(0.8)",
          }}
        >
          🌾
        </motion.div>

        {/* Label */}
        <div className="absolute bottom-2 left-2 right-2">
          <p className={`text-xs font-semibold text-center ${isDark ? "text-gray-300" : "text-gray-900"}`}>
            Growth
          </p>
        </div>
      </div>
    </div>
  );
}

