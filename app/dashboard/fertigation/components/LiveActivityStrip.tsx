"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveActivityStripProps {
  isWatering: boolean;
  isFertilizing: boolean;
  moisture: number;
  nutrients: number;
  onIconTap: (type: "water" | "nutrient" | "soil") => void;
}

export default function LiveActivityStrip({
  isWatering,
  isFertilizing,
  moisture,
  nutrients,
  onIconTap,
}: LiveActivityStripProps) {
  const [longPressType, setLongPressType] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePressStart = (type: string) => {
    const timer = setTimeout(() => {
      setLongPressType(type);
      setTimeout(() => setLongPressType(null), 2000);
    }, 500);
    setLongPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTap = (type: "water" | "nutrient" | "soil") => {
    if (!longPressType) {
      onIconTap(type);
    }
  };

  const activities = [
    {
      icon: "💧",
      type: "water" as const,
      isActive: isWatering || moisture > 50,
      text: "Water is soaking into soil",
    },
    {
      icon: "🌱",
      type: "nutrient" as const,
      isActive: isFertilizing || nutrients > 40,
      text: "Plant is absorbing nutrients",
    },
    {
      icon: "🟫",
      type: "soil" as const,
      isActive: moisture > 40 && nutrients > 30,
      text: "Soil condition is changing",
    },
  ];

  return (
    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-4 z-10">
      {activities.map((activity) => (
        <div key={activity.type} className="relative">
          <motion.button
            onMouseDown={() => handlePressStart(activity.type)}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={() => handlePressStart(activity.type)}
            onTouchEnd={handlePressEnd}
            onClick={() => handleTap(activity.type)}
            whileTap={{ scale: 0.9 }}
            className="relative w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 flex items-center justify-center text-2xl shadow-sm"
          >
            {activity.icon}
            
            {/* Pulse animation when active */}
            {activity.isActive && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#7faf3b]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.button>

          {/* Long-press tooltip */}
          <AnimatePresence>
            {longPressType === activity.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20"
              >
                {activity.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

