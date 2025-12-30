"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ComparisonData {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface ComparisonViewProps {
  data: ComparisonData[];
}

export default function ComparisonView({ data }: ComparisonViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-800/40 p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Current vs Target
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Compare current soil conditions with optimal values
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-6">
        {data.map((item, index) => {
          const gap = Math.max(0, item.target - item.current);
          const gapPercentage = item.target > 0 ? (gap / item.target) * 100 : 0;
          const currentPercentage = item.target > 0 ? (item.current / item.target) * 100 : 0;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500">
                  Gap: {gap.toFixed(1)} {item.unit}
                </span>
              </div>

              {/* Dual columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Current */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Current</span>
                    <span className="text-sm font-bold text-white">
                      {item.current.toFixed(1)} {item.unit}
                    </span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${Math.min(currentPercentage, 100)}%` } : {}}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={`h-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>
                </div>

                {/* Target */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Target</span>
                    <span className="text-sm font-bold text-[#a3c94f]">
                      {item.target.toFixed(1)} {item.unit}
                    </span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800/50">
                    <div className="h-full w-full bg-gradient-to-r from-[#a3c94f]/40 to-[#7faf3b]/40" />
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 backdrop-blur-sm"
                >
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}



