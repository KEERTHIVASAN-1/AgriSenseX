"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddDevicePage() {
  const router = useRouter();
  const [selectedDevices, setSelectedDevices] = useState(new Set());

  const toggleDevice = (label: string) => {
    setSelectedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const devices = [
    { 
      label: "Motor Control", 
      icon: "⚙️", 
      href: "/dashboard/motor-control",
      description: "Control and monitor water pumps",
      gradient: "from-blue-400 to-blue-600"
    },
    { 
      label: "Drone Monitoring", 
      icon: "💧",
      href:"/dashboard/drone-monitoring",
      description: "Track water levels and usage",
      gradient: "from-cyan-400 to-cyan-600"
    },
    { 
      label: "Weather Station", 
      icon: "🌤️",
      href:"/dashboard/weather-station",
      description: "Real-time weather data",
      gradient: "from-amber-400 to-amber-600"
    },
    { 
      label: "Auto Scheduling", 
      icon: "📅",
      description: "Automated irrigation schedules",
      gradient: "from-purple-400 to-purple-600"
    },
    { 
      label: "Fertigation Mode", 
      icon: "🧪",
      href:"/dashboard/fertigation",
      description: "Fertilizer injection control",
      gradient: "from-green-400 to-green-600"
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0c10] via-[#111318] to-[#1a1d24]">
      {/* Top bar */}
      <header className="w-full bg-gradient-to-r from-[#7faf3b] to-[#8ec045] shadow-lg">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
          {/* Logo + title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-white text-[#1b290b] transition-all hover:bg-lime-100 hover:scale-105 active:scale-95 shadow-md"
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
            
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg bg-white shadow-md">
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-[#2f7d32] leading-tight text-center">
                Agri
                <br />
                SenseX
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-lime-100">
                Smart Farm Control
              </span>
              <span className="text-xs sm:text-sm lg:text-base font-semibold tracking-wide text-[#1b290b]">
                Device Modes
              </span>
            </div>
          </div>

          {/* Icons on the right */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[#1b290b]">
            <button className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full bg-lime-200/80 hover:bg-lime-200 transition-all duration-200 text-xs sm:text-sm active:scale-95 shadow-sm">
              <span className="relative">
                🔔
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </span>
            </button>
            <button className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full bg-lime-200/80 hover:bg-lime-200 transition-all duration-200 text-xs sm:text-sm active:scale-95 shadow-sm">
              👤
            </button>
          </div>
        </div>

        {/* Decorative wave strip */}
        <div className="relative flex h-5 sm:h-6 items-center justify-center bg-gradient-to-r from-[#7faf3b] to-[#8ec045] px-4 pb-2">
          <div className="h-2 w-20 sm:w-24 lg:w-32 rounded-full bg-gradient-to-r from-lime-200/70 to-lime-300/70 shadow-inner" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-transparent to-black/10"></div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-6 pt-6 sm:pt-8 lg:pt-10">
        <div className="max-w-4xl mx-auto">
          {/* Page title with description */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7faf3b] to-[#8ec045] shadow-lg">
                <span className="text-xl sm:text-2xl">🎛️</span>
              </span>
              Select Device Mode
            </h1>
            <p className="text-sm sm:text-base text-slate-400 ml-0 sm:ml-[60px]">
              Choose the devices you want to control and monitor
            </p>
          </div>

          {/* Device cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {devices.map((item) => {
              const isSelected = selectedDevices.has(item.label);
              const CardWrapper = item.href ? Link : 'div';
              const cardProps = item.href ? { href: item.href } : {};

              return (
                <CardWrapper key={item.label} {...(cardProps as any)}>
                  <button
                    type="button"
                    onClick={() => !item.href && toggleDevice(item.label)}
                    className={`group relative w-full flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#a7c94b] to-[#8ec045] shadow-[0_12px_28px_rgba(167,201,75,0.4)] scale-105' 
                        : 'bg-gradient-to-br from-[#1e2229] to-[#252b34] shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.8)]'
                    } hover:scale-105 active:scale-95 border ${
                      isSelected ? 'border-[#c7f15e]' : 'border-[#2a2f38] hover:border-[#7faf3b]'
                    }`}
                  >
                    {/* Icon background glow */}
                    <div className={`absolute top-0 right-0 h-24 w-24 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${item.gradient} transition-opacity duration-300 ${isSelected ? 'opacity-30' : 'group-hover:opacity-30'}`}></div>
                    
                    <div className="relative p-5 sm:p-6">
                      {/* Top row: checkbox + icon */}
                      <div className="flex items-start justify-between mb-4">
                        {/* Checkbox */}
                        <div className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg transition-all duration-300 ${
                          isSelected 
                            ? 'bg-[#1b290b] border-2 border-[#1b290b] shadow-inner' 
                            : 'bg-transparent border-2 border-[#3a4048] group-hover:border-[#7faf3b]'
                        }`}>
                          {isSelected && (
                            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#c7f15e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Icon */}
                        <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300 ${
                          isSelected 
                            ? 'bg-white/20 shadow-lg' 
                            : 'bg-[#2a2f38] group-hover:bg-[#323842]'
                        }`}>
                          <span className="text-2xl sm:text-3xl">{item.icon}</span>
                        </div>
                      </div>

                      {/* Label */}
                      <h3 className={`text-base sm:text-lg font-bold mb-1.5 transition-colors duration-300 ${
                        isSelected ? 'text-[#1b290b]' : 'text-white'
                      }`}>
                        {item.label}
                      </h3>

                      {/* Description */}
                      <p className={`text-xs sm:text-sm transition-colors duration-300 ${
                        isSelected ? 'text-[#2a3d15]' : 'text-slate-400 group-hover:text-slate-300'
                      }`}>
                        {item.description}
                      </p>

                      {/* Link indicator */}
                      {item.href && (
                        <div className="mt-3 flex items-center gap-1 text-xs font-medium">
                          <span className={isSelected ? 'text-[#1b290b]' : 'text-[#7faf3b]'}>
                            Configure
                          </span>
                          <svg className={`h-3 w-3 ${isSelected ? 'text-[#1b290b]' : 'text-[#7faf3b]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Bottom accent line */}
                    <div className={`h-1 w-full transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#1b290b] to-[#2a3d15]' 
                        : 'bg-gradient-to-r from-transparent via-[#7faf3b]/20 to-transparent group-hover:via-[#7faf3b]/40'
                    }`}></div>
                  </button>
                </CardWrapper>
              );
            })}
          </div>

          {/* Action buttons - only show on larger screens or when devices selected */}
          {selectedDevices.size > 0 && (
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto">
              <button
                className="flex-1 py-3 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7faf3b] to-[#8ec045] text-white font-semibold text-sm sm:text-base shadow-[0_8px_24px_rgba(127,175,59,0.4)] hover:shadow-[0_12px_32px_rgba(127,175,59,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Add {selectedDevices.size} Device{selectedDevices.size > 1 ? 's' : ''}
              </button>
              <button
                onClick={() => setSelectedDevices(new Set())}
                className="py-3 sm:py-4 px-6 rounded-2xl bg-[#1e2229] border-2 border-[#2a2f38] text-slate-300 font-semibold text-sm sm:text-base hover:border-red-500 hover:text-red-400 hover:bg-[#252b34] transition-all duration-300 active:scale-95"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Info card for larger screens */}
          <div className="hidden lg:block mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#1e2229] to-[#252b34] border border-[#2a2f38]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7faf3b]/20 text-xl">
                💡
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Quick Tip</h4>
                <p className="text-sm text-slate-400">
                  Select multiple devices to configure them together. Devices with a "Configure" option can be set up individually for more control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative gradient orbs */}
      <div className="hidden lg:block pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-[#7faf3b] opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-[#8ec045] opacity-5 blur-3xl"></div>
      </div>
    </div>
  );
}