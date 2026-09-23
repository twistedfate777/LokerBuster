import React from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { DataEntryNode, AIDeepScanNode, SafetyVerdictNode } from "./ScaleArchitectureDiagram";

export default function ScaleDiagramSolo({ type = 1, threatState = "SECURE" }) {
  return (
    <div className="w-full h-[320px] sm:h-[380px] relative rounded-2xl overflow-hidden cyber-glass border border-white/10">
      <Canvas
        camera={{ position: [0, 2, 6.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight
          position={[0, 4, 4]}
          intensity={1.8}
          color={type === 1 ? "#3b82f6" : type === 2 ? "#1ecfc1" : "#10b981"}
        />

        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <group position={[0, -0.8, 0]}>
            {type === 1 && <DataEntryNode position={[0, 0, 0]} scale={1.15} isInteractive />}
            {type === 2 && <AIDeepScanNode position={[0, 0, 0]} scale={1.15} isInteractive />}
            {type === 3 && (
              <SafetyVerdictNode
                position={[0, 0, 0]}
                scale={1.15}
                threatState={threatState}
              />
            )}
          </group>
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.0}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
