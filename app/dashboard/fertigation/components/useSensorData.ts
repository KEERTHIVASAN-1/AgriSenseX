import { useState, useEffect } from "react";

export interface SensorData {
  soilMoisture: number;
  pH: number;
  temperature: number;
  npk: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

export interface TargetData {
  soilMoisture: number;
  pH: number;
  temperature: number;
  npk: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

export function useSensorData() {
  const [data, setData] = useState<SensorData>({
    soilMoisture: 45,
    pH: 6.2,
    temperature: 22,
    npk: {
      nitrogen: 35,
      phosphorus: 28,
      potassium: 42,
    },
  });

  const [target] = useState<TargetData>({
    soilMoisture: 60,
    pH: 6.5,
    temperature: 24,
    npk: {
      nitrogen: 50,
      phosphorus: 40,
      potassium: 55,
    },
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        soilMoisture: Math.max(20, Math.min(80, prev.soilMoisture + (Math.random() - 0.5) * 2)),
        pH: Math.max(5.5, Math.min(7.5, prev.pH + (Math.random() - 0.5) * 0.1)),
        temperature: Math.max(18, Math.min(30, prev.temperature + (Math.random() - 0.5) * 0.5)),
        npk: {
          nitrogen: Math.max(20, Math.min(70, prev.npk.nitrogen + (Math.random() - 0.5) * 1)),
          phosphorus: Math.max(15, Math.min(60, prev.npk.phosphorus + (Math.random() - 0.5) * 1)),
          potassium: Math.max(25, Math.min(75, prev.npk.potassium + (Math.random() - 0.5) * 1)),
        },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { data, target };
}

