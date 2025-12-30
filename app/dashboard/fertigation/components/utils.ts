import { SensorData, TargetData } from "./useSensorData";

export function getSoilMoistureStatus(data: SensorData, target: TargetData): string {
  if (data.soilMoisture < 40) return "Soil is Dry";
  if (data.soilMoisture < target.soilMoisture - 10) return "Soil needs water";
  return "Soil is OK";
}

export function getpHStatus(data: SensorData, target: TargetData): string {
  if (data.pH < 6.0) return "Soil is Acidic";
  if (data.pH < target.pH - 0.3) return "Soil is Slightly Acidic";
  if (data.pH > 7.0) return "Soil is Alkaline";
  return "Soil pH is OK";
}

export function getNutrientStatus(data: SensorData, target: TargetData): string {
  const avg = (data.npk.nitrogen + data.npk.phosphorus + data.npk.potassium) / 3;
  const targetAvg = (target.npk.nitrogen + target.npk.phosphorus + target.npk.potassium) / 3;
  
  if (avg < targetAvg * 0.7) return "Plant food is LOW";
  if (avg < targetAvg * 0.9) return "Plant food is OK";
  return "Plant food is Good";
}

export function getInitialWaterValue(data: SensorData, target: TargetData): number {
  const gap = Math.max(0, target.soilMoisture - data.soilMoisture);
  return Math.min(100, Math.round(gap * 0.5));
}

export function getInitialFertilizerValue(data: SensorData, target: TargetData): number {
  const nitrogenGap = Math.max(0, target.npk.nitrogen - data.npk.nitrogen);
  return Math.min(50, Math.round(nitrogenGap * 0.5));
}
