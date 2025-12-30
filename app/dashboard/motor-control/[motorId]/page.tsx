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

  return (
    <div className="flex min-h-screen flex-col bg-white">
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

            <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-100 to-lime-200 shadow-sm">
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-green-700 leading-tight text-center">
                Agri
                <br />
                SenseX
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-green-600">
                Motor Diagnostics
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
            <button className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 text-lg sm:text-xl shadow-sm">
              🔌
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-9xl flex-1 flex-col px-4 sm:px-6 lg:px-8 pb-10 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Industrial Pump Controller
          </h1>
          <p className="text-sm text-gray-600">
            Node ID: {label || "WP-01"} | System Health: Nominal
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">{/* placeholder */}</div>

          <aside className="space-y-6">
            <section className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                    Operation Status
                  </p>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  />
                </div>
                <p
                  className={`text-2xl font-black tracking-tight ${
                    isRunning ? "text-green-600" : "text-gray-500"
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
                    onClick={() => setIsRunning(true)}
                    className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                      isRunning
                        ? "bg-green-600 border-green-500 text-white shadow-lg"
                        : "bg-white border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600"
                    }`}
                  >
                    POWER ON
                  </button>

                  <button
                    onClick={() => setIsRunning(false)}
                    className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                      !isRunning
                        ? "bg-rose-600 border-rose-500 text-white shadow-lg"
                        : "bg-white border-gray-300 text-gray-600 hover:border-rose-400 hover:text-rose-600"
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
