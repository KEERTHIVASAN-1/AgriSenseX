"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useInView } from "framer-motion";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  status: "low" | "optimal" | "high";
  icon: string;
  min?: number;
  max?: number;
  optimalMin?: number;
  optimalMax?: number;
}

export default function SensorCard({
  title,
  value,
  unit,
  status,
  icon,
  min = 0,
  max = 100,
  optimalMin,
  optimalMax,
}: SensorCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  // Animate value change
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000;
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    animate();
  }, [value, isInView]);

  // Calculate percentage for gauge
  const percentage = ((value - min) / (max - min)) * 100;
  const optimalPercentage = optimalMin && optimalMax 
    ? ((optimalMax - optimalMin) / (max - min)) * 100 
    : 0;
  const optimalStart = optimalMin 
    ? ((optimalMin - min) / (max - min)) * 100 
    : 0;

  // Status colors
  const statusColors = {
    low: "from-red-500/20 to-red-600/30 border-red-500/40",
    optimal: "from-[#a3c94f]/20 to-[#7faf3b]/30 border-[#a3c94f]/40",
    high: "from-yellow-500/20 to-orange-600/30 border-yellow-500/40",
  };

  const statusIndicators = {
    low: { color: "bg-red-500", text: "Low", glow: "shadow-[0_0_12px_rgba(239,68,68,0.5)]" },
    optimal: { color: "bg-[#a3c94f]", text: "Optimal", glow: "shadow-[0_0_12px_rgba(163,201,79,0.5)]" },
    high: { color: "bg-yellow-500", text: "High", glow: "shadow-[0_0_12px_rgba(234,179,8,0.5)]" },
  };

  const indicator = statusIndicators[status];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${statusColors[status]} p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusColors[status]} opacity-20 blur-xl`} />

      {/* Header */}
      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${indicator.color} ${indicator.glow}`} />
              <span className="text-xs text-slate-400">{indicator.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Value Display */}
      <div className="relative mb-6">
        <motion.div
          key={displayValue}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-baseline gap-2"
        >
          <span className="text-4xl font-bold text-white">
            {displayValue.toFixed(1)}
          </span>
          <span className="text-lg text-slate-400">{unit}</span>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
        {/* Optimal range indicator */}
        {optimalMin && optimalMax && (
          <div
            className="absolute left-0 top-0 h-full bg-[#a3c94f]/30"
            style={{
              left: `${optimalStart}%`,
              width: `${optimalPercentage}%`,
            }}
          />
        )}
        
        {/* Current value bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${Math.min(percentage, 100)}%` } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${
            status === "optimal"
              ? "bg-gradient-to-r from-[#a3c94f] to-[#7faf3b]"
              : status === "low"
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-yellow-500 to-orange-500"
          }`}
        />
      </div>

      {/* Min/Max labels */}
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </motion.div>
  );
}



