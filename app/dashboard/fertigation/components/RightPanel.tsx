"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBubbles from "./ProgressBubbles";
import EffectAnimationTile from "./EffectAnimationTile";

interface RightPanelProps {
  waterValue: number;
  fertilizerValue: number;
  isStarted: boolean;
  showSuccess: boolean;
  isDark?: boolean;
}

export default function RightPanel({ waterValue, fertilizerValue, isStarted, showSuccess, isDark = false }: RightPanelProps) {
  const [improvingItems, setImprovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (waterValue > 0 || fertilizerValue > 0) {
      const items = new Set<string>();
      if (waterValue > 0) items.add("moisture");
      if (fertilizerValue > 0) items.add("plant");
      if (waterValue > 0 || fertilizerValue > 0) items.add("growth");
      setImprovingItems(items);
    } else {
      setImprovingItems(new Set());
    }
  }, [waterValue, fertilizerValue]);

  useEffect(() => {
    if (isStarted || showSuccess) {
      setImprovingItems(new Set(["moisture", "plant", "growth"]));
    }
  }, [isStarted, showSuccess]);

  const items = [
    {
      id: "moisture",
      icon: "💧",
      label: "Moisture",
      status: improvingItems.has("moisture") ? "Better" : "Current",
    },
    {
      id: "plant",
      icon: "🌿",
      label: "Plant Health",
      status: improvingItems.has("plant") ? "Improving" : "Current",
    },
    {
      id: "growth",
      icon: "🟢",
      label: "Growth",
      status: improvingItems.has("growth") ? "Good" : "Current",
    },
  ];

  return (
    <div className="flex flex-col gap-2 lg:gap-3 relative z-10">
      <div className="mb-1 lg:mb-2">
        <p className={`text-xs lg:text-sm font-medium transition-colors duration-300 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}>After Action</p>
      </div>

      {items.map((item, index) => {
        const isImproving = improvingItems.has(item.id);
        // Calculate progress based on actual slider values
        let progress = 0;
        if (item.id === "moisture") {
          progress = Math.min(100, (waterValue / 100) * 100);
        } else if (item.id === "plant") {
          progress = Math.min(100, (fertilizerValue / 50) * 100);
        } else if (item.id === "growth") {
          progress = Math.min(100, ((waterValue + fertilizerValue * 2) / 200) * 100);
        }
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <EffectAnimationTile
              icon={item.icon}
              label={item.label}
              progress={progress}
              isSuccess={showSuccess && isImproving}
              isDark={isDark}
            />
          </motion.div>
        );
      })}

      {/* Progress Bubbles */}
      <ProgressBubbles
        waterValue={waterValue}
        fertilizerValue={fertilizerValue}
        isStarted={isStarted}
      />
    </div>
  );
}

