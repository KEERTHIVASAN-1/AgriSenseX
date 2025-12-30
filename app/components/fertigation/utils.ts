export function getStatus(
  value: number,
  optimalMin: number,
  optimalMax: number
): "low" | "optimal" | "high" {
  if (value < optimalMin) return "low";
  if (value > optimalMax) return "high";
  return "optimal";
}

export interface Fertilizer {
  type: string;
  quantity: number;
  unit: string;
  duration: number;
  color: string;
}

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

export function calculateFertilizers(
  data: SensorData,
  target: TargetData
): Fertilizer[] {
  const moistureGap = Math.max(0, target.soilMoisture - data.soilMoisture);
  const nitrogenGap = Math.max(0, target.npk.nitrogen - data.npk.nitrogen);
  const phosphorusGap = Math.max(0, target.npk.phosphorus - data.npk.phosphorus);
  const potassiumGap = Math.max(0, target.npk.potassium - data.npk.potassium);

  return [
    {
      type: "Nitrogen Fertilizer",
      quantity: Number((nitrogenGap * 0.5).toFixed(1)),
      unit: "kg",
      duration: 30,
      color: "from-blue-500/30 to-cyan-500/30",
    },
    {
      type: "Phosphorus Fertilizer",
      quantity: Number((phosphorusGap * 0.4).toFixed(1)),
      unit: "kg",
      duration: 25,
      color: "from-purple-500/30 to-pink-500/30",
    },
    {
      type: "Potassium Fertilizer",
      quantity: Number((potassiumGap * 0.6).toFixed(1)),
      unit: "kg",
      duration: 35,
      color: "from-orange-500/30 to-red-500/30",
    },
    {
      type: "Water Solution",
      quantity: Number((moistureGap * 2).toFixed(1)),
      unit: "L",
      duration: 20,
      color: "from-cyan-500/30 to-blue-500/30",
    },
  ];
}

export interface ComparisonData {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export function getComparisonData(
  data: SensorData,
  target: TargetData
): ComparisonData[] {
  return [
    {
      label: "Soil Moisture",
      current: data.soilMoisture,
      target: target.soilMoisture,
      unit: "%",
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "pH Level",
      current: data.pH,
      target: target.pH,
      unit: "",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Nitrogen",
      current: data.npk.nitrogen,
      target: target.npk.nitrogen,
      unit: "ppm",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Phosphorus",
      current: data.npk.phosphorus,
      target: target.npk.phosphorus,
      unit: "ppm",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Potassium",
      current: data.npk.potassium,
      target: target.npk.potassium,
      unit: "ppm",
      color: "from-orange-500 to-red-500",
    },
  ];
}

