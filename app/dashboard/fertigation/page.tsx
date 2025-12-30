"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSensorData } from "./components/useSensorData";
import LivingFarmVisual from "./components/LivingFarmVisual";
import StatusButton from "./components/StatusButton";
import ActionPanel from "./components/ActionPanel";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import ConfirmChips from "./components/ConfirmChips";
import AnimatedFarmBackground from "./components/AnimatedFarmBackground";
import FlowLines from "./components/FlowLines";
import SensorDataCard from "./components/SensorDataCard";
import NPKCard from "./components/NPKCard";
import CurrentVsTargetPanel from "./components/CurrentVsTargetPanel";
import ThemeToggle from "./components/ThemeToggle";
import {
  getSoilMoistureStatus,
  getpHStatus,
  getNutrientStatus,
  getInitialWaterValue,
  getInitialFertilizerValue,
} from "./components/utils";

export default function FertigationPage() {
  const { data, target } = useSensorData();
  
  const [waterValue, setWaterValue] = useState(getInitialWaterValue(data, target));
  const [fertilizerValue, setFertilizerValue] = useState(getInitialFertilizerValue(data, target));
  const [isWatering, setIsWatering] = useState(false);
  const [isFertilizing, setIsFertilizing] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLeftToCenter, setShowLeftToCenter] = useState(false);
  const [showCenterToRight, setShowCenterToRight] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("fertigation-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("fertigation-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("fertigation-theme", "light");
      }
      return newMode;
    });
  };
  
  // Calculate REAL-TIME values based on current actions
  // When watering: moisture increases
  // When fertilizing: nutrients increase
  const currentMoisture = data.soilMoisture + (waterValue * 0.5); // Real-time moisture based on water value
  const currentNutrients = ((data.npk.nitrogen + data.npk.phosphorus + data.npk.potassium) / 3) + (fertilizerValue * 0.8); // Real-time nutrients based on fertilizer value
  
  // Visual state based on sliders and current actions
  const visualMoisture = isWatering ? currentMoisture + 5 : currentMoisture; // Extra boost when actively watering
  const visualNutrients = isFertilizing ? currentNutrients + 5 : currentNutrients; // Extra boost when actively fertilizing

  const handleFarmUpdate = (type: "water" | "fertilizer", value: number) => {
    if (type === "water" && value > 0) {
      setIsWatering(true);
      setShowLeftToCenter(true);
      setTimeout(() => {
        setIsWatering(false);
        setShowLeftToCenter(false);
      }, 600);
    }
    if (type === "fertilizer" && value > 0) {
      setIsFertilizing(true);
      setShowLeftToCenter(true);
      setTimeout(() => {
        setIsFertilizing(false);
        setShowLeftToCenter(false);
      }, 600);
    }
  };

  const handleStart = () => {
    // Prevent multiple clicks while already started
    if (isStarted) return;
    
    // Step 1: Initialize - Mark as started and trigger all visual feedback
    setIsStarted(true);
    setIsWatering(true);
    setIsFertilizing(true);
    setShowCenterToRight(true);
    setShowLeftToCenter(true);
    
    // Step 2: Keep animations active for 3 seconds (simulating fertigation process)
    setTimeout(() => {
      // Step 3: Show success message while animations are still active
      setShowSuccess(true);
      
      // Step 4: After 1 second, stop the animations but keep success visible
      setTimeout(() => {
        setIsWatering(false);
        setIsFertilizing(false);
        setShowLeftToCenter(false);
        setShowCenterToRight(false);
      }, 1000);
      
      // Step 5: Hide success message after 2.5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
      
      // Step 6: Reset started state after all animations complete (total: 4 seconds)
      setTimeout(() => {
        setIsStarted(false);
      }, 4000);
    }, 3000);
  };

  const handleLeftPanelTap = (type: "water" | "plant" | "soil") => {
    // Trigger visual reaction in center farm
    if (type === "water") {
      setIsWatering(true);
      setTimeout(() => setIsWatering(false), 1000);
    } else if (type === "plant") {
      setIsFertilizing(true);
      setTimeout(() => setIsFertilizing(false), 1000);
    }
    // Soil pH changes are visual only, handled by farm visual
  };

  // Determine status for each sensor
  const getMoistureStatus = (current: number, target: number): "low" | "optimal" | "high" => {
    if (current < target * 0.8) return "low";
    if (current > target * 1.2) return "high";
    return "optimal";
  };

  const getpHStatusValue = (current: number, target: number): "low" | "optimal" | "high" => {
    const diff = Math.abs(current - target);
    if (diff > 0.5) return current < target ? "low" : "high";
    return "optimal";
  };

    return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? "bg-gray-900 text-gray-100" : "bg-[#fafafa] text-gray-900"
    }`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 px-3 sm:px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-20 shadow-sm ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center justify-between">
        <div>
            <h1 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}>Fertigation & Soil Health</h1>
            <p className={`text-xs sm:text-sm mt-0.5 transition-colors duration-300 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>Real-time sensor data and recommendations</p>
          </div>
          <ThemeToggle isDark={isDarkMode} toggleTheme={toggleTheme} />
        </div>
      </div>

      <main className="px-3 sm:px-4 lg:px-6 py-4 lg:py-6 max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Sensor Data Cards Section */}
        <section>
          <h2 className={`text-base lg:text-lg font-bold mb-3 lg:mb-4 px-1 transition-colors duration-300 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>Current Sensor Readings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <SensorDataCard
              title="Soil Moisture"
              icon="💧"
              currentValue={currentMoisture}
              targetValue={target.soilMoisture}
              unit="%"
              status={getMoistureStatus(currentMoisture, target.soilMoisture)}
              color="bg-[#42a5f5]"
              isDark={isDarkMode}
            />
            <SensorDataCard
              title="pH Level"
              icon="🟫"
              currentValue={data.pH}
              targetValue={target.pH}
              unit=""
              status={getpHStatusValue(data.pH, target.pH)}
              color="bg-[#8B6F47]"
              isDark={isDarkMode}
            />
            <SensorDataCard
              title="Temperature"
              icon="🌡️"
              currentValue={data.temperature}
              targetValue={25}
              unit="°C"
              status={data.temperature < 20 || data.temperature > 30 ? "low" : "optimal"}
              color="bg-orange-500"
              isDark={isDarkMode}
            />
            <div className="sm:col-span-2 lg:col-span-1 flex">
              <NPKCard 
                current={{
                  nitrogen: data.npk.nitrogen + (fertilizerValue * 0.3),
                  phosphorus: data.npk.phosphorus + (fertilizerValue * 0.2),
                  potassium: data.npk.potassium + (fertilizerValue * 0.3)
                }} 
                target={target.npk}
                isDark={isDarkMode}
              />
            </div>
          </div>
        </section>

        {/* Current vs Target Comparison */}
        <section>
          <CurrentVsTargetPanel 
            data={{
              ...data,
              soilMoisture: currentMoisture,
              npk: {
                nitrogen: data.npk.nitrogen + (fertilizerValue * 0.3),
                phosphorus: data.npk.phosphorus + (fertilizerValue * 0.2),
                potassium: data.npk.potassium + (fertilizerValue * 0.3)
              }
            }} 
            target={target} 
            isDark={isDarkMode} 
          />
        </section>

        {/* Interactive Farm Section */}
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <AnimatedFarmBackground
              waterValue={waterValue}
              fertilizerValue={fertilizerValue}
              isStarted={isStarted}
              isWatering={isWatering}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 relative" style={{ zIndex: 1 }}>
            {/* Flow Lines - Visual connection between panels */}
            <FlowLines
              showLeftToCenter={showLeftToCenter}
              showCenterToRight={showCenterToRight}
            />
          {/* Left Panel - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-2">
            <LeftPanel
              data={{
                ...data,
                soilMoisture: currentMoisture,
                npk: {
                  nitrogen: data.npk.nitrogen + (fertilizerValue * 0.3),
                  phosphorus: data.npk.phosphorus + (fertilizerValue * 0.2),
                  potassium: data.npk.potassium + (fertilizerValue * 0.3)
                }
              }}
              target={target}
              onItemTap={handleLeftPanelTap}
              onReasonTap={(type) => {
                // Trigger subtle visual change
                if (type === "heat" || type === "rain") {
                  setIsWatering(true);
                  setTimeout(() => setIsWatering(false), 800);
                }
              }}
              waterValue={waterValue}
              fertilizerValue={fertilizerValue}
              isWatering={isWatering}
              isFertilizing={isFertilizing}
              isDark={isDarkMode}
            />
          </div>

          {/* Center UI */}
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            {/* Living Farm Visual */}
            <section>
              <LivingFarmVisual
                moisture={visualMoisture}
                nutrients={visualNutrients}
                isWatering={isWatering}
                isFertilizing={isFertilizing}
                onActivityTap={(type) => {
                  if (type === "water") {
                    setIsWatering(true);
                    setTimeout(() => setIsWatering(false), 1000);
                  } else if (type === "nutrient") {
                    setIsFertilizing(true);
                    setTimeout(() => setIsFertilizing(false), 1000);
                  }
                }}
              />
            </section>

        {/* Tap-to-Reveal Status Buttons */}
        <section className="space-y-2 lg:space-y-3">
          <StatusButton
            icon="💧"
            label="Water"
            status={getSoilMoistureStatus(
              { ...data, soilMoisture: currentMoisture },
              target
            )}
            color="bg-[#42a5f5]"
            onTap={() => {
              // Trigger immediate visual feedback
              setIsWatering(true);
              // Increase water value slightly to show action
              if (waterValue < 100) {
                setWaterValue(prev => Math.min(100, prev + 5));
              }
              // Reset after animation
              setTimeout(() => setIsWatering(false), 1500);
            }}
            isDark={isDarkMode}
          />

          {/* Confirm Chips */}
          <ConfirmChips
            waterValue={waterValue}
            fertilizerValue={fertilizerValue}
            soilOK={data.pH >= 6.0 && data.pH <= 7.0}
            onChipTap={(type) => {
              if (type === "water") {
                setIsWatering(true);
                setTimeout(() => setIsWatering(false), 1000);
              } else if (type === "fertilizer") {
                setIsFertilizing(true);
                setTimeout(() => setIsFertilizing(false), 1000);
              }
            }}
          />

          <StatusButton
            icon="🌱"
            label="Plant Food"
            status={getNutrientStatus(
              { ...data, npk: { 
                nitrogen: data.npk.nitrogen + (fertilizerValue * 0.3),
                phosphorus: data.npk.phosphorus + (fertilizerValue * 0.2),
                potassium: data.npk.potassium + (fertilizerValue * 0.3)
              }},
              target
            )}
            color="bg-[#7faf3b]"
            onTap={() => {
              // Trigger immediate visual feedback
              setIsFertilizing(true);
              // Increase fertilizer value slightly to show action
              if (fertilizerValue < 50) {
                setFertilizerValue(prev => Math.min(50, prev + 2));
              }
              // Reset after animation
              setTimeout(() => setIsFertilizing(false), 1500);
            }}
            isDark={isDarkMode}
          />

          <StatusButton
            icon="🟫"
            label="Soil Health"
            status={getpHStatus(data, target)}
            color="bg-[#8B6F47]"
            onTap={() => {
              // Visual feedback for soil health check
              setShowLeftToCenter(true);
              setTimeout(() => setShowLeftToCenter(false), 800);
            }}
            isDark={isDarkMode}
          />
        </section>

            {/* Action Panel with Sliders */}
            <section>
              <ActionPanel
                waterValue={waterValue}
                fertilizerValue={fertilizerValue}
                onWaterChange={setWaterValue}
                onFertilizerChange={setFertilizerValue}
                onFarmUpdate={handleFarmUpdate}
                onChipTap={(type) => {
                  if (type === "water") {
                    setIsWatering(true);
                    setTimeout(() => setIsWatering(false), 1000);
                  } else if (type === "fertilizer") {
                    setIsFertilizing(true);
                    setTimeout(() => setIsFertilizing(false), 1000);
                  }
                }}
                soilOK={data.pH >= 6.0 && data.pH <= 7.0}
                isDark={isDarkMode}
              />
            </section>

            {/* Start Button */}
            {(waterValue > 0 || fertilizerValue > 0) && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleStart}
                disabled={isStarted}
                whileHover={!isStarted ? { scale: 1.02 } : {}}
                whileTap={!isStarted ? { scale: 0.98 } : {}}
                className={`w-full rounded-xl text-white py-4 lg:py-6 text-lg lg:text-xl font-bold transition-all shadow-lg ${
                  isStarted
                    ? "bg-gray-500 cursor-not-allowed opacity-70"
                    : "bg-[#7faf3b] hover:bg-[#6a9331] active:scale-95"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isStarted ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-xl"
                      >
                        ⏳
                      </motion.span>
                      <span>Starting Fertigation...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🚀</span>
                      <span>Start Fertigation</span>
                    </>
                  )}
                </div>
              </motion.button>
            )}
          </div>

          {/* Right Panel - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-2">
            <RightPanel
              waterValue={waterValue}
              fertilizerValue={fertilizerValue}
              isStarted={isStarted}
              showSuccess={showSuccess}
              isDark={isDarkMode}
            />
          </div>
        </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          >
            <div className={`rounded-3xl p-8 mx-4 text-center shadow-2xl transition-colors duration-300 ${
              isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}>
              <div className="text-6xl mb-4">✅</div>
              <p className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>Good!</p>
              <p className={`text-base transition-colors duration-300 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>Your farm is getting healthier.</p>
            </div>
          </motion.div>
        )}
      </main>
        </div>
  );
}
