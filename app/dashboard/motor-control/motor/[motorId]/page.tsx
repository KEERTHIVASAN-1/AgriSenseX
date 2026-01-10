"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { publishMessage, subscribeToTopic } from "../../../../../lib/mqttClient";
import ModeStatus from "../../../../components/ModeStatus";

type MotorDetailsPageProps = {
  params: Promise<{
    motorId: string;
  }>;
};

function formatMotorLabel(motorId: string) {
  const parts = motorId.split("-");
  if (parts.length === 2 && parts[0].toLowerCase() === "motor") {
    return `Motor ${parts[1]}`;
  }
  return motorId.replace(/-/g, " ");
}

function getMotorIndex(motorId: string): number | null {
  const parts = motorId.split("-");
  if (parts.length === 2 && parts[0].toLowerCase() === "motor") {
    const idx = parseInt(parts[1], 10);
    return Number.isNaN(idx) ? null : idx;
  }
  return null;
}

export default function MotorDetailsPage({ params }: MotorDetailsPageProps) {
  const router = useRouter();
  const { motorId } = use(params);
  const label = formatMotorLabel(motorId);
  const motorIndex = getMotorIndex(motorId);
  const [mode, setMode] = useState<"manual" | "auto">(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem(`motor_${label}_mode`);
      if (savedMode === "auto" || savedMode === "manual") {
        return savedMode;
      }
    }
    return "manual";
  });
  
  const [onTime, setOnTime] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMotors = localStorage.getItem("motors");
      if (savedMotors) {
        try {
          const motors = JSON.parse(savedMotors);
          const motorKey = label; // e.g., "Motor 1"
          if (motors[motorKey] && motors[motorKey].onTime) {
            return motors[motorKey].onTime;
          }
        } catch (e) {
          console.error("Error loading motor state:", e);
        }
      }
    }
    return "06:00";
  });
  const [offTime, setOffTime] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMotors = localStorage.getItem("motors");
      if (savedMotors) {
        try {
          const motors = JSON.parse(savedMotors);
          const motorKey = label; // e.g., "Motor 1"
          if (motors[motorKey] && motors[motorKey].offTime) {
            return motors[motorKey].offTime;
          }
        } catch (e) {
          console.error("Error loading motor state:", e);
        }
      }
    }
    return "18:00";
  });
  const [isRunning, setIsRunning] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMotors = localStorage.getItem("motors");
      if (savedMotors) {
        try {
          const motors = JSON.parse(savedMotors);
          const motorKey = label; // e.g., "Motor 1"
          if (motors[motorKey] && typeof motors[motorKey].isOn === "boolean") {
            return motors[motorKey].isOn;
          }
        } catch (e) {
          console.error("Error loading motor state:", e);
        }
      }
    }
    return false;
  });

  // Timer state for AUTO mode - declared after state variables
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modeRef = useRef<"manual" | "auto">(mode);
  const onTimeRef = useRef<string>(onTime);
  const offTimeRef = useRef<string>(offTime);
  const lastMotorCommandRef = useRef<"ON" | "OFF" | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  
  useEffect(() => {
    onTimeRef.current = onTime;
  }, [onTime]);
  
  useEffect(() => {
    offTimeRef.current = offTime;
  }, [offTime]);

  // Subscribe to MQTT status for Motor 1 and Motor 2
  useEffect(() => {
    if (motorIndex !== 1 && motorIndex !== 2) {
      return;
    }

    const topic =
      motorIndex === 1
        ? "anuja/esp32/motor/status"
        : "anuja/esp32/motor2/status";

    const unsubscribe = subscribeToTopic(topic, (payload) => {
      const isOn =
        payload.trim().toUpperCase() === "ON" ||
        payload.trim() === "1" ||
        payload.trim().toLowerCase() === "true";

      setIsRunning(isOn);

      if (typeof window !== "undefined") {
        const savedMotors = localStorage.getItem("motors");
        const motors = savedMotors ? JSON.parse(savedMotors) : {};
        const currentMotor = motors[label] || {};
        // Preserve existing onTime/offTime from localStorage, or use defaults
        motors[label] = {
          ...currentMotor,
          isOn,
          onTime: currentMotor.onTime || "06:00",
          offTime: currentMotor.offTime || "18:00",
        };
        localStorage.setItem("motors", JSON.stringify(motors));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [label, motorIndex]);

  const updateMotorTime = (field: "onTime" | "offTime", value: string) => {
    if (field === "onTime") {
      setOnTime(value);
    } else {
      setOffTime(value);
    }

    // Save to localStorage
    if (typeof window !== "undefined") {
      const savedMotors = localStorage.getItem("motors");
      const motors = savedMotors ? JSON.parse(savedMotors) : {};
      motors[label] = {
        ...motors[label],
        [field]: value,
        isOn: isRunning,
      };
      localStorage.setItem("motors", JSON.stringify(motors));
    }
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
    checkAndUpdateMotor();

    // Then run every 5 seconds for better accuracy when crossing time boundaries
    autoTimerRef.current = setInterval(() => {
      checkAndUpdateMotor();
    }, 5000);
  };

  // Check current time and update motor based on AUTO schedule
  const checkAndUpdateMotor = () => {
    if (modeRef.current !== "auto" || motorIndex === null || (motorIndex !== 1 && motorIndex !== 2)) {
      return;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const shouldBeOn = isTimeInRange(currentTime, onTimeRef.current, offTimeRef.current);
    const topic =
      motorIndex === 1
        ? "anuja/esp32/motor/control"
        : "anuja/esp32/motor2/control";

    const command: "ON" | "OFF" = shouldBeOn ? "ON" : "OFF";
    const lastCommand = lastMotorCommandRef.current;

    // Only publish if command changed
    if (lastCommand !== command) {
      publishMessage(topic, command);
      lastMotorCommandRef.current = command;
      // Update local state (MQTT status will sync when response arrives)
    }
  };

  // Stop AUTO timer
  const stopAutoTimer = () => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    // Reset last command
    lastMotorCommandRef.current = null;
  };

  // Handle mode switch to MANUAL
  const setManual = () => {
    stopAutoTimer();
    // Send MANUAL command to ESP32
    if (motorIndex === 1 || motorIndex === 2) {
      const topic =
        motorIndex === 1
          ? "anuja/esp32/motor/control"
          : "anuja/esp32/motor2/control";
      publishMessage(topic, "MANUAL");
    }
    setMode("manual");
    if (typeof window !== "undefined") {
      localStorage.setItem(`motor_${label}_mode`, "manual");
    }
  };

  // Handle mode switch to AUTO
  const setAuto = () => {
    setMode("auto");
    if (typeof window !== "undefined") {
      localStorage.setItem(`motor_${label}_mode`, "auto");
    }
    // Timer will start when SAVE AUTO is clicked
    // Don't start timer automatically - user must click SAVE AUTO
  };

  // Save AUTO settings and start timer
  const saveAuto = () => {
    // Validate: startTime and endTime must be different
    if (onTime === offTime) {
      alert("Start time and end time cannot be the same");
      return;
    }

    // Validate: both times must be provided
    if (!onTime || !offTime) {
      alert("Please select both start and end time");
      return;
    }

    // Save to localStorage (already done by updateMotorTime)
    // Also send AUTO command to ESP32 in format: AUTO,startTime,endTime
    if (motorIndex === 1 || motorIndex === 2) {
      const topic =
        motorIndex === 1
          ? "anuja/esp32/motor/control"
          : "anuja/esp32/motor2/control";
      const payload = `AUTO,${onTime},${offTime}`;
      publishMessage(topic, payload);
    }

    // Start/restart the timer
    if (mode === "auto") {
      startAutoTimer();
      alert("Auto mode activated for " + label);
    }
  };

  const handlePowerChange = (desiredState: boolean) => {
    // Only allow manual control in MANUAL mode
    if (mode !== "manual") {
      return;
    }

    // Update state immediately
    setIsRunning(desiredState);

    // Save to localStorage immediately
    if (typeof window !== "undefined") {
      const savedMotors = localStorage.getItem("motors");
      const motors = savedMotors ? JSON.parse(savedMotors) : {};
      const currentMotor = motors[label] || {};
      // Preserve existing onTime/offTime from localStorage, or use current state values
      motors[label] = {
        ...currentMotor,
        isOn: desiredState,
        onTime: currentMotor.onTime || onTime,
        offTime: currentMotor.offTime || offTime,
      };
      localStorage.setItem("motors", JSON.stringify(motors));
    }

    // Publish to MQTT
    if (motorIndex === 1 || motorIndex === 2) {
      const topic =
        motorIndex === 1
          ? "anuja/esp32/motor/control"
          : "anuja/esp32/motor2/control";
      publishMessage(topic, desiredState ? "ON" : "OFF");
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopAutoTimer();
    };
  }, []);

  // Handle mode changes and auto-start timer if already in AUTO mode with valid times
  useEffect(() => {
    if (mode === "auto") {
      // Check if times are valid
      const hasValidTimes = onTime && offTime && onTime !== offTime;
      
      // If AUTO mode is active and times are configured, start the timer
      // (User can still click SAVE AUTO to update times and restart timer)
      if (hasValidTimes) {
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
  }, [mode, onTime, offTime]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0]">
      {/* Top header bar */}
      <header className="w-full border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-9xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-lime-300 to-lime-400 text-green-900 transition-all hover:scale-110 active:scale-95 shadow-md"
              aria-label="Go back"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-wide text-gray-900">
                {label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ModeStatus />
            <button className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 text-lg sm:text-xl shadow-sm">
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-9xl flex-1 flex-col px-4 sm:px-6 lg:px-8 pb-10 pt-6">
        {/* Mode Toggle */}
        <section className="mb-6">
          <div className="flex rounded-2xl bg-green-50 p-1 max-w-md">
            <button
              onClick={setManual}
              className={`flex-1 rounded-xl py-3 font-bold ${
                mode === "manual"
                  ? "bg-green-700 text-white shadow"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              Manual
            </button>
            <button
              onClick={setAuto}
              className={`flex-1 rounded-xl py-3 font-bold ${
                mode === "auto"
                  ? "bg-green-700 text-white shadow"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              Auto
            </button>
          </div>
        </section>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Motor Status and Details */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Motor Configuration</h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  {/* Motor Icon - Green when active, Red when off */}
                  <div className="flex justify-center mb-3">
                    <div className={`flex h-24 w-24 items-center justify-center 
                      rounded-2xl shadow-md transition-transform ${
                      isRunning
                        ? "bg-gradient-to-br from-green-100 to-green-200"
                        : "bg-gradient-to-br from-red-100 to-red-200"
                    }`}>
                      <img 
                        src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021968/icons8-motor-50_ooixaf.png" 
                        alt="Motor Icon" 
                        width={60} 
                        height={60} 
                        className="object-contain"
                        style={{
                          filter: isRunning 
                            ? 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(88deg) brightness(118%) contrast(119%)'
                            : 'brightness(0) saturate(100%) invert(15%) sepia(94%) saturate(7151%) hue-rotate(350deg) brightness(95%) contrast(88%)'
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isRunning
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {isRunning ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Time Settings - Only visible in AUTO mode */}
                {mode === "auto" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 uppercase">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={onTime}
                        onChange={(e) => updateMotorTime("onTime", e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 uppercase">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={offTime}
                        onChange={(e) => updateMotorTime("offTime", e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={saveAuto}
                      className="w-full rounded-xl py-3 text-center text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-all shadow-md"
                    >
                      SAVE AUTO
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                    Operation Status
                  </p>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isRunning ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                  />
                </div>
                <p
                  className={`text-2xl font-black tracking-tight ${
                    isRunning ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {isRunning ? "SYSTEM ONLINE" : "SYSTEM IDLE"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-3">
                    Diagnostic Summary
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-600">Total Run Time</span>
                      <span className="text-gray-900">428.5 hrs</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-600">Energy Consumption</span>
                      <span className="text-gray-900">1,240 kWh</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-600">Internal Temp</span>
                      <span className="text-green-600">34°C</span>
                    </div>
                  </div>
                </div>

                {/* Manual Mode Controls - Only visible in MANUAL mode */}
                {mode === "manual" && (
                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={() => handlePowerChange(true)}
                      className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                        isRunning
                          ? "bg-green-600 border-green-500 text-white shadow-lg"
                          : "bg-white border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600"
                      }`}
                    >
                      POWER ON
                    </button>

                    <button
                      onClick={() => handlePowerChange(false)}
                      className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                        !isRunning
                          ? "bg-red-600 border-red-500 text-white shadow-lg"
                          : "bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600"
                      }`}
                    >
                      POWER OFF
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-center text-gray-500 font-semibold px-4">
                  EMERGENCY OVERRIDE: Physical stop button located at control
                  panel base.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
