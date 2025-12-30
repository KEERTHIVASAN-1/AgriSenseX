"use client";

import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

interface SoilVisualization3DProps {
  moisture: number;
  nutrients: { nitrogen: number; phosphorus: number; potassium: number };
  isActive: boolean;
}

// Create realistic soil texture
function createSoilTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  
  const imageData = ctx.createImageData(size, size);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Create realistic soil texture with noise
      const noise1 = Math.sin(x * 0.02 + y * 0.03) * 0.5 + 0.5;
      const noise2 = Math.sin(x * 0.05 + y * 0.07) * 0.5 + 0.5;
      const noise3 = Math.sin(x * 0.1 + y * 0.15) * 0.5 + 0.5;
      
      // Rich, natural soil colors
      const r = Math.floor(85 + noise1 * 25 + noise2 * 15);
      const g = Math.floor(65 + noise1 * 20 + noise2 * 12);
      const b = Math.floor(50 + noise1 * 18 + noise2 * 10);
      
      imageData.data[index] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Main soil visualization
function SoilVisualization({
  moisture,
  nutrients,
}: {
  moisture: number;
  nutrients: { nitrogen: number; phosphorus: number; potassium: number };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [soilTexture] = useState(() => createSoilTexture());
  
  // Calculate soil color based on moisture (darker when wetter)
  const soilColor = useMemo(() => {
    const baseColor = new THREE.Color(0x5a4a3a);
    const wetColor = new THREE.Color(0x4a3a2a);
    const moistureFactor = moisture / 100;
    return baseColor.clone().lerp(wetColor, moistureFactor * 0.3);
  }, [moisture]);

  // Subtle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Calculate nutrient visualization intensity
  const nutrientLevel = useMemo(() => {
    return (nutrients.nitrogen + nutrients.phosphorus + nutrients.potassium) / 300;
  }, [nutrients]);

  return (
    <group ref={groupRef}>
      {/* Main soil block - compact and realistic */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[2.5, 1.2, 2.5]}
        radius={0.2}
        smoothness={16}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={soilTexture}
          color={soilColor}
          roughness={0.95}
          metalness={0.02}
        />
      </RoundedBox>

      {/* Moisture layer - subtle and realistic */}
      {moisture > 25 && (
        <RoundedBox
          position={[0, 0.15, 0]}
          args={[2.55, (moisture / 100) * 0.7, 2.55]}
          radius={0.18}
          smoothness={16}
          castShadow
        >
          <meshPhysicalMaterial
            color={new THREE.Color(0x3a5a7a)}
            roughness={0.2}
            metalness={0.1}
            transmission={0.7}
            thickness={0.3}
            opacity={Math.min((moisture / 100) * 0.35, 0.35)}
            transparent
            ior={1.33}
          />
        </RoundedBox>
      )}

      {/* Subtle nutrient indicator - simple color overlay */}
      <RoundedBox
        position={[0, -0.5, 0]}
        args={[2.6, 0.15, 2.6]}
        radius={0.15}
        smoothness={16}
      >
        <meshStandardMaterial
          color={new THREE.Color(
            0.3 + nutrientLevel * 0.2,
            0.4 + nutrientLevel * 0.3,
            0.2 + nutrientLevel * 0.1
          )}
          roughness={0.8}
          metalness={0.05}
          opacity={0.4 + nutrientLevel * 0.3}
          transparent
        />
      </RoundedBox>
    </group>
  );
}

// Simple irrigation indicator
function IrrigationIndicator({ moisture }: { moisture: number }) {
  const needsWater = moisture < 50;
  
  if (!needsWater) return null;

  return (
    <group position={[0, 1, 0]}>
      {/* Simple pipe */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color={0x4a5568} roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Water drop indicator */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshPhysicalMaterial
          color={0x4a90e2}
          transmission={1}
          thickness={0.1}
          roughness={0}
          metalness={0}
          ior={1.33}
        />
      </mesh>
    </group>
  );
}

// Ground plane
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial
        color={0x1a1a1a}
        roughness={0.9}
        metalness={0.05}
      />
    </mesh>
  );
}

function Scene({ moisture, nutrients }: { moisture: number; nutrients: any }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 4, 4]} fov={50} />
      
      {/* Clean, professional lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-3, 5, -3]} intensity={0.3} />
      
      {/* Scene objects */}
      <SoilVisualization moisture={moisture} nutrients={nutrients} />
      <IrrigationIndicator moisture={moisture} />
      <GroundPlane />
      
      {/* Smooth camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.08}
      />
      
      {/* Subtle environment */}
      <Environment preset="sunset" />
    </>
  );
}

export default function SoilVisualization3D({
  moisture,
  nutrients,
  isActive,
}: SoilVisualization3DProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Pause rendering when not active or not visible
  useEffect(() => {
    if (!isActive || !isMounted) {
      setIsVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = containerRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [isActive, isMounted]);

  if (!isMounted || !isActive) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/20">
        <p className="text-sm text-slate-500">3D Visualization</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-800/40"
    >
      {/* Header overlay */}
      <div className="absolute left-0 right-0 top-0 z-10 border-b border-slate-800/50 bg-slate-900/80 p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#a3c94f] shadow-[0_0_8px_rgba(163,201,79,0.5)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              3D Soil Visualization
            </span>
          </div>
          <div className="text-xs text-slate-500 max-w-xs text-right">
            Cross-section view of soil block showing moisture content and nutrient levels
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="h-full w-full pt-12">
        {isVisible && (
          <Canvas
            gl={{ 
              antialias: true, 
              alpha: true,
              shadowMap: true,
              powerPreference: "high-performance"
            }}
            dpr={[1, 1.5]}
            performance={{ min: 0.5 }}
            shadows
          >
            <Suspense fallback={null}>
              <Scene moisture={moisture} nutrients={nutrients} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Simple, clean legend with explanation */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-slate-800/50 bg-slate-900/80 p-3 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-slate-400">Moisture Layer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-slate-400">Nutrient Indicator</span>
            </div>
          </div>
          <div className="text-center text-[10px] text-slate-500 px-4">
            <strong>Concept:</strong> This 3D soil block represents a cross-section of your farm soil. 
            The blue layer shows water/moisture content, and the green base indicates nutrient levels. 
            The darker the soil, the more moisture it contains.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
