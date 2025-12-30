"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import LiveActivityStrip from "./LiveActivityStrip";

interface LivingFarmVisualProps {
  moisture: number;
  nutrients: number;
  isWatering: boolean;
  isFertilizing: boolean;
  onActivityTap?: (type: "water" | "nutrient" | "soil") => void;
  isDark?: boolean;
}

export default function LivingFarmVisual({
  moisture,
  nutrients,
  isWatering,
  isFertilizing,
  onActivityTap,
  isDark = false,
}: LivingFarmVisualProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [waterDrops, setWaterDrops] = useState<Array<{ id: number; y: number }>>([]);

  // Calculate visual states - react more to watering/fertilizing
  const baseMoisture = moisture - (isWatering ? 20 : 0); // Visual boost when watering
  const soilColor = baseMoisture < 40 ? "#8B6F47" : baseMoisture < 60 ? "#9B7A57" : "#A68B5B";
  const baseNutrients = nutrients - (isFertilizing ? 15 : 0); // Visual boost when fertilizing
  const plantHealth = baseNutrients < 30 ? 0.7 : baseNutrients < 50 ? 0.85 : 1;
  const plantHeight = 40 + (baseNutrients / 100) * 20;

  // Water drop animation - more intense when watering
  useEffect(() => {
    if (!isWatering) {
      // Clear drops when not watering
      setWaterDrops([]);
      return;
    }

    const interval = setInterval(() => {
      setWaterDrops((prev) => {
        const newDrops = prev
          .map((drop) => ({ ...drop, y: drop.y + 4 }))
          .filter((drop) => drop.y < 150);

        // Add more drops when actively watering
        if (newDrops.length < 8) {
          newDrops.push({ id: Date.now() + Math.random(), y: 0 });
        }

        return newDrops;
      });
    }, 150); // Faster, more frequent drops

    return () => clearInterval(interval);
  }, [isWatering]);

  return (
    <div className="relative w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-b from-[#e8f5e9] to-[#f1f8e9] rounded-xl overflow-hidden border-2 border-[#c8e6c9] z-10 shadow-sm">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e3f2fd] to-transparent" />
      
      {/* Water pipe */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#90caf9] rounded-t-lg border-2 border-[#64b5f6]" />
      
      {/* Drip line */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#64b5f6]" />
      
      {/* Water drops - more visible and animated */}
      {waterDrops.map((drop, index) => (
        <motion.div
          key={drop.id}
          className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#42a5f5] shadow-lg"
          style={{ 
            top: `${drop.y}px`,
            left: `${50 + (index % 3 - 1) * 3}%`, // Spread drops horizontally
          }}
          animate={{ 
            y: [0, 150],
            opacity: [1, 0.8, 0],
            scale: [1, 1.2, 0.8],
          }}
          transition={{ 
            duration: 1,
            ease: "easeIn",
            repeat: 0,
          }}
        />
      ))}

      {/* Soil patch */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          {/* Soil base */}
          <path
            d="M0,100 Q50,80 100,85 T200,100 L200,100 L0,100 Z"
            fill={soilColor}
            stroke="#6B5A4A"
            strokeWidth="1"
          />
          
          {/* Moisture layer - more visible when watering */}
          {moisture > 30 && (
            <motion.path
              d="M0,100 Q50,80 100,85 T200,100 L200,100 L0,100 Z"
              fill="#4a90e2"
              initial={{ opacity: (moisture / 100) * 0.4 }}
              animate={{ 
                opacity: isWatering 
                  ? (moisture / 100) * 0.7 
                  : (moisture / 100) * 0.4 
              }}
              transition={{ duration: 0.5 }}
            />
          )}
        </svg>
      </div>

      {/* Plant */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
        animate={{
          scaleY: plantHealth,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <svg width="40" height={plantHeight} viewBox="0 0 40 60">
          {/* Stem */}
          <rect x="18" y="20" width="4" height={plantHeight - 20} fill="#66bb6a" />
          
          {/* Leaves */}
          <ellipse cx="12" cy="25" rx="8" ry="12" fill="#81c784" />
          <ellipse cx="28" cy="25" rx="8" ry="12" fill="#81c784" />
          <ellipse cx="20" cy="15" rx="10" ry="8" fill="#81c784" />
          
          {/* Plant health indicator */}
          {nutrients > 50 && (
            <circle cx="20" cy="10" r="3" fill="#ffd54f" opacity={0.8}>
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
      </motion.div>

      {/* Fertilizer particles - more visible when fertilizing */}
      {isFertilizing && (
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-[#7faf3b] shadow-md"
              style={{
                left: `${25 + (i % 4) * 15}%`,
                top: `${15 + Math.floor(i / 4) * 10}%`,
              }}
              animate={{
                y: [0, 180],
                opacity: [1, 0.9, 0],
                scale: [1, 1.5, 0.8],
              }}
              transition={{
                duration: 1.2,
                delay: (i % 4) * 0.1,
                repeat: Infinity,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}

      {/* Live Activity Strip */}
      <LiveActivityStrip
        isWatering={isWatering}
        isFertilizing={isFertilizing}
        moisture={moisture}
        nutrients={nutrients}
        onIconTap={onActivityTap || (() => {})}
      />
    </div>
  );
}

