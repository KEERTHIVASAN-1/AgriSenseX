"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

// Map WMO weather codes to labels and basic icons (using text/emoji for simplicity or images if available)
function getWeatherDescription(code: number) {
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    // 51, 53, 55: Drizzle
    // 61, 63, 65: Rain
    // 71, 73, 75: Snow
    // 95: Thunderstorm
    if (code === 0) return "Sunny";
    if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 95) return "Thunderstorm";
    return "Cloudy";
}

// Helper to get day name
function getDayName(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

export default function WeatherDetailsPage() {
    const router = useRouter();
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Coordinates for Erode, TN
        const lat = 11.3410;
        const lon = 77.7172;

        async function fetchWeather() {
            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const data = await res.json();
                setWeather(data);
            } catch (error) {
                console.error("Failed to fetch weather:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#aecd8e]">
                <div className="text-2xl font-bold text-white">Loading Weather...</div>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#aecd8e]">
                <div className="text-xl text-white">Failed to load weather data.</div>
            </div>
        );
    }

    const current = weather.current;
    const daily = weather.daily;

    const todayDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    // Background styling to match the "green landscape" feel
    // We'll use a gradient that mimics the sky-to-grass transition
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="relative w-full max-w-sm overflow-hidden rounded-[3rem] shadow-2xl bg-cover bg-center"
                style={{
                    backgroundImage: "linear-gradient(to bottom, #87CEEB 0%, #A4D8C2 40%, #88C070 60%, #6E9E55 100%)"
                }}>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 z-20 text-black/60 hover:text-black transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>

                {/* Top Section: Date, City, Main Weather */}
                <div className="relative z-10 flex flex-col items-center pt-12 pb-6 text-[#1a2e1a]">
                    <h1 className="text-xl font-bold tracking-wide">{todayDate}</h1>
                    <h2 className="text-2xl font-extrabold mt-1">Erode</h2>

                    {/* Main Weather Icon */}
                    <div className="mt-4 relative">
                        {/* Using a simple substituted image or emoji for now, or cloud resource if I had one. 
                 Since I can't guarantee external image stability, I'll use a high-quality emoji or styling.
                 However, the user wants "like above image". Let's try to use a nice image URL if possible, 
                 or a CSS art cloud. Let's stick to a robust external image for now, or just the emoji 
                 scaled up if we want to be safe, but "premium" demands better. 
                 I'll try to use the same cloud image from the dashboard if applicable, or a standard one.
                 Dashboard used: https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021689/icons8-rain-cloud-50_jx8pnw.png
                 Let's find a "sun/cloud" one. I'll use a generic weather icon URL.
             */}
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png"
                            alt="Weather Icon"
                            className="h-32 w-32 drop-shadow-lg"
                        />
                    </div>

                    <p className="mt-2 text-lg font-semibold opacity-90">
                        {getWeatherDescription(current.weather_code)}
                    </p>

                    <div className="mt-2 text-6xl font-black tracking-tighter text-[#1a2e1a]">
                        {Math.round(current.temperature_2m)}°C
                    </div>
                </div>

                {/* Middle Landscape Decoration (Simulated with SVG or CSS) */}
                {/* We can overlay a semi-transparent hills SVG at the bottom if we want, 
            but the linear gradient does a decent job. 
            Let's add a "glassmorphism" card for the details below. */}

                {/* Bottom Section: Forecast & Details */}
                <div className="mt-4 px-6 pb-8">

                    {/* Daily Forecast Row */}
                    <div className="flex justify-between items-center mb-8 px-2">
                        {daily.time.slice(1, 5).map((date: string, index: number) => (
                            <div key={date} className="flex flex-col items-center gap-1">
                                {/* Icons for future days - simplified logic */}
                                <div className="h-8 w-8 mb-1">
                                    {/* Simplified icon selection */}
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png"
                                        alt="icon"
                                        className="w-full h-full object-contain opacity-80"
                                    />
                                </div>
                                <span className="text-sm font-bold text-[#1a2e1a]">{getDayName(date)}</span>
                                <span className="text-xs font-semibold text-[#1a2e1a]">{Math.round(daily.temperature_2m_max[index + 1])}°</span>
                            </div>
                        ))}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-4 text-[#1a2e1a]">
                        <div className="flex flex-col items-start p-2">
                            <span className="text-sm font-bold opacity-80">Wind</span>
                            <span className="text-lg font-bold">{current.wind_speed_10m} m/s</span>
                        </div>

                        <div className="flex flex-col items-end p-2">
                            <span className="text-sm font-bold opacity-80">Humidity</span>
                            <span className="text-lg font-bold">{current.relative_humidity_2m}%</span>
                        </div>

                        <div className="flex flex-col items-start p-2">
                            <span className="text-sm font-bold opacity-80">Max Temp</span>
                            <span className="text-lg font-bold">{Math.round(daily.temperature_2m_max[0])}°</span>
                        </div>

                        <div className="flex flex-col items-end p-2">
                            <span className="text-sm font-bold opacity-80">Min Temp</span>
                            <span className="text-lg font-bold">{Math.round(daily.temperature_2m_min[0])}°</span>
                        </div>
                    </div>
                </div>

                {/* Subtle texture overlay to mimic the "drawing" style if desired */}
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>
            </div>
        </div>
    );
}
