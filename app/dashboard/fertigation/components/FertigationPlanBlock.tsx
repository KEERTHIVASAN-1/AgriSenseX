"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FertigationPlanBlockProps {
  waterValue: number;
  fertilizerValue: number;
  isStarted: boolean;
  isDark: boolean;
}

export default function FertigationPlanBlock({
  waterValue,
  fertilizerValue,
  isStarted,
  isDark,
}: FertigationPlanBlockProps) {
  const [displayWater, setDisplayWater] = useState(0);
  const [displayFertilizer, setDisplayFertilizer] = useState(0);
  const [displayPlantFood, setDisplayPlantFood] = useState(0);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Lock values when started
  useEffect(() => {
    if (isStarted) {
      setIsLocked(true);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 1500);
    }
  }, [isStarted]);

  // Smooth count-up animation for water
  useEffect(() => {
    if (!isLocked) {
      const duration = 300;
      const startValue = displayWater;
      const endValue = waterValue;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (endValue - startValue) * eased;

        setDisplayWater(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayWater(endValue);
          if (Math.abs(endValue - startValue) > 0.5) {
            setHighlightedRow("water");
            setTimeout(() => setHighlightedRow(null), 300);
          }
        }
      };

      animate();
    }
  }, [waterValue, isLocked]);

  // Smooth count-up animation for fertilizer
  useEffect(() => {
    if (!isLocked) {
      const duration = 300;
      const startValue = displayFertilizer;
      const endValue = fertilizerValue;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (endValue - startValue) * eased;

        setDisplayFertilizer(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayFertilizer(endValue);
          if (Math.abs(endValue - startValue) > 0.5) {
            setHighlightedRow("fertilizer");
            setTimeout(() => setHighlightedRow(null), 300);
          }
        }
      };

      animate();
    }
  }, [fertilizerValue, isLocked]);

  // Plant food is same as fertilizer (or can be calculated differently)
  useEffect(() => {
    if (!isLocked) {
      const plantFoodValue = fertilizerValue * 0.67; // Approximate conversion
      const duration = 300;
      const startValue = displayPlantFood;
      const endValue = plantFoodValue;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (endValue - startValue) * eased;

        setDisplayPlantFood(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayPlantFood(endValue);
          if (Math.abs(endValue - startValue) > 0.5) {
            setHighlightedRow("plantFood");
            setTimeout(() => setHighlightedRow(null), 300);
          }
        }
      };

      animate();
    }
  }, [fertilizerValue, isLocked]);

  const soilStatus = waterValue > 0 || fertilizerValue > 0 ? "Improving" : "Current";

  const rows = [
    {
      id: "water",
      icon: "💧",
      label: "Water",
      value: displayWater,
      unit: "min",
      highlighted: highlightedRow === "water",
    },
    {
      id: "fertilizer",
      icon: "🌱",
      label: "Fertilizer",
      value: displayFertilizer,
      unit: "kg",
      highlighted: highlightedRow === "fertilizer",
    },
    {
      id: "plantFood",
      icon: "🧪",
      label: "Plant Food",
      value: displayPlantFood,
      unit: "kg",
      highlighted: highlightedRow === "plantFood",
    },
    {
      id: "soilStatus",
      icon: "🌡️",
      label: "Soil Status",
      value: soilStatus,
      unit: "",
      highlighted: false,
    },
  ];

  return (
    <motion.div
      className={`w-full rounded-xl border transition-all duration-200 ${
        isDark
          ? "bg-gray-800/80 border-gray-700"
          : "bg-white border-gray-200 shadow-sm"
      } ${showConfirmation ? "ring-2 ring-[#7faf3b]/50" : ""}`}
      animate={{
        scale: showConfirmation ? [1, 1.01, 1] : 1,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="p-3">
        <h3 className={`text-xs font-semibold mb-3 transition-colors duration-200 ${
          isDark ? "text-gray-300" : "text-gray-900"
        }`}>
          Today's Plan
        </h3>

        <div className="space-y-2">
          {rows.map((row) => (
            <motion.div
              key={row.id}
              className={`flex items-center justify-between py-1.5 px-2 rounded transition-all duration-200 ${
                row.highlighted
                  ? isDark
                    ? "bg-[#7faf3b]/20"
                    : "bg-[#7faf3b]/10"
                  : ""
              }`}
              animate={{
                backgroundColor: row.highlighted
                  ? isDark
                    ? "rgba(127, 175, 59, 0.2)"
                    : "rgba(127, 175, 59, 0.1)"
                  : "transparent",
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{row.icon}</span>
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {row.label}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                {row.id === "soilStatus" ? (
                  <span className={`text-sm font-semibold transition-colors duration-200 ${
                    row.value === "Improving"
                      ? "text-[#7faf3b]"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}>
                    {row.value}
                  </span>
                ) : (
                  <>
                    <motion.span
                      key={row.value}
                      initial={{ scale: 1.05, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`text-base font-bold transition-colors duration-200 ${
                        isDark ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {row.value.toFixed(row.id === "plantFood" ? 1 : 0)}
                    </motion.span>
                    <span className={`text-xs transition-colors duration-200 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {row.unit}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

