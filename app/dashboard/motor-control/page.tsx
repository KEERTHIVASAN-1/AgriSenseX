"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

type MotorState = {
  isOn: boolean;
  onTime: string;
  offTime: string;
};

type ValveState = {
  isOn: boolean;
  onTime: string;
  offTime: string;
  timerDuration: number;
  timerActive: boolean;
  timerRemaining: number;
};

export default function MotorControlPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "auto">("manual");
  const [voltage, setVoltage] = useState(100);
  const [current, setCurrent] = useState(11.0);

  const [motors, setMotors] = useState<Record<string, MotorState>>({
    "Motor 1": { isOn: false, onTime: "06:00", offTime: "18:00" },
    "Motor 2": { isOn: false, onTime: "06:00", offTime: "18:00" },
    "Motor 3": { isOn: false, onTime: "06:00", offTime: "18:00" },
    "Motor 4": { isOn: false, onTime: "06:00", offTime: "18:00" },
  });

  const [valves, setValves] = useState<Record<string, ValveState>>({
    "Valve 1": { isOn: false, onTime: "06:00", offTime: "18:00", timerDuration: 30, timerActive: false, timerRemaining: 0 },
    "Valve 2": { isOn: false, onTime: "06:00", offTime: "18:00", timerDuration: 30, timerActive: false, timerRemaining: 0 },
    "Valve 3": { isOn: false, onTime: "06:00", offTime: "18:00", timerDuration: 30, timerActive: false, timerRemaining: 0 },
  });

  const toggleMotor = (name: string) =>
    setMotors((p) => ({ ...p, [name]: { ...p[name], isOn: !p[name].isOn } }));

  const updateMotorTime = (name: string, field: "onTime" | "offTime", v: string) =>
    setMotors((p) => ({ ...p, [name]: { ...p[name], [field]: v } }));

  const toggleValve = (name: string) =>
    setValves((p) => ({ ...p, [name]: { ...p[name], isOn: !p[name].isOn } }));

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
    <div className="flex min-h-screen flex-col bg-white text-gray-900">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-green-200">
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
                  Motor Control
                </h1>
                <p className="text-sm text-green-700">
                  Smart Irrigation Management
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

        {/* Phase Monitoring */}
        <section className="mb-6 rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-green-600">
            Phase Monitoring
          </h2>
          <p className="mt-1 text-lg font-semibold">
            Electrical Output — All Motors
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-green-200 bg-green-50/40">
            <table className="w-full">
              <thead className="bg-green-100 text-green-700 text-[11px] uppercase font-bold">
                <tr>
                  <th className="px-4 py-2 text-left">Phase</th>
                  <th className="px-4 py-2 text-center">Voltage</th>
                  <th className="px-4 py-2 text-right">Current</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-200">
                {[
                  { id: "L1", color: "bg-red-500", v: "239.4", a: "11.0" },
                  { id: "L2", color: "bg-yellow-300", v: "238.5", a: "10.8" },
                  { id: "L3", color: "bg-blue-500", v: "240.4", a: "12.0" },
                ].map((p) => (
                  <tr key={p.id} className="hover:bg-green-50">
                    <td className={`px-4 py-2 font-semibold ${p.color}`}>
                      Phase {p.id}
                    </td>
                    <td className="px-4 py-2 text-center font-mono">{p.v}</td>
                    <td className="px-4 py-2 text-right font-mono">{p.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Safety Parameters */}
        <section className="mb-6 rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">
            Safety Parameters
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 bg-green-50/40 border border-green-200 rounded-xl p-4">

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-green-700 uppercase">
                Voltage Trip Threshold
              </label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-11 rounded-lg border border-green-300 bg-white px-3 font-mono focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-green-700 uppercase">
                Overcurrent Cut-off
              </label>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="w-full h-11 rounded-lg border border-green-300 bg-white px-3 font-mono focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-3">
              <button className="px-5 py-2 rounded-lg text-green-700 font-semibold hover:bg-green-100">
                Reset
              </button>
              <button className="px-5 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 shadow">
                Apply Changes
              </button>
            </div>
          </div>
        </section>

        {/* Mode Toggle */}
        <section className="mb-6">
          <div className="flex rounded-2xl bg-green-50 border border-green-200 p-1">
            <button
              onClick={() => setMode("manual")}
              className={`flex-1 rounded-xl py-3 font-bold ${
                mode === "manual"
                  ? "bg-green-500 text-white shadow"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Motor 1", "Motor 2", "Motor 3", "Motor 4"].map((motor, idx) => {
              const motorState = motors[motor];
              return (
                <div
                  key={motor}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 text-black shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* Motor Icon and Status */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-20 w-20 items-center justify-center 
                        rounded-2xl bg-gradient-to-br from-green-100 to-green-200
                        shadow-md transition-transform group-hover:scale-110">
                        <span className="text-4xl">
                          <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021968/icons8-motor-50_ooixaf.png" alt="Motor Icon" width={40} height={40} className="opacity-90 object-contain" />
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-base font-bold sm:text-lg">
                          {motor}
                        </span>
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              motorState.isOn
                                ? "bg-green-500 animate-pulse"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span className="text-xs text-gray-600">
                            {motorState.isOn ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* On/Off Toggle Tabs */}
                    <div className="flex w-full overflow-hidden rounded-xl bg-gray-200 p-1 shadow-inner">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!motorState.isOn) toggleMotor(motor);
                        }}
                        className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all ${
                          motorState.isOn
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        ON
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (motorState.isOn) toggleMotor(motor);
                        }}
                        className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all ${
                          !motorState.isOn
                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        OFF
                      </button>
                    </div>

                    {/* Time Settings */}
                    <div className="w-full space-y-3 pt-2 border-t border-gray-200">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-gray-600 uppercase">
                          On Time
                        </label>
                        <input
                          type="time"
                          value={motorState.onTime}
                          onChange={(e) =>
                            updateMotorTime(motor, "onTime", e.target.value)
                          }
                          className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-[#7faf3b]/50 focus:border-[#7faf3b] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-gray-600 uppercase">
                          Off Time
                        </label>
                        <input
                          type="time"
                          value={motorState.offTime}
                          onChange={(e) =>
                            updateMotorTime(motor, "offTime", e.target.value)
                          }
                          className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-[#7faf3b]/50 focus:border-[#7faf3b] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* View Details Link */}
                    <Link
                      href={`/dashboard/motor-control/motor-${idx + 1}`}
                      className="text-xs text-gray-500 hover:text-[#7faf3b] font-semibold transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details →
                    </Link>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7faf3b]/0 to-[#7faf3b]/0 transition-all group-hover:from-[#7faf3b]/5 group-hover:to-[#8ac34a]/5 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Valves section */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">
              Valve Control
            </h2>
            <span className="text-xs text-gray-400 sm:text-sm">
              {mode === "manual" ? "Manual Mode" : "Auto Mode"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Valve 1", "Valve 2", "Valve 3"].map((valve) => {
              const valveState = valves[valve];
              const minutes = Math.floor(valveState.timerRemaining / 60);
              const seconds = valveState.timerRemaining % 60;
              const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

              return (
                <div
                  key={valve}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-black shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* Valve Icon and Status */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-200 to-indigo-200 shadow-md transition-transform group-hover:scale-110">
                        <span className="text-4xl">
                          <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767022401/icons8-valve-64_xhtuoh.png" alt="Valve Icon" width={40} height={40} className="opacity-90 object-contain" />
                        </span>
                      </div>
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
                    </div>

                    {/* Open/Closed Toggle Tabs */}
                    <div className="flex w-full overflow-hidden rounded-xl bg-gray-200 p-1 shadow-inner">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!valveState.isOn) toggleValve(valve);
                        }}
                        className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all ${
                          valveState.isOn
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        OPEN
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (valveState.isOn) toggleValve(valve);
                        }}
                        className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all ${
                          !valveState.isOn
                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        CLOSED
                      </button>
                    </div>

                    {/* Timer Section */}
                    <div className="w-full space-y-3 pt-2 border-t border-gray-200">
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
