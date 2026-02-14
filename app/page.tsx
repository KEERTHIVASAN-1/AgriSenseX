"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleVideoEnd = () => {
      router.replace("/connect-device");
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd);
      return () => {
        videoElement.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [router]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover"
      >
        <source src="/images/intro_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
