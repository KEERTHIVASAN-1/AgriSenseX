"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EffectAnimationTileProps {
  icon: string;
  label: string;
  progress: number; // 0-100
  isSuccess: boolean;
  onLongPress?: () => void;
  isDark?: boolean;
}

export default function EffectAnimationTile({
  icon,
  label,
  progress,
  isSuccess,
  onLongPress,
  isDark = false,
}: EffectAnimationTileProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handlePressStart = () => {
    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress?.();
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handlePressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const isActive = progress > 0;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Smoothly animate progress changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <motion.div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      animate={{
        borderColor: isActive 
          ? isDark ? "rgba(127, 175, 59, 0.5)" : "rgba(127, 175, 59, 0.4)" 
          : isDark ? "#4b5563" : "#e5e7eb",
        backgroundColor: isActive 
          ? isDark ? "#1a2e1a" : "#f0f9f0" 
          : isDark ? "#1f2937" : "#ffffff",
        opacity: isActive ? 1 : 0.6,
      }}
      transition={{ duration: 0.3 }}
      className="relative rounded-xl lg:rounded-2xl border-2 p-3 lg:p-4 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        {/* Progress Ring */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
            {/* Background circle */}
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            {/* Progress circle */}
            {isActive && (
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#7faf3b"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animatedProgress / 100 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                strokeDasharray={`${2 * Math.PI * 20}`}
              />
            )}
          </svg>
          
          {/* Icon in center */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-2xl"
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
              filter: isActive ? "brightness(1.2)" : "brightness(0.8)",
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {icon}
          </motion.div>
        </div>

        <div className="flex-1">
          <p className={`text-sm font-semibold transition-colors duration-300 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}>{label}</p>
          <motion.div
            animate={{
              opacity: isActive ? 1 : 0.5,
            }}
            className={`text-xs mt-0.5 transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {isActive ? "Improving" : "Current"}
          </motion.div>
        </div>
      </div>

      {/* Success glow pulse */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.8, 1.1, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: 1 }}
            className="absolute inset-0 rounded-2xl bg-[#7faf3b]/20 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

