"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FlowLinesProps {
  showLeftToCenter: boolean;
  showCenterToRight: boolean;
}

export default function FlowLines({
  showLeftToCenter,
  showCenterToRight,
}: FlowLinesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* Left to Center flow line */}
      <AnimatePresence>
        {showLeftToCenter && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.4, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-red-300/60 via-blue-300/60 to-transparent"
            style={{ left: "16.66%", width: "8.33%", top: "50%" }}
          />
        )}
      </AnimatePresence>

      {/* Center to Right flow line */}
      <AnimatePresence>
        {showCenterToRight && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.4, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-l from-green-300/60 via-blue-300/60 to-transparent"
            style={{ right: "16.66%", width: "8.33%", top: "50%" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

