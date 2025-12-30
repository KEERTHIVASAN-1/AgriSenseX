"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Fertilizer {
  type: string;
  quantity: number;
  unit: string;
  duration: number;
  color: string;
}

interface FertilizerRecommendationProps {
  fertilizers: Fertilizer[];
}

export default function FertilizerRecommendation({
  fertilizers,
}: FertilizerRecommendationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setFillHeight(100), 500);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-[#a3c94f]/40 bg-gradient-to-br from-[#a3c94f]/10 to-[#7faf3b]/10 p-6 backdrop-blur-sm"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#a3c94f]/5 to-[#7faf3b]/5 blur-2xl" />

      {/* Header */}
      <div className="relative mb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#a3c94f] shadow-[0_0_12px_rgba(163,201,79,0.5)]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a3c94f]">
            Fertilizer Recommendation
          </h3>
        </div>
        <p className="text-sm text-slate-300">
          To reach target values, add:
        </p>
      </div>

      {/* Fertilizers List */}
      <div className="relative space-y-4">
        {fertilizers.map((fertilizer, index) => (
          <motion.div
            key={fertilizer.type}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl border border-[#a3c94f]/20 bg-slate-900/40 p-4 backdrop-blur-sm"
          >
            {/* Liquid fill animation */}
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: `${fillHeight}%` } : {}}
              transition={{ duration: 1.5, delay: index * 0.2 + 0.5, ease: "easeOut" }}
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${fertilizer.color} opacity-20`}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#a3c94f]/20 to-[#7faf3b]/20 text-lg">
                  💧
                </div>
                <div>
                  <h4 className="font-semibold text-white">{fertilizer.type}</h4>
                  <p className="text-xs text-slate-400">
                    Application: {fertilizer.duration} minutes
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.8, type: "spring" }}
                className="flex flex-col items-end"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#a3c94f]">
                    {fertilizer.quantity}
                  </span>
                  <span className="text-sm text-slate-400">{fertilizer.unit}</span>
                </div>
                <span className="text-xs text-slate-500">Required</span>
              </motion.div>
            </div>

            {/* Flow lines animation */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, opacity: 0 }}
                  animate={
                    isInView
                      ? {
                          y: [null, 100],
                          opacity: [0, 1, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    delay: index * 0.2 + i * 0.3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-1/2 h-8 w-0.5 -translate-x-1/2 bg-[#a3c94f]"
                  style={{ left: `${20 + i * 30}%` }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative mt-6 rounded-lg border border-[#a3c94f]/30 bg-slate-900/60 p-4 backdrop-blur-sm"
      >
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-[#a3c94f]">Note:</span> Apply fertilizers
          gradually over the recommended duration for optimal soil absorption.
        </p>
      </motion.div>
    </motion.div>
  );
}



