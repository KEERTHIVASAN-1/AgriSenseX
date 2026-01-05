'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
// import { ArrowRightIcon } from "@heroicons/react/24/solid";
// import { FaArrowRight } from "react-icons/fa";

export default function DashboardPage() {

  // Weather data
  const weatherData = {
    temperature: 32,
    humidity: 58,
    rainfall: 0,
    windSpeed: 12.8,
  };

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
              <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767027198/icons8-farmer-100_cmxz20.png" alt="" />
            </div>
            <span className="text-lg sm:text-sm lg:text-base font-semibold tracking-wide text-[#2d3436]">
              Egroot&apos;s Farm
            </span>
          </div>

          {/* Top-right controls - responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-[#e1e8ed] bg-white text-[10px] sm:text-xs text-[#636e72] hover:bg-[#f5f9f0] hover:border-[#7faf3b] transition-all duration-200 active:scale-95 shadow-sm"
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>

            </button>
            <button
              className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-[#e1e8ed] bg-white text-sm sm:text-base text-[#636e72] hover:bg-[#f5f9f0] hover:border-[#7faf3b] transition-all duration-200 active:scale-95 shadow-sm"
              aria-label="Menu"
            >
              ⋮
            </button>
          </div>
        </div>
        {/* Graphic strip - responsive height */}
        <div className="relative h-32 sm:h-40 lg:h-48 w-full overflow-hidden rounded-b-3xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://img.freepik.com/premium-photo/green-mountain-landscape-with-mountains-trees_956920-194447.jpg" 
              alt="Farm Background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {/* Temperature */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021601/thermometer_g3cmqb.png"
                    alt="Temperature"
                    className="w-6 h-6 sm:w-10 sm:h-10 opacity-80 invert"
                  />
                  <span className="text-xs sm:text-sm text-white/90 font-semibold">Temperature</span>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {weatherData.temperature}°C
                </p>
              </div>

              {/* Rainfall */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021689/icons8-rain-cloud-50_jx8pnw.png"
                    alt="Rainfall"
                    className="w-8 h-8 sm:w-10 sm:h-10 opacity-80 invert"
                  />
                  <span className="text-xs sm:text-sm text-white/90 font-semibold">Rainfall</span>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {weatherData.rainfall} mm
                </p>
              </div>
            </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-12">
            {[
              { 
                label: "Motor Control", 
                icon: "https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767162661/water-pump-motor-vector_1049408-13189_huw6tk.png", 
                href: "/dashboard/motor-control",
              },
              { 
                label: "Weather Station", 
                icon: "https://img.freepik.com/premium-photo/weather-station-cartoon-vector-icon-illustration_1022901-71469.jpg",
                href: "/dashboard/weather-station",
              },
              { 
                label: "Fertigation Mode", 
                icon: "https://static.vecteezy.com/system/resources/previews/049/768/605/original/cartoon-of-cute-fertilizer-illustration-with-simple-colors-and-concept-free-vector.jpg  ",
                href: "/dashboard/fertigation",
              },
              { 
                label: "Drone Monitoring", 
                icon: "https://img.freepik.com/premium-vector/vector-illustration-smart-farming-tech-with-irrigation-drone-automatic-sprinkler-copter_251917-122.jpg?w=1060",
                href: "/dashboard/drone-monitoring",
              },
            ].map((device) => {
              const CardWrapper = device.href ? Link : 'div';
              const cardProps = device.href ? { href: device.href } : {};

              return (
                <CardWrapper key={device.label} {...(cardProps as any)}>
                  <div 
                    className="group relative w-full flex flex-col overflow-hidden rounded-2xl border border-white/50 shadow-sm hover:shadow-xl hover:border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer p-4 sm:p-6 min-h-[200px] sm:min-h-[240px]"
                    style={{
                      backgroundImage: `url(${device.icon})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                    {/* Text Below Image */}
                    <div className="flex flex-col items-center justify-end text-center relative z-10 h-full">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white drop-shadow-lg">
                        {device.label}
                      </h3>
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