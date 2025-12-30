"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CauseAnimationTileProps {
  icon: string;
  label: string;
  isActive: boolean;
  animationType: "water" | "fertilizer" | "soil";
  onTap: () => void;
  triggerValue?: number;
  isTriggering?: boolean;
  isDark?: boolean;
}

export default function CauseAnimationTile({
  icon,
  label,
  isActive,
  animationType,
  onTap,
  triggerValue = 0,
  isTriggering = false,
  isDark = false,
}: CauseAnimationTileProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTriggerValue = useRef(triggerValue);

  useEffect(() => {
    // Animate when trigger value changes or when actively triggering
    if (isTriggering || (triggerValue > 0 && triggerValue !== prevTriggerValue.current)) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400);
      prevTriggerValue.current = triggerValue;
      return () => clearTimeout(timer);
    }
  }, [triggerValue, isTriggering]);

  const getAnimation = () => {
    if (!isAnimating) return {};

    switch (animationType) {
      case "water":
        return {
          scale: [1, 1.05, 1],
          rotate: [0, -2, 2, 0],
        };
      case "fertilizer":
        return {
          scale: [1, 1.08, 1],
          y: [0, -3, 0],
        };
      case "soil":
        return {
          scale: [1, 1.03, 1],
          rotate: [0, 1, -1, 0],
        };
      default:
        return {};
    }
  };

  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
      className={`w-full rounded-xl lg:rounded-2xl border-2 p-3 lg:p-4 text-left transition-all shadow-sm hover:shadow-md ${
        isDark
          ? isActive
            ? "border-red-700 bg-red-900/30"
            : "border-gray-700 bg-gray-800"
          : isActive
          ? "border-red-200 bg-red-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={isAnimating ? getAnimation() : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-4xl relative"
        >
          {icon}
          
          {/* Water-specific: moisture waves */}
          {isAnimating && animationType === "water" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.2, 1.4] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-12 h-12 rounded-full border-2 border-blue-300" />
            </motion.div>
          )}

          {/* Fertilizer-specific: leaf straightening */}
          {isAnimating && animationType === "fertilizer" && (
            <motion.div
              className="absolute -top-1 -right-1"
              initial={{ rotate: -15, opacity: 0 }}
              animate={{ rotate: 0, opacity: [0, 1, 0] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              🌿
            </motion.div>
          )}

          {/* Soil-specific: color transition */}
          {isAnimating && animationType === "soil" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ backgroundColor: "rgba(139, 111, 71, 0.3)" }}
              animate={{
                backgroundColor: [
                  "rgba(139, 111, 71, 0.3)",
                  "rgba(166, 139, 91, 0.5)",
                  "rgba(139, 111, 71, 0.3)",
                ],
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          )}
        </motion.div>
        
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
        </div>
      </div>
    </motion.button>
  );
}

