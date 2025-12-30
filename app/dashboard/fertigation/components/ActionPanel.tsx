"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import InteractiveSlider from "./InteractiveSlider";
import FeedbackBar from "./FeedbackBar";
import ConfirmChips from "./ConfirmChips";

interface ActionPanelProps {
  waterValue: number;
  fertilizerValue: number;
  onWaterChange: (value: number) => void;
  onFertilizerChange: (value: number) => void;
  onFarmUpdate: (type: "water" | "fertilizer", value: number) => void;
  onChipTap?: (type: "water" | "fertilizer" | "soil") => void;
  soilOK?: boolean;
  isDark?: boolean;
}

export default function ActionPanel({
  waterValue,
  fertilizerValue,
  onWaterChange,
  onFertilizerChange,
  onFarmUpdate,
  onChipTap,
  soilOK = true,
}: ActionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-xl bg-gradient-to-br from-[#7faf3b] to-[#6a9331] p-4 lg:p-6 text-white relative z-10 shadow-lg"
    >
      <div className="mb-3 lg:mb-4 text-center">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 lg:mb-2">Your farm will improve if you do this</h3>
      </div>

      <div className="space-y-3 lg:space-y-4 bg-white/20 rounded-xl p-3 lg:p-5">
        <InteractiveSlider
          label="Water"
          icon="💧"
          value={waterValue}
          max={100}
          onChange={onWaterChange}
          onVisualChange={(val) => onFarmUpdate("water", val)}
          unit=" min"
        />

        <InteractiveSlider
          label="Fertilizer"
          icon="🌱"
          value={fertilizerValue}
          max={50}
          onChange={onFertilizerChange}
          onVisualChange={(val) => onFarmUpdate("fertilizer", val)}
          unit=" kg"
        />
      </div>

      {/* Feedback Bar */}
      <FeedbackBar waterValue={waterValue} fertilizerValue={fertilizerValue} />
    </motion.div>
  );
}

