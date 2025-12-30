"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

// Icons8 – colorful, professional icon set
const ICONS8 = {
  back: "https://img.icons8.com/fluency/48/back.png",
  soil: "https://img.icons8.com/color/48/plant-under-sun.png",
  nutrient: "https://img.icons8.com/color/48/plant-under-rain.png",
  recommend: "https://img.icons8.com/color/48/star.png",
  fertilizer: "https://img.icons8.com/color/48/test-tube.png",
  moisture: "https://img.icons8.com/color/48/water.png",
  npk: "https://img.icons8.com/color/48/chemical-formula.png",
  ph: "https://img.icons8.com/color/48/ph-scale.png",
};

export default function FertigationPage() {
  const router = useRouter();
  const [applyNow, setApplyNow] = useState(true);

  return (
    <div className="min-h-screen bg-[#e8f5d0] pb-12">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#eef5df] to-[#f6f8f2] pt-6 pb-0">
        <div className="px-4">
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-4 text-green-700 hover:scale-110 transition-transform duration-200"
          >
            <img
              src={ICONS8.back}
              alt="Back"
              className="h-7 w-7 drop-shadow-sm"
            />
          </button>

          <h1 className="ml-10 text-xl font-semibold text-green-900">
            Fertigation
          </h1>
        </div>

        {/* Farm Illustration – full width, no rounded corners */}
        <div
          className="mt-6 h-56 w-full bg-cover bg-center shadow-lg relative z-0"
          style={{
            backgroundImage: "url('/images/farm-bg.png')",
          }}
        />
      </div>

      {/* Content – positioned below image */}
      <div className="mt-12 px-4 space-y-4 relative z-10">
        {/* Soil Data */}
        <Card
          title="Soil Data"
          icon={
            <IconWithFallback
              src={ICONS8.soil}
              alt="Soil data"
              className="h-7 w-7"
              fallback="🌱"
            />
          }
          tint="blue"
        >
          <Row
            label="Moisture"
            value="42%"
            rightValue="45%"
            icon={
              <img
                src={ICONS8.moisture}
                alt="Moisture"
                className="h-5 w-5"
              />
            }
          />
          <Row
            label="NPK"
            value="14-10-8"
            rightValue="14-10-8"
            icon={
              <img
                src={ICONS8.npk}
                alt="NPK"
                className="h-5 w-5"
              />
            }
          />
          <Row
            label="pH"
            value="6.8"
            rightValue="5.8 µS/cm"
            icon={
              <img
                src={ICONS8.ph}
                alt="pH"
                className="h-5 w-5"
              />
            }
          />
        </Card>

        {/* Nutrient Levels */}
        <Card
          title="Nutrient Levels"
          icon={
            <img
              src={ICONS8.nutrient}
              alt="Nutrient levels"
              className="h-7 w-7"
            />
          }
          tint="green"
        >
          <Row
            label="Nitrogen (N)"
            value={
              <span className="px-3 py-1 rounded-lg bg-green-200 text-green-900 font-medium">
                250 mg/kg
              </span>
            }
          />
          <Row label="pH" value="6.8" rightValue="🧪🧪🧪" />
        </Card>

        {/* Recommendation */}
        <Card
          title="Recommended"
          icon={
            <IconWithFallback
              src={ICONS8.recommend}
              alt="Recommended"
              className="h-7 w-7"
              fallback="✓"
            />
          }
          tint="olive"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">
              Apply Now
            </span>
            <Toggle
              enabled={applyNow}
              onToggle={() => setApplyNow(!applyNow)}
            />
          </div>
        </Card>

        {/* Action Block */}
        <div className="rounded-2xl border-2 border-green-300 bg-gradient-to-r from-[#eaf3e0] to-[#f3f7ed] p-4 flex items-center justify-between shadow-lg shadow-green-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <img
              src={ICONS8.fertilizer}
              alt="Fertilizer"
              className="h-9 w-9 drop-shadow-sm"
            />
            <span className="font-medium text-gray-700">
              Apply Fertilizer
            </span>
          </div>

          <Toggle
            enabled={applyNow}
            onToggle={() => setApplyNow(!applyNow)}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function IconWithFallback({
  src,
  alt,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  className: string;
  fallback: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return <span className={`${className} flex items-center justify-center text-2xl`}>{fallback}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
    />
  );
}

function Card({
  title,
  icon,
  tint,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  tint: "blue" | "green" | "olive";
  children: React.ReactNode;
}) {
  const colors = {
    blue: "bg-blue-50 border-2 border-blue-300 shadow-lg shadow-blue-200/50",
    green: "bg-green-50 border-2 border-green-300 shadow-lg shadow-green-200/50",
    olive: "bg-[#f0f4e6] border-2 border-[#c4d4a8] shadow-lg shadow-[#dde6c8]/50",
  };

  return (
    <div className={`rounded-2xl p-4 ${colors[tint]} hover:shadow-xl transition-all duration-300 relative`}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
          {icon}
        </div>
        <h2 className="font-semibold text-gray-800">
          {title}
        </h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  rightValue,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  rightValue?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-700 font-medium flex items-center gap-2">
        {icon && icon}
        {label}
      </span>
      <div className="flex items-center gap-4 font-medium text-gray-800">
        <span>{value}</span>
        {rightValue && (
          <span className="text-gray-500">{rightValue}</span>
        )}
      </div>
    </div>
  );
}

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-8 w-20 rounded-full transition-all ${
        enabled ? "bg-green-700" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-all ${
          enabled ? "translate-x-12" : ""
        }`}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}
