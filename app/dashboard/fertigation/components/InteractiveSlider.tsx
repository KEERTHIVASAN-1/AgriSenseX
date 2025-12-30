"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface InteractiveSliderProps {
  label: string;
  icon: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
  onVisualChange?: (value: number) => void;
  unit?: string;
}

export default function InteractiveSlider({
  label,
  icon,
  value,
  max,
  onChange,
  onVisualChange,
  unit = "",
}: InteractiveSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showValue, setShowValue] = useState(false);

  const handleChange = (newValue: number) => {
    onChange(newValue);
    onVisualChange?.(newValue);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <span className="text-base font-semibold text-gray-900">{label}</span>
        </div>
        {showValue && (
          <span className="text-lg font-bold text-[#7faf3b]">
            {value.toFixed(0)}{unit}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          onMouseDown={() => {
            setIsDragging(true);
            setShowValue(true);
          }}
          onMouseUp={() => {
            setIsDragging(false);
            setTimeout(() => setShowValue(false), 2000);
          }}
          onTouchStart={() => {
            setIsDragging(true);
            setShowValue(true);
          }}
          onTouchEnd={() => {
            setIsDragging(false);
            setTimeout(() => setShowValue(false), 2000);
          }}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #7faf3b 0%, #7faf3b ${(value / max) * 100}%, #e5e7eb ${(value / max) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>

      {isDragging && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-2 text-center"
        >
          <p className="text-sm text-gray-600">
            {value === 0 ? "None" : value < max * 0.3 ? "A little" : value < max * 0.7 ? "Medium" : "A lot"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

