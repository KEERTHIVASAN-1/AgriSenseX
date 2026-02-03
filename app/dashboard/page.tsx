'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { subscribeToTopic, publishMessage } from "../../lib/mqttClient";

type PhaseValues = { v: number; i: number; p: number; e: number };
type MotorState = { isOn: boolean; onTime: string; offTime: string };
type ValveState = { isOn: boolean };

const VALVE_STATUS_TOPIC = "anuja/esp32/valve/status";
const VALVE_CONTROL_TOPIC = "anuja/esp32/valve/control";

const MOTOR_TOPICS: Record<number, { control: string; status: string }> = {
  0: { control: "anuja/esp32/motor/control", status: "anuja/esp32/motor/status" },
  1: { control: "anuja/esp32/motor2/control", status: "anuja/esp32/motor2/status" },
};

// Motor icon - sample (replace src with your own icon later)
const MOTOR_ICON_SRC = "https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767021968/icons8-motor-50_ooixaf.png";

export default function DashboardPage() {
  const router = useRouter();
  const [voltage, setVoltage] = useState(100);
  const [current, setCurrent] = useState(11.0);
  const [isModeConnected, setIsModeConnected] = useState(false);
  const [phases, setPhases] = useState<{
    p1: PhaseValues;
    p2: PhaseValues;
    p3: PhaseValues;
  }>({
    p1: { v: 0, i: 0, p: 0, e: 0 },
    p2: { v: 0, i: 0, p: 0, e: 0 },
    p3: { v: 0, i: 0, p: 0, e: 0 },
  });

  // Motors list (Motor 1, Motor 2, ... can add more)
  // Motors list (Motor 1, Motor 2, ... can add more)
  const [motorList, setMotorList] = useState<{ id: string; name: string }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("motorList");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading motor list:", e);
        }
      }
    }
    return [
      { id: "motor1", name: "Motor 1" },
      { id: "motor2", name: "Motor 2" },
    ];
  });
  const [expandedMotor, setExpandedMotor] = useState<string | null>(null);
  const [motorModes, setMotorModes] = useState<Record<string, "manual" | "auto">>({ motor1: "manual", motor2: "manual" });
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
    };
  });
  const [valves, setValves] = useState<Record<string, ValveState>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("valves");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            "Valve 1": { isOn: !!parsed["Valve 1"]?.isOn },
            "Valve 2": { isOn: !!parsed["Valve 2"]?.isOn },
          };
        } catch (e) {
          console.error("Error parsing valves:", e);
        }
      }
    }
    return { "Valve 1": { isOn: true }, "Valve 2": { isOn: false } };
  });
  const lastOnValve = useRef<"V1" | "V2">("V1");
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modeRef = useRef<Record<string, "manual" | "auto">>({ motor1: "manual", motor2: "manual" });

  const [weatherData, setWeatherData] = useState({ temperature: 21, humidity: 47.0, rainfall: 0, windSpeed: 0 });

  // Fetch real-time weather data based on user location
  useEffect(() => {
    async function fetchWeatherData(latitude: number, longitude: number) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`
        );
        const data = await res.json();
        setWeatherData({
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          rainfall: data.current.precipitation || 0,
          windSpeed: data.current.wind_speed_10m || 0,
        });
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
    }

    // Get user's real-time location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to Erode coordinates
          fetchWeatherData(11.3410, 77.7172);
        }
      );
    } else {
      // Geolocation not supported, use default Erode coordinates
      fetchWeatherData(11.3410, 77.7172);
    }
  }, []);

  // Handle weather banner click


  useEffect(() => {
    modeRef.current = motorModes;
  }, [motorModes]);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedVoltage = localStorage.getItem("voltageThreshold");
      const savedCurrent = localStorage.getItem("currentThreshold");
      if (savedVoltage) setVoltage(Number(savedVoltage));
      if (savedCurrent) setCurrent(Number(savedCurrent));
    };
    window.addEventListener("thresholdsUpdated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => {
      window.removeEventListener("thresholdsUpdated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const unsub = subscribeToTopic("anuja/esp32/mode/status", (payload) => {
      const trimmed = payload.trim();
      setIsModeConnected(!!trimmed && trimmed !== "--");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isModeConnected) return;
    const unsub = subscribeToTopic("anuja/esp32/pzem/energy_001", (payload) => {
      try {
        const data = JSON.parse(payload) as { p1?: PhaseValues; p2?: PhaseValues; p3?: PhaseValues };
        setPhases((prev) => ({
          p1: data.p1 ?? prev.p1,
          p2: data.p2 ?? prev.p2,
          p3: data.p3 ?? prev.p3,
        }));
      } catch (err) {
        console.error("Failed to parse energy payload:", err);
      }
    });
    return () => unsub();
  }, [isModeConnected]);

  // Motor status subscriptions (Motor 1, Motor 2)
  useEffect(() => {
    const unsub1 = subscribeToTopic(MOTOR_TOPICS[0].status, (payload) => {
      const isOn = /^(ON|1|true)$/i.test(payload.trim());
      setMotors((prev) => {
        const updated = { ...prev, "Motor 1": { ...prev["Motor 1"], isOn } };
        if (typeof window !== "undefined") localStorage.setItem("motors", JSON.stringify(updated));
        return updated;
      });
    });
    const unsub2 = subscribeToTopic(MOTOR_TOPICS[1].status, (payload) => {
      const isOn = /^(ON|1|true)$/i.test(payload.trim());
      setMotors((prev) => {
        const updated = { ...prev, "Motor 2": { ...prev["Motor 2"], isOn } };
        if (typeof window !== "undefined") localStorage.setItem("motors", JSON.stringify(updated));
        return updated;
      });
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Valve status subscription
  useEffect(() => {
    const unsub = subscribeToTopic(VALVE_STATUS_TOPIC, (payload) => {
      const msg = payload.trim();
      setValves((prev) => {
        const next = { ...prev };
        msg.split(",").forEach((p) => {
          const [k, v] = p.split("=");
          const on = v?.trim().toUpperCase() === "ON";
          if (k === "V1") next["Valve 1"] = { isOn: on };
          if (k === "V2") next["Valve 2"] = { isOn: on };
          if (on && (k === "V1" || k === "V2")) lastOnValve.current = k as "V1" | "V2";
        });
        const anyOn = Object.values(next).some((v) => v.isOn);
        if (!anyOn) {
          const restore = lastOnValve.current || "V1";
          publishMessage(VALVE_CONTROL_TOPIC, `${restore}=ON`);
          if (restore === "V1") next["Valve 1"] = { isOn: true };
          else next["Valve 2"] = { isOn: true };
        }
        if (typeof window !== "undefined") localStorage.setItem("valves", JSON.stringify(next));
        return next;
      });
    });
    return () => unsub();
  }, []);

  const toggleMotor = (name: string, index: number) => {
    if (index > 1) return; // only Motor 1 and 2 have MQTT
    const topic = MOTOR_TOPICS[index]?.control;
    if (!topic) return;
    setMotors((p) => {
      const updated = { ...p, [name]: { ...p[name], isOn: !p[name].isOn } };
      if (typeof window !== "undefined") localStorage.setItem("motors", JSON.stringify(updated));
      const isOn = updated[name].isOn;
      publishMessage(topic, isOn ? "ON" : "OFF");
      return updated;
    });
  };

  const handleToggleValve = (name: string) => {
    const valveKey = name === "Valve 1" ? "V1" : "V2";
    setValves((prev) => {
      const current = prev[name];
      const newIsOn = !current.isOn;
      if (!newIsOn) {
        const onCount = Object.values(prev).filter((v) => v.isOn).length;
        if (onCount <= 1) {
          alert("At least one valve must remain ON");
          return prev;
        }
      }
      const next = { ...prev, [name]: { isOn: newIsOn } };
      if (typeof window !== "undefined") localStorage.setItem("valves", JSON.stringify(next));
      publishMessage(VALVE_CONTROL_TOPIC, `${valveKey}=${newIsOn ? "ON" : "OFF"}`);
      if (newIsOn) lastOnValve.current = valveKey;
      return next;
    });
  };

  const updateMotorTime = (name: string, field: "onTime" | "offTime", v: string) => {
    setMotors((p) => {
      const updated = { ...p, [name]: { ...p[name], [field]: v } };
      if (typeof window !== "undefined") localStorage.setItem("motors", JSON.stringify(updated));
      return updated;
    });
  };

  const setMotorMode = (motorId: string, mode: "manual" | "auto") => {
    setMotorModes((prev) => ({ ...prev, [motorId]: mode }));
    if (mode === "manual") {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      publishMessage("anuja/esp32/motor/control", "MANUAL");
    }
  };

  const saveAuto = (motorName: string, motorIndex: number) => {
    const motor = motors[motorName];
    if (!motor || motor.onTime === motor.offTime) {
      alert("Start time and end time cannot be the same");
      return;
    }
    const topic = MOTOR_TOPICS[motorIndex]?.control;
    if (topic) {
      publishMessage(topic, `AUTO,${motor.onTime},${motor.offTime}`);
    }
    if (motorModes[motorList[motorIndex]?.id] === "auto") {
      alert("Auto mode activated for " + motorName);
    }
  };

  const addMotor = () => {
    let n = 1;
    while (motorList.some(m => m.name === `Motor ${n}`)) {
      n++;
    }
    const newName = `Motor ${n}`;
    const newId = `motor_custom_${Date.now()}`;

    setMotorList((prev) => {
      const updated = [...prev, { id: newId, name: newName }];
      if (typeof window !== "undefined") localStorage.setItem("motorList", JSON.stringify(updated));
      return updated;
    });
    setMotors((prev) => {
      const updated = {
        ...prev,
        [newName]: { isOn: false, onTime: "06:00", offTime: "18:00" },
      };
      if (typeof window !== "undefined") localStorage.setItem("motors", JSON.stringify(updated));
      return updated;
    });
    setMotorModes((prev) => ({ ...prev, [newId]: "manual" }));
  };

  const deleteMotor = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setMotorList((prev) => {
        const updated = prev.filter(m => m.id !== id);
        if (typeof window !== "undefined") localStorage.setItem("motorList", JSON.stringify(updated));
        return updated;
      });
      setMotors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        if (typeof window !== "undefined") localStorage.setItem("motors", JSON.stringify(updated));
        return updated;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  const phaseCircles = [
    { id: "p1", v: phases.p1.v.toFixed(1), a: phases.p1.i.toFixed(1), borderClass: "border-red-500" },
    { id: "p2", v: phases.p2.v.toFixed(1), a: phases.p2.i.toFixed(1), borderClass: "border-yellow-500" },
    { id: "p3", v: phases.p3.v.toFixed(1), a: phases.p3.i.toFixed(1), borderClass: "border-[#5bc0eb]" },
  ];

  const otherDevices = [
    { label: "Weather Station", icon: "https://img.freepik.com/premium-photo/weather-station-cartoon-vector-icon-illustration_1022901-71469.jpg", href: "/dashboard/weather-station" },
    { label: "Fertigation Mode", icon: "https://static.vecteezy.com/system/resources/previews/049/768/605/original/cartoon-of-cute-fertilizer-illustration-with-simple-colors-and-concept-free-vector.jpg", href: "/dashboard/fertigation" },
    { label: "Drone Monitoring", icon: "https://img.freepik.com/premium-vector/vector-illustration-smart-farming-tech-with-irrigation-drone-automatic-sprinkler-copter_251917-122.jpg?w=1060", href: "/dashboard/drone-monitoring" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col" style={{ backgroundColor: '#eefae6' }}>
      {/* Top weather banner - desktop: centered content */}
      <header className="w-full shadow-[0px_9px_3px_-4px_rgba(0,_0,_0,_0.35)]">
        <Link href="/dashboard/weather-details" className="block relative h-40 sm:h-48 lg:h-52 w-full overflow-hidden rounded-none shadow-md mb-0 cursor-pointer hover:opacity-95 transition-opacity">
          <div className="absolute inset-0 overflow-hidden">
            <img src="/images/main_page_top.png" alt="Farm Background" className="h-full w-full object-cover object-bottom origin-bottom scale-y-130 rounded-sm " />
          </div>
          <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 ">
            <div className="w-full max-w-5xl lg:max-w-6xl mx-auto grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 place-items-center">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/images/summer.png" alt="Temperature" className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
                  <span className="text-sm sm:text-base lg:text-lg text-black/90 font-bold">Temperature</span>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">{weatherData.temperature}°C</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/images/rain.png" alt="Rainfall" className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
                  <span className="text-sm sm:text-base lg:text-lg text-black/90 font-bold">Rainfall</span>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">{weatherData.rainfall} mm</p>
              </div>
            </div>
          </div>
        </Link>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 pt-6 pb-8 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16 ">
        <div className="max-w-5xl lg:max-w-6xl mx-auto ">
          {/* Phase Monitoring - desktop: card layout like reference */}
          <section className="mb-8 rounded-2xl p-5 sm:p-6 lg:p-8 bg-[#dcffcb]/60 border border-[#b8d4a0] shadow-[4px_4px_10px_0px_rgba(0,_0,_0,_0.8)]">
            <h1 className="text-center text-xl sm:text-lg font-extrabold text-shadow-lg uppercase tracking-wider text-[#2d3436] mb-1">Phase Monitoring</h1>
            <p className="text-center text-xs sm:text-sm text-[#2d3436]/80 mb-4 sm:mb-6">Click on each card to view Power and Energy</p>
            <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 ">
              {phaseCircles.map((p) => (
                <div key={p.id} className={`flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[#eefae6] border-3 ${p.borderClass} shadow-sm`}>
                  <span className="text-base sm:text-lg font-mono font-bold text-[#2d3436]">{p.v}V</span>
                  <div className="w-10 sm:w-12 border-t-2 border-blackmy-1" />
                  <span className="text-base sm:text-lg font-mono font-bold text-[#2d3436]">{p.a}A</span>
                </div>
              ))}
            </div>
            <div className="rounded-3xl p-4 border border-[#dcffcb] shadow-[0px_0px_9px_-3px_rgba(0,_0,_0,_0.2)] flex items-center justify-between gap-4">
              <div>
                <label className="text-sm font-semibold text-[#4f8820] block mb-1">Voltage & Current Threshold:</label>
                <p className="text-base sm:text-lg font-mono font-bold text-[#2d3436]">{voltage}V | {current} A</p>
              </div>
              <button onClick={() => router.push("/dashboard/motor-control/thresholds")} className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#90cd72] hover:bg-[#a8c890] text-[#2d3436] transition-colors shadow-sm" aria-label="Edit thresholds">
                <PencilIcon className="w-5 h-5" />
              </button>
            </div>
          </section>

          {/* Motor Control & Management - desktop: same card style as reference */}
          <section className="mb-10">
            <h2 className="text-base sm:text-lg font-bold uppercase text-shadow-lg tracking-wider text-[#2d3436] mb-3 sm:mb-4">Motor Control & Management</h2>
            <div className="space-y-3 sm:space-y-4">
              {motorList.map((motor, idx) => {
                const motorState = motors[motor.name] ?? { isOn: false, onTime: "06:00", offTime: "18:00" };
                const mode = motorModes[motor.id] ?? "manual";
                const isExpanded = expandedMotor === motor.id;
                const hasMqtt = idx < 2;

                return (
                  <div key={motor.id} className="rounded-2xl border border-[#b8d4a0] bg-[#d4e8c4]/50 shadow-[0px_8px_13px_-5px_rgba(0,_0,_0,_0.35)] overflow-hidden">
                    {/* Motor header - click to expand/collapse */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer bg-[background: #D9D9D9]"
                      onClick={() => setExpandedMotor(isExpanded ? null : motor.id)}
                    >
                      <div className="flex items-center gap-3 ">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white overflow-hidden">
                          <img src="\images\electric-motor.png" alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-lg font-bold text-[#2d3436]">{motor.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (hasMqtt) toggleMotor(motor.name, idx);
                            }}
                            className={`relative w-14 h-8 rounded-full transition-colors ${motorState.isOn ? "bg-[#5e970e]" : "bg-gray-400"}`}
                            aria-label={`${motor.name} ${motorState.isOn ? "ON" : "OFF"}`}
                          >
                            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${motorState.isOn ? "left-7" : "left-1"}`} />
                          </button>
                          <span className="text-xs text-gray-500">ON/OFF</span>
                        </div>

                        {/* Delete button (X) for extra motors */}
                        {!hasMqtt && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMotor(motor.id, motor.name);
                            }}
                            className="flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                            title="Delete Motor"
                          >
                            <span className="font-bold text-lg">×</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded: Manual / Auto and valve controls */}
                    {isExpanded && (
                      <div className="border-t border-[#b8d4a0] bg-[#e8f5e0]/50 p-4 space-y-4">
                        <div className="flex rounded-full bg-#e8f5e0-50 p-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setMotorMode(motor.id, "manual"); }}
                            className={`flex-1 rounded-full py-2 text-sm font-bold ${mode === "manual" ? "bg-[#90cd72] text-black font-extrabold shadow-[5px_8px_6px_-5px_rgba(0,_0,_0,_0.8)]" : "text-[#2d3436] hover:bg-green-100"}`}
                          >
                            MANUAL
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMotorMode(motor.id, "auto"); }}
                            className={`flex-1 rounded-full py-2 text-sm font-bold ${mode === "auto" ? "bg-[#90cd72] text-black font-extrabold shadow-[5px_8px_6px_-5px_rgba(0,_0,_0,_0.8)]" : "text-[#2d3436] hover:bg-green-100"}`}
                          >
                            AUTO
                          </button>
                        </div>

                        {mode === "manual" ? (
                          <div className="grid grid-cols-2 gap-4 ">
                            {["Valve 1", "Valve 2"].map((v) => (
                              <div key={v} className="rounded-xl bg-[#f3fae8] border border-[#b8d4a0] p-4 flex flex-col items-center gap-2 shadow-[4px_7px_3px_-3px_rgba(0,_0,_0,_0.35)]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white">
                                  <img src="/images/valve_icon.png" alt="Valve" className="w-10 h-10" />
                                </div>
                                <span className="text-sm font-bold text-[#2d3436]">{v}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleToggleValve(v); }}
                                  className={`w-16 rounded-2xl py-2 text-xs font-bold ${valves[v]?.isOn ? "bg-[#90cd72] text-black" : "bg-gray-300 text-gray-700"}`}
                                >
                                  {valves[v]?.isOn ? "ON" : "OFF"}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {["Valve 1", "Valve 2"].map((v) => (
                              <div key={v} className="rounded-xl bg-[#f3fae8] border border-[#b8d4a0] p-2 sm:p-3 flex flex-col items-center shadow-[4px_7px_3px_-3px_rgba(0,_0,_0,_0.35)]">
                                {/* Valve Icon and Name */}
                                <div className="flex flex-col items-center gap-1 mb-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white">
                                    <img src="/images/valve_icon.png" alt="Valve" className="w-8 h-8" />
                                  </div>
                                  <span className="font-bold text-[#2d3436] text-xs whitespace-nowrap">{v}</span>
                                </div>

                                {/* Time Inputs with Individual Labels */}
                                <div className="flex items-end gap-1.5 sm:gap-2 w-full mb-2">
                                  {/* Start Time */}
                                  <div className="flex-1 flex flex-col items-center min-w-0">
                                    <label className="text-[11px] sm:text-[10px] text-black-600 mb-1 font-semibold whitespace-nowrap">
                                      Start Time
                                    </label>
                                    <input
                                      type="time"
                                      value={motorState.onTime}
                                      onChange={(e) => updateMotorTime(motor.name, "onTime", e.target.value)}
                                      onFocus={(e) => e.stopPropagation()}
                                      className="w-full rounded-xl border border-gray-300 px--5 sm:px-1.5 py-1 text-[8px] sm:text-[10px] text-center bg-white shadow-[0px_1px_4px_2px_rgba(0,_0,_0,_0.1)]"
                                    />
                                  </div>

                                  {/* Vertical Divider */}
                                  <div className="w-0.5 h-10 bg-gray-600 rounded-full"></div>

                                  {/* End Time */}
                                  <div className="flex-1 flex flex-col items-center min-w-0">
                                    <label className="text-[11px] sm:text-[10px] text-black-600 mb-1 font-semibold whitespace-nowrap">
                                      End Time
                                    </label>
                                    <input
                                      type="time"
                                      value={motorState.offTime}
                                      onChange={(e) => updateMotorTime(motor.name, "offTime", e.target.value)}
                                      onFocus={(e) => e.stopPropagation()}
                                      className="w-full rounded-xl border border-gray-300 px-0 sm:px-1.5 py-1 text-[8px] sm:text-[10px] text-center bg-white shadow-[0px_1px_4px_2px_rgba(0,_0,_0,_0.1)]"
                                    />
                                  </div>
                                </div>

                                {/* Save Button - Half Width and Centered */}
                                <div className="w-full flex justify-center">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); saveAuto(motor.name, idx); }}
                                    className="w-1/2 rounded-2xl py-1.5 bg-[#90cd72] hover:bg-[#6a9331] text-black text-xs font-bold transition-colors"
                                  >
                                    SAVE
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Add Motor + button - outside motor blocks */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={addMotor}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2d3436] text-white shadow-md hover:bg-[#1a1d1e] transition-colors"
                  aria-label="Add motor"
                >
                  <PlusIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </section>

          {/* Other devices - visible after scroll */}
          <section className="pt-6 sm:pt-8 border-t border-[#b8d4a0]/50">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#2d3436] mb-3 sm:mb-4">Other Devices</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-12">
              {otherDevices.map((device) => (
                <Link key={device.label} href={device.href}>
                  <div
                    className="group relative w-full flex flex-col overflow-hidden rounded-2xl border border-white/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer p-4 sm:p-6 min-h-[160px] sm:min-h-[200px]"
                    style={{ backgroundImage: `url(${device.icon})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="flex flex-col items-center justify-end text-center relative z-10 h-full">
                      <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-lg">{device.label}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <div>
          <img src="/images/design_img.png" alt="Footer Image" className="w-25 h-23 object-cover object-top mt-auto" />
      </div>        
    </div>
  );
}
