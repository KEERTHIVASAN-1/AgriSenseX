"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function MotorControlPage() {
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
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleStorageChange = () => {
      const savedVoltage = localStorage.getItem("voltageThreshold");
      const savedCurrent = localStorage.getItem("currentThreshold");
      if (savedVoltage) setVoltage(Number(savedVoltage));
      if (savedCurrent) setCurrent(Number(savedCurrent));
    };

    // Listen for custom event (for same-tab updates)
    window.addEventListener("thresholdsUpdated", handleStorageChange);
    // Also listen for storage event (for cross-tab updates)
    window.addEventListener("storage", handleStorageChange);
    // Check on mount
    handleStorageChange();

    return () => {
      window.removeEventListener("thresholdsUpdated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
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
        <section 
          className="mb-6 rounded-2xl p-5 shadow-sm relative overflow-hidden"
          style={{
            backgroundImage: `url(https://img.freepik.com/premium-photo/electrical-circuit-board-technology-background_1022901-71469.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-white drop-shadow-md">
                  Phase Monitoring
                </h2>
                <p className="text-sm text-white/90 mt-1">
                  Click on each card to view Power and Energy
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard/motor-control/thresholds")}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-green-700 transition-colors shadow-md"
                aria-label="Edit thresholds"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>

          <div className="mt-4 relative overflow-hidden rounded-xl">

            {/* Soft white/green overlay to improve contrast */}
            <div className="absolute inset-0" />

            {/* Foreground content */}
            <div className="relative p-1 mt-0 flex justify-between items-center gap-1">
                {[
                  { id: "L1", borderColor: "border-red-500", textColor: "text-red-600", bgColor: "bg-red-50/30", v: "239.4", a: "11.0" },
                  { id: "L2", borderColor: "border-yellow-500", textColor: "text-yellow-600", bgColor: "bg-yellow-50/30", v: "238.5", a: "10.8" },
                  { id: "L3", borderColor: "border-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50/30", v: "240.4", a: "12.0" },
                ].map((p) => {
                  const isFlipped = flippedCards[p.id] || false;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setFlippedCards(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                      className={`relative rounded-lg border-2 ${p.borderColor} ${p.bgColor} shadow-lg backdrop-blur-sm cursor-pointer flex-1 min-w-[70px]`}
                      style={{
                        perspective: '1000px',
                      }}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-500"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                      >
                        {/* Front side - Voltage and Current */}
                        <div 
                          className="rounded-md p-3 min-h-[80px] w-full"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                          }}
                        >
                          {/* Voltage */}
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-sm sm:text-base font-mono font-bold text-gray-900 !opacity-100 whitespace-nowrap">{p.v}V</span>
                          </div>
                          {/* Divider */}
                          <div className="border-t border-gray-300 my-2"></div>
                          {/* Current */}
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm sm:text-base font-mono font-bold text-gray-900 !opacity-100 whitespace-nowrap">{p.a}A</span>
                          </div>
                        </div>
                        
                        {/* Back side - Power and Energy */}
                        <div 
                          className="rounded-md p-3 min-h-[80px] w-full absolute inset-0"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          {/* Power (P = V × I) */}
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-sm sm:text-base font-mono font-bold text-gray-900 !opacity-100 whitespace-nowrap">
                              {(parseFloat(p.v) * parseFloat(p.a)).toFixed(1)}W
                            </span>
                          </div>
                          {/* Divider */}
                          <div className="border-t border-gray-300 my-2"></div>
                          {/* Energy (calculated as power × time, using a base value) */}
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm sm:text-base font-mono font-bold text-gray-900 !opacity-100 whitespace-nowrap">
                              {((parseFloat(p.v) * parseFloat(p.a)) * 0.1).toFixed(2)}kWh
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Safety Parameters Display */}
          <div className="mt-4 pt-4 border-t border-white/20 relative z-10">
            <div className="grid sm:grid-cols-2 gap-4">
              <div 
                className="relative rounded-lg p-3 border border-green-200 overflow-hidden"
                style={{
                  backgroundImage: `url(https://tse2.mm.bing.net/th/id/OIP.cIfgTJmVB7ABkuj85ENbYwHaEq?pid=Api&P=0&h=180)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold text-white uppercase block mb-1 drop-shadow-md">
                      Voltage & Current Threshold
                    </label>
                    <button
                      onClick={() => router.push("/dashboard/motor-control/thresholds")}
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-green-700 transition-colors shadow-md"
                      aria-label="Edit thresholds"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-mono font-bold text-white drop-shadow-md">
                      {voltage}V
                    </p>
                    <span className="text-white/80">|</span>
                    <p className="text-lg font-mono font-bold text-white drop-shadow-md">
                      {current}A
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Navigation Cards */}
        <section className="mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Motors Page Link */}
            <Link
              href="/dashboard/motor-control/motor"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 text-black shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center 
                  rounded-2xl bg-gradient-to-br from-green-100 to-green-200
                  shadow-md transition-transform group-hover:scale-110">
                  <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021968/icons8-motor-50_ooixaf.png" alt="Motor Icon" width={50} height={50} className="opacity-90 object-contain" />
                </div>
                <h3 className="text-xl font-bold">Motors</h3>
                <p className="text-sm text-gray-600 text-center">
                  Control and manage all motors
                </p>
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  View Motors →
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7faf3b]/0 to-[#7faf3b]/0 transition-all group-hover:from-[#7faf3b]/5 group-hover:to-[#8ac34a]/5 pointer-events-none"></div>
            </Link>

            {/* Valve Page Link */}
            <Link
              href="/dashboard/motor-control/valves"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-black shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center 
                  rounded-2xl bg-gradient-to-br from-blue-200 to-indigo-200
                  shadow-md transition-transform group-hover:scale-110">
                  <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767022401/icons8-valve-64_xhtuoh.png" alt="Valve Icon" width={50} height={50} className="opacity-90 object-contain" />
                </div>
                <h3 className="text-xl font-bold">Valves</h3>
                <p className="text-sm text-gray-600 text-center">
                  Control and manage all valves
                </p>
                <div className="mt-2 text-sm text-blue-600 font-semibold">
                  View Valves →
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 transition-all group-hover:from-blue-500/5 group-hover:to-indigo-500/5 pointer-events-none"></div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
