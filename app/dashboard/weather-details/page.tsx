"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import WeatherLoadingAnimation from "../../../components/WeatherLoadingAnimation";

// Map WMO weather codes to labels and basic icons (using text/emoji for simplicity or images if available)
function getWeatherDescription(code: number) {
  // Clear
  if (code === 0 || code === 1) return "Sunny";

  // Cloudy
  if (code >= 1 && code <= 3) return "Partly Sunny";

  // Fog
  if (code === 45 || code === 48) return "Partly Cloudy";

  // Rain + Drizzle + Showers + Thunderstorm
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95)
    return "Rainy";

  // Snow + freezing rain
  if (code >= 71 && code <= 77) return "Snowy";

  return "Cloudy";
}

function getWeatherIcon(code: number) {
  // Sunny
  if (code === 0 || code === 1) return "/images/sunny.png";

  // Partly sunny / cloudy
  if (code >= 2 && code <= 3) return "/images/partly_sunny.png";

  // Fog
  if (code === 45 || code === 48) return "/images/partly_cloudy.png";

  // Rain
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95)
    return "/images/rainy.png";

  // Snow
  if (code >= 71 && code <= 77) return "/images/snowy.png";

  return "/images/weather_sub_1_symbol.png";
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

  // for drag and drop bottom sheet functionality
  const [translateY, setTranslateY] = useState(300);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const initialTranslateRef = useRef(350);

  useEffect(() => {
    async function fetchWeather(latitude: number, longitude: number) {
      try {
        // Fetch weather data
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
        );
        const data = await res.json();
        setWeather(data);

        // Fetch location name using reverse geocoding
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
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
          const lat = 11.341;
          const lon = 77.7172;
          fetchWeather(lat, lon);
        },
      );
    } else {
      // Geolocation not supported, use default Erode coordinates
      const lat = 11.341;
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
      <div
        className="relative w-full max-w-sm h-screen sm:h-auto overflow-hidden shadow-2xl bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/weather_page_background.png')",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 text-black/60 hover:text-black transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>

        {/* Top Section: City, Main Weather */}
        <div className="relative flex flex-row justify-between pt-8 pb-4 mt-4 ml-3 mr-3 z-10">
          <div>
            <div className="flex flex-row gap-2">
              <div className="mt-1 text-8xl sm:text-10xl font-semibold tracking-tighter text-white [text-shadow:0px_8px_4px_#6a6a6a]">
                {Math.round(current.temperature_2m)}
              </div>
              <div className="mt-1 text-4xl sm:text-6xl font-semibold tracking-tighter text-white">
                °C
              </div>
            </div>
            <h2 className="text-xl text-white sm:text-2xl font-bold mt-2">
              {locationName},India
            </h2>
          </div>

          <div className="relative z-10 text-white flex flex-col items-center">
            <p className="mt-1 text-base sm:text-lg font-semibold opacity-90">
              {getWeatherDescription(current.weather_code)}
            </p>
            <div className="flex justify-between items-center gap-2">
              <span className="text-sm opacity-90 font-semibold text-white">
                Wind
              </span>
              <span className="text-sm font-semibold text-white">
                {current.wind_speed_10m} m/s
              </span>
            </div>
          </div>
        </div>

        {/* Draggable Bottom Sheet */}
        <div
          className="absolute left-0 bottom-0 w-full bg-white rounded-t-3xl p-5 shadow-xl"
          style={{
            transform: `translateY(${translateY}px)`,
            touchAction: "none",
            transition: dragging
              ? "none"
              : "transform 300ms cubic-bezier(.2,.8,.2,1)",
          }}
          onPointerDown={(e) => {
            // start dragging; capture pointer so we keep receiving events
            const target = e.currentTarget as Element;
            try {
              target.setPointerCapture(e.pointerId);
            } catch (err) {}
            setDragging(true);
            startYRef.current = e.clientY;
            initialTranslateRef.current = translateY;
          }}
          onPointerMove={(e) => {
            if (!dragging) return;
            e.preventDefault();

            const currentY = e.clientY;
            const diff = currentY - startYRef.current;
            let next = initialTranslateRef.current + diff;

            if (next < 0) next = 0;
            if (next > 500) next = 500;

            setTranslateY(next);
          }}
          onPointerUp={(e) => {
            const target = e.currentTarget as Element;
            try {
              target.releasePointerCapture(e.pointerId);
            } catch (err) {}
            setDragging(false);

            // snap - you can tweak threshold
            if (translateY < 200) {
              setTranslateY(0);
            } else {
              setTranslateY(300);
            }
          }}
          onPointerCancel={() => {
            setDragging(false);
            setTranslateY(300);
          }}
        >
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto mb-4"></div>

          {daily.time.slice(0, 7).map((date: string, index: number) => (
            <div key={date} className="grid grid-cols-4 items-center border-b pb-3 mb-3 text-sm">
              <span className="font-medium">
                {index === 0
                  ? "Today"
                  : index === 1
                    ? "Tomorrow"
                    : getDayName(date)}
              </span>
              <img
                src={getWeatherIcon(daily.weather_code[index])}
                className="w-6 h-6"
                alt="weather icon"
              />
              <span className="text-center truncate">{getWeatherDescription(daily.weather_code[index])}</span>
              <span className="text-right font-semibold">
                {Math.round(daily.temperature_2m_max[index])}/
                {Math.round(daily.temperature_2m_min[index])}°C
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
