"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReasonButtonsProps {
  data: {
    soilMoisture: number;
    temperature: number;
    pH: number;
  };
  onReasonTap: (type: "rain" | "heat" | "soil") => void;
}

export default function ReasonButtons({ data, onReasonTap }: ReasonButtonsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const reasons = [
    {
      id: "rain",
      icon: "💧",
      label: "Low Rain",
      explanation: "Low rain dries soil faster",
      isActive: data.soilMoisture < 50,
    },
    {
      id: "heat",
      icon: "🌡️",
      label: "High Heat",
      explanation: "High heat dries soil faster",
      isActive: data.temperature > 25,
    },
    {
      id: "soil",
      icon: "🧪",
      label: "Soil Type",
      explanation: "Soil type affects water retention",
      isActive: data.pH < 6.5 || data.pH > 7.0,
    },
  ];

  const handleTap = (id: string, type: "rain" | "heat" | "soil") => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      onReasonTap(type);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {reasons
        .filter((r) => r.isActive)
        .map((reason) => (
          <motion.button
            key={reason.id}
            onClick={() => handleTap(reason.id, reason.id as "rain" | "heat" | "soil")}
            whileTap={{ scale: 0.95 }}
            className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
              expanded === reason.id
                ? "border-[#7faf3b] bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl">{reason.icon}</div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">{reason.label}</p>
                <AnimatePresence>
                  {expanded === reason.id && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs text-gray-600 mt-1 overflow-hidden"
                    >
                      {reason.explanation}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.button>
        ))}
    </div>
  );
}

