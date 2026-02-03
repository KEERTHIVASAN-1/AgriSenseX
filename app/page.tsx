"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/connect-device");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
      <motion.img
        src="/images/startpage.png"
        alt="AgriSenseX"
        className="max-w-[80%] object-contain"

        // Start state
        initial={{
          scale: 2.5,
          rotate: -25,
          opacity: 0,
          y: 80,
        }}

        // End state
        animate={{
          scale: 1,
          rotate: 0,
          opacity: 1,
          y: 0,
        }}

        // Smooth cinematic timing
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1], // premium easing
        }}
      />
    </div>
  );
}
