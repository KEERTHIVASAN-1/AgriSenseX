"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function DroneMonitoringPage() {
  const router = useRouter();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment", // Use back camera if available
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setAnalysisResult(null);
      }
    } catch (err) {
      setError("Failed to access camera. Please ensure camera permissions are granted.");
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setAnalysisResult(null);
    setUploadedImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        setError(null);
        setAnalysisResult(null);
        // Stop camera if running
        if (isStreaming) {
          stopCamera();
        }
      };
      reader.onerror = () => {
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const captureFrame = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        return canvas.toDataURL("image/jpeg");
      }
    }
    return null;
  };

  const analyzeImage = async () => {
    let imageData: string | null = null;

    // Get image from uploaded file or camera
    if (uploadedImage) {
      imageData = uploadedImage;
    } else if (isStreaming) {
      imageData = captureFrame();
    } else {
      setError("Please start the camera or upload an image first");
      return;
    }

    if (!imageData) {
      setError("Failed to get image for analysis");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    // Simulate analysis (replace with actual AI/ML analysis)
    setTimeout(() => {
      // Here you would send the image to your analysis API
      // For now, we'll simulate the analysis
      const mockResults = [
        "Crop Health: Good - 85% healthy coverage detected",
        "Pest Detection: Low risk - Minor pest activity in sector 3",
        "Irrigation Status: Optimal - Soil moisture levels adequate",
        "Growth Stage: Vegetative - Plants showing healthy growth",
        "Weed Detection: Minimal - 2% weed coverage detected",
      ];

      setAnalysisResult(mockResults.join("\n"));
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-[#e1e8ed]">
        <div className="mx-auto max-w-9xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="group flex h-10 w-10 items-center justify-center rounded-2xl
                        bg-gradient-to-br from-[#7faf3b] to-[#6a9331]
                        text-white shadow-md ring-1 ring-black/5
                        transition-all hover:shadow-lg hover:-translate-x-0.5 active:scale-95"
            >
            <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl text-[#2d3436]">
                  Drone Monitoring
                </h1>
                <p className="text-sm text-[#636e72]">
                  Real-time field analysis and monitoring
                </p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7faf3b] to-[#6a9331] shadow-md">
              <span className="text-xl">🚁</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Camera Section */}
        <div className="mb-6">
          <div className="rounded-2xl bg-white border border-[#e1e8ed] shadow-lg overflow-hidden">
            {/* Video/Image Preview */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
              {uploadedImage ? (
                <>
                  <img
                    src={uploadedImage}
                    alt="Uploaded for analysis"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={clearUploadedImage}
                    className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg"
                  >
                    Remove Image
                  </button>
                </>
              ) : !isStreaming ? (
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-white/70 text-lg mb-4">
                    Camera not active
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 bg-gradient-to-r from-[#7faf3b] to-[#6a9331] text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    Start Camera
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={stopCamera}
                    className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg"
                  >
                    Stop Camera
                  </button>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="p-6 border-t border-[#e1e8ed]">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2d3436] mb-1">
                      {uploadedImage ? "Image Upload" : "Camera Controls"}
                    </h3>
                    <p className="text-sm text-[#636e72]">
                      {uploadedImage
                        ? "Image uploaded and ready for analysis"
                        : isStreaming
                        ? "Camera is active and ready for analysis"
                        : "Click 'Start Camera' to begin monitoring or upload an image"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Upload Image Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-[#7faf3b] to-[#6a9331] text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {uploadedImage ? "Change Image" : "Upload Image"}
                  </button>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Analyze Button */}
                  <button
                    onClick={analyzeImage}
                    disabled={(!isStreaming && !uploadedImage) || isAnalyzing}
                    className="px-6 py-3 bg-gradient-to-r from-[#4a90e2] to-[#357abd] text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Analyze
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mb-6 rounded-2xl bg-white border border-[#e1e8ed] shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#4a90e2] to-[#357abd] flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2d3436]">
                  Analysis Results
                </h2>
                <p className="text-sm text-[#636e72]">
                  Field analysis completed
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f5f9f0] to-[#e8f5e9] rounded-xl p-4 border border-[#e1e8ed]">
              <pre className="text-sm text-[#2d3436] whitespace-pre-wrap font-medium">
                {analysisResult}
              </pre>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-[#e1e8ed] p-4 shadow-sm">
            <div className="text-2xl mb-2">🌾</div>
            <h3 className="font-semibold text-[#2d3436] mb-1">Crop Health</h3>
            <p className="text-sm text-[#636e72]">
              Monitor crop conditions in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}