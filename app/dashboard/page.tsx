'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-[#0a0c10] via-[#111318] to-[#1a1d24]">
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
        <div className="flex items-center justify-between bg-[#7faf3b] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* App logo - responsive size */}
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-[#2f7d32] leading-tight text-center">
                Agri
                <br />
                SmartX
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-lime-100">
                Smart Farm
              </span>
              <span className="text-xs sm:text-sm lg:text-base font-semibold tracking-wide text-[#1d310b]">
                Kandavel&apos;s Farm
              </span>
            </div>
          </div>

          {/* Top-right controls - responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-white/40 bg-black/10 text-[10px] sm:text-xs text-white/90 hover:bg-black/20 hover:border-white/60 transition-all duration-200 active:scale-95"
              aria-label="Notifications"
            >
              <span className="relative">
                &#128276;
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </span>
            </button>
            <button
              className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-white/40 bg-black/10 text-sm sm:text-base text-white/90 hover:bg-black/20 hover:border-white/60 transition-all duration-200 active:scale-95"
              aria-label="Menu"
            >
              &#8942;
            </button>
          </div>
        </div>
      </header>

      {/* Main content - responsive padding and centering */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Illustration bubble - responsive sizing */}
        <div className="mb-6 sm:mb-8 lg:mb-10 flex h-52 w-52 sm:h-60 sm:w-60 lg:h-72 lg:w-72 xl:h-80 xl:w-80 items-center justify-center rounded-full bg-gradient-to-br from-[#2a2e35] to-[#1e2127] shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_70px_rgba(127,175,59,0.3)] transition-all duration-500 hover:scale-105">
          <div className="flex h-40 w-40 sm:h-44 sm:w-44 lg:h-52 lg:w-52 xl:h-60 xl:w-60 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-[#faf3ea] to-[#f3e7d9] shadow-inner">
            {/* Simple person + plant illustration - responsive sizing */}
            <div className="flex items-end gap-4 sm:gap-5 lg:gap-6">
              {/* Plant */}
              <div className="flex flex-col items-center gap-1 animate-[bounce_3s_ease-in-out_infinite]">
                <div className="h-8 w-6 sm:h-10 sm:w-7 lg:h-12 lg:w-8 rounded-full bg-gradient-to-t from-emerald-700 to-emerald-500" />
                <div className="flex gap-1">
                  <div className="h-2 w-2.5 sm:h-2.5 sm:w-3 lg:h-3 lg:w-3.5 rounded-sm bg-emerald-700 shadow" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 rounded-sm bg-emerald-800 shadow" />
                </div>
                <div className="mt-1 h-2 w-8 sm:w-9 lg:w-10 rounded-t-md bg-gradient-to-b from-amber-700 to-amber-900" />
              </div>

              {/* Person */}
              <div className="flex flex-col items-center gap-1 animate-[bounce_3s_ease-in-out_0.5s_infinite]">
                <div className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-md" />
                <div className="h-8 w-7 sm:h-10 sm:w-8 lg:h-12 lg:w-9 rounded-2xl bg-gradient-to-b from-[#ef8f77] to-[#e47a5b] shadow" />
                <div className="h-7 w-8 sm:h-9 sm:w-10 lg:h-11 lg:w-12 rounded-t-2xl bg-gradient-to-b from-[#3a5fb8] to-[#2a4f9b] shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* Instruction text - responsive sizing */}
        <div className="max-w-xs sm:max-w-sm lg:max-w-md px-4">
          <p className="text-center text-sm sm:text-base lg:text-lg leading-relaxed text-slate-200 font-light">
            Please press the{" "}
            <span className="inline-flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-[#c7f15e] text-[#263210] font-bold text-base sm:text-lg shadow-md mx-1">
              +
            </span>{" "}
            button to add a device
          </p>
        </div>

        {/* Optional: Status cards for larger screens */}
        <div className="hidden lg:grid grid-cols-3 gap-4 mt-12 w-full max-w-2xl">
          {[
            { icon: "🌱", label: "Devices", value: "0" },
            { icon: "💧", label: "Active", value: "0" },
            { icon: "📊", label: "Alerts", value: "0" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#1e2229] rounded-2xl p-4 border border-[#2a2f38] hover:border-[#7faf3b] transition-all duration-300 hover:shadow-lg hover:shadow-[#7faf3b]/20">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom floating actions - responsive positioning */}
      <footer className="pointer-events-none fixed inset-x-0 bottom-4 sm:bottom-6 lg:bottom-8 flex items-end justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Left rounded square button - responsive sizing */}
        <div className="pointer-events-auto">
          <button
            type="button"
            className="flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl sm:rounded-3xl lg:rounded-[1.8rem] bg-gradient-to-br from-[#8ec045] to-[#7faf3b] shadow-[0_12px_32px_rgba(0,0,0,0.8)] hover:shadow-[0_16px_40px_rgba(127,175,59,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
            aria-label="Device overview"
          >
            {/* Simple grid icon - responsive sizing */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-[#1d310b]" />
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-[#1d310b]" />
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-[#1d310b]" />
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-[#1d310b]" />
            </div>
          </button>
        </div>

        {/* Right primary + button - responsive sizing */}
        <div className="pointer-events-auto">
          <Link href="/dashboard/add-device" aria-label="Add device">
            <button
              type="button"
              className="group relative flex h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-[1.6rem] sm:rounded-[1.8rem] lg:rounded-[2.2rem] bg-gradient-to-br from-[#d4f76e] to-[#c7f15e] text-[#263210] shadow-[0_16px_36px_rgba(0,0,0,0.9)] hover:shadow-[0_20px_48px_rgba(199,241,94,0.5)] hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-none group-hover:rotate-90 transition-transform duration-300">
                +
              </span>
              
              {/* Pulse effect */}
              <span className="absolute inset-0 rounded-[1.6rem] sm:rounded-[1.8rem] lg:rounded-[2.2rem] bg-[#c7f15e] animate-ping opacity-20"></span>
            </button>
          </Link>
        </div>
      </footer>

      {/* Decorative gradient orbs for larger screens */}
      <div className="hidden lg:block pointer-events-none">
        <div className="absolute top-1/4 left-10 h-64 w-64 rounded-full bg-[#7faf3b] opacity-5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 h-80 w-80 rounded-full bg-[#c7f15e] opacity-5 blur-3xl"></div>
      </div>
    </div>
  );
}