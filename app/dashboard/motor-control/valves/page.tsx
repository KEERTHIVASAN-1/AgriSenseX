"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ModeStatus from "../../../components/ModeStatus";
import { publishMessage, subscribeToTopic } from "../../../../lib/mqttClient";

type ValveState = {
  isOn: boolean;
};

const VALVE_STATUS_TOPIC = "anuja/esp32/valve/status";
const VALVE_CONTROL_TOPIC = "anuja/esp32/valve/control";

export default function ValvePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "auto">("manual");

  const [valves, setValves] = useState<Record<string, ValveState>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("valves");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            "Valve 1": { isOn: !!parsed["Valve 1"]?.isOn },
            "Valve 2": { isOn: !!parsed["Valve 2"]?.isOn },
            "Valve 3": { isOn: !!parsed["Valve 3"]?.isOn },
          };
        } catch (e) {
          console.error("Error parsing valves from storage:", e);
        }
      }
    }
    return {
      "Valve 1": { isOn: true }, // default ON for safety
      "Valve 2": { isOn: false },
      "Valve 3": { isOn: false },
    };
  });

  // Track the last ON valve for safety fallback
  const lastOnValve = useRef<"V1" | "V2" | "V3">("V1");
  // Subscribe to valve status topic
  useEffect(() => {
    const unsubscribe = subscribeToTopic(VALVE_STATUS_TOPIC, (payload) => {
      const msg = payload.trim();

      setValves((prev) => {
        const nextValves: Record<string, ValveState> = { ...prev };

        msg.split(",").forEach((p) => {
          const [k, v] = p.split("=");
          const on = v?.trim().toUpperCase() === "ON";
          if (k === "V1") nextValves["Valve 1"] = { isOn: on };
          if (k === "V2") nextValves["Valve 2"] = { isOn: on };
          if (k === "V3") nextValves["Valve 3"] = { isOn: on };
          if (on && (k === "V1" || k === "V2" || k === "V3")) {
            lastOnValve.current = k as "V1" | "V2" | "V3";
          }
        });

        // Safety: ensure at least one valve stays ON
        const anyOn = Object.values(nextValves).some((v) => v.isOn);
        if (!anyOn) {
          const restore = lastOnValve.current || "V1";
          publishMessage(VALVE_CONTROL_TOPIC, `${restore}=ON`);
          if (restore === "V1") nextValves["Valve 1"] = { isOn: true };
          if (restore === "V2") nextValves["Valve 2"] = { isOn: true };
          if (restore === "V3") nextValves["Valve 3"] = { isOn: true };
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("valves", JSON.stringify(nextValves));
        }

        return nextValves;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleValve = (name: string) => {
    const valveKey = name === "Valve 1" ? "V1" : name === "Valve 2" ? "V2" : "V3";

    setValves((prev) => {
      const current = prev[name];
      const newIsOn = !current.isOn;

      // Safety: prevent turning off the last ON valve
      if (!newIsOn) {
        const onCount = Object.values(prev).filter((v) => v.isOn).length;
        if (onCount <= 1) {
          alert("At least one valve must remain ON");
          return prev;
        }
      }

      const next = { ...prev, [name]: { isOn: newIsOn } };

      if (typeof window !== "undefined") {
        localStorage.setItem("valves", JSON.stringify(next));
      }

      publishMessage(VALVE_CONTROL_TOPIC, `${valveKey}=${newIsOn ? "ON" : "OFF"}`);
      if (newIsOn) {
        lastOnValve.current = valveKey;
      }

      return next;
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
                  Valve Control
                </h1>
                <p className="text-sm text-green-700">
                  Valve Management System
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
          <div className="flex rounded-2xl bg-green-50  p-1">
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

        {/* Valves section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">
              Valve Control
            </h2>
            <span className="text-xs text-gray-400 sm:text-sm">
              {mode === "manual" ? "Manual Mode" : "Auto Mode"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["Valve 1", "Valve 2", "Valve 3"].map((valve) => {
              const valveState = valves[valve];

              return (
                <div
                  key={valve}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-black shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* Valve Icon */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-200 to-indigo-200 shadow-md transition-transform group-hover:scale-110">
                        <span className="text-4xl">
                          <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767022401/icons8-valve-64_xhtuoh.png" alt="Valve Icon" width={40} height={40} className="opacity-90 object-contain" />
                        </span>
                      </div>
                    </div>

                    {/* Status dot */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          valveState.isOn ? "bg-blue-500 animate-pulse" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs text-gray-600">
                        {valveState.isOn ? "Open" : "Close"}
                      </span>
                    </div>

                    {/* Single Open/Closed Toggle Button */}
                    <button
                      onClick={() => handleToggleValve(valve)}
                      className={`w-full rounded-xl py-3 text-center text-sm font-bold transition-all shadow-md ${
                        valveState.isOn
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
                      }`}
                    >
                      {valveState.isOn ? "OPEN" : "CLOSE"}
                    </button>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 transition-all group-hover:from-blue-500/5 group-hover:to-indigo-500/5 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

