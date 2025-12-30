'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Check if screen is mobile size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (loading && isMobile) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#3a3f47] overflow-hidden">
        {/* Animated clouds */}
        <div className="absolute top-6 left-4 animate-[float_6s_ease-in-out_infinite]">
          <svg width="150" height="80" viewBox="0 0 150 80" fill="none">
            <path d="M30 50C30 50 10 50 10 35C10 20 25 15 35 20C35 20 35 10 50 10C65 10 70 20 70 20C70 20 85 15 95 25C105 35 100 50 100 50H30Z" fill="#a3c94f" opacity="0.9"/>
          </svg>
        </div>

        <div className="absolute top-28 right-8 animate-[float_8s_ease-in-out_1s_infinite]">
          <svg width="200" height="90" viewBox="0 0 200 90" fill="none">
            <path d="M40 60C40 60 15 60 15 42C15 24 35 18 48 24C48 24 48 10 68 10C88 10 95 24 95 24C95 24 115 18 128 30C141 42 135 60 135 60H40Z" fill="#a3c94f" opacity="0.85"/>
          </svg>
        </div>

        {/* Center content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          {/* Logo with drop animation */}
          <div className="mb-8 animate-[bounce_2s_ease-in-out_infinite]">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-2xl">
              <div className="text-center">
                <div className="mb-1">
                  <svg className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C10.8 2 9.85 2.95 9.85 4.15C9.85 4.55 9.95 4.95 10.15 5.25L8 8.5V11H6V13H8V22H10V13H14V22H16V13H18V11H16V8.5L13.85 5.25C14.05 4.95 14.15 4.55 14.15 4.15C14.15 2.95 13.2 2 12 2Z" fill="#2f7d32"/>
                    <circle cx="12" cy="4" r="1.5" fill="#7faf3b"/>
                    <path d="M9 11C9 11 8 12 7 12C6 12 5 11 5 11" stroke="#7faf3b" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M15 11C15 11 16 12 17 12C18 12 19 11 19 11" stroke="#7faf3b" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="text-xs font-bold text-[#2f7d32] leading-tight">
                  AgriSenseX
                </div>
                <div className="text-[8px] font-medium text-[#7faf3b] tracking-wide">
                  AGRI AUTOMATION
                </div>
              </div>
            </div>
          </div>

          {/* Water drop animation */}
          <div className="relative mb-12">
            <div className="animate-[drip_2s_ease-in-out_infinite]">
              <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
                <path d="M30 5C30 5 10 25 10 40C10 51 18.95 60 30 60C41.05 60 50 51 50 40C50 25 30 5 30 5Z" fill="#00BCD4"/>
                <path d="M30 5C30 5 10 25 10 40C10 51 18.95 60 30 60C41.05 60 50 51 50 40C50 25 30 5 30 5Z" fill="url(#waterGradient)"/>
                <ellipse cx="23" cy="35" rx="5" ry="7" fill="rgba(255,255,255,0.3)"/>
                <defs>
                  <linearGradient id="waterGradient" x1="30" y1="5" x2="30" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4DD0E1"/>
                    <stop offset="1" stopColor="#00ACC1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#a3c94f] animate-[pulse_1s_ease-in-out_infinite]"></span>
              <span className="h-2 w-2 rounded-full bg-[#a3c94f] animate-[pulse_1s_ease-in-out_0.2s_infinite]"></span>
              <span className="h-2 w-2 rounded-full bg-[#a3c94f] animate-[pulse_1s_ease-in-out_0.4s_infinite]"></span>
            </div>
            <p className="text-sm text-slate-400 font-light">Loading your farm...</p>
          </div>
        </div>

        {/* Bottom plants decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg width="100%" height="180" viewBox="0 0 430 180" fill="none" preserveAspectRatio="none">
            {/* Left palm tree */}
            <path d="M60 180V120C60 120 55 115 50 120C45 125 40 135 40 135" stroke="#7faf3b" strokeWidth="4" fill="none"/>
            <path d="M60 180V120C60 120 65 115 70 120C75 125 80 135 80 135" stroke="#7faf3b" strokeWidth="4" fill="none"/>
            <ellipse cx="60" cy="110" rx="45" ry="25" fill="#8ec045"/>
            <rect x="54" y="110" width="12" height="70" rx="6" fill="#5d7a2f"/>
            
            {/* Middle palm tree */}
            <path d="M160 180V130C160 130 155 125 150 130C145 135 140 145 140 145" stroke="#a3c94f" strokeWidth="5" fill="none"/>
            <path d="M160 180V130C160 130 165 125 170 130C175 135 180 145 180 145" stroke="#a3c94f" strokeWidth="5" fill="none"/>
            <ellipse cx="160" cy="120" rx="50" ry="28" fill="#a3c94f"/>
            <rect x="153" y="120" width="14" height="60" rx="7" fill="#6a7f3d"/>
            
            {/* Right plants */}
            <path d="M280 180C280 180 275 160 270 150C265 140 260 135 260 135" stroke="#8ec045" strokeWidth="3" fill="none"/>
            <path d="M300 180C300 180 295 165 292 155C289 145 285 140 285 140" stroke="#9ed24f" strokeWidth="3" fill="none"/>
            <path d="M320 180C320 180 318 168 315 158C312 148 308 143 308 143" stroke="#a3c94f" strokeWidth="2.5" fill="none"/>
            <circle cx="270" cy="135" r="8" fill="#7faf3b"/>
            <circle cx="292" cy="140" r="7" fill="#8ec045"/>
            <circle cx="315" cy="143" r="6" fill="#9ed24f"/>
            
            {/* Small bushes */}
            <ellipse cx="30" cy="175" rx="25" ry="12" fill="#5d7a2f" opacity="0.8"/>
            <ellipse cx="120" cy="178" rx="30" ry="15" fill="#6a7f3d" opacity="0.7"/>
            <ellipse cx="380" cy="176" rx="35" ry="14" fill="#7faf3b" opacity="0.6"/>
          </svg>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          @keyframes drip {
            0%, 100% { transform: translateY(0px); opacity: 1; }
            50% { transform: translateY(10px); opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0]">
      {/* Top farm illustration banner */}
      <header className="w-full">
        {/* Graphic strip - responsive height */}
        <div className="relative h-32 sm:h-40 lg:h-48 w-full overflow-hidden bg-gradient-to-b from-[#a3c94f] via-[#7faf3b] to-[#6a9331]">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
            }}></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-80">
            {/* Simple farm-style shapes - responsive sizes */}
            <div className="flex items-end gap-3 sm:gap-4 lg:gap-6 text-[#1f2c10]">
              <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg bg-lime-200 shadow-lg transform hover:scale-110 transition-transform duration-300" />
              <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-lg bg-lime-100 shadow-lg transform hover:scale-110 transition-transform duration-300" />
              <div className="h-14 w-16 sm:h-16 sm:w-20 lg:h-20 lg:w-24 rounded-lg bg-lime-300 shadow-lg transform hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Farm name bar - responsive padding */}
        <div className="flex items-center justify-between bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-sm border-b border-[#e1e8ed]">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* App logo - responsive size */}
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7faf3b] to-[#6a9331] shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-white leading-tight text-center">
                Agri
                <br />
                SmartX
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#636e72]">
                Smart Farm
              </span>
              <span className="text-xs sm:text-sm lg:text-base font-semibold tracking-wide text-[#2d3436]">
                Kandavel&apos;s Farm
              </span>
            </div>
          </div>

          {/* Top-right controls - responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-[#e1e8ed] bg-white text-sm sm:text-base text-[#636e72] hover:bg-[#f5f9f0] hover:border-[#7faf3b] transition-all duration-200 active:scale-95 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-[#e1e8ed] bg-white text-[10px] sm:text-xs text-[#636e72] hover:bg-[#f5f9f0] hover:border-[#7faf3b] transition-all duration-200 active:scale-95 shadow-sm"
              aria-label="Notifications"
            >
              <span className="relative">
                🔔
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#ff8c42] animate-pulse"></span>
              </span>
            </button>
            <button
              className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-[#e1e8ed] bg-white text-sm sm:text-base text-[#636e72] hover:bg-[#f5f9f0] hover:border-[#7faf3b] transition-all duration-200 active:scale-95 shadow-sm"
              aria-label="Menu"
            >
              ⋮
            </button>
          </div>
        </div>
      </header>

      {/* Main content - responsive padding and centering */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d3436] mb-2">
              Device Management
            </h2>
            <p className="text-[#636e72]">
              Select a device to monitor and control
            </p>
          </div>

          {/* Device Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-12">
            {[
              { 
                label: "Motor Control", 
                icon: "⚙️", 
                href: "/dashboard/motor-control",
                description: "Control and monitor water pumps",
                gradient: "from-blue-400 to-blue-600",
                bgGradient: "from-blue-50 to-blue-100",
                textColor: "text-blue-900",
                descColor: "text-blue-700"
              },
              { 
                label: "Drone Monitoring", 
                icon: "🚁",
                href: "/dashboard/drone-monitoring",
                description: "Real-time field analysis and monitoring",
                gradient: "from-cyan-400 to-cyan-600",
                bgGradient: "from-cyan-50 to-sky-100",
                textColor: "text-cyan-900",
                descColor: "text-cyan-700"
              },
              { 
                label: "Weather Station", 
                icon: "🌤️",
                href: "/dashboard/weather-station",
                description: "Real-time weather data",
                gradient: "from-amber-400 to-amber-600",
                bgGradient: "from-amber-50 to-yellow-100",
                textColor: "text-amber-900",
                descColor: "text-amber-700"
              },
              { 
                label: "Fertigation Mode", 
                icon: "🧪",
                href: "/dashboard/fertigation",
                description: "Fertilizer injection control",
                gradient: "from-green-400 to-green-600",
                bgGradient: "from-green-50 to-emerald-100",
                textColor: "text-green-900",
                descColor: "text-green-700"
              },
            ].map((device) => {
              const CardWrapper = device.href ? Link : 'div';
              const cardProps = device.href ? { href: device.href } : {};

              return (
                <CardWrapper key={device.label} {...(cardProps as any)}>
                  <div className={`group relative w-full flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${device.bgGradient} border border-white/50 shadow-sm hover:shadow-xl hover:border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer`}>
                    {/* Icon background glow */}
                    <div className={`absolute top-0 right-0 h-24 w-24 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${device.gradient} transition-opacity duration-300 group-hover:opacity-30`}></div>
                    
                    {/* Icon */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${device.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{device.icon}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col relative p-6 pt-16">
                      {/* Label */}
                      <h3 className={`text-lg font-bold ${device.textColor} mb-2`}>
                        {device.label}
                      </h3>

                      {/* Description */}
                      <p className={`text-sm ${device.descColor} mb-4`}>
                        {device.description}
                      </p>
                    </div>

                    {/* Bottom accent line */}
                    <div className={`h-1 w-full bg-gradient-to-r ${device.gradient} opacity-100`}>
                    </div>
                  </div>
                </CardWrapper>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}