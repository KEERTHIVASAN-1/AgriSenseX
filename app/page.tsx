"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, PerspectiveCamera, Cloud, useTexture } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// Custom shader material to remove white background
const ChromaKeyShaderMaterial = {
  uniforms: {
    uTexture: { value: null },
    uColor: { value: new THREE.Color(1, 1, 1) }, // Key color (white)
    uThreshold: { value: 0.1 }, // Tolerance
    uSmoothing: { value: 0.2 } // Smoothing
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uThreshold;
    uniform float uSmoothing;
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Calculate distance from key color
      float dist = distance(texColor.rgb, uColor);
      
      // Smooth alpha transition
      float alpha = smoothstep(uThreshold, uThreshold + uSmoothing, dist);
      
      gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
      
      // Optional: if very close to white, make it fully transparent instantly to avoid halos
      if (dist < uThreshold) discard;
    }
  `
};

function LogoPlane() {
  const texture = useTexture("/images/startpage.png");
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  return (
    <mesh>
      <planeGeometry args={[6, 6]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={{
          uTexture: { value: texture },
          uColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
          uThreshold: { value: 0.4 },
          uSmoothing: { value: 0.1 }
        }}
        vertexShader={ChromaKeyShaderMaterial.vertexShader}
        fragmentShader={ChromaKeyShaderMaterial.fragmentShader}
      />
    </mesh>
  );
}


function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={4} color="#ffd700" /> {/* Sun-like light */}
      <pointLight position={[-10, -10, -10]} intensity={1} color="#4ade80" /> {/* Green reflection */}

      {/* Sky and Atmosphere */}
      <Cloud 
        opacity={0.5} 
        speed={0.4} // Slow moving clouds
        segments={20} 
        position={[0, -5, -10]}
        color="#ffffff"
      />
       <Cloud 
        opacity={0.3} 
        speed={0.3} 
        segments={20} 
        position={[0, 5, -15]}
        color="#e0f2fe"
      />

      {/* Ground and Crops */}

      {/* Floating Logo with Chroma Key */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
        <LogoPlane />
      </Float>
      
      {/* Pollen / Fireflies */}
      <Sparkles 
        count={150} 
        scale={20} 
        size={6} 
        speed={0.4} 
        opacity={0.8} 
        color="#fbbf24" // Golden pollen
      />
      <Sparkles 
        count={100} 
        scale={15} 
        size={4} 
        speed={0.8} 
        opacity={0.5} 
        color="#86efac" // Green spores
      />
    </>
  );
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 2 seconds (reduced duration)
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-green-200 to-emerald-50">
      {/* 3D Scene */}
      <motion.div 
        className="absolute inset-0 z-10"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Canvas gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Loading Bar / Text Overlay */}
      <div className="absolute bottom-20 left-0 right-0 z-20 flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold tracking-[0.2em] text-[#1a472a] drop-shadow-sm"
        >
          AGRISENSE X
        </motion.div>
        
        <motion.div 
          className="h-1.5 w-64 overflow-hidden rounded-full bg-white/40 backdrop-blur-sm border border-white/50"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }} // 256px = w-64
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#7faf3b] to-[#2d6a4f]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm font-medium text-[#2d6a4f]/80"
        >
          Initializing Smart Farming Systems...
        </motion.p>
      </div>
    </div>
  );
}
