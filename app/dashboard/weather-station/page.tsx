"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
// import { ThermometerIcon } from "@heroicons/react/24/outline";

export default function WeatherStationPage() {
  const router = useRouter();

  const weatherData = {
    temperature: 75,
    humidity: 65,
    rainfall: 2.5,
    windspeed: 12,
    soilMoisture: 45,
  };

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
                  Weather Control
                </h1>
                <p className="text-sm text-green-700">
                  Monitor and control weather station sensors
                </p>
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 border border-green-300">
              🌤️
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Temperature */}
          <div className="rounded-2xl bg-white border border-green-200 p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700">Temperature</p>
                <p className="mt-2 text-4xl font-extrabold text-gray-900">
                  {weatherData.temperature}°F
                </p>
                <p className="mt-1 text-sm text-green-600">
                  {((weatherData.temperature - 32) * 5/9).toFixed(1)}°C
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-200">
                <img
                  src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021601/thermometer_g3cmqb.png"
                  alt="Humidity Icon"
                  width={40}
                  height={40}
                  className="opacity-90 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="rounded-2xl bg-white border border-green-200 p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700">Humidity</p>
                <p className="mt-2 text-4xl font-extrabold">
                  {weatherData.humidity}%
                </p>
                <p className="mt-1 text-sm text-green-600">
                  {weatherData.humidity < 40
                    ? "Low"
                    : weatherData.humidity < 70
                    ? "Normal"
                    : "High"}
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-200">
                <img
                  src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021342/icons8-humidity-50_jog7uo.png"
                  alt="Humidity Icon"
                  width={40}
                  height={40}
                  className="opacity-90 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Rainfall */}
          <div className="rounded-2xl bg-white border border-green-200 p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700">Rainfall</p>
                <p className="mt-2 text-4xl font-extrabold">
                  {weatherData.rainfall}mm
                </p>
                <p className="mt-1 text-sm text-green-600">Last 24 hours</p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-200">
                <img
                  src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021689/icons8-rain-cloud-50_jx8pnw.png"
                  alt="Humidity Icon"
                  width={40}
                  height={40}
                  className="opacity-90 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="rounded-2xl bg-white border border-green-200 p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700">Wind Speed</p>
                <p className="mt-2 text-4xl font-extrabold">
                  {weatherData.windspeed}
                </p>
                <p className="mt-1 text-sm text-green-600">km/h</p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-200">
                <img
                  src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021750/icons8-wind-50_wc12ep.png"
                  width={40}
                  height={40}
                  className="opacity-90 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Soil Moisture */}
          <div className="rounded-2xl bg-white border border-green-200 p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700">Soil Moisture</p>
                <p className="mt-2 text-4xl font-extrabold">
                  {weatherData.soilMoisture}%
                </p>
                <p className="mt-1 text-sm text-green-600">
                  {weatherData.soilMoisture < 30
                    ? "Dry"
                    : weatherData.soilMoisture < 60
                    ? "Optimal"
                    : "Wet"}
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-200">
                <img
                  src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021821/icons8-soil-50_ruocgd.png"
                  alt="Humidity Icon"
                  width={40}
                  height={40}
                  className="opacity-90 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-green-800">
            Weather Station Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-white border border-green-200 p-4">
              <p className="text-sm text-green-700">Last Update</p>
              <p className="mt-1 font-semibold">
                {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="rounded-xl bg-white border border-green-200 p-4">
              <p className="text-sm text-green-700">Station ID</p>
              <p className="mt-1 font-semibold">WS-001</p>
            </div>

            <div className="rounded-xl bg-white border border-green-200 p-4">
              <p className="text-sm text-green-700">Location</p>
              <p className="mt-1 font-semibold">Field A</p>
            </div>

            <div className="rounded-xl bg-white border border-green-200 p-4">
              <p className="text-sm text-green-700">Battery</p>
              <p className="mt-1 font-semibold text-green-600">85%</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
