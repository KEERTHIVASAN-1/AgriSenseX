"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface SensorDataCardProps {
  title: string;
  icon: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: "low" | "optimal" | "high";
  color: string;
  isDark?: boolean;
}

export default function SensorDataCard({
  title,
  icon,
  currentValue,
  targetValue,
  unit,
  status,
  color,
  isDark = false,
}: SensorDataCardProps) {
  const [animatedValue, setAnimatedValue] = useState(currentValue);
  const animatedValueRef = useRef(currentValue);
  const percentage = Math.min(100, (currentValue / targetValue) * 100);
  const gap = Math.abs(currentValue - targetValue);

  useEffect(() => {
    // Update ref
    animatedValueRef.current = animatedValue;
  }, [animatedValue]);

  useEffect(() => {
    // Smoothly animate to new value when it changes
    const startValue = animatedValueRef.current;
    const endValue = currentValue;
    const diff = endValue - startValue;
    
    if (Math.abs(diff) < 0.01) {
      setAnimatedValue(endValue);
      animatedValueRef.current = endValue;
      return;
    }
    
    const duration = 300; // 300ms animation
    const steps = 20;
    let step = 0;
    const stepSize = diff / steps;
    
    const interval = setInterval(() => {
      step++;
      setAnimatedValue((prev) => {
        const newValue = prev + stepSize;
        if (step >= steps) {
          clearInterval(interval);
          animatedValueRef.current = endValue;
          return endValue;
        }
        animatedValueRef.current = newValue;
        return newValue;
      });
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, [currentValue]);

  const statusColors = isDark
    ? {
        low: "text-red-400 bg-red-900/30 border-red-700",
        optimal: "text-green-400 bg-green-900/30 border-green-700",
        high: "text-orange-400 bg-orange-900/30 border-orange-700",
      }
    : {
        low: "text-red-600 bg-red-50 border-red-200",
        optimal: "text-green-600 bg-green-50 border-green-200",
        high: "text-orange-600 bg-orange-50 border-orange-200",
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border-2 p-4 lg:p-5 shadow-sm hover:shadow-md transition-all ${statusColors[status]} ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className="flex items-center gap-2 lg:gap-3">
          <span className="text-2xl lg:text-3xl">{icon}</span>
          <h3 className={`text-sm lg:text-base font-semibold transition-colors duration-300 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}>{title}</h3>
        </div>
        <span
          className={`text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-1.5 rounded-full font-medium ${
            isDark
              ? status === "optimal"
                ? "bg-green-700/50 text-green-300"
                : status === "low"
                ? "bg-red-700/50 text-red-300"
                : "bg-orange-700/50 text-orange-300"
              : status === "optimal"
              ? "bg-green-200 text-green-700"
              : status === "low"
              ? "bg-red-200 text-red-700"
              : "bg-orange-200 text-orange-700"
          }`}
        >
          {status === "optimal" ? "Optimal" : status === "low" ? "Low" : "High"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex-1">
            <p className={`text-xs lg:text-sm mb-1 transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>Current</p>
            <p className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              {animatedValue.toFixed(1)}
              <span className={`text-xs lg:text-sm font-normal ml-1 transition-colors duration-300 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>{unit}</span>
            </p>
          </div>
          <div className="text-right flex-1">
            <p className={`text-xs lg:text-sm mb-1 transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>Target</p>
            <p className={`text-base lg:text-lg font-semibold transition-colors duration-300 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
              {targetValue.toFixed(1)}
              <span className={`text-xs lg:text-sm font-normal ml-1 transition-colors duration-300 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>{unit}</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`relative h-2 rounded-full overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-gray-700" : "bg-gray-200"
        }`}>
          <motion.div
            className={`h-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Gap Indicator */}
        <p className={`text-xs text-center mt-1 transition-colors duration-300 ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}>
          {gap > 0.1
            ? `${status === "low" ? "Need +" : status === "high" ? "Need -" : ""}${gap.toFixed(1)} ${unit} to reach target`
            : "At optimal level"}
        </p>
      </div>
    </motion.div>
  );
}

