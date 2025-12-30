"use client";

import { motion } from "framer-motion";

interface FeedbackBarProps {
  waterValue: number;
  fertilizerValue: number;
}

export default function FeedbackBar({ waterValue, fertilizerValue }: FeedbackBarProps) {
  const totalValue = waterValue + fertilizerValue * 2;
  const isGood = totalValue > 30;
  const isExcellent = totalValue > 60;

  const getFeedback = () => {
    if (totalValue === 0) return "Adjust sliders to help your farm";
    if (totalValue < 20) return "This will help a little";
    if (totalValue < 40) return "This will make soil better";
    if (totalValue < 60) return "This will make soil healthy today";
    return "This will make soil very healthy";
  };

  const getColor = () => {
    if (totalValue === 0) return "text-gray-500";
    if (totalValue < 20) return "text-orange-500";
    if (totalValue < 40) return "text-yellow-600";
    if (totalValue < 60) return "text-green-600";
    return "text-[#7faf3b]";
  };

  return (
    <motion.div
      key={totalValue}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 text-center"
    >
      <motion.p
        className={`text-sm font-medium ${getColor()} transition-colors duration-300`}
        animate={{
          scale: isExcellent ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isExcellent ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {getFeedback()}
      </motion.p>
    </motion.div>
  );
}

