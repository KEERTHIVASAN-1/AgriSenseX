"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MotorControlPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "auto">("manual");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#111318] text-white">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-[#111318]/95 backdrop-blur-sm border-b border-[#2a2f3a]">
        <div className="mx-auto max-w-9xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7faf3b] text-[#1b290b] transition-all hover:bg-[#8ac34a] hover:scale-105 active:scale-95"
                aria-label="Go back"
              >
                <svg
                  className="h-5 w-5"
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
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Motor Control
                </h1>
                <p className="text-xs text-gray-400 sm:text-sm">
                  Manage and monitor your farm motors
                </p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7faf3b]/20 border border-[#7faf3b]/30">
              <span className="text-xl">⚙️</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Weather card - responsive */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#a7c94b] to-[#8ac34a] p-5 text-[#1b290b] shadow-xl sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left: Temperature */}
            <div className="flex flex-col">
              <div className="text-4xl font-extrabold leading-none sm:text-5xl lg:text-6xl">
                75°F
              </div>
              <p className="mt-2 text-sm font-semibold sm:text-base">
                Feels like:{" "}
                <span className="font-bold text-[#f97316]">22°C</span>
              </p>
              <div className="mt-4 space-y-2 text-xs font-semibold sm:text-sm">
                <div className="flex items-center gap-2">
                  <span>🌅</span>
                  <span>
                    Sunrise <span className="ml-2 font-bold">06:37 AM</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌇</span>
                  <span>
                    Sunset <span className="ml-2 font-bold">20:37 PM</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Weather icon */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#facc15] shadow-lg sm:h-20 sm:w-20">
                <span className="text-4xl sm:text-5xl">☀️</span>
              </div>
              <div className="mt-3 text-base font-bold uppercase tracking-wide sm:text-lg">
                Sunny
              </div>
            </div>

            {/* Right: Metrics */}
            <div className="flex flex-col justify-center space-y-3 text-right text-xs font-semibold sm:text-sm">
              <div className="flex items-center justify-end gap-2">
                <span>💧</span>
                <span>
                  41% <span className="ml-1">Humidity</span>
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>💨</span>
                <span>
                  2 km/h <span className="ml-1">Wind</span>
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>📊</span>
                <span>
                  997 hPa <span className="ml-1">Pressure</span>
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>☀️</span>
                <span>
                  8 <span className="ml-1">UV</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Manual / Auto toggle - enhanced */}
        <section className="mb-6">
          <div className="flex w-full overflow-hidden rounded-2xl bg-[#1e2329] p-1 shadow-lg">
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex-1 rounded-xl py-3 text-center text-sm font-bold transition-all sm:py-4 sm:text-base ${
                mode === "manual"
                  ? "bg-gradient-to-r from-[#8ac34a] to-[#7faf3b] text-[#101810] shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Manual
            </button>
            <button
              type="button"
              onClick={() => setMode("auto")}
              className={`flex-1 rounded-xl py-3 text-center text-sm font-bold transition-all sm:py-4 sm:text-base ${
                mode === "auto"
                  ? "bg-gradient-to-r from-[#e17c5b] to-[#d2694a] text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Auto
            </button>
          </div>
        </section>

        {/* Motors grid - enhanced design */}
        <main>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-200 sm:text-xl">
              Available Motors
            </h2>
            <span className="text-xs text-gray-400 sm:text-sm">
              {mode === "manual" ? "Manual Mode" : "Auto Mode"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Motor 1", "Motor 2", "Motor 3", "Motor 4"].map((motor, idx) => (
              <Link
                key={motor}
                href={`/dashboard/motor-control/motor-${idx + 1}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 text-black shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] shadow-md transition-transform group-hover:scale-110">
                    <span className="text-4xl">⚙️</span>
                  </div>
                  <div className="text-center">
                    <span className="text-base font-bold sm:text-lg">
                      {motor}
                    </span>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-600">Active</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7faf3b]/0 to-[#7faf3b]/0 transition-all group-hover:from-[#7faf3b]/10 group-hover:to-[#8ac34a]/10"></div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}


