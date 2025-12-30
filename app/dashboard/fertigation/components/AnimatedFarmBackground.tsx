"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedFarmBackgroundProps {
  waterValue: number;
  fertilizerValue: number;
  isStarted: boolean;
  isWatering: boolean;
}

export default function AnimatedFarmBackground({
  waterValue,
  fertilizerValue,
  isStarted,
  isWatering,
}: AnimatedFarmBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);

  // Animation state
  const stateRef = useRef({
    cloudOffset: 0,
    windOffset: 0,
    soilOffset: 0,
    sunlight: 0.5,
    rippleTime: 0,
    rainDrops: [] as Array<{ x: number; y: number; speed: number }>,
  });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Check if tab is active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Rain drops for Start Fertigation
  useEffect(() => {
    if (isStarted && !isReducedMotion) {
      const drops: Array<{ x: number; y: number; speed: number }> = [];
      for (let i = 0; i < 20; i++) {
        drops.push({
          x: Math.random() * 100,
          y: -5,
          speed: 2 + Math.random() * 3,
        });
      }
      stateRef.current.rainDrops = drops;

      // Clear rain after 2 seconds
      setTimeout(() => {
        stateRef.current.rainDrops = [];
      }, 2000);
    }
  }, [isStarted, isReducedMotion]);

  // Ripple effect when water slider moves
  useEffect(() => {
    if (waterValue > 0 && !isReducedMotion) {
      stateRef.current.rippleTime = 1;
    }
  }, [waterValue, isReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop (capped at ~30 FPS)
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!isTabActive || isReducedMotion) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime - (deltaTime % frameInterval);

      const state = stateRef.current;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Set global alpha for subtle background
      ctx.globalAlpha = 0.1;

      // Sky gradient (very subtle)
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      skyGradient.addColorStop(0, "#e3f2fd");
      skyGradient.addColorStop(1, "#f1f8e9");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height * 0.6);

      // Slow moving clouds
      state.cloudOffset += 0.02;
      if (state.cloudOffset > width + 100) state.cloudOffset = -100;

      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 3; i++) {
        const cloudX = (state.cloudOffset + i * (width / 2)) % (width + 200) - 100;
        const cloudY = height * 0.1 + i * 20;
        drawCloud(ctx, cloudX, cloudY, 40 + i * 10);
      }

      // Gentle wind through crops (subtle lines)
      state.windOffset += 0.03;
      if (state.windOffset > 20) state.windOffset = 0;

      ctx.strokeStyle = "#81c784";
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const x = (i * width) / 8;
        const y = height * 0.5 + Math.sin((x + state.windOffset) * 0.1) * 5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 30, y + Math.sin((x + state.windOffset) * 0.15) * 8);
        ctx.stroke();
      }

      // Light soil texture movement
      state.soilOffset += 0.01;
      if (state.soilOffset > 50) state.soilOffset = 0;

      ctx.fillStyle = "#8B6F47";
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 15; i++) {
        const x = ((i * 30 + state.soilOffset) % width);
        const y = height * 0.7 + (i % 3) * 5;
        ctx.fillRect(x, y, 20, 3);
      }

      // Ripple effect when water slider moves
      if (state.rippleTime > 0) {
        ctx.strokeStyle = "#42a5f5";
        ctx.globalAlpha = 0.15 * state.rippleTime;
        ctx.lineWidth = 2;
        const centerX = width / 2;
        const centerY = height * 0.75;
        const radius = state.rippleTime * 30;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        state.rippleTime -= 0.05;
        if (state.rippleTime < 0) state.rippleTime = 0;
      }

      // Rain drops for Start Fertigation
      if (state.rainDrops.length > 0) {
        ctx.fillStyle = "#42a5f5";
        ctx.globalAlpha = 0.2;
        state.rainDrops.forEach((drop) => {
          drop.y += drop.speed;
          if (drop.y < height) {
            ctx.fillRect(
              (drop.x / 100) * width,
              drop.y,
              1,
              3
            );
          }
        });
        // Remove drops that are off screen
        state.rainDrops = state.rainDrops.filter((drop) => drop.y < height);
      }

      // Subtle sunlight shift
      state.sunlight += 0.001;
      if (state.sunlight > 1) state.sunlight = 0;

      const sunGradient = ctx.createRadialGradient(
        width * 0.8,
        height * 0.2,
        0,
        width * 0.8,
        height * 0.2,
        100
      );
      sunGradient.addColorStop(0, `rgba(255, 255, 200, ${0.1 * Math.sin(state.sunlight * Math.PI * 2)})`);
      sunGradient.addColorStop(1, "transparent");
      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, width, height);

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTabActive, isReducedMotion, isStarted, isWatering]);

  // Helper function to draw cloud
  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.5, y, size * 0.6, 0, Math.PI * 2);
    ctx.arc(x + size, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.7, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

