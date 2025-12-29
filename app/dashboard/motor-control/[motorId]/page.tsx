"use client";

import { use, useState } from "react";
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
  const [voltage, setVoltage] = useState("0");
  const [current, setCurrent] = useState("0");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0c10] via-[#111318] to-[#1a1d24]">
      {/* Top header bar */}
      <header className="w-full border-b border-white/5 bg-gradient-to-r from-[#0f172a]/90 to-[#1e293b]/90 backdrop-blur-xl shadow-lg sticky top-0 z-50">
        <div className="mx-auto flex max-w-9xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7faf3b] to-[#8ec045] text-[#1b290b] transition-all hover:scale-110 active:scale-95 shadow-lg hover:shadow-[#7faf3b]/50"
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

            <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-100 to-lime-200 shadow-md">
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-[#166534] leading-tight text-center">
                Agri
                <br />
                SenseX
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-lime-300">
                Motor Diagnostics
              </span>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-wide text-white">
                {label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95 text-lg sm:text-xl shadow-md">
              ⚙️
            </button>
            <button className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95 text-lg sm:text-xl shadow-md">
              🔌
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-9xl flex-1 flex-col px-4 sm:px-6 lg:px-8 pb-10 pt-6">
        {/* Header Section for Context */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Industrial Pump Controller
          </h1>
          <p className="text-sm text-slate-400">
            Node ID: {label || "WP-01"} | System Health: Nominal
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left Column: Data & Configuration */}
          <div className="space-y-6">
            {/* Power Metrics Card */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Phase Monitoring
                    </h2>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Live Electrical Output
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-500">
                      Average Load
                    </p>
                    <p className="text-xl font-mono font-bold text-white">
                      239<span className="ml-1 text-xs text-slate-400">V</span>{" "}
                      / 11.2
                      <span className="ml-1 text-xs text-slate-400">A</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase Table */}
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold text-slate-500">
                      <th className="px-4 py-3">Phase Identification</th>
                      <th className="px-4 py-3 text-center">Voltage (V)</th>
                      <th className="px-4 py-3 text-right">Amperage (A)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      {
                        id: "L1",
                        v: "239.4",
                        a: "11.0",
                        color: "border-rose-500/50",
                      },
                      {
                        id: "L2",
                        v: "238.5",
                        a: "10.8",
                        color: "border-amber-500/50",
                      },
                      {
                        id: "L3",
                        v: "240.4",
                        a: "12.0",
                        color: "border-cyan-500/50",
                      },
                    ].map((phase) => (
                      <tr
                        key={phase.id}
                        className="group hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-1 border-l-2 ${phase.color}`}
                            ></div>
                            <span className="text-sm font-bold text-slate-300">
                              Phase {phase.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-sm font-semibold text-white">
                          {phase.v}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-white">
                          {phase.a}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Secondary Metrics Bar */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Active Power", value: "5.5 kW" },
                  { label: "Frequency", value: "50.02 Hz" },
                  { label: "Power Factor", value: "0.88" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-slate-800 bg-slate-900/30 p-3"
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-500">
                      {m.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Threshold Configuration */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                Safety Parameters
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Voltage Trip Threshold (±10%)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={voltage}
                      onChange={(e) => setVoltage(e.target.value)}
                      className="w-full h-11 rounded-lg border border-slate-800 bg-slate-900 px-4 font-mono text-sm text-cyan-400 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                    />
                    <span className="text-slate-600 text-sm font-bold">
                      VAC
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Overcurrent Cut-off
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      className="w-full h-11 rounded-lg border border-slate-800 bg-slate-900 px-4 font-mono text-sm text-cyan-400 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                    />
                    <span className="text-slate-600 text-sm font-bold">
                      AMP
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button className="px-6 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors">
                    Discard
                  </button>
                  <button className="px-6 py-2 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 shadow-lg shadow-cyan-950/20 transition-all">
                    Apply Changes
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Master Controls */}
          <aside className="space-y-6">
            <section className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Operation Status
                  </p>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isRunning
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-slate-600"
                    }`}
                  ></span>
                </div>
                <p
                  className={`text-2xl font-black tracking-tight ${
                    isRunning ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {isRunning ? "SYSTEM ONLINE" : "SYSTEM IDLE"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">
                    Diagnostic Summary
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Total Run Time</span>
                      <span className="text-white">428.5 hrs</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Energy Consumption</span>
                      <span className="text-white">1,240 kWh</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Internal Temp</span>
                      <span className="text-emerald-400">34°C</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => setIsRunning(true)}
                    className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                      isRunning
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-400"
                    }`}
                  >
                    POWER ON
                  </button>
                  <button
                    onClick={() => setIsRunning(false)}
                    className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                      !isRunning
                        ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/40"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-rose-500/50 hover:text-rose-400"
                    }`}
                  >
                    POWER OFF
                  </button>
                </div>

                <p className="text-[10px] text-center text-slate-600 font-semibold px-4">
                  EMERGENCY OVERRIDE: Physical stop button located at control
                  panel base.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Decorative gradient orbs */}
      <div className="hidden lg:block pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-20 h-96 w-96 rounded-full bg-sky-500 opacity-5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-20 h-96 w-96 rounded-full bg-emerald-500 opacity-5 blur-3xl"></div>
      </div>
    </div>
  );
}
