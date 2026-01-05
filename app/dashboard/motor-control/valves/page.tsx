"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

type ValveState = {
  isOn: boolean;
  onTime: string;
  offTime: string;
  timerDuration: number;
  timerActive: boolean;
  timerRemaining: number;
};

export default function ValvePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "auto">("manual");

  const [valves, setValves] = useState<Record<string, ValveState>>({
    "Valve 1": { isOn: false, onTime: "06:00", offTime: "18:00", timerDuration: 30, timerActive: false, timerRemaining: 0 },
    "Valve 2": { isOn: false, onTime: "06:00", offTime: "18:00", timerDuration: 30, timerActive: false, timerRemaining: 0 },
    "Valve 3": { isOn: false, onTime: "06:00", offTime: "18:00", timerDuration: 30, timerActive: false, timerRemaining: 0 },
  });

  const [expandedValves, setExpandedValves] = useState<Record<string, boolean>>({});

  const toggleValveExpand = (valve: string) => {
    setExpandedValves((prev) => ({ ...prev, [valve]: !prev[valve] }));
  };

  const toggleValve = (name: string) => {
    setValves((p) => {
      const v = p[name];
      const newIsOn = !v.isOn;
      let updated;
      
      // If opening the valve, start the timer
      if (newIsOn && !v.timerActive) {
        updated = {
          ...p,
          [name]: {
            ...v,
            isOn: true,
            timerActive: true,
            timerRemaining: v.timerDuration * 60,
          },
        };
      }
      // If closing the valve, stop the timer
      else if (!newIsOn && v.timerActive) {
        updated = {
          ...p,
          [name]: {
            ...v,
            isOn: false,
            timerActive: false,
            timerRemaining: 0,
          },
        };
      }
      // Otherwise just toggle the state
      else {
        updated = { ...p, [name]: { ...v, isOn: newIsOn } };
      }
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("valves", JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  const updateValveTime = (name: string, field: "onTime" | "offTime", v: string) =>
    setValves((p) => ({ ...p, [name]: { ...p[name], [field]: v } }));

  const updateValveTimerDuration = (name: string, d: number) =>
    setValves((p) => ({ ...p, [name]: { ...p[name], timerDuration: d } }));

  const startValveTimer = (name: string) =>
    setValves((p) => {
      const v = p[name];
      return {
        ...p,
        [name]: { ...v, timerActive: true, timerRemaining: v.timerDuration * 60, isOn: true },
      };
    });

  const stopValveTimer = (name: string) =>
    setValves((p) => ({
      ...p,
      [name]: { ...p[name], timerActive: false, timerRemaining: 0, isOn: false },
    }));

  useEffect(() => {
    const interval = setInterval(() => {
      setValves((prev) => {
        const u = { ...prev };
        Object.keys(u).forEach((k) => {
          const v = u[k];
          if (v.timerActive && v.timerRemaining > 0) {
            u[k] = { ...v, timerRemaining: v.timerRemaining - 1 };
            if (v.timerRemaining <= 1)
              u[k] = { ...v, timerActive: false, timerRemaining: 0, isOn: false };
          }
        });
        return u;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
                  Valve Control
                </h1>
                <p className="text-sm text-green-700">
                  Valve Management System
                </p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 border border-green-300">
              ⚙️
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Mode Toggle */}
        <section className="mb-6">
          <div className="flex rounded-2xl bg-green-50  p-1">
            <button
              onClick={() => setMode("manual")}
              className={`flex-1 rounded-xl py-3 font-bold ${
                mode === "manual"
                  ? "bg-green-700 text-white shadow"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setMode("auto")}
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

        {/* Valves section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">
              Valve Control
            </h2>
            <span className="text-xs text-gray-400 sm:text-sm">
              {mode === "manual" ? "Manual Mode" : "Auto Mode"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["Valve 1", "Valve 2", "Valve 3"].map((valve) => {
              const valveState = valves[valve];
              const isExpanded = expandedValves[valve] || false;
              const minutes = Math.floor(valveState.timerRemaining / 60);
              const seconds = valveState.timerRemaining % 60;
              const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

              return (
                <div
                  key={valve}
                  onClick={() => toggleValveExpand(valve)}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-black shadow-lg transition-all hover:shadow-2xl cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* Valve Icon */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-200 to-indigo-200 shadow-md transition-transform group-hover:scale-110">
                        <span className="text-4xl">
                          <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767022401/icons8-valve-64_xhtuoh.png" alt="Valve Icon" width={40} height={40} className="opacity-90 object-contain" />
                        </span>
                      </div>
                    </div>

                    {/* Single Open/Closed Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleValve(valve);
                      }}
                      className={`w-full rounded-xl py-3 text-center text-sm font-bold transition-all shadow-md ${
                        valveState.isOn
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
                      }`}
                    >
                      {valveState.isOn ? "OPEN" : "CLOSED"}
                    </button>

                    {/* Collapsible Details Section */}
                    {isExpanded && (
                      <div className="w-full space-y-3 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center">
                          <span className="text-base font-bold sm:text-lg">
                            {valve}
                          </span>
                          <div className="mt-2 flex items-center justify-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                valveState.isOn
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                            <span className="text-xs text-gray-600">
                              {valveState.isOn ? "Open" : "Closed"}
                            </span>
                          </div>
                        </div>

                        {/* Timer Section */}
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-600 uppercase">
                              Timer Duration (minutes)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="1440"
                              value={valveState.timerDuration}
                              onChange={(e) =>
                                updateValveTimerDuration(
                                  valve,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              disabled={valveState.timerActive}
                              className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                            />
                          </div>

                          {/* Timer Display and Controls */}
                          {valveState.timerActive ? (
                            <div className="space-y-2">
                              <div className="rounded-lg bg-blue-100 p-3 text-center">
                                <p className="text-[10px] font-semibold text-gray-600 uppercase mb-1">
                                  Time Remaining
                                </p>
                                <p className="text-2xl font-mono font-bold text-blue-600">
                                  {timerDisplay}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  stopValveTimer(valve);
                                }}
                                className="w-full py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
                              >
                                Stop Timer
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                startValveTimer(valve);
                              }}
                              disabled={valveState.timerDuration <= 0}
                              className="w-full py-2 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                              Start Timer
                            </button>
                          )}

                          {/* Scheduled Times */}
                          <div className="space-y-1.5 pt-2 border-t border-gray-200">
                            <label className="text-[10px] font-semibold text-gray-600 uppercase">
                              On Time
                            </label>
                            <input
                              type="time"
                              value={valveState.onTime}
                              onChange={(e) =>
                                updateValveTime(valve, "onTime", e.target.value)
                              }
                              className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-600 uppercase">
                              Off Time
                            </label>
                            <input
                              type="time"
                              value={valveState.offTime}
                              onChange={(e) =>
                                updateValveTime(valve, "offTime", e.target.value)
                              }
                              className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 transition-all group-hover:from-blue-500/5 group-hover:to-indigo-500/5 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

