"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function DroneMonitoringPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] =
    useState<"image" | "video" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ RECOMMENDED: move image to /public/images/drone.jpg
  const droneImageUrl = "/images/drone.jpg";

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "video/mp4",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Upload PNG, JPG, WEBP, or MP4 only");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const maxSize = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(isImage ? "Image max 10MB" : "Video max 50MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile(e.target?.result as string);
      setUploadedFileType(isImage ? "image" : "video");
      setError(null);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setUploadedFileType(null);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analyzeImage = () => {
    if (!uploadedFile) {
      setError("Please upload a file first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    setTimeout(() => {
      setAnalysisResult(
        [
          "Crop Health: Good (85%)",
          "Pest Risk: Low",
          "Irrigation: Optimal",
          "Growth Stage: Vegetative",
        ].join("\n")
      );
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f9f0]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-600 text-white"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Drone Monitoring</h1>
              <p className="text-sm text-gray-500">
                Upload drone image or video
              </p>
            </div>
          </div>
          {/* 3D Drone Model - Realistic */}
          <div className="relative w-16 h-16 group/drone cursor-pointer" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
            <div 
              className="relative w-full h-full drone-3d-animation"
              style={{
                transformStyle: 'preserve-3d',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = 'paused';
                e.currentTarget.style.transform = 'rotateY(15deg) rotateX(-10deg) translateY(-4px) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = 'running';
              }}
            >
              <svg
                viewBox="0 0 140 140"
                className="w-full h-full transition-all duration-700"
                style={{
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3)) drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              >
                <defs>
                  {/* Realistic gradients for 3D effect */}
                  <linearGradient id="droneBodyTop" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5a6578" />
                    <stop offset="50%" stopColor="#4a5568" />
                    <stop offset="100%" stopColor="#3a4558" />
                  </linearGradient>
                  <linearGradient id="droneBodySide" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6a7588" />
                    <stop offset="100%" stopColor="#2d3748" />
                  </linearGradient>
                  <radialGradient id="propellerGlow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#cbd5e0" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a0aec0" stopOpacity="0.3" />
                  </radialGradient>
                  <radialGradient id="cameraLens" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#68d391" />
                    <stop offset="50%" stopColor="#48bb78" />
                    <stop offset="100%" stopColor="#2f855a" />
                  </radialGradient>
                  <filter id="shadow3D">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="4" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Propeller Arms - 3D depth with shadows */}
                <g filter="url(#shadow3D)" className="group-hover/drone:opacity-90 transition-opacity duration-500">
                  {/* Left arm - with 3D depth */}
                  <line x1="12" y1="70" x2="42" y2="70" stroke="#5a6578" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="12" y1="70" x2="42" y2="70" stroke="#718096" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                  {/* Right arm */}
                  <line x1="98" y1="70" x2="128" y2="70" stroke="#5a6578" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="98" y1="70" x2="128" y2="70" stroke="#718096" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                  {/* Top arm */}
                  <line x1="70" y1="42" x2="70" y2="52" stroke="#5a6578" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="70" y1="42" x2="70" y2="52" stroke="#718096" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                  {/* Bottom arm */}
                  <line x1="70" y1="88" x2="70" y2="98" stroke="#5a6578" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="70" y1="88" x2="70" y2="98" stroke="#718096" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                </g>
                
                {/* Propellers - realistic with glow and depth */}
                <g className="group-hover/drone:[animation:spin_0.1s_linear_infinite]">
                  {/* Propeller shadows */}
                  <ellipse cx="12" cy="72" rx="11" ry="4" fill="#000000" opacity="0.2" />
                  <ellipse cx="128" cy="72" rx="11" ry="4" fill="#000000" opacity="0.2" />
                  <ellipse cx="72" cy="42" rx="4" ry="11" fill="#000000" opacity="0.2" />
                  <ellipse cx="72" cy="98" rx="4" ry="11" fill="#000000" opacity="0.2" />
                  {/* Propellers with glow */}
                  <circle cx="12" cy="70" r="11" fill="url(#propellerGlow)" />
                  <circle cx="128" cy="70" r="11" fill="url(#propellerGlow)" />
                  <circle cx="70" cy="42" r="11" fill="url(#propellerGlow)" />
                  <circle cx="70" cy="98" r="11" fill="url(#propellerGlow)" />
                  {/* Propeller centers */}
                  <circle cx="12" cy="70" r="3" fill="#4a5568" />
                  <circle cx="128" cy="70" r="3" fill="#4a5568" />
                  <circle cx="70" cy="42" r="3" fill="#4a5568" />
                  <circle cx="70" cy="98" r="3" fill="#4a5568" />
                </g>
                
                {/* Drone Body - 3D box structure */}
                {/* Top face - lighter */}
                <rect
                  x="45"
                  y="58"
                  width="50"
                  height="24"
                  rx="5"
                  fill="url(#droneBodyTop)"
                  opacity="0.95"
                />
                {/* Side face - darker for depth */}
                <path
                  d="M 45 58 L 50 55 L 95 55 L 95 82 L 50 82 Z"
                  fill="url(#droneBodySide)"
                  opacity="0.85"
                />
                {/* Front face highlight */}
                <rect
                  x="47"
                  y="60"
                  width="46"
                  height="10"
                  rx="3"
                  fill="#718096"
                  opacity="0.4"
                />
                {/* Top edge highlight */}
                <line x1="47" y1="60" x2="93" y2="60" stroke="#a0aec0" strokeWidth="1.5" opacity="0.6" />
                
                {/* Camera/Sensor - 3D lens with depth */}
                <g filter="url(#shadow3D)">
                  {/* Lens housing */}
                  <ellipse cx="70" cy="68" rx="10" ry="6" fill="#2d3748" opacity="0.8" />
                  {/* Main lens */}
                  <circle cx="70" cy="70" r="9" fill="url(#cameraLens)" />
                  {/* Lens reflection */}
                  <ellipse cx="72" cy="68" rx="4" ry="3" fill="#ffffff" opacity="0.6" />
                  {/* Inner lens */}
                  <circle cx="70" cy="70" r="5" fill="#1a202c" />
                  {/* Center highlight */}
                  <circle cx="70" cy="70" r="2" fill="#ffffff" opacity="0.9" />
                </g>
                
                {/* LED indicators - glowing */}
                <g>
                  <circle cx="50" cy="65" r="2" fill="#48bb78" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="90" cy="65" r="2" fill="#48bb78" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" begin="1s" />
                  </circle>
                  {/* LED glow */}
                  <circle cx="50" cy="65" r="4" fill="#48bb78" opacity="0.2" />
                  <circle cx="90" cy="65" r="4" fill="#48bb78" opacity="0.2" />
                </g>
                
                {/* Body details - screws/connectors */}
                <circle cx="48" cy="62" r="1" fill="#a0aec0" opacity="0.6" />
                <circle cx="92" cy="62" r="1" fill="#a0aec0" opacity="0.6" />
                <circle cx="48" cy="78" r="1" fill="#a0aec0" opacity="0.6" />
                <circle cx="92" cy="78" r="1" fill="#a0aec0" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 py-8">
        {/* Upload Card */}
        <div className="bg-white rounded-2xl p-6 shadow border">
          <div
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group"
            style={{
              backgroundImage: uploadedFile
                ? `url(${uploadedFile})`
                : `url(${droneImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => !uploadedFile && fileInputRef.current?.click()}
          >
            {/* White Overlay - reduces opacity on hover */}
            <div
              className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-[0.25] z-0"
              style={{
                backgroundColor: 'white',
                opacity: uploadedFile ? 0.20 : 0.25
              }}
            />
            {!uploadedFile && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="h-16 w-16 rounded-full bg-white border-2 border-green-600 flex items-center justify-center shadow-lg">
                  <PlusIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
            )}

            {uploadedFile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearUploadedFile();
                }}
                className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow z-20"
              >
                <XMarkIcon className="h-5 w-5 text-red-500" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Analyze Button - Below the block */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={analyzeImage}
            disabled={!uploadedFile || isAnalyzing}
            className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50 transition-all hover:bg-green-700 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Upload"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}

        {analysisResult && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow border">
            <h2 className="font-bold mb-3">Analysis Result</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {analysisResult}
            </pre>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes drone3D {
            0% {
              transform: rotateY(0deg) rotateX(0deg) translateY(0px);
            }
            25% {
              transform: rotateY(90deg) rotateX(5deg) translateY(-2px);
            }
            50% {
              transform: rotateY(180deg) rotateX(0deg) translateY(0px);
            }
            75% {
              transform: rotateY(270deg) rotateX(-5deg) translateY(-2px);
            }
            100% {
              transform: rotateY(360deg) rotateX(0deg) translateY(0px);
            }
          }
          .drone-3d-animation {
            animation: drone3D 8s ease-in-out infinite;
            transform-style: preserve-3d;
          }
        `
      }} />
    </div>
  );
}
