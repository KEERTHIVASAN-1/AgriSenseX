"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { publishMessage, subscribeToTopic } from "../../../../lib/mqttClient";
import ModeStatus from "../../../components/ModeStatus";

type MotorState = {
  isOn: boolean;
  onTime: string;
  offTime: string;
};

export default function MotorsPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "auto">("manual");
  
  // Timer state for AUTO mode
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modeRef = useRef<"manual" | "auto">(mode);
  const lastMotorCommandsRef = useRef<Record<string, "ON" | "OFF" | null>>({
    "Motor 1": null,
    "Motor 2": null,
    "Motor 3": null,
    "Motor 4": null,
  });

  // Keep modeRef in sync with mode state
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const [motors, setMotors] = useState<Record<string, MotorState>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("motors");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading motors:", e);
        }
      }
    }
    return {
      "Motor 1": { isOn: false, onTime: "06:00", offTime: "18:00" },
      "Motor 2": { isOn: false, onTime: "06:00", offTime: "18:00" },
      "Motor 3": { isOn: false, onTime: "06:00", offTime: "18:00" },
      "Motor 4": { isOn: false, onTime: "06:00", offTime: "18:00" },
    };
  });

  useEffect(() => {
    const unsubscribeMotor1 = subscribeToTopic(
      "anuja/esp32/motor/status",
      (payload) => {
        const isOn =
          payload.trim().toUpperCase() === "ON" ||
          payload.trim() === "1" ||
          payload.trim().toLowerCase() === "true";

        setMotors((prev) => {
          const updated = {
            ...prev,
            "Motor 1": {
              ...prev["Motor 1"],
              isOn,
            },
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("motors", JSON.stringify(updated));
          }
          return updated;
        });
      }
    );

    const unsubscribeMotor2 = subscribeToTopic(
      "anuja/esp32/motor2/status",
      (payload) => {
        const isOn =
          payload.trim().toUpperCase() === "ON" ||
          payload.trim() === "1" ||
          payload.trim().toLowerCase() === "true";

        setMotors((prev) => {
          const updated = {
            ...prev,
            "Motor 2": {
              ...prev["Motor 2"],
              isOn,
            },
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("motors", JSON.stringify(updated));
          }
          return updated;
        });
      }
    );

    return () => {
      unsubscribeMotor1();
      unsubscribeMotor2();
    };
  }, []);

  const toggleMotor = (name: string, index: number) => {
    setMotors((p) => {
      const updated = { ...p, [name]: { ...p[name], isOn: !p[name].isOn } };
      if (typeof window !== "undefined") {
        localStorage.setItem("motors", JSON.stringify(updated));
      }

      if (mode === "manual") {
        const topic =
          index === 0
            ? "anuja/esp32/motor/control"
            : index === 1
            ? "anuja/esp32/motor2/control"
            : null;

        if (topic) {
          const isOn = updated[name].isOn;
          publishMessage(topic, isOn ? "ON" : "OFF");
        }
      }

      return updated;
    });
  };

  const updateMotorTime = (name: string, field: "onTime" | "offTime", v: string) => {
    setMotors((p) => {
      const updated = { ...p, [name]: { ...p[name], [field]: v } };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("motors", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Helper function to check if current time is within range (handles overnight)
  // Motor should be ON when: startTime <= currentTime < endTime
  // At endTime exactly, motor should turn OFF
  const isTimeInRange = (currentTime: string, startTime: string, endTime: string): boolean => {
    const [currentH, currentM] = currentTime.split(":").map(Number);
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const currentMinutes = currentH * 60 + currentM;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // Handle overnight range (e.g., 22:00 to 05:00)
    if (endMinutes <= startMinutes) {
      // Overnight range: ON if current >= startTime OR current < endTime
      // Example: 22:00 to 05:00
      // - At 22:00 → ON (current >= start)
      // - At 23:59 → ON (current >= start)
      // - At 04:59 → ON (current < end)
      // - At 05:00 → OFF (current >= end and current < start)
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    } else {
      // Normal range: ON if current >= startTime AND current < endTime
      // Example: 06:00 to 18:00
      // - At 06:00 → ON (current >= start)
      // - At 17:59 → ON (current < end)
      // - At 18:00 → OFF (current >= end)
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }
  };

  // AUTO mode timer loop - runs every 5 seconds for better accuracy
  const startAutoTimer = () => {
    // Clear any existing timer
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
    }

    // Run immediately on start
    checkAndUpdateMotors();

    // Then run every 5 seconds for better accuracy when crossing time boundaries
    autoTimerRef.current = setInterval(() => {
      checkAndUpdateMotors();
    }, 5000);
  };

  // Check current time and update motors based on AUTO schedule
  const checkAndUpdateMotors = () => {
    if (modeRef.current !== "auto") return;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setMotors((prev) => {
      const updated = { ...prev };
      let hasChanges = false;

      ["Motor 1", "Motor 2", "Motor 3", "Motor 4"].forEach((motorName, idx) => {
        const motor = prev[motorName];
        if (!motor) return;

        const shouldBeOn = isTimeInRange(currentTime, motor.onTime, motor.offTime);
        const motorIndex = idx;
        const topic =
          motorIndex === 0
            ? "anuja/esp32/motor/control"
            : motorIndex === 1
            ? "anuja/esp32/motor2/control"
            : null;

        if (topic) {
          const command: "ON" | "OFF" = shouldBeOn ? "ON" : "OFF";
          const lastCommand = lastMotorCommandsRef.current[motorName];

          // Only publish if command changed
          if (lastCommand !== command) {
            publishMessage(topic, command);
            lastMotorCommandsRef.current[motorName] = command;
            hasChanges = true;
          }
        }
      });

      if (hasChanges && typeof window !== "undefined") {
        localStorage.setItem("motors", JSON.stringify(updated));
      }

      return updated;
    });
  };

  // Stop AUTO timer
  const stopAutoTimer = () => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    // Reset last commands
    lastMotorCommandsRef.current = {
      "Motor 1": null,
      "Motor 2": null,
      "Motor 3": null,
      "Motor 4": null,
    };
  };

  // Handle mode switch to MANUAL
  const setManual = () => {
    stopAutoTimer();
    // Send MANUAL command to ESP32
    publishMessage("anuja/esp32/motor/control", "MANUAL");
    setMode("manual");
  };

  // Handle mode switch to AUTO
  const setAuto = () => {
    setMode("auto");
    // Timer will start when SAVE AUTO is clicked
    // Don't start timer automatically - user must click SAVE AUTO for each motor
  };

  // Save AUTO settings and start timer
  const saveAuto = (motorName: string) => {
    const motor = motors[motorName];
    if (!motor) return;

    // Validate: startTime and endTime must be different
    if (motor.onTime === motor.offTime) {
      alert("Start time and end time cannot be the same");
      return;
    }

    // Validate: both times must be provided
    if (!motor.onTime || !motor.offTime) {
      alert("Please select both start and end time");
      return;
    }

    // Save to localStorage (already done by updateMotorTime)
    // Also send AUTO command to ESP32 in format: AUTO,startTime,endTime
    const motorIndex = ["Motor 1", "Motor 2", "Motor 3", "Motor 4"].indexOf(motorName);
    if (motorIndex === 0 || motorIndex === 1) {
      const topic =
        motorIndex === 0
          ? "anuja/esp32/motor/control"
          : "anuja/esp32/motor2/control";
      const payload = `AUTO,${motor.onTime},${motor.offTime}`;
      publishMessage(topic, payload);
    }

    // Start/restart the timer
    if (mode === "auto") {
      startAutoTimer();
      alert("Auto mode activated for " + motorName);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopAutoTimer();
    };
  }, []);

  // Handle mode changes and auto-start timer if already in AUTO mode
  useEffect(() => {
    if (mode === "auto") {
      // Check if any motor has valid times configured
      const hasAutoConfig = Object.values(motors).some(
        (motor) => motor.onTime && motor.offTime && motor.onTime !== motor.offTime
      );
      
      // If AUTO mode is active and times are configured, start the timer
      // (User can still click SAVE AUTO to update times and restart timer)
      if (hasAutoConfig) {
        // Start timer after a short delay to ensure mode is set
        const timer = setTimeout(() => {
          if (modeRef.current === "auto") {
            startAutoTimer();
          }
        }, 500);
        
        return () => clearTimeout(timer);
      }
    } else if (mode === "manual") {
      stopAutoTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, motors]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-9xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                aria-label="Go back"
                className="group flex h-10 w-10 items-center justify-center rounded-2xl
                          bg-gradient-to-br from-[#7faf3b] to-[#6a9331]
                          text-white shadow-md ring-1 ring-black/5
                          transition-all hover:shadow-lg hover:-translate-x-0.5 active:scale-95"
              >
                <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  Motors
                </h1>
                <p className="text-sm text-green-700">
                  Motor Control Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ModeStatus />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 border border-green-300">
                ⚙️
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Mode Toggle */}
        <section className="mb-6">
          <div className="flex rounded-full bg-green-50 p-1">
            <button
              onClick={setManual}
              className={`flex-1 rounded-full py-3 font-bold ${
                mode === "manual"
                  ? "bg-green-700 text-white shadow"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              Manual
            </button>
            <button
              onClick={setAuto}
              className={`flex-1 rounded-full py-3 font-bold ${
                mode === "auto"
                  ? "bg-green-700 text-white shadow"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              Auto
            </button>
          </div>
        </section>

        {/* Motors grid - enhanced design */}
        <main>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">
              Available Motors
            </h2>
            <span className="text-xs text-gray-400 sm:text-sm">
              {mode === "manual" ? "Manual Mode" : "Auto Mode"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
          {["Motor 1", "Motor 2", "Motor 3", "Motor 4"].map((motor, idx) => {
              const motorState = motors[motor];
              return (
                <div
                  key={motor}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 text-black shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* View Details Link - Top */}
                    <Link
                      href={`/dashboard/motor-control/motor/motor-${idx + 1}`}
                      className="self-end text-xs text-gray-500 hover:text-[#7faf3b] font-semibold transition-colors z-10"
                    >
                      View Details →
                    </Link>

                    {/* Motor Icon - Green when active, Red when off */}
                    <div className="flex flex-col items-center gap-3">
                      <div className={`flex h-20 w-20 items-center justify-center 
                        rounded-2xl shadow-md transition-transform group-hover:scale-110 ${
                        motorState.isOn
                          ? "bg-gradient-to-br from-green-100 to-green-200"
                          : "bg-gradient-to-br from-red-100 to-red-200"
                      }`}>
                        <span className="text-4xl">
                          <img 
                            src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021968/icons8-motor-50_ooixaf.png" 
                            alt="Motor Icon" 
                            width={40} 
                            height={40} 
                            className={`object-contain ${
                              motorState.isOn
                                ? "opacity-90 brightness-0 saturate-100 hue-rotate-[200deg]"
                                : "opacity-90 brightness-0 saturate-100 hue-rotate-[0deg]"
                            }`}
                            style={{
                              filter: motorState.isOn 
                                ? 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(88deg) brightness(118%) contrast(119%)'
                                : 'brightness(0) saturate(100%) invert(15%) sepia(94%) saturate(7151%) hue-rotate(350deg) brightness(95%) contrast(88%)'
                            }}
                          />
                        </span>
                      </div>
                    </div>

                    {/* Conditional UI: Manual mode shows ON/OFF, Auto mode shows time inputs + SAVE */}
                    {mode === "manual" ? (
                      <button
                        onClick={() => toggleMotor(motor, idx)}
                        className={`w-full rounded-xl py-3 text-center text-sm font-bold transition-all shadow-md ${
                          motorState.isOn
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
                        }`}
                      >
                        {motorState.isOn ? "ON" : "OFF"}
                      </button>
                    ) : (
                      <div className="w-full space-y-3">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-700">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={motorState.onTime}
                            onChange={(e) => updateMotorTime(motor, "onTime", e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-700">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={motorState.offTime}
                            onChange={(e) => updateMotorTime(motor, "offTime", e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                          />
                        </div>
                        <button
                          onClick={() => saveAuto(motor)}
                          className="w-full rounded-xl py-2.5 text-center text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-all shadow-md"
                        >
                          SAVE AUTO
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7faf3b]/0 to-[#7faf3b]/0 transition-all group-hover:from-[#7faf3b]/5 group-hover:to-[#8ac34a]/5 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

