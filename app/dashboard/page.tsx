'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
// import { ArrowRightIcon } from "@heroicons/react/24/solid";
// import { FaArrowRight } from "react-icons/fa";

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
          <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767080549/landscape_zlgmew.jpg" alt="Farm Background" className="w-full h-full object-cover" />
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
          <div className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d3436] mb-1">
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
                icon: "https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767081937/icons8-motor-64_a4giuq.png", 
                href: "/dashboard/motor-control",
              },
              { 
                label: "Weather Station", 
                icon: "https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767083291/icons8-rain-cloud-48_splxof.png",
                href: "/dashboard/weather-station",
              },
              { 
                label: "Fertigation Mode", 
                icon: "https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767083345/icons8-solid-fertilizer-48_rb1fk0.png",
                href: "/dashboard/fertigation",
              },
              { 
                label: "Drone Monitoring", 
                icon: "https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767083154/icons8-drone-64_czua9t.png",
                href: "/dashboard/drone-monitoring",
              },
            ].map((device) => {
              const CardWrapper = device.href ? Link : 'div';
              const cardProps = device.href ? { href: device.href } : {};

              return (
                <CardWrapper key={device.label} {...(cardProps as any)}>
                  <div className="group relative w-full flex flex-col overflow-hidden rounded-2xl bg-white border border-white/50 shadow-sm hover:shadow-xl hover:border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="flex justify-between items-center pr-3 pl-3">
                      <div className="flex gap-2 relative p-3">
                        {/* Label */}
                        <img src={device.icon} alt={device.label} className="w-10 h-10 object-contain" />
                        <h3 className="flex items-center text-lg font-bold">
                          {device.label}
                        </h3>
                      </div>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-black">
                          <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                      </div>
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