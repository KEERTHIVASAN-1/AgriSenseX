"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function MotorDetailsPage({ params }: MotorDetailsPageProps) {
  const router = useRouter();
  const { motorId } = use(params);
  const label = formatMotorLabel(motorId);
  const [isRunning, setIsRunning] = useState(false);
  const [onTime, setOnTime] = useState("06:00");
  const [offTime, setOffTime] = useState("18:00");

  // Load motor state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMotors = localStorage.getItem("motors");
      if (savedMotors) {
        try {
          const motors = JSON.parse(savedMotors);
          const motorKey = label; // e.g., "Motor 1"
          if (motors[motorKey]) {
            setOnTime(motors[motorKey].onTime || "06:00");
            setOffTime(motors[motorKey].offTime || "18:00");
            setIsRunning(motors[motorKey].isOn || false);
          }
        } catch (e) {
          console.error("Error loading motor state:", e);
        }
      }
    }
  }, [label]);

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

  const toggleMotor = () => {
    const newState = !isRunning;
    setIsRunning(newState);

    // Save to localStorage
    if (typeof window !== "undefined") {
      const savedMotors = localStorage.getItem("motors");
      const motors = savedMotors ? JSON.parse(savedMotors) : {};
      motors[label] = {
        ...motors[label],
        isOn: newState,
        onTime,
        offTime,
      };
      localStorage.setItem("motors", JSON.stringify(motors));
    }
  };

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
            <button className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 text-lg sm:text-xl shadow-sm">
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-9xl flex-1 flex-col px-4 sm:px-6 lg:px-8 pb-10 pt-6">
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
                        src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767162661/water-pump-motor-vector_1049408-13189_huw6tk.png" 
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

                {/* Time Settings */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase">
                      On Time
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
                      Off Time
                    </label>
                    <input
                      type="time"
                      value={offTime}
                      onChange={(e) => updateMotorTime("offTime", e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                    />
                  </div>
                </div>
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

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={toggleMotor}
                    className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                      isRunning
                        ? "bg-green-600 border-green-500 text-white shadow-lg"
                        : "bg-white border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600"
                    }`}
                  >
                    POWER ON
                  </button>

                  <button
                    onClick={toggleMotor}
                    className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                      !isRunning
                        ? "bg-red-600 border-red-500 text-white shadow-lg"
                        : "bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600"
                    }`}
                  >
                    POWER OFF
                  </button>
                </div>

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
