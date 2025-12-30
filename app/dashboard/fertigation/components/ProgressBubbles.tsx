"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ProgressBubblesProps {
  waterValue: number;
  fertilizerValue: number;
  isStarted: boolean;
}

export default function ProgressBubbles({
  waterValue,
  fertilizerValue,
  isStarted,
}: ProgressBubblesProps) {
  const [frozen, setFrozen] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    moisture: 0,
    plant: 0,
    growth: 0,
  });

  useEffect(() => {
    if (isStarted) {
      // Animate to 100% when started
      setProgress({
        moisture: waterValue > 0 ? 100 : 0,
        plant: fertilizerValue > 0 ? 100 : 0,
        growth: (waterValue > 0 || fertilizerValue > 0) ? 100 : 0,
      });
    } else {
      // Update based on slider values
      setProgress({
        moisture: (waterValue / 100) * 100,
        plant: (fertilizerValue / 50) * 100,
        growth: ((waterValue + fertilizerValue * 2) / 200) * 100,
      });
    }
  }, [waterValue, fertilizerValue, isStarted]);

  const bubbles = [
    {
      id: "moisture",
      icon: "💧",
      label: "Moisture rising",
      progress: progress.moisture,
    },
    {
      id: "plant",
      icon: "🌱",
      label: "Plant strength",
      progress: progress.plant,
    },
    {
      id: "growth",
      icon: "🟢",
      label: "Growth progress",
      progress: progress.growth,
    },
  ];

  return (
    <div className="mt-4 space-y-3">
      {bubbles.map((bubble) => {
        const isFrozen = frozen === bubble.id;
        const isActive = bubble.progress > 0;

        return (
          <motion.div
            key={bubble.id}
            onMouseDown={() => setFrozen(bubble.id)}
            onMouseUp={() => setTimeout(() => setFrozen(null), 100)}
            onTouchStart={() => setFrozen(bubble.id)}
            onTouchEnd={() => setTimeout(() => setFrozen(null), 100)}
            className="relative"
          >
            <div className="relative w-16 h-16 mx-auto">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-2 border-gray-200 bg-white" />
              
              {/* Progress fill */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#7faf3b]"
                  animate={isFrozen ? {} : {
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: isFrozen ? 0 : 3,
                    repeat: isFrozen ? 0 : Infinity,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, #7faf3b 0deg, #7faf3b ${bubble.progress * 3.6}deg, transparent ${bubble.progress * 3.6}deg)`,
                    }}
                    animate={{
                      background: `conic-gradient(from 0deg, #7faf3b 0deg, #7faf3b ${bubble.progress * 3.6}deg, transparent ${bubble.progress * 3.6}deg)`,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </motion.div>
              )}

              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center text-2xl z-10">
                {bubble.icon}
              </div>
            </div>

            {/* Label on tap */}
            {isFrozen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20"
              >
                {bubble.label}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

