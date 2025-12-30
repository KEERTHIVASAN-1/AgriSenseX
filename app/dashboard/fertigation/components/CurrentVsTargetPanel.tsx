"use client";

import { motion } from "framer-motion";

interface CurrentVsTargetPanelProps {
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
  isDark?: boolean;
}

export default function CurrentVsTargetPanel({ data, target, isDark = false }: CurrentVsTargetPanelProps) {
  const metrics = [
    {
      label: "Soil Moisture",
      icon: "💧",
      current: data.soilMoisture,
      target: target.soilMoisture,
      unit: "%",
      color: "bg-[#42a5f5]",
    },
    {
      label: "pH Level",
      icon: "🟫",
      current: data.pH,
      target: target.pH,
      unit: "",
      color: "bg-[#8B6F47]",
    },
    {
      label: "Temperature",
      icon: "🌡️",
      current: data.temperature,
      target: 25,
      unit: "°C",
      color: "bg-orange-500",
    },
    {
      label: "Nitrogen (N)",
      icon: "🌿",
      current: data.npk.nitrogen,
      target: target.npk.nitrogen,
      unit: "ppm",
      color: "bg-[#7faf3b]",
    },
    {
      label: "Phosphorus (P)",
      icon: "🔬",
      current: data.npk.phosphorus,
      target: target.npk.phosphorus,
      unit: "ppm",
      color: "bg-[#8B6F47]",
    },
    {
      label: "Potassium (K)",
      icon: "⚡",
      current: data.npk.potassium,
      target: target.npk.potassium,
      unit: "ppm",
      color: "bg-[#42a5f5]",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 p-4 lg:p-6 shadow-sm transition-colors duration-300 ${
        isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <h3 className={`text-base lg:text-lg font-bold mb-4 lg:mb-5 transition-colors duration-300 ${
        isDark ? "text-gray-100" : "text-gray-900"
      }`}>Current vs Target Values</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 lg:gap-4">
        {metrics.map((metric, index) => {
          const gap = metric.current - metric.target;
          const percentage = Math.min(100, Math.max(0, (metric.current / metric.target) * 100));
          const status = Math.abs(gap) < metric.target * 0.05 ? "optimal" : gap < 0 ? "low" : "high";

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`rounded-lg border p-3 lg:p-4 transition-all ${
                isDark
                  ? "border-gray-700 bg-gray-700/50 hover:bg-gray-700"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg lg:text-xl">{metric.icon}</span>
                <span className={`text-xs lg:text-sm font-semibold transition-colors duration-300 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}>{metric.label}</span>
              </div>

              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className={`text-xs mb-1 transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>Current</p>
                    <p className={`text-lg lg:text-xl font-bold transition-colors duration-300 ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}>
                      {metric.current.toFixed(1)}
                      <span className={`text-xs font-normal ml-1 transition-colors duration-300 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>{metric.unit}</span>
                    </p>
                  </div>
                  <div className="text-right flex-1">
                    <p className={`text-xs mb-1 transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>Target</p>
                    <p className={`text-base lg:text-lg font-semibold transition-colors duration-300 ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>
                      {metric.target.toFixed(1)}
                      <span className={`text-xs font-normal ml-1 transition-colors duration-300 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>{metric.unit}</span>
                    </p>
                  </div>
                </div>

                {/* Visual Gap Indicator */}
                <div className="flex items-center gap-2">
                  <div className={`flex-1 relative h-2 rounded-full overflow-hidden transition-colors duration-300 ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}>
                    <motion.div
                      className={`h-full ${metric.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      status === "optimal"
                        ? "text-green-600"
                        : status === "low"
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  >
                    {gap > 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

