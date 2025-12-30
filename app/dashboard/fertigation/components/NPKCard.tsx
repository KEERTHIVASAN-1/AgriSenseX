"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NPKCardProps {
  current: { nitrogen: number; phosphorus: number; potassium: number };
  target: { nitrogen: number; phosphorus: number; potassium: number };
  isDark?: boolean;
}

export default function NPKCard({ current, target, isDark = false }: NPKCardProps) {
  const [animatedValues, setAnimatedValues] = useState({
    n: 0,
    p: 0,
    k: 0,
  });

  useEffect(() => {
    // Smoothly animate to new values
    const steps = 20;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      setAnimatedValues(prev => ({
        n: prev.n + (current.nitrogen - prev.n) / steps,
        p: prev.p + (current.phosphorus - prev.p) / steps,
        k: prev.k + (current.potassium - prev.k) / steps,
      }));
      if (step >= steps) {
        setAnimatedValues({
          n: current.nitrogen,
          p: current.phosphorus,
          k: current.potassium,
        });
        clearInterval(interval);
      }
    }, 20);
    
    return () => clearInterval(interval);
  }, [current]);

  const nutrients = [
    {
      label: "Nitrogen (N)",
      icon: "🌿",
      current: animatedValues.n,
      target: target.nitrogen,
      color: "bg-[#7faf3b]",
      status: animatedValues.n < target.nitrogen * 0.8 ? "low" : animatedValues.n > target.nitrogen * 1.2 ? "high" : "optimal",
    },
    {
      label: "Phosphorus (P)",
      icon: "🔬",
      current: animatedValues.p,
      target: target.phosphorus,
      color: "bg-[#8B6F47]",
      status: animatedValues.p < target.phosphorus * 0.8 ? "low" : animatedValues.p > target.phosphorus * 1.2 ? "high" : "optimal",
    },
    {
      label: "Potassium (K)",
      icon: "⚡",
      current: animatedValues.k,
      target: target.potassium,
      color: "bg-[#42a5f5]",
      status: animatedValues.k < target.potassium * 0.8 ? "low" : animatedValues.k > target.potassium * 1.2 ? "high" : "optimal",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border-2 border-gray-200 bg-white p-4"
    >
      <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-5">
        <span className="text-2xl lg:text-3xl">🧪</span>
        <h3 className="text-base lg:text-lg font-bold text-gray-900">NPK Levels</h3>
      </div>

      <div className="space-y-3 lg:space-y-4">
        {nutrients.map((nutrient, index) => {
          const percentage = Math.min(100, (nutrient.current / nutrient.target) * 100);
          const gap = Math.abs(nutrient.current - nutrient.target);

          return (
            <div key={nutrient.label}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg lg:text-xl">{nutrient.icon}</span>
                  <span className="text-xs lg:text-sm font-semibold text-gray-900">{nutrient.label}</span>
                </div>
                <div className="flex items-baseline gap-2 lg:gap-3">
                  <div className="text-left sm:text-right flex-1">
                    <p className="text-xs text-gray-600">Current</p>
                    <p className="text-base lg:text-lg font-bold text-gray-900">
                      {nutrient.current.toFixed(1)}
                      <span className="text-xs font-normal text-gray-600 ml-1">ppm</span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-1">
                    <p className="text-xs text-gray-600">Target</p>
                    <p className="text-sm lg:text-base font-semibold text-gray-700">
                      {nutrient.target.toFixed(1)}
                      <span className="text-xs font-normal text-gray-600 ml-1">ppm</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2.5 lg:h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${nutrient.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                />
              </div>

              {/* Status and Gap */}
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isDark
                      ? nutrient.status === "optimal"
                        ? "bg-green-700/50 text-green-300"
                        : nutrient.status === "low"
                        ? "bg-red-700/50 text-red-300"
                        : "bg-orange-700/50 text-orange-300"
                      : nutrient.status === "optimal"
                      ? "bg-green-200 text-green-700"
                      : nutrient.status === "low"
                      ? "bg-red-200 text-red-700"
                      : "bg-orange-200 text-orange-700"
                  }`}
                >
                  {nutrient.status === "optimal" ? "Optimal" : nutrient.status === "low" ? "Low" : "High"}
                </span>
                {gap > 0.1 && (
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {nutrient.current < nutrient.target ? "+" : "-"}
                    {gap.toFixed(1)} ppm needed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

