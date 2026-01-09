"use client";

import { useState, useEffect } from "react";
import { subscribeToTopic } from "../../lib/mqttClient";

export default function ModeStatus() {
  const [modeStatus, setModeStatus] = useState<string>("--");

  useEffect(() => {
    const MODE_TOPIC = "anuja/esp32/mqtt_mode";
    
    const unsubscribe = subscribeToTopic(
      MODE_TOPIC,
      (payload) => {
        const trimmed = payload.trim().toUpperCase();
        if (trimmed === "WIFI" || trimmed === "GSM") {
          setModeStatus(trimmed);
        } else {
          setModeStatus("--");
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
      <div className="flex items-center gap-1.5">
        {modeStatus.toUpperCase().includes("WIFI") ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
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
        ) : modeStatus.toUpperCase().includes("GSM") ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600"
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
        ) : (
          <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-gray-400"></div>
        )}
        <span className="text-xs sm:text-sm font-semibold text-gray-700">
          {modeStatus === "--" ? "Not Connected" : `Mode: ${modeStatus}`}
        </span>
      </div>
    </div>
  );
}

