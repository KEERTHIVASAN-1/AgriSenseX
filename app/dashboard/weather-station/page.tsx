"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WeatherStationPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "auto">("auto");

  // Sample weather data - in a real app, this would come from an API
  const weatherData = {
    temperature: 75, // °F
    humidity: 65, // %
    rainfall: 2.5, // mm
    windspeed: 12, // km/h
    soilMoisture: 45, // %
  };

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
                  Weather Control
                </h1>
                <p className="text-xs text-gray-400 sm:text-sm">
                  Monitor and control weather station sensors
                </p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7faf3b]/20 border border-[#7faf3b]/30">
              <span className="text-xl">🌤️</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Manual / Auto toggle */}
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

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Temperature Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ee5a6f] p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold opacity-90">Temperature</span>
                <div className="mt-2 text-4xl font-extrabold sm:text-5xl">
                  {weatherData.temperature}°F
                </div>
                <span className="mt-1 text-sm opacity-80">
                  {(weatherData.temperature - 32) * 5 / 9}°C
                </span>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-4xl">🌡️</span>
              </div>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4ecdc4] to-[#44a08d] p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold opacity-90">Humidity</span>
                <div className="mt-2 text-4xl font-extrabold sm:text-5xl">
                  {weatherData.humidity}%
                </div>
                <span className="mt-1 text-xs opacity-80">
                  {weatherData.humidity < 40 ? "Low" : weatherData.humidity < 70 ? "Normal" : "High"}
                </span>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-4xl">💧</span>
              </div>
            </div>
          </div>

          {/* Rainfall Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold opacity-90">Rainfall</span>
                <div className="mt-2 text-4xl font-extrabold sm:text-5xl">
                  {weatherData.rainfall}mm
                </div>
                <span className="mt-1 text-xs opacity-80">Last 24 hours</span>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-4xl">🌧️</span>
              </div>
            </div>
          </div>

          {/* Wind Speed Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f093fb] to-[#f5576c] p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold opacity-90">Wind Speed</span>
                <div className="mt-2 text-4xl font-extrabold sm:text-5xl">
                  {weatherData.windspeed}
                </div>
                <span className="mt-1 text-xs opacity-80">km/h</span>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-4xl">💨</span>
              </div>
            </div>
          </div>

          {/* Soil Moisture Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fa709a] to-[#fee140] p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold opacity-90">Soil Moisture</span>
                <div className="mt-2 text-4xl font-extrabold sm:text-5xl">
                  {weatherData.soilMoisture}%
                </div>
                <span className="mt-1 text-xs opacity-80">
                  {weatherData.soilMoisture < 30 ? "Dry" : weatherData.soilMoisture < 60 ? "Optimal" : "Wet"}
                </span>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-4xl">🌱</span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#30cfd0] to-[#330867] p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold opacity-90">Status</span>
                <div className="mt-2 text-2xl font-extrabold sm:text-3xl">
                  {mode === "auto" ? "Auto" : "Manual"}
                </div>
                <span className="mt-1 text-xs opacity-80">
                  {mode === "auto" ? "Automated monitoring" : "Manual control"}
                </span>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-4xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-6 rounded-2xl bg-[#1e2329] p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-bold text-gray-200 sm:text-xl">
            Weather Station Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[#2a2f3a] p-4">
              <div className="text-sm text-gray-400">Last Update</div>
              <div className="mt-1 text-base font-semibold text-white">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="rounded-xl bg-[#2a2f3a] p-4">
              <div className="text-sm text-gray-400">Station ID</div>
              <div className="mt-1 text-base font-semibold text-white">WS-001</div>
            </div>
            <div className="rounded-xl bg-[#2a2f3a] p-4">
              <div className="text-sm text-gray-400">Location</div>
              <div className="mt-1 text-base font-semibold text-white">Field A</div>
            </div>
            <div className="rounded-xl bg-[#2a2f3a] p-4">
              <div className="text-sm text-gray-400">Battery</div>
              <div className="mt-1 text-base font-semibold text-green-400">85%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}