"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReasonButtons from "./ReasonButtons";
import CauseAnimationTile from "./CauseAnimationTile";

interface LeftPanelProps {
  data: {
    soilMoisture: number;
    pH: number;
    temperature: number;
    npk: { nitrogen: number; phosphorus: number; potassium: number };
  };
  target: {
    soilMoisture: number;
    pH: number;
    npk: { nitrogen: number; phosphorus: number; potassium: number };
  };
  onItemTap: (type: "water" | "plant" | "soil") => void;
  onReasonTap?: (type: "rain" | "heat" | "soil") => void;
  waterValue?: number;
  fertilizerValue?: number;
  isWatering?: boolean;
  isFertilizing?: boolean;
  isDark?: boolean;
}

export default function LeftPanel({
  data,
  target,
  onItemTap,
  onReasonTap,
  waterValue = 0,
  fertilizerValue = 0,
  isWatering = false,
  isFertilizing = false,
  isDark = false,
}: LeftPanelProps) {
  const [longPressItem, setLongPressItem] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePressStart = (type: "water" | "plant" | "soil", value?: number) => {
    const timer = setTimeout(() => {
      setLongPressItem(type);
      setTimeout(() => setLongPressItem(null), 2000);
    }, 500);
    setLongPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTap = (type: "water" | "plant" | "soil") => {
    if (!longPressItem) {
      onItemTap(type);
    }
  };

  // Calculate REAL-TIME status based on current data
  const avgNutrients = (data.npk.nitrogen + data.npk.phosphorus + data.npk.potassium) / 3;
  const targetAvgNutrients = (target.npk.nitrogen + target.npk.phosphorus + target.npk.potassium) / 3;
  
  const moistureStatus = data.soilMoisture < 40 ? "Soil Dry" : data.soilMoisture < target.soilMoisture - 10 ? "Soil Needs Water" : "Soil OK";
  const plantStatus = avgNutrients < targetAvgNutrients * 0.7 ? "Plant Weak" : "Plant OK";
  const soilStatus = data.pH < 6.0 ? "Soil Acidic" : data.pH < target.pH - 0.3 ? "Soil Slightly Acidic" : "Soil OK";

  const items = [
    {
      icon: "💧",
      label: moistureStatus,
      type: "water" as const,
      value: data.soilMoisture,
      unit: "%",
      isProblem: data.soilMoisture < target.soilMoisture - 10,
    },
    {
      icon: "🌱",
      label: plantStatus,
      type: "plant" as const,
      value: Math.round(avgNutrients),
      unit: "",
      isProblem: avgNutrients < targetAvgNutrients * 0.7,
    },
    {
      icon: "🟫",
      label: soilStatus,
      type: "soil" as const,
      value: data.pH,
      unit: "",
      isProblem: data.pH < target.pH - 0.3 || data.pH > 7.0,
    },
  ];

  return (
    <div className="flex flex-col gap-2 lg:gap-3 relative z-10">
      <div className="mb-1 lg:mb-2">
        <p className={`text-xs lg:text-sm font-medium transition-colors duration-300 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}>Current Condition</p>
      </div>
      
      {items.map((item, index) => {
        // Determine if this tile should animate based on user actions
        const shouldAnimate =
          (item.type === "water" && (isWatering || waterValue > 0)) ||
          (item.type === "plant" && (isFertilizing || fertilizerValue > 0)) ||
          (item.type === "soil" && false); // Soil animates on tap only

        return (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <CauseAnimationTile
              icon={item.icon}
              label={item.label}
              isActive={item.isProblem}
              animationType={item.type}
              onTap={() => handleTap(item.type)}
              triggerValue={item.type === "water" ? waterValue : item.type === "plant" ? fertilizerValue : 0}
              isTriggering={item.type === "water" ? isWatering : item.type === "plant" ? isFertilizing : false}
              isDark={isDark}
            />

            {/* Long-press tooltip */}
            {longPressItem === item.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10"
              >
                {item.value}{item.unit}
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Reason Buttons */}
      <ReasonButtons data={data} onReasonTap={onReasonTap || (() => {})} />
    </div>
  );
}

