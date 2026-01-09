"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ModeStatus from "../../../../components/ModeStatus";
import { publishMessage, subscribeToTopic } from "../../../../../lib/mqttClient";

type ValveDetailsPageProps = {
  params: Promise<{
    valveId: string;
  }>;
};

type ValveState = {
  isOn: boolean;
};

const VALVE_STATUS_TOPIC = "anuja/esp32/valve/status";
const VALVE_CONTROL_TOPIC = "anuja/esp32/valve/control";

function formatValveLabel(valveId: string) {
  const parts = valveId.split("-");
  if (parts.length === 2 && parts[0].toLowerCase() === "valve") {
    return `Valve ${parts[1]}`;
  }
  return valveId.replace(/-/g, " ");
}

function getValveKey(label: string): "V1" | "V2" | "V3" {
  if (label.includes("1")) return "V1";
  if (label.includes("2")) return "V2";
  return "V3";
}

export default function ValveDetailsPage({ params }: ValveDetailsPageProps) {
  const router = useRouter();
  const { valveId } = use(params);
  const label = formatValveLabel(valveId);
  const valveKey = getValveKey(label);
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedValves = localStorage.getItem("valves");
      if (savedValves) {
        try {
          const valves = JSON.parse(savedValves);
          return !!valves[label]?.isOn;
        } catch (e) {
          console.error("Error loading valve state:", e);
        }
      }
    }
    return valveKey === "V1"; // default keep V1 on for safety
  });

  // Subscribe to valve status
  useEffect(() => {
    const unsubscribe = subscribeToTopic(VALVE_STATUS_TOPIC, (payload) => {
      const msg = payload.trim();
      const parts = msg.split(",");
      let open = false;
      parts.forEach((p) => {
        const [k, v] = p.split("=");
        const on = v?.trim().toUpperCase() === "ON";
        if (k === valveKey) {
          open = on;
        }
      });

      setIsOpen(open);

      // persist
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("valves");
        const valves = saved ? JSON.parse(saved) : {};
        valves[label] = { isOn: open };
        localStorage.setItem("valves", JSON.stringify(valves));
      }
    });

    return () => unsubscribe();
  }, [label, valveKey]);

  const toggleValve = () => {
    const desired = !isOpen;

    if (!desired && typeof window !== "undefined") {
      const saved = localStorage.getItem("valves");
      const valves = saved ? JSON.parse(saved) : {};
      valves[label] = { isOn: isOpen };
      const onCount = Object.values(valves).filter((v: ValveState) => v?.isOn).length;
      if (onCount <= 1) {
        alert("At least one valve must remain ON");
        return;
      }
    }

    setIsOpen(desired);

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("valves");
      const valves = saved ? JSON.parse(saved) : {};
      valves[label] = { isOn: desired };
      localStorage.setItem("valves", JSON.stringify(valves));
    }

    publishMessage(VALVE_CONTROL_TOPIC, `${valveKey}=${desired ? "ON" : "OFF"}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0]">
      {/* Top header bar */}
      <header className="w-full border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-9xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-lime-300 to-lime-400 text-green-900 transition-all hover:scale-110 active:scale-95 shadow-md"
              aria-label="Go back"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-green-600">
                Valve Control
              </span>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-wide text-gray-900">
                {label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ModeStatus />
            <button className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 text-lg sm:text-xl shadow-sm">
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-9xl flex-1 flex-col px-4 sm:px-6 lg:px-8 pb-10 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Irrigation Valve Controller
          </h1>
          <p className="text-sm text-gray-600">
            Node ID: {label || "V-01"} | System Health: Nominal
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Valve Configuration */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Valve Configuration</h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-base font-bold sm:text-lg text-gray-900">
                    {label}
                  </span>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isOpen
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                    Operation Status
                  </p>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOpen ? "bg-blue-500 animate-pulse" : "bg-gray-400"
                    }`}
                  />
                </div>
                <p
                  className={`text-2xl font-black tracking-tight ${
                    isOpen ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {isOpen ? "VALVE ON" : "VALVE OFF"}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={toggleValve}
                  className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                    isOpen
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                      : "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  VALVE ON
                </button>

                <button
                  onClick={toggleValve}
                  className={`py-4 rounded-xl text-xs font-black tracking-[0.2em] transition-all border ${
                    !isOpen
                      ? "bg-rose-600 border-rose-500 text-white shadow-lg"
                      : "bg-white border-gray-300 text-gray-600 hover:border-rose-400 hover:text-rose-600"
                  }`}
                >
                  VALVE OFF
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
