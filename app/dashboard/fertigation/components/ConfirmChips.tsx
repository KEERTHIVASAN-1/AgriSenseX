"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfirmChipsProps {
  waterValue: number;
  fertilizerValue: number;
  soilOK: boolean;
  onChipTap: (type: "water" | "fertilizer" | "soil") => void;
}

export default function ConfirmChips({
  waterValue,
  fertilizerValue,
  soilOK,
  onChipTap,
}: ConfirmChipsProps) {
  const chips = [
    {
      id: "water",
      label: "Water Ready",
      icon: "✔",
      isReady: waterValue > 0,
    },
    {
      id: "fertilizer",
      label: "Fertilizer Ready",
      icon: "✔",
      isReady: fertilizerValue > 0,
    },
    {
      id: "soil",
      label: "Soil OK",
      icon: "✔",
      isReady: soilOK,
    },
  ].filter((chip) => chip.isReady);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-2">
      <AnimatePresence>
        {chips.map((chip, index) => (
          <motion.button
            key={chip.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChipTap(chip.id as "water" | "fertilizer" | "soil")}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 rounded-full bg-[#7faf3b]/20 border border-[#7faf3b]/40 px-3 py-1.5 text-xs font-medium text-[#7faf3b] active:bg-[#7faf3b]/30"
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

