"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import WeatherLoadingAnimation from "../../../components/WeatherLoadingAnimation";

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
    const [locationName, setLocationName] = useState("Erode");

    useEffect(() => {
        async function fetchWeather(latitude: number, longitude: number) {
            try {
                // Fetch weather data
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const data = await res.json();
                setWeather(data);

                // Fetch location name using reverse geocoding
                try {
                    const geoRes = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const geoData = await geoRes.json();
                    setLocationName(geoData.city || geoData.locality || "Erode");
                } catch (geoError) {
                    console.error("Failed to fetch location name:", geoError);
                }
            } catch (error) {
                console.error("Failed to fetch weather:", error);
            } finally {
                setLoading(false);
            }
        }

        // Get user's real-time location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // Fallback to Erode coordinates
                    const lat = 11.3410;
                    const lon = 77.7172;
                    fetchWeather(lat, lon);
                }
            );
        } else {
            // Geolocation not supported, use default Erode coordinates
            const lat = 11.3410;
            const lon = 77.7172;
            fetchWeather(lat, lon);
        }
    }, []);

    if (loading) {
        return <WeatherLoadingAnimation />;
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
        <div className="min-h-screen flex items-start sm:items-center justify-center bg-cover bg-center">
            <div className="relative w-full max-w-sm h-screen sm:h-auto overflow-hidden shadow-2xl bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/weather_background.png')"
                }}>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 z-20 text-black/60 hover:text-black transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>

                {/* Top Section: Date, City, Main Weather */}
                <div className="relative flex flex-col items-center pt-8 pb-4">

                    {/* Blurred background layer */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/images/main_page_top.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "bottom center",

                            borderBottomLeftRadius: "140px",
                            borderBottomRightRadius: "140px",
                            transform: "scaleY(1)",
                            zIndex: 0,

                        }}
                    />

                    {/* Content layer (NOT blurred) */}
                    <div className="relative z-10 text-[#1a2e1a] flex flex-col items-center">

                        <h1 className="font-istok text-2xl sm:text-xl font-extrabold tracking-wide">
                            {todayDate}
                        </h1>

                        <h2 className="text-xl sm:text-2xl font-bold mt-1">
                            {locationName}
                        </h2>

                        <div className="mt-2">
                            <img
                                src="/images/weather_main_symbol.png"
                                alt="Weather Icon"
                                className="h-24 w-24 sm:h-32 sm:w-32 drop-shadow-lg"
                            />
                        </div>

                        <p className="mt-1 text-base sm:text-lg font-semibold opacity-90">
                            {getWeatherDescription(current.weather_code)}
                        </p>

                        <div className="mt-1 text-5xl sm:text-6xl font-black tracking-tighter">
                            {Math.round(current.temperature_2m)}°C
                        </div>

                    </div>

                </div>


                {/* Middle Landscape Decoration (Simulated with SVG or CSS) */}
                {/* We can overlay a semi-transparent hills SVG at the bottom if we want, 
            but the linear gradient does a decent job. 
            Let's add a "glassmorphism" card for the details below. */}

                {/* Bottom Section: Forecast & Details */}
                <div className="mt-8 px-6 sm:px-8 pb-8 flex-1 flex flex-col justify-end">

                    {/* Daily Forecast Row */}
                    <div className="flex justify-between items-start mb-8 px-4">
                        {daily.time.slice(1, 5).map((date: string, index: number) => (
                            <div key={date} className="flex flex-col items-center gap-5">
                                {/* Icons for future days */}
                                <div className="h-8 w-8">
                                    <img
                                        src="/images/weather_sub_1_symbol.png"
                                        alt="icon"
                                        className="w-full h-full object-contain opacity-90"
                                    />
                                </div>
                                <span className="text-lg font-bold text-[#1a2e1a]">{getDayName(date)}</span>
                                <span className="text-lg font-bold text-[#1a2e1a] relative">
                                    {Math.round(daily.temperature_2m_max[index + 1])}°
                                </span>
                                <span className="text-lg font-bold text-[#1a2e1a] relative">
                                    {Math.round(daily.temperature_2m_min[index + 1])}°
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Details Grid */}
                    <div className="flex flex-col gap-y-4 px-4 text-[#1a2e1a] mt-auto">
                        {/* Wind */}
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold opacity-90 text-black">Wind</span>
                            <span className="text-xl font-bold text-black">{current.wind_speed_10m} m/s</span>
                        </div>

                        {/* Humidity */}
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold opacity-90 text-black">Humidity</span>
                            <span className="text-xl font-bold text-black">{current.relative_humidity_2m}%</span>
                        </div>
                    </div>
                </div>

                {/* Subtle texture overlay to mimic the "drawing" style if desired */}
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>
            </div>
        </div>
    );
}
