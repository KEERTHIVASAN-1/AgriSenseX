"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function ThresholdsPage() {
  const router = useRouter();
  const [voltage, setVoltage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("voltageThreshold");
      return saved ? Number(saved) : 100;
    }
    return 100;
  });
  const [current, setCurrent] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("currentThreshold");
      return saved ? Number(saved) : 11.0;
    }
    return 11.0;
  });

  const handleSave = () => {
    localStorage.setItem("voltageThreshold", voltage.toString());
    localStorage.setItem("currentThreshold", current.toString());
    // Trigger custom event for same-tab updates
    window.dispatchEvent(new CustomEvent("thresholdsUpdated"));
    router.back();
  };

  const handleReset = () => {
    setVoltage(100);
    setCurrent(11.0);
  };

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
                  Edit Safety Parameters
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-6">
            Safety Parameters
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-green-700 uppercase">
                Voltage Trip Threshold (V)
              </label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-12 rounded-lg border border-green-300 bg-white px-4 font-mono text-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                placeholder="Enter voltage threshold"
              />
              <p className="text-xs text-gray-500">
                Set the maximum voltage before automatic trip
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-green-700 uppercase">
                Overcurrent Cut-off (A)
              </label>
              <input
                type="number"
                step="0.1"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="w-full h-12 rounded-lg border border-green-300 bg-white px-4 font-mono text-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                placeholder="Enter current threshold"
              />
              <p className="text-xs text-gray-500">
                Set the maximum current before automatic cut-off
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg text-green-700 font-semibold hover:bg-green-100 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 shadow transition-all"
            >
              Save
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

