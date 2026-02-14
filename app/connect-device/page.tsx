"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { publishMessage, subscribeToTopic } from "../../lib/mqttClient";

export default function ConnectDevicePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"wifi" | "gsm" | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTopic(
      "anuja/esp32/mode/status",
      (payload) => {
        const trimmed = payload.trim();

        if (!trimmed) {
          return;
        }

        if (trimmed.toUpperCase().includes("WIFI")) {
          setSelectedMode("wifi");
        } else if (trimmed.toUpperCase().includes("GSM")) {
          setSelectedMode("gsm");
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOptionClick = (option: "wifi" | "gsm") => {
    setIsMenuOpen(false);

    const modePayload = option.toUpperCase() === "WIFI" ? "WIFI" : "GSM";
    publishMessage("anuja/esp32/mqtt_mode", modePayload);

    setSelectedMode(option);

    // ✅ SAVE HERE
    localStorage.setItem("connectionMode", option);

    router.push(`/dashboard?mode=${option}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e5f9dd] relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0">
        <img
          src="/images/design_img_2.png"
          alt="Footer Image"
          className="w-25 h-23 object-cover object-top mt-auto"
        />
      </div>
      <div className="absolute bottom-0 left-0">
        <img
          src="/images/design_img.png"
          alt="Footer Image"
          className="w-25 h-23 object-cover object-top mt-auto"
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-sm px-6">
        <h1 className="text-3xl font-semibold text-center mb-10">
          Select Connectivity
        </h1>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)] p-8 flex flex-col">
          <div className="space-y-6 m-6 flex flex-col items-start">
            {/* GSM */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={selectedMode === "gsm"}
                onChange={() => setSelectedMode("gsm")}
                className="w-5 h-5 appearance-none rounded-full border-2 border-gray-600 checked:bg-black/50"
              />
              <span className="text-lg">GSM (Sim-based)</span>
            </label>

            {/* WiFi */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={selectedMode === "wifi"}
                onChange={() => setSelectedMode("wifi")}
                className="w-5 h-5 appearance-none rounded-full border-2 border-gray-600 checked:bg-black/50"
              />
              <span className="text-lg">Wifi (Local Network)</span>
            </label>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (!selectedMode) return;
                handleOptionClick(selectedMode);
              }}
              className="w-40 bg-[#B3F296] hover:bg-[#8cc86c] text-gray-800 font-semibold px-0 py-2 rounded-full shadow-[0px_3px_6px_0px_rgba(0,0,0,0.8)] transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
