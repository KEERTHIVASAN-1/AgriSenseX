"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { publishMessage, subscribeToTopic } from "../../../../lib/mqttClient";
import ModeStatus from "../../../components/ModeStatus";

type MotorState = {
  isOn: boolean;
  onTime: string;
  offTime: string;
};

export default function MotorsPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "auto">("manual");

  const [motors, setMotors] = useState<Record<string, MotorState>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("motors");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading motors:", e);
        }
      }
    }
    return {
      "Motor 1": { isOn: false, onTime: "06:00", offTime: "18:00" },
      "Motor 2": { isOn: false, onTime: "06:00", offTime: "18:00" },
      "Motor 3": { isOn: false, onTime: "06:00", offTime: "18:00" },
      "Motor 4": { isOn: false, onTime: "06:00", offTime: "18:00" },
    };
  });

  useEffect(() => {
    const unsubscribeMotor1 = subscribeToTopic(
      "anuja/esp32/motor/status",
      (payload) => {
        const isOn =
          payload.trim().toUpperCase() === "ON" ||
          payload.trim() === "1" ||
          payload.trim().toLowerCase() === "true";

        setMotors((prev) => {
          const updated = {
            ...prev,
            "Motor 1": {
              ...prev["Motor 1"],
              isOn,
            },
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("motors", JSON.stringify(updated));
          }
          return updated;
        });
      }
    );

    const unsubscribeMotor2 = subscribeToTopic(
      "anuja/esp32/motor2/status",
      (payload) => {
        const isOn =
          payload.trim().toUpperCase() === "ON" ||
          payload.trim() === "1" ||
          payload.trim().toLowerCase() === "true";

        setMotors((prev) => {
          const updated = {
            ...prev,
            "Motor 2": {
              ...prev["Motor 2"],
              isOn,
            },
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("motors", JSON.stringify(updated));
          }
          return updated;
        });
      }
    );

    return () => {
      unsubscribeMotor1();
      unsubscribeMotor2();
    };
  }, []);

  const toggleMotor = (name: string, index: number) => {
    setMotors((p) => {
      const updated = { ...p, [name]: { ...p[name], isOn: !p[name].isOn } };
      if (typeof window !== "undefined") {
        localStorage.setItem("motors", JSON.stringify(updated));
      }

      if (mode === "manual") {
        const topic =
          index === 0
            ? "anuja/esp32/motor/control"
            : index === 1
            ? "anuja/esp32/motor2/control"
            : null;

        if (topic) {
          const isOn = updated[name].isOn;
          publishMessage(topic, isOn ? "ON" : "OFF");
        }
      }

      return updated;
    });
  };

  const updateMotorTime = (name: string, field: "onTime" | "offTime", v: string) => {
    setMotors((p) => {
      const updated = { ...p, [name]: { ...p[name], [field]: v } };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("motors", JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-9xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                aria-label="Go back"
                className="group flex h-10 w-10 items-center justify-center rounded-2xl
                          bg-gradient-to-br from-[#7faf3b] to-[#6a9331]
                          text-white shadow-md ring-1 ring-black/5
                          transition-all hover:shadow-lg hover:-translate-x-0.5 active:scale-95"
              >
                <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  Motors
                </h1>
                <p className="text-sm text-green-700">
                  Motor Control Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ModeStatus />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 border border-green-300">
                ⚙️
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Mode Toggle */}
        <section className="mb-6">
          <div className="flex rounded-2xl bg-green-50 p-1">
            <button
              onClick={() => setMode("manual")}
              className={`flex-1 rounded-xl py-3 font-bold ${
                mode === "manual"
                  ? "bg-green-700 text-white shadow"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setMode("auto")}
              className={`flex-1 rounded-xl py-3 font-bold ${
                mode === "auto"
                  ? "bg-green-700 text-white shadow"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              Auto
            </button>
          </div>
        </section>

        {/* Motors grid - enhanced design */}
        <main>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">
              Available Motors
            </h2>
            <span className="text-xs text-gray-400 sm:text-sm">
              {mode === "manual" ? "Manual Mode" : "Auto Mode"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
          {["Motor 1", "Motor 2", "Motor 3", "Motor 4"].map((motor, idx) => {
              const motorState = motors[motor];
              return (
                <div
                  key={motor}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 text-black shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* View Details Link - Top */}
                    <Link
                      href={`/dashboard/motor-control/motor/motor-${idx + 1}`}
                      className="self-end text-xs text-gray-500 hover:text-[#7faf3b] font-semibold transition-colors z-10"
                    >
                      View Details →
                    </Link>

                    {/* Motor Icon - Green when active, Red when off */}
                    <div className="flex flex-col items-center gap-3">
                      <div className={`flex h-20 w-20 items-center justify-center 
                        rounded-2xl shadow-md transition-transform group-hover:scale-110 ${
                        motorState.isOn
                          ? "bg-gradient-to-br from-green-100 to-green-200"
                          : "bg-gradient-to-br from-red-100 to-red-200"
                      }`}>
                        <span className="text-4xl">
                          <img 
                            src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021968/icons8-motor-50_ooixaf.png" 
                            alt="Motor Icon" 
                            width={40} 
                            height={40} 
                            className={`object-contain ${
                              motorState.isOn
                                ? "opacity-90 brightness-0 saturate-100 hue-rotate-[200deg]"
                                : "opacity-90 brightness-0 saturate-100 hue-rotate-[0deg]"
                            }`}
                            style={{
                              filter: motorState.isOn 
                                ? 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(88deg) brightness(118%) contrast(119%)'
                                : 'brightness(0) saturate(100%) invert(15%) sepia(94%) saturate(7151%) hue-rotate(350deg) brightness(95%) contrast(88%)'
                            }}
                          />
                        </span>
                      </div>
                    </div>

                    {/* Single On/Off Toggle Button */}
                    <button
                    onClick={() => toggleMotor(motor, idx)}
                    className={`w-full rounded-xl py-3 text-center text-sm font-bold transition-all shadow-md ${
                        motorState.isOn
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
                      }`}
                    >
                      {motorState.isOn ? "ON" : "OFF"}
                    </button>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7faf3b]/0 to-[#7faf3b]/0 transition-all group-hover:from-[#7faf3b]/5 group-hover:to-[#8ac34a]/5 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

