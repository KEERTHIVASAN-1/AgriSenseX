"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { publishMessage, subscribeToTopic } from "../../lib/mqttClient";

export default function ConnectDevicePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setSelectedMode] = useState<"wifi" | "gsm" | null>(null);

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
      }
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

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-[#e1e8ed]">
        <div className="mx-auto max-w-9xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7faf3b] to-[#6a9331] text-white hover:scale-105 active:scale-95 transition shadow-md"
                aria-label="Go back"
              >
                <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767027198/icons8-farmer-100_cmxz20.png" alt="" />
              </button>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl text-[#2d3436]">
                  AgriSenseX
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-9xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
            <div className="mb-6">
                <img
                src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767026447/e-groots_no_bg_isnnax.png"
                alt="No Devices Connected"
                width={160}
                height={160}
                className="mx-auto h-40 w-40 object-contain opacity-90"
                />
            </div>

            <h2 className="text-2xl font-bold text-[#2d3436] mb-2">
                No Devices Connected
            </h2>

            <p className="text-[#636e72] mb-8">
                Click the + button to connect a new device
            </p>
        </div>
      </main>

      {/* Floating Action Button with Options */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50">
        {/* WiFi and GSM Options */}
        {isMenuOpen && (
          <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-4">
            {/* WiFi Option */}
            <button
              onClick={() => handleOptionClick("wifi")}
              className="group flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-xl border border-[#e1e8ed] hover:border-[#7faf3b] hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a90e2] to-[#357abd] text-white shadow-md">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#2d3436]">WiFi</div>
                <div className="text-xs text-[#636e72]">Connect via WiFi</div>
              </div>
            </button>

            {/* GSM Option */}
            <button
              onClick={() => handleOptionClick("gsm")}
              className="group flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-xl border border-[#e1e8ed] hover:border-[#7faf3b] hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7faf3b] to-[#6a9331] text-white shadow-md">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#2d3436]">GSM</div>
                <div className="text-xs text-[#636e72]">Connect via GSM</div>
              </div>
            </button>
          </div>
        )}

      {/* Floating Action Button with Options */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative flex flex-col items-end gap-4">
          {/* WiFi and GSM Options */}
          <div
            className={`flex flex-col gap-3 transition-all duration-300 ${
              isMenuOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {/* WiFi Option */}
            <button
              onClick={() => handleOptionClick("wifi")}
              className="group flex items-center gap-4 pl-5 pr-6 py-4 bg-white rounded-2xl shadow-xl border-2 border-[#e1e8ed] hover:border-[#7faf3b] hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:-translate-x-1"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md group-hover:shadow-lg transition-shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 text-lg">WiFi</p>
                <p className="text-sm text-gray-500">Connect via WiFi</p>
              </div>
            </button>

            {/* GSM Option */}
            <button
              onClick={() => handleOptionClick("gsm")}
              className="group flex items-center gap-4 pl-5 pr-6 py-4 bg-white rounded-2xl shadow-xl border-2 border-[#e1e8ed] hover:border-[#7faf3b] hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:-translate-x-1"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md group-hover:shadow-lg transition-shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 text-lg">GSM</p>
                <p className="text-sm text-gray-500">Connect via GSM</p>
              </div>
            </button>
          </div>

          {/* Main Plus Button */}
          <button
            onClick={toggleMenu}
            className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#7faf3b] to-[#6a9331] text-white text-3xl font-light shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 ${
              isMenuOpen ? "rotate-45" : "rotate-0"
            }`}
            aria-label="Toggle menu"
          >
            <span className="relative z-10">+</span>

            {/* Pulse effect */}
            {!isMenuOpen && (
              <>
                <span className="absolute inset-0 rounded-full bg-[#7faf3b] opacity-75 animate-ping"></span>
                <span className="absolute inset-0 rounded-full bg-[#7faf3b] opacity-50 animate-pulse"></span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      </div>
    </div>
  );
}