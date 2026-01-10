"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ModeStatus from "../../components/ModeStatus";

export default function WeatherStationPage() {
  const router = useRouter();

  // Fixed default values (no random generation)
  const [weatherData] = useState({
    temperature: 21.0,     // Fixed default: 21.0°C
    humidity: 47.0,        // Fixed default: 47.0%
    rainfall: null as number | null,
    windSpeed: null as number | null,
    soilMoisture: 85,      // Fixed default: 85%
    soilPH: 7.1,           // Fixed default: 7.1 pH
  });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90
       backdrop-blur-sm text-black">
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
                  Weather Control
                </h1>
              </div>
            </div>
            <ModeStatus />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather Metrics Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="space-y-0">
              {/* Temperature */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021601/thermometer_g3cmqb.png"
                    alt="Temperature Icon"
                    width={32}
                    height={32}
                    className="opacity-90 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Temperature</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weatherData.temperature.toFixed(1)}°C
                  </p>
                </div>
              </div>

              {/* Humidity */}
              <div className="flex items-center gap-4 py-4 border-b border-gray-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021342/icons8-humidity-50_jog7uo.png"
                    alt="Humidity Icon"
                    width={32}
                    height={32}
                    className="opacity-90 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Humidity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weatherData.humidity.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Rainfall */}
              <div className="flex items-center gap-4 py-4 border-b border-gray-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-200 flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021689/icons8-rain-cloud-50_jx8pnw.png"
                    alt="Rainfall Icon"
                    width={32}
                    height={32}
                    className="opacity-90 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Rainfall</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {weatherData.rainfall !== null ? `${weatherData.rainfall} mm` : "------"}
                  </p>
                </div>
              </div>

              {/* Wind Speed */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 border border-green-200 flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021750/icons8-wind-50_wc12ep.png"
                    alt="Wind Speed Icon"
                    width={32}
                    height={32}
                    className="opacity-90 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Wind Speed</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {weatherData.windSpeed !== null ? `${weatherData.windSpeed} km/h` : "------"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Soil Data Card */}
          <div 
          className="rounded-2xl p-6 shadow-sm relative overflow-hidden"
          style={{
            backgroundImage: `url(https://static.vecteezy.com/system/resources/previews/000/538/975/original/vector-nature-above-and-underground.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 justify-between">
              <h2 className="text-lg font-bold text-white mb-6 drop-shadow-md">Soil Data</h2>
              <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021821/icons8-soil-50_ruocgd.png" alt="Soil Moisture Icon" width={32} height={32} className="opacity-90 object-contain invert brightness-0" />
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/30 mb-6">
              {/* Left Panel — Moisture */}
              <div className="pr-5">
                <div className="flex items-center gap-2 justify-between">
                  <p className="text-sm font-semibold text-white drop-shadow-md">Moisture</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold text-white drop-shadow-md">
                      {weatherData.soilMoisture}%
                    </p>
                  </div>
                </div>
              </div>
              {/* Right Panel — pH */}
              <div className="pl-5">
                <div className="flex items-center gap-2 ">
                  <p className="text-sm font-semibold text-white drop-shadow-md">pH</p>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-white drop-shadow-md">
                      {weatherData.soilPH.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}