"use client";

import ComparisonView from "./ComparisonView";
import FertilizerRecommendation from "./FertilizerRecommendation";
import { SensorData, TargetData } from "./useSensorData";
import { getComparisonData, calculateFertilizers } from "./utils";

interface FertigationContentProps {
  data: SensorData;
  target: TargetData;
}

export default function FertigationContent({
  data,
  target,
}: FertigationContentProps) {
  const comparisonData = getComparisonData(data, target);
  const fertilizers = calculateFertilizers(data, target);

  return (
    <div className="grid flex-1 gap-6 lg:grid-cols-1">
      <div className="space-y-6">
        <ComparisonView data={comparisonData} />
        <FertilizerRecommendation fertilizers={fertilizers} />
      </div>
    </div>
  );
}

