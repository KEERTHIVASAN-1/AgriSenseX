"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ValveDetailsPageProps = {
  params: Promise<{
    valveId: string;
  }>;
};

function formatValveLabel(valveId: string) {
  const parts = valveId.split("-");
  if (parts.length === 2 && parts[0].toLowerCase() === "valve") {
    return `Valve ${parts[1]}`;
  }
  return valveId.replace(/-/g, " ");
}

export default function ValveDetailsPage({ params }: ValveDetailsPageProps) {
  const router = useRouter();
  const { valveId } = use(params);
  const label = formatValveLabel(valveId);
  const [isOpen, setIsOpen] = useState(false);
  const [onTime, setOnTime] = useState("06:00");
  const [offTime, setOffTime] = useState("18:00");
  const [timerDuration, setTimerDuration] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);

  // Load valve state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedValves = localStorage.getItem("valves");
      if (savedValves) {
        try {
          const valves = JSON.parse(savedValves);
          const valveKey = label; // e.g., "Valve 1"
          if (valves[valveKey]) {
            const valve = valves[valveKey];
            setOnTime(valve.onTime || "06:00");
            setOffTime(valve.offTime || "18:00");
            setIsOpen(valve.isOn || false);
            setTimerDuration(valve.timerDuration || 30);
            setTimerActive(valve.timerActive || false);
            setTimerRemaining(valve.timerRemaining || 0);
          }
        } catch (e) {
          console.error("Error loading valve state:", e);
        }
      }
    }
  }, [label]);

  // Timer countdown
  useEffect(() => {
    if (timerActive && timerRemaining > 0) {
      const interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setIsOpen(false);
            // Save to localStorage
            if (typeof window !== "undefined") {
              const savedValves = localStorage.getItem("valves");
              const valves = savedValves ? JSON.parse(savedValves) : {};
              valves[label] = {
                ...valves[label],
                timerActive: false,
                timerRemaining: 0,
                isOn: false,
              };
              localStorage.setItem("valves", JSON.stringify(valves));
              // Trigger custom event for same-tab updates
              window.dispatchEvent(new CustomEvent("valvesUpdated"));
            }
            return 0;
          }
          // Save timer remaining on each tick
          const newRemaining = prev - 1;
          if (typeof window !== "undefined") {
            const savedValves = localStorage.getItem("valves");
            const valves = savedValves ? JSON.parse(savedValves) : {};
            valves[label] = {
              ...valves[label],
              timerRemaining: newRemaining,
            };
            localStorage.setItem("valves", JSON.stringify(valves));
            // Trigger custom event for same-tab updates
            window.dispatchEvent(new CustomEvent("valvesUpdated"));
          }
          return newRemaining;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timerRemaining, label]);

  const updateValveTime = (field: "onTime" | "offTime", value: string) => {
    if (field === "onTime") {
      setOnTime(value);
    } else {
      setOffTime(value);
    }

    // Save to localStorage
    if (typeof window !== "undefined") {
      const savedValves = localStorage.getItem("valves");
      const valves = savedValves ? JSON.parse(savedValves) : {};
      valves[label] = {
        ...valves[label],
        [field]: value,
        isOn: isOpen,
        timerDuration,
        timerActive,
        timerRemaining,
      };
      localStorage.setItem("valves", JSON.stringify(valves));
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new CustomEvent("valvesUpdated"));
    }
  };

  const updateTimerDuration = (value: number) => {
    setTimerDuration(value);
    // Save to localStorage
    if (typeof window !== "undefined") {
      const savedValves = localStorage.getItem("valves");
      const valves = savedValves ? JSON.parse(savedValves) : {};
      valves[label] = {
        ...valves[label],
        timerDuration: value,
        isOn: isOpen,
        onTime,
        offTime,
        timerActive,
        timerRemaining,
      };
      localStorage.setItem("valves", JSON.stringify(valves));
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new CustomEvent("valvesUpdated"));
    }
  };

  const toggleValve = () => {
    const newState = !isOpen;
    let newTimerActive = timerActive;
    let newTimerRemaining = timerRemaining;

    // If opening the valve, start the timer
    if (newState && !timerActive) {
      newTimerActive = true;
      newTimerRemaining = timerDuration * 60;
      setTimerActive(true);
      setTimerRemaining(timerDuration * 60);
    }
    
    // If closing the valve, stop the timer
    if (!newState && timerActive) {
      newTimerActive = false;
      newTimerRemaining = 0;
      setTimerActive(false);
      setTimerRemaining(0);
    }

    setIsOpen(newState);

    // Save to localStorage
    if (typeof window !== "undefined") {
      const savedValves = localStorage.getItem("valves");
      const valves = savedValves ? JSON.parse(savedValves) : {};
      valves[label] = {
        ...valves[label],
        isOn: newState,
        onTime,
        offTime,
        timerDuration,
        timerActive: newTimerActive,
        timerRemaining: newTimerRemaining,
      };
      localStorage.setItem("valves", JSON.stringify(valves));
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new CustomEvent("valvesUpdated"));
    }
  };

  const startTimer = () => {
    setTimerActive(true);
    setTimerRemaining(timerDuration * 60);
    setIsOpen(true);

    // Save to localStorage
    if (typeof window !== "undefined") {
      const savedValves = localStorage.getItem("valves");
      const valves = savedValves ? JSON.parse(savedValves) : {};
      valves[label] = {
        ...valves[label],
        timerActive: true,
        timerRemaining: timerDuration * 60,
        isOn: true,
      };
      localStorage.setItem("valves", JSON.stringify(valves));
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new CustomEvent("valvesUpdated"));
    }
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTimerRemaining(0);
    setIsOpen(false); // Close the valve when timer stops

    // Save to localStorage
    if (typeof window !== "undefined") {
      const savedValves = localStorage.getItem("valves");
      const valves = savedValves ? JSON.parse(savedValves) : {};
      valves[label] = {
        ...valves[label],
        timerActive: false,
        timerRemaining: 0,
        isOn: false,
      };
      localStorage.setItem("valves", JSON.stringify(valves));
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new CustomEvent("valvesUpdated"));
    }
  };

  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

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
              <span className="text-[9px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-green-600">
                Valve Control
              </span>
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
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Irrigation Valve Controller
          </h1>
          <p className="text-sm text-gray-600">
            Node ID: {label || "V-01"} | System Health: Nominal
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Valve Configuration */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Valve Configuration</h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-base font-bold sm:text-lg text-gray-900">
                    {label}
                  </span>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isOpen
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {isOpen ? "Open" : "Closed"}
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
                      onChange={(e) => updateValveTime("onTime", e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase">
                      Off Time
                    </label>
                    <input
                      type="time"
                      value={offTime}
                      onChange={(e) => updateValveTime("offTime", e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Timer Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase">
                      Timer Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={timerDuration}
                      onChange={(e) => updateTimerDuration(parseInt(e.target.value) || 0)}
                      disabled={timerActive}
                      className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  {/* Timer Display and Controls */}
                  {timerActive ? (
                    <div className="space-y-3">
                      <div className="rounded-lg bg-blue-100 p-4 text-center border border-blue-200">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                          Time Remaining
                        </p>
                        <p className="text-3xl font-mono font-bold text-blue-600">
                          {timerDisplay}
                        </p>
                      </div>
                      <button
                        onClick={stopTimer}
                        className="w-full py-3 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all"
                      >
                        Stop Timer
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startTimer}
                      disabled={timerDuration <= 0}
                      className="w-full py-3 rounded-lg bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      Start Timer
                    </button>
                  )}
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
                      isOpen ? "bg-blue-500 animate-pulse" : "bg-gray-400"
                    }`}
                  />
                </div>
                <p
                  className={`text-2xl font-black tracking-tight ${
                    isOpen ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {isOpen ? "VALVE OPEN" : "VALVE CLOSED"}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={toggleValve}
                  className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                    isOpen
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                      : "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  OPEN VALVE
                </button>

                <button
                  onClick={toggleValve}
                  className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                    !isOpen
                      ? "bg-rose-600 border-rose-500 text-white shadow-lg"
                      : "bg-white border-gray-300 text-gray-600 hover:border-rose-400 hover:text-rose-600"
                  }`}
                >
                  CLOSE VALVE
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
