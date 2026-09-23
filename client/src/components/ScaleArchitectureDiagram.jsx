import React, { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, OrbitControls } from "@react-three/drei";

// Node 1: Job Data Ingestion Hologram
export const DataEntryNode = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base Pedestal */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.4, 32]} />
        <meshStandardMaterial
          color="#0d111a"
          metalness={0.9}
          roughness={0.2}
          emissive="#1e293b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cyber Grid Base Ring */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.45, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.7} />
      </mesh>

      {/* Center Hologram Pillar */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 1.6, 6]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.3}
          wireframe={hovered}
        />
      </mesh>

      {/* Floating Document Layers */}
      {[0, 0.35, 0.7, 1.05].map((yOffset, i) => (
        <group key={i} position={[0, 2.2 + yOffset * 0.4, 0]} rotation={[0, (i * Math.PI) / 8, 0]}>
          <mesh>
            <boxGeometry args={[1.4 - i * 0.1, 0.08, 1.0 - i * 0.05]} />
            <meshStandardMaterial
              color={i === 0 ? "#ffffff" : "#60a5fa"}
              emissive={i === 0 ? "#3b82f6" : "#1d4ed8"}
              emissiveIntensity={hovered ? 0.8 : 0.3}
              transparent
              opacity={0.85}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Floating Holographic Bar Telemetry */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 3.2, 0]}>
          <boxGeometry args={[0.16, 0.4 + i * 0.3, 0.08]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Node Title Header */}
      <Text
        position={[0, 0.2, 1.6]}
        fontSize={0.24}
        color="#60a5fa"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        01 • DATA INGESTION
      </Text>
    </group>
  );
};

// Node 2: AI DeepScan Radar Scanner
export const AIDeepScanNode = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef();
  const scanLaserRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4;
    }
    if (scanLaserRef.current) {
      scanLaserRef.current.position.y = 2.4 + Math.sin(t * 3.5) * 0.6;
    }
  });

  return (
    <group
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base Pedestal */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.4, 32]} />
        <meshStandardMaterial
          color="#0d111a"
          metalness={0.9}
          roughness={0.2}
          emissive="#1e293b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cyber Grid Base Ring */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.45, 32]} />
        <meshBasicMaterial color="#1ecfc1" transparent opacity={0.8} />
      </mesh>

      {/* Rotating Core Chamber */}
      <group ref={groupRef} position={[0, 1.8, 0]}>
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#092628"
            emissive="#1ecfc1"
            emissiveIntensity={hovered ? 1.5 : 0.6}
            wireframe
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#1ecfc1" />
        </mesh>
      </group>

      {/* Laser Scanning Grid Plane */}
      <group ref={scanLaserRef} position={[0, 2.4, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 2.0]} />
          <meshBasicMaterial color="#1ecfc1" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshBasicMaterial color="#5eead4" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Node Title Header */}
      <Text
        position={[0, 0.2, 1.6]}
        fontSize={0.24}
        color="#1ecfc1"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        02 • AI DEEP SCAN
      </Text>
    </group>
  );
};

