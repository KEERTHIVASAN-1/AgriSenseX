"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface NPKData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface NPKCardProps {
  data: NPKData;
  optimal: NPKData;
}

export default function NPKCard({ data, optimal }: NPKCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayData, setDisplayData] = useState<NPKData>({
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = Date.now();
    const startData = { ...displayData };
    const endData = { ...data };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayData({
        nitrogen: startData.nitrogen + (endData.nitrogen - startData.nitrogen) * eased,
        phosphorus: startData.phosphorus + (endData.phosphorus - startData.phosphorus) * eased,
        potassium: startData.potassium + (endData.potassium - startData.potassium) * eased,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayData(endData);
      }
    };

    animate();
  }, [data, isInView]);

  const nutrients = [
    {
      label: "Nitrogen",
      value: displayData.nitrogen,
      optimal: optimal.nitrogen,
      color: "from-blue-500 to-cyan-500",
      icon: "N",
    },
    {
      label: "Phosphorus",
      value: displayData.phosphorus,
      optimal: optimal.phosphorus,
      color: "from-purple-500 to-pink-500",
      icon: "P",
    },
    {
      label: "Potassium",
      value: displayData.potassium,
      optimal: optimal.potassium,
      color: "from-orange-500 to-red-500",
      icon: "K",
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-800/40 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-2xl backdrop-blur-sm">
          🧪
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            NPK Sensor
          </h3>
          <p className="text-xs text-slate-500">Nutrient Levels</p>
        </div>
      </div>

      {/* Nutrients */}
      <div className="space-y-4">
        {nutrients.map((nutrient, index) => {
          const percentage = (nutrient.value / 100) * 100;
          const optimalPercentage = (nutrient.optimal / 100) * 100;
          const status = nutrient.value < nutrient.optimal * 0.8 
            ? "low" 
            : nutrient.value > nutrient.optimal * 1.2 
            ? "high" 
            : "optimal";

          return (
            <div key={nutrient.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${nutrient.color} text-xs font-bold text-white`}>
                    {nutrient.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    {nutrient.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={nutrient.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-bold text-white"
                  >
                    {nutrient.value.toFixed(1)}
                  </motion.span>
                  <span className="text-xs text-slate-500">ppm</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
                {/* Optimal range */}
                <div
                  className="absolute left-0 top-0 h-full bg-[#a3c94f]/20"
                  style={{
                    width: `${optimalPercentage}%`,
                  }}
                />
                
                {/* Current value */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${Math.min(percentage, 100)}%` } : {}}
                  transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${nutrient.color} ${
                    status === "optimal" ? "opacity-100" : "opacity-80"
                  }`}
                />
              </div>

              {/* Optimal indicator */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Current</span>
                <span className="text-[#a3c94f]">
                  Optimal: {nutrient.optimal} ppm
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}



