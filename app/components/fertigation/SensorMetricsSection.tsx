"use client";

import SensorCard from "./SensorCard";
import NPKCard from "./NPKCard";
import { SensorData, TargetData } from "./useSensorData";
import { getStatus } from "./utils";

interface SensorMetricsSectionProps {
  data: SensorData;
  target: TargetData;
}

export default function SensorMetricsSection({
  data,
  target,
}: SensorMetricsSectionProps) {
  return (
    <section className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Real-Time Sensor Metrics</h2>
        <p className="text-sm text-slate-400">Live soil condition monitoring</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SensorCard
          title="Soil Moisture"
          value={data.soilMoisture}
          unit="%"
          status={getStatus(data.soilMoisture, 50, 70)}
          icon="💧"
          min={0}
          max={100}
          optimalMin={50}
          optimalMax={70}
        />

        <SensorCard
          title="pH Value"
          value={data.pH}
          unit=""
          status={getStatus(data.pH, 6.0, 7.0)}
          icon="🧪"
          min={5.0}
          max={8.0}
          optimalMin={6.0}
          optimalMax={7.0}
        />

        <SensorCard
          title="Temperature"
          value={data.temperature}
          unit="°C"
          status={getStatus(data.temperature, 20, 26)}
          icon="🌡️"
          min={15}
          max={35}
          optimalMin={20}
          optimalMax={26}
        />

        <NPKCard data={data.npk} optimal={target.npk} />
      </div>
    </section>
  );
}