// Node 3: Safety Verdict & Threat Isolator
export const SafetyVerdictNode = ({
  position = [0, 0, 0],
  scale = 1,
  threatState = "SECURE", // "SECURE" | "CAUTION" | "THREAT"
}) => {
  const ringRef = useRef();
  const lockRef = useRef();
  const [hovered, setHovered] = useState(false);

  const theme = {
    SECURE: { color: "#10b981", emissive: "#059669", label: "STATUS: VERIFIED SAFE" },
    CAUTION: { color: "#f59e0b", emissive: "#d97706", label: "STATUS: HIGH RISK" },
    THREAT: { color: "#ef4444", emissive: "#dc2626", label: "STATUS: SCAM DETECTED" },
  }[threatState] || { color: "#10b981", emissive: "#059669", label: "STATUS: VERIFIED SAFE" };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.8;
      ringRef.current.rotation.x = Math.sin(t) * 0.3;
    }
    if (lockRef.current) {
      lockRef.current.position.y = 2.0 + Math.sin(t * 2) * 0.12;
    }
  });

  return (
    <group
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base Pedestal */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.4, 32]} />
        <meshStandardMaterial
          color="#0d111a"
          metalness={0.9}
          roughness={0.2}
          emissive="#1e293b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Base Ring */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.45, 32]} />
        <meshBasicMaterial color={theme.color} transparent opacity={0.8} />
      </mesh>

      {/* Revolving Orbital Rings */}
      <group ref={ringRef} position={[0, 2.0, 0]}>
        <mesh>
          <torusGeometry args={[1.2, 0.03, 16, 64]} />
          <meshBasicMaterial color={theme.color} transparent opacity={0.7} />
        </mesh>
        <mesh position={[1.2, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={theme.color} />
        </mesh>
        <mesh position={[-1.2, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={theme.color} />
        </mesh>
      </group>

      {/* Cyber Padlock Core */}
      <group ref={lockRef} position={[0, 2.0, 0]}>
        {/* Shackle */}
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.38, 0.1, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Lock Body */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[1.1, 0.9, 0.45]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.85}
            roughness={0.25}
            emissive={theme.emissive}
            emissiveIntensity={hovered ? 0.7 : 0.35}
          />
        </mesh>

        {/* Keyhole Glow */}
        <mesh position={[0, -0.15, 0.24]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color={theme.color} />
        </mesh>
      </group>

      {/* Status Badge */}
      <group position={[0, 3.4, 0]}>
        <Text
          fontSize={0.22}
          color={theme.color}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        >
          {theme.label}
        </Text>
      </group>

      {/* Node Title Header */}
      <Text
        position={[0, 0.2, 1.6]}
        fontSize={0.24}
        color={theme.color}
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        03 • SAFETY VERDICT
      </Text>
    </group>
  );
};

// Overview Scene containing all 3 nodes
function OverviewScene({ activeIndex = 0 }) {
  const sceneRef = useRef();

  useFrame((state) => {
    if (sceneRef.current) {
      sceneRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08 - 0.2;
    }
  });

  return (
    <group ref={sceneRef} position={[0, -1, 0]}>
      {/* Central Matrix Platform */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[13, 0.5, 5]} />
        <meshStandardMaterial color="#080a10" metalness={0.9} roughness={0.3} />
      </mesh>

      <DataEntryNode position={[-4.2, 0, 0]} scale={activeIndex === 0 ? 1.08 : 0.95} />
      <AIDeepScanNode position={[0, 0, 0]} scale={activeIndex === 1 ? 1.08 : 0.95} />
      <SafetyVerdictNode
        position={[4.2, 0, 0]}
        scale={activeIndex === 2 ? 1.08 : 0.95}
        threatState={activeIndex === 2 ? "SECURE" : "SECURE"}
      />
    </group>
  );
}

export default function ScaleArchitectureDiagram({ hoverObject = null, activeNode = null }) {
  const activeIndex = activeNode !== null ? activeNode : hoverObject ? hoverObject - 1 : 1;

  return (
    <div className="w-full h-[400px] md:h-[460px] relative rounded-2xl overflow-hidden cyber-glass border border-white/10">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-slate-300">
        <span className="w-2 h-2 rounded-full bg-[#1ecfc1] animate-pulse" />
        <span>3D Cyber Architecture Engine</span>
      </div>

      <Canvas
        camera={{ position: [0, 3, 11], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-8, 8, -5]} intensity={1.2} color="#3b82f6" />
        <pointLight position={[8, 8, -5]} intensity={1.2} color="#10b981" />
        <pointLight position={[0, 6, 8]} intensity={1.5} color="#1ecfc1" />

        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
          <OverviewScene activeIndex={activeIndex} />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          maxAzimuthAngle={Math.PI / 6}
          minAzimuthAngle={-Math.PI / 6}
        />
      </Canvas>
    </div>
  );
}
